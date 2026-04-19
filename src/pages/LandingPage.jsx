// src/pages/LandingPage.jsx
// RewardHub — Landing page route: handles sign-in and demo navigation

import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import LandingContent from '../components/Landing/LandingPage'
import { DashboardLoadingSkeleton } from '../components/LoadingStates'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Still resolving session (covers OAuth hash redirect case)
  if (loading) return <DashboardLoadingSkeleton />

  // Already signed in → go straight to dashboard
  if (user) return <Navigate to="/dashboard" replace />

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
