// src/App.jsx
// RewardHub — Root: sets up router, error boundary, and toast container

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useToast } from './hooks/useToast'
import { ToastContainer } from './components/UI/Toast'
import { ErrorBoundary } from './components/LoadingStates'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/Dashboard'

function AppRoutes() {
  const { toasts, toast, removeToast } = useToast()

  return (
    <>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
