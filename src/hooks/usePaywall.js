import { useState, useCallback } from 'react'

const STORAGE_KEY = 'ozzo_paywall'
const FREE_LIMIT  = 3

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { plan: 'free', usageCount: 0, monthKey: currentMonthKey() }
    const s = JSON.parse(raw)
    if (s.monthKey !== currentMonthKey()) {
      return { plan: s.plan, usageCount: 0, monthKey: currentMonthKey() }
    }
    return s
  } catch {
    return { plan: 'free', usageCount: 0, monthKey: currentMonthKey() }
  }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, monthKey: currentMonthKey() })) } catch {}
}

export function usePlan() {
  const [state, setState] = useState(getState)

  const refresh = useCallback(() => setState(getState()), [])

  const activatePlan = useCallback((plan) => {
    const s = { ...getState(), plan }
    saveState(s)
    setState(s)
  }, [])

  // Her benzersiz sayfa ziyaretinde bir kez çağrılır (PaywallGate ref korumalı)
  const recordUsage = useCallback(() => {
    const s = getState()
    if (s.plan !== 'free') return   // ücretli planlarda sayma
    const next = { ...s, usageCount: s.usageCount + 1 }
    saveState(next)
    setState(next)
  }, [])

  const canUse = useCallback((type) => {
    const s = getState()
    if (type === 'calc') {
      return s.plan === 'calc' || s.plan === 'pro' || s.usageCount < FREE_LIMIT
    }
    if (type === 'tool') {
      return s.plan === 'pro'
    }
    return false
  }, [])

  const remainingFree = Math.max(0, FREE_LIMIT - state.usageCount)

  return {
    plan: state.plan,
    usageCount: state.usageCount,
    remainingFree,
    canUse,
    recordUsage,
    activatePlan,
    refresh,
  }
}

export { FREE_LIMIT }
