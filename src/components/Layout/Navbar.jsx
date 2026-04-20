// src/components/Layout/Navbar.jsx
// FinPulse — Top navigation with logo, user avatar, and Sync Now CTA

const syncPulse = `
@keyframes ring-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(0,208,132,0.6); }
  70%  { box-shadow: 0 0 0 6px rgba(0,208,132,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,208,132,0); }
}
`

function Avatar({ name, email }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (email?.[0] || '?').toUpperCase()

  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '11px',
        fontWeight: 700,
        color: '#000',
        fontFamily: 'var(--font-primary)',
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  )
}

export default function Navbar({ user, onSignOut, demoMode, onSync, isSyncing }) {
  const displayName = demoMode
    ? 'Demo User'
    : (user?.full_name || user?.user_metadata?.full_name || user?.email || '')
  const displayEmail = demoMode ? 'demo@rewardhub.app' : (user?.email || '')
  const signOutLabel = demoMode ? 'Exit Demo' : 'Sign out'

  return (
    <>
      <style>{syncPulse}</style>
      <nav
        style={{
          background: 'rgba(8,11,18,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-default)',
          padding: '0 32px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              marginRight: '8px',
              boxShadow: '0 0 8px rgba(0,208,132,0.6)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            FinPulse
          </span>
          {demoMode && (
            <span
              style={{
                marginLeft: '10px',
                background: 'rgba(240,165,0,0.1)',
                color: '#F0A500',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: 'var(--font-primary)',
                padding: '3px 8px',
                borderRadius: '20px',
                border: '1px solid rgba(240,165,0,0.25)',
                letterSpacing: '0.05em',
              }}
            >
              DEMO
            </span>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          {/* Sync Now button (hidden in demo mode) */}
          {onSync && !demoMode && (
            <button
              onClick={isSyncing ? undefined : onSync}
              disabled={isSyncing}
              style={{
                background: isSyncing ? 'transparent' : 'var(--accent-primary)',
                color: isSyncing ? 'var(--accent-primary)' : '#000',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
                fontSize: '12px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: isSyncing ? '1px solid rgba(0,208,132,0.4)' : 'none',
                cursor: isSyncing ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                letterSpacing: '-0.01em',
                transition: 'opacity 0.2s',
                animation: isSyncing ? 'ring-pulse 1.4s ease-in-out infinite' : 'none',
              }}
              onMouseEnter={e => { if (!isSyncing) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {isSyncing ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity={0.3} />
                    <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Syncing…
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 2.5A6.5 6.5 0 118 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M13.5 2.5V6H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sync Now
                </>
              )}
            </button>
          )}

          {/* User info */}
          {(user || demoMode) && (
            <>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <Avatar name={displayName} email={displayEmail} />
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-primary)',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName || displayEmail}
                </span>
              </div>

              <button
                onClick={onSignOut}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-primary)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {signOutLabel}
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
