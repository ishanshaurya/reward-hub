// src/pages/LandingPage.jsx
// RewardHub — Landing page route: handles sign-in and demo navigation

import { useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import LandingContent from '../components/Landing/LandingPage'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Already signed in → go straight to dashboard
  if (!loading && user) return <Navigate to="/dashboard" replace />

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  const handleDemo = () => navigate('/dashboard?demo=true')

  return <LandingContent onSignInClick={handleSignIn} onDemoClick={handleDemo} />
}
