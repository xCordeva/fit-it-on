'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface UserData {
  trial_count: number
  plan: string
}

export function useTrials() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('trial_count, plan')
      .eq('id', user.id)
      .single()

    if (data) {
      setUserData(data)
    }
    setLoading(false)
  }

  const decrementTrial = async () => {
    if (!user || !userData) return false

    const { data, error } = await supabase
      .from('users')
      .update({ trial_count: userData.trial_count - 1 })
      .eq('id', user.id)
      .select()
      .single()

    if (data && !error) {
      setUserData({ ...userData, trial_count: data.trial_count })
      return true
    }
    return false
  }

  const canTryOn = () => {
    if (!user) {
      // Check anonymous trial
      return !localStorage.getItem('hasTriedFree')
    }
    
    if (!userData) return false
    
    // Pro users have unlimited tries
    if (userData.plan === 'pro') return true
    
    // Free users have limited tries
    return userData.trial_count > 0
  }

  const getRemainingTrials = () => {
    if (!user) {
      return localStorage.getItem('hasTriedFree') ? 0 : 1
    }
    
    if (!userData) return 0
    
    if (userData.plan === 'pro') return Infinity
    
    return userData.trial_count
  }

  return {
    userData,
    loading,
    canTryOn: canTryOn(),
    remainingTrials: getRemainingTrials(),
    decrementTrial,
    refetch: fetchUserData,
  }
}