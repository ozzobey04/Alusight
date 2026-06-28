import { useState, useEffect, useRef } from 'react'
import { usePlan } from '../hooks/usePaywall'
import PaywallModal from './PaywallModal'

export default function PaywallGate({ type, children }) {
  const { canUse, recordUsage } = usePlan()
  const [show, setShow]       = useState(false)
  const [allowed, setAllowed] = useState(null)
  const checked = useRef(false)

  useEffect(() => {
    if (checked.current) return
    checked.current = true

    const ok = canUse(type)
    if (ok) {
      recordUsage()
      setAllowed(true)
    } else {
      setAllowed(false)
      setShow(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (allowed === null) return null

  if (!allowed) {
    return show ? (
      <PaywallModal
        type={type}
        onClose={() => {
          setShow(false)
          window.history.back()
        }}
      />
    ) : null
  }

  return children
}
