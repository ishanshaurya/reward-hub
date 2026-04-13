import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useRewards(user) {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- Filters state ---
  const [filters, setFilters] = useState({
    app: 'all',       // 'all' | 'Paytm' | 'PhonePe' | 'Google Pay' | 'Amazon Pay' | 'Swiggy' | 'Zomato'
    type: 'all',      // 'all' | 'cashback' | 'coupon' | 'refund' | 'points'
    dateRange: 'all', // 'all' | '7d' | '30d' | '90d'
  })

  // --- Fetch all rewards for the current user ---
  const fetchRewards = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('email_date', { ascending: false })

      if (fetchError) throw fetchError
      setRewards(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch rewards')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch on mount + whenever user changes
  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  // --- Mark a reward as claimed / unclaimed ---
  const toggleClaimed = useCallback(async (rewardId, currentValue) => {
    // Optimistic update — flip it in UI immediately
    setRewards(prev =>
      prev.map(r => r.id === rewardId ? { ...r, is_claimed: !currentValue } : r)
    )

    const { error: updateError } = await supabase
      .from('rewards')
      .update({ is_claimed: !currentValue })
      .eq('id', rewardId)

    if (updateError) {
      // Rollback on failure
      setRewards(prev =>
        prev.map(r => r.id === rewardId ? { ...r, is_claimed: currentValue } : r)
      )
      setError('Failed to update reward. Please try again.')
    }
  }, [])

  // --- Derived: apply filters to raw rewards ---
  const filteredRewards = rewards.filter(r => {
    if (filters.app !== 'all' && r.app_name !== filters.app) return false
    if (filters.type !== 'all' && r.reward_type !== filters.type) return false

    if (filters.dateRange !== 'all') {
      const days = { '7d': 7, '30d': 30, '90d': 90 }[filters.dateRange]
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      if (new Date(r.email_date) < cutoff) return false
    }

    return true
  })

  // --- Derived: summary stats (always from full rewards, not filtered) ---
  const stats = {
    totalEarned: rewards
      .filter(r => ['cashback', 'refund'].includes(r.reward_type) && r.amount)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0),

    pendingClaimed: rewards
      .filter(r => !r.is_claimed && !r.is_expired && r.amount)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0),

    expiringSoon: rewards.filter(r => {
      if (!r.expiry_date || r.is_expired) return false
      const expiry = new Date(r.expiry_date)
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      return expiry <= sevenDaysFromNow && expiry >= new Date()
    }),

    byApp: rewards.reduce((acc, r) => {
      if (!r.amount) return acc
      acc[r.app_name] = (acc[r.app_name] || 0) + parseFloat(r.amount)
      return acc
    }, {}),

    byType: rewards.reduce((acc, r) => {
      acc[r.reward_type] = (acc[r.reward_type] || 0) + 1
      return acc
    }, {}),

    totalRewards: rewards.length,
  }

  // --- Derived: filter options (from all rewards) ---
  const filterOptions = {
    apps: [...new Set(rewards.map(r => r.app_name).filter(Boolean))].sort(),
    types: [...new Set(rewards.map(r => r.reward_type).filter(Boolean))].sort(),
  }

  return {
    // Data
    rewards: filteredRewards,
    allRewards: rewards,
    stats,
    loading,
    error,

    // Filters
    filters,
    setFilters,
    filterOptions,

    // Actions
    fetchRewards,   // call this after a Gmail sync
    toggleClaimed,
  }
}