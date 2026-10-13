import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import { ReportProvider } from './Report'
import { ConnectProvider } from './Connect'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Verify from './pages/Verify'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

function Routed() {
  const { loading } = useAuth()
  if (loading) return null
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <ConnectProvider>
          <HashRouter>
            <Routed />
          </HashRouter>
        </ConnectProvider>
      </ReportProvider>
    </AuthProvider>
  )
}
