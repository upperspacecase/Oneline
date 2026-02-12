import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLock } from './hooks/useLock'
import Nav from './components/Nav'
import Today from './screens/Today'
import Calendar from './screens/Calendar'
import Browse from './screens/Browse'
import Settings from './screens/Settings'
import LockScreen from './screens/LockScreen'

export default function App() {
  const { isLocked, isUnlocked, loading, unlock } = useLock()

  if (loading) {
    return (
      <div className="loading-screen">
        <p className="loading-title">One Line.</p>
      </div>
    )
  }

  if (isLocked && !isUnlocked) {
    return <LockScreen onUnlock={unlock} />
  }

  return (
    <BrowserRouter>
      <div className="app">
        <main className="main">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/:dateKey" element={<Browse />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Nav />
      </div>
    </BrowserRouter>
  )
}
