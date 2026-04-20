// src/pages/Dashboard.jsx
// FinPulse — Protected dashboard page: wires auth, rewards, and Gmail sync

import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useRewards } from '../hooks/useRewards'
import { useGmailSync } from '../hooks/useGmailSync'
import { loadDemoData } from '../data/demoRewards'
import Navbar from '../components/Layout/Navbar'
import DashboardContent from '../components/Dashboard/Dashboard'
import { DashboardLoadingSkeleton } from '../components/LoadingStates'

const DEMO_FILTERS = { app: 'all', type: 'all', dateRange: 'all' }

export default function DashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [searchParams] = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  // Real rewards (null user = skip fetch)
  const rewardsData = useRewards(isDemo ? null : user)

  // Gmail sync
  const { syncState, startSync, resetSync } = useGmailSync()
  const isSyncing = ['searching', 'fetching', 'parsing', 'saving'].includes(syncState.status)

  // Demo data
  const [demoData, setDemoData] = useState(null)
  const [demoLoading, setDemoLoading] = useState(false)

  useEffect(() => {
    if (!isDemo || demoData) return
    setDemoLoading(true)
    loadDemoData().then(data => {
      setDemoData(data)
      setDemoLoading(false)
    })
  }, [isDemo]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- Auth gate ---
  if (authLoading) return <DashboardLoadingSkeleton />
  if (!user && !isDemo) return <Navigate to="/" replace />

  // --- Demo mode loading ---
  if (isDemo && (demoLoading || !demoData)) return <DashboardLoadingSkeleton />

  // --- Build active data object ---
  const activeData = isDemo
    ? {
        rewards:       demoData.rewards,
        allRewards:    demoData.allRewards,
        stats:         demoData.stats,
        loading:       false,
        error:         null,
        filters:       DEMO_FILTERS,
        setFilters:    () => {},
        filterOptions: demoData.filterOptions,
        fetchRewards:  () => {},
        toggleClaimed: () => {},
      }
    : rewardsData

  const handleSignOut = isDemo
    ? () => { window.location.href = '/' }
    : signOut

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar
        user={profile || user}
        onSignOut={handleSignOut}
        demoMode={isDemo}
        onSync={isDemo ? null : startSync}
        isSyncing={isSyncing}
      />
      <DashboardContent
        {...activeData}
        syncState={syncState}
        resetSync={resetSync}
        isDemo={isDemo}
      />
    </div>
  )
}
