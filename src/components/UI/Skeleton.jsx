// src/components/UI/Skeleton.jsx
// RewardHub — Reusable loading skeleton components

const pulse = { animation: 'pulse 1.5s infinite' }

const styles = `
@keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
`

/** Matches the shape of a SummaryCard */
export function SkeletonCard() {
  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          padding: '28px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--bg-tertiary)', borderRadius: '16px 16px 0 0' }} />
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', height: '11px', width: '80px',  marginBottom: '16px', ...pulse }} />
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', height: '32px', width: '140px', marginBottom: '10px', ...pulse }} />
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', height: '11px', width: '100px', ...pulse }} />
      </div>
    </>
  )
}

/** Matches the shape of a RewardTimeline row */
export function SkeletonRow() {
  return (
    <>
      <style>{styles}</style>
      <div
        className="flex items-center justify-between"
        style={{ padding: '16px 8px', borderBottom: '1px solid var(--border-default)', gap: '12px' }}
      >
        <div className="flex items-center" style={{ gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bg-tertiary)', flexShrink: 0, ...pulse }} />
          <div style={{ width: '56px',  height: '18px', borderRadius: '6px', background: 'var(--bg-tertiary)', flexShrink: 0, ...pulse }} />
          <div style={{ width: '52px',  height: '18px', borderRadius: '6px', background: 'var(--bg-tertiary)', flexShrink: 0, ...pulse }} />
          <div style={{ flex: 1, height: '13px', borderRadius: '6px', background: 'var(--bg-tertiary)', ...pulse }} />
        </div>
        <div style={{ width: '70px', height: '14px', borderRadius: '6px', background: 'var(--bg-tertiary)', flexShrink: 0, ...pulse }} />
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--bg-tertiary)', flexShrink: 0, ...pulse }} />
      </div>
    </>
  )
}
