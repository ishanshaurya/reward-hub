// src/components/UI/Toast.jsx
// RewardHub — Slide-in toast notification component

const TOAST_STYLES = {
  success: { bg: 'rgba(0,208,132,0.15)',  border: 'rgba(0,208,132,0.4)',  text: '#00D084', icon: '✓' },
  error:   { bg: 'rgba(255,71,87,0.12)',  border: 'rgba(255,71,87,0.4)',  text: '#FF4757', icon: '✕' },
  info:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', text: '#3B82F6', icon: 'ℹ' },
}

function Toast({ toast, onRemove }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        fontFamily: 'var(--font-primary)',
        fontSize: '13px',
        fontWeight: 500,
        padding: '12px 16px',
        borderRadius: '10px',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slide-in 0.3s ease-out',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ fontSize: '14px', flexShrink: 0 }}>{s.icon}</span>
      <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 400 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: s.text,
          cursor: 'pointer',
          opacity: 0.6,
          fontSize: '18px',
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
      >
        &times;
      </button>
    </div>
  )
}

export function ToastContainer({ toasts = [], onRemove = () => {} }) {
  if (toasts.length === 0) return null
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '340px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}
