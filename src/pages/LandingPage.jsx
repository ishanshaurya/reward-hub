// src/pages/LandingPage.jsx
// FinPulse — Landing page route: handles sign-in and demo navigation

import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LandingContent from '../components/Landing/LandingPage'
import { DashboardLoadingSkeleton } from '../components/LoadingStates'

export default function LandingPage({ onSignInClick }) {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Still resolving session (covers OAuth hash redirect case)
  if (loading) return <DashboardLoadingSkeleton />

  // Already signed in → go straight to dashboard
  if (user) return <Navigate to="/dashboard" replace />

  const handleDemo = () => navigate('/dashboard?demo=true')

  return <LandingContent onSignInClick={onSignInClick} onDemoClick={handleDemo} />
}
