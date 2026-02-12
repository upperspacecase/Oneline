import { useState } from 'react'

interface Props {
  onUnlock: (code: string) => Promise<boolean>
}

export default function LockScreen({ onUnlock }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setChecking(true)
    setError(false)
    const ok = await onUnlock(code)
    if (!ok) {
      setError(true)
      setCode('')
    }
    setChecking(false)
  }

  return (
    <div className="lock-screen">
      <div className="lock-content">
        <h1 className="lock-title">One Line.</h1>
        <form onSubmit={handleSubmit} className="lock-form">
          <input
            type="password"
            className="lock-input"
            placeholder="Passcode"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            maxLength={8}
            autoFocus
          />
          {error && <p className="lock-error">Wrong passcode</p>}
          <button className="lock-btn" type="submit" disabled={!code || checking}>
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
