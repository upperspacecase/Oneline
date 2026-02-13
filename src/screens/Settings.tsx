import { useState } from 'react'
import { useLock } from '../hooks/useLock'
import { exportToPDF } from '../lib/export'

export default function Settings() {
  const { hasPasscode, setPasscode, removePasscode } = useLock()
  const [showPasscodeInput, setShowPasscodeInput] = useState(false)
  const [code, setCode] = useState('')
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      await exportToPDF()
    } finally {
      setExporting(false)
    }
  }

  async function handleSetPasscode() {
    if (code.length >= 4) {
      await setPasscode(code)
      setCode('')
      setShowPasscodeInput(false)
    }
  }

  return (
    <div className="screen settings-screen">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <h3>Privacy</h3>
        {hasPasscode ? (
          <div className="settings-row">
            <span>Passcode lock is on</span>
            <button className="settings-btn danger" onClick={removePasscode}>
              Remove
            </button>
          </div>
        ) : showPasscodeInput ? (
          <div className="settings-row passcode-row">
            <input
              type="password"
              className="passcode-input"
              placeholder="Enter 4+ digit passcode"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              maxLength={8}
              autoFocus
            />
            <button
              className="settings-btn"
              onClick={handleSetPasscode}
              disabled={code.length < 4}
            >
              Set
            </button>
            <button className="settings-btn" onClick={() => setShowPasscodeInput(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="settings-row">
            <span>No passcode set</span>
            <button className="settings-btn" onClick={() => setShowPasscodeInput(true)}>
              Set Passcode
            </button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Export</h3>
        <div className="settings-row">
          <span>Download all entries as PDF</span>
          <button className="settings-btn" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>About</h3>
        <div className="settings-about">
          <p className="settings-tagline">Through Line.</p>
          <p className="muted">
            One sentence. Every day. For five years.
          </p>
        </div>
      </div>
    </div>
  )
}
