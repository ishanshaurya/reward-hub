// src/components/LoadingStates.jsx
// RewardHub — Skeleton loaders + empty state components

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/* ── Skeletons ────────────────────────────────────────────────────── */

export function CardSkeleton() {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--bg-tertiary)', borderRadius: '16px 16px 0 0' }} />
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', height: '11px', width: '80px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', height: '32px', width: '140px', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', height: '11px', width: '100px', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '28px 24px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between" style={{ padding: '16px 8px', borderBottom: '1px solid var(--border-default)' }}>
      <div className="flex items-center gap-3">
        <div style={{ width: '60px', height: '18px', borderRadius: '6px', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ width: '180px', height: '14px', borderRadius: '6px', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s infinite' }} />
      </div>
      <div style={{ width: '70px', height: '14px', borderRadius: '6px', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div style={{ padding: '32px', maxWidth: '1320px', margin: '0 auto' }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <div style={{ width: '260px', height: '28px', borderRadius: '8px', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ width: '120px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', animation: 'pulse 1.5s infinite' }} />
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: '24px' }}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* Chart + alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginBottom: '24px' }}>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      {/* List */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '28px 24px' }}>
        <div style={{ width: '140px', height: '16px', borderRadius: '6px', background: 'var(--bg-tertiary)', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        {[...Array(5)].map((_, i) => <ListItemSkeleton key={i} />)}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }`}</style>
    </div>
  );
}

/* ── Empty States ─────────────────────────────────────────────────── */

const emptyContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' };
const emptyIcon = { width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' };
const emptyTitle = { fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' };
const emptyDesc = { fontFamily: 'var(--font-primary)', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.5, marginBottom: '24px' };
const emptyBtn = { background: 'var(--accent-primary)', color: '#000', fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '13px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };

export function EmptyStateNoRewards({ onSyncClick }) {
  return (
    <div style={emptyContainer}>
      <div style={emptyIcon}><AlertCircle size={24} color="#F0A500" /></div>
      <h3 style={emptyTitle}>No Rewards Found</h3>
      <p style={emptyDesc}>We didn't find any reward emails in your Gmail. Try syncing your mailbox, or check your email filters.</p>
      <button onClick={onSyncClick} style={emptyBtn}><RefreshCw size={14} /> Try Syncing Again</button>
    </div>
  );
}

export function EmptyStateSyncInProgress() {
  return (
    <div style={emptyContainer}>
      <div style={{ ...emptyIcon, animation: 'pulse 1.5s ease-in-out infinite' }}><RefreshCw size={24} color="#00D084" className="animate-spin" /></div>
      <h3 style={emptyTitle}>Syncing Your Rewards...</h3>
      <p style={{ ...emptyDesc, marginBottom: 0 }}>Fetching emails from Gmail and parsing rewards. This might take a minute.</p>
    </div>
  );
}

export function EmptyStateError({ error, onRetry }) {
  return (
    <div style={emptyContainer}>
      <div style={emptyIcon}><AlertCircle size={24} color="#FF4757" /></div>
      <h3 style={emptyTitle}>Something Went Wrong</h3>
      <p style={emptyDesc}>{error || 'An unexpected error occurred while loading your rewards.'}</p>
      <button onClick={onRetry} style={emptyBtn}><RefreshCw size={14} /> Try Again</button>
    </div>
  );
}

/* ── Error Boundary ───────────────────────────────────────────────── */

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)', padding: '24px', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Oops! Something Went Wrong</h1>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: 'var(--accent-primary)', color: '#000', fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '14px', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
