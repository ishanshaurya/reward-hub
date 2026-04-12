import { useAuth } from './hooks/useAuth'
import Navbar from './components/Layout/Navbar'
import LoginButton from './components/Auth/LoginButton'
import SyncProgress from './components/Sync/SyncProgress'

function App() {
  const { user, profileError, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      {user ? (
        <div className="p-8">
          {profileError && (
            <div
              className="mb-6 px-4 py-3 rounded-lg text-sm font-medium"
              style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}
            >
              {profileError}
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome, {user.user_metadata?.full_name?.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Dashboard coming in Phase 3. Auth is working
          </p>
          <div className="mt-6">
            <SyncProgress onSyncComplete={() => window.location.reload()} />
          </div>
        </div>
      ) : (
        <div
          className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center gap-6"
        >
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            RewardHub
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track all your UPI rewards in one place
          </p>
          <LoginButton />
        </div>
      )}
    </div>
  )
}

export default App