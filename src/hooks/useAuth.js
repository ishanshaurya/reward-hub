import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

async function fetchOrUpsertProfile(user, setProfile, setProfileError) {
    if (!user) {
        setProfile(null)
        setProfileError(null)
        return
    }

    // Upsert so the row exists even if the DB trigger missed it
    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(
            {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name ?? null,
            },
            { onConflict: 'id' }
        )

    if (upsertError) {
        console.error('Profile upsert failed:', upsertError)
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error || !data) {
        setProfileError(
            'Account setup incomplete. Please contact support or sign out and sign in again.'
        )
        setProfile(null)
    } else {
        setProfile(data)
        setProfileError(null)
    }
}

export function useAuth() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [profileError, setProfileError] = useState(null)
    const [loading, setLoading] = useState(true)

    const initialUpsertDone = useRef(false)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null
            setUser(u)
            if (session?.provider_token) {
                localStorage.setItem('gmail_token', session.provider_token)
            }
            initialUpsertDone.current = true
            fetchOrUpsertProfile(u, setProfile, setProfileError).finally(() =>
                setLoading(false)
            )
        })

        // On auth state change, only upsert if the initial one already ran
        // (prevents the duplicate fire that happens on mount)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const u = session?.user ?? null
                setUser(u)
                if (!initialUpsertDone.current) return
                // SIGNED_IN after the initial load means a real new sign-in
                if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
                    if (session?.provider_token) {
                        localStorage.setItem('gmail_token', session.provider_token)
                    }
                    fetchOrUpsertProfile(u, setProfile, setProfileError)
                } else if (_event === 'SIGNED_OUT') {
                    localStorage.removeItem('gmail_token')
                    setProfile(null)
                    setProfileError(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/gmail.readonly',
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return { user, profile, profileError, loading, signIn, signOut }
}
