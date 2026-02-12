import { useState, useEffect, useCallback } from 'react'
import { getSetting, setSetting } from '../lib/db'

const LOCK_KEY = 'app-locked'
const PASSCODE_KEY = 'app-passcode'

export function useLock() {
  const [isLocked, setIsLocked] = useState(false)
  const [hasPasscode, setHasPasscode] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSetting<boolean>(LOCK_KEY),
      getSetting<string>(PASSCODE_KEY),
    ]).then(([locked, passcode]) => {
      setIsLocked(!!locked)
      setHasPasscode(!!passcode)
      setIsUnlocked(!locked)
      setLoading(false)
    })
  }, [])

  const setPasscode = useCallback(async (code: string) => {
    await setSetting(PASSCODE_KEY, code)
    await setSetting(LOCK_KEY, true)
    setHasPasscode(true)
    setIsLocked(true)
    setIsUnlocked(true)
  }, [])

  const removePasscode = useCallback(async () => {
    await setSetting(PASSCODE_KEY, '')
    await setSetting(LOCK_KEY, false)
    setHasPasscode(false)
    setIsLocked(false)
    setIsUnlocked(true)
  }, [])

  const unlock = useCallback(
    async (code: string): Promise<boolean> => {
      const stored = await getSetting<string>(PASSCODE_KEY)
      if (stored === code) {
        setIsUnlocked(true)
        return true
      }
      return false
    },
    []
  )

  return { isLocked, hasPasscode, isUnlocked, loading, setPasscode, removePasscode, unlock }
}
