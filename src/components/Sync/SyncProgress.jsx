// components/Sync/SyncProgress.jsx
// RewardHub — Sync Progress Indicator
// Shows live status during Gmail fetch + parse cycle

import { Component } from "react";
import { useGmailSync } from "../../hooks/useGmailSync";

// Error boundary to prevent blank page if SyncProgress crashes
class SyncErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[SyncProgress] Render crash:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <p style={{ color: "#EF4444", fontSize: 13 }}>
          Sync widget crashed: {this.state.error?.message || "Unknown error"}
        </p>
      );
    }
    return this.props.children;
  }
}

const STATUS_CONFIG = {
  idle: { label: "Ready to sync", icon: "⟳", color: "text-secondary" },
  syncing: { label: "Syncing Gmail...", icon: "⟳", color: "text-info", animate: true },
  searching: { label: "Searching Gmail...", icon: "⟳", color: "text-info", animate: true },
  fetching: { label: "Fetching emails...", icon: "⟳", color: "text-info", animate: true },
  parsing: { label: "Parsing rewards...", icon: "⟳", color: "text-info", animate: true },
  saving: { label: "Saving to dashboard...", icon: "⟳", color: "text-info", animate: true },
  done: { label: "Sync complete!", icon: "✓", color: "text-success" },
  error: { label: "Sync failed", icon: "✕", color: "text-danger" },
};

/**
 * SyncProgress — Full sync orchestration UI.
 * Drop this into your Dashboard; it handles the sync button + live progress display.
 *
 * @param {function} onSyncComplete - Called when sync finishes successfully
 */
export default function SyncProgress({ onSyncComplete }) {
  return (
    <SyncErrorBoundary>
      <SyncProgressInner onSyncComplete={onSyncComplete} />
    </SyncErrorBoundary>
  );
}

function SyncProgressInner({ onSyncComplete }) {
  const { syncState, startSync, resetSync } = useGmailSync();
  // Map hook state names to local names used by this component
  const status = syncState.status;
  const emailsFound = syncState.found ?? syncState.emailsFound ?? 0;
  const emailsFetched = syncState.fetched ?? syncState.emailsFetched ?? 0;
  const rewardsParsed = syncState.parsed ?? syncState.rewardsParsed ?? 0;
  const rewardsSaved = syncState.saved ?? syncState.rewardsSaved ?? 0;
  const error = syncState.errorMessage ?? syncState.error ?? null;

  const isRunning = ["syncing", "searching", "fetching", "parsing", "saving"].includes(status);
  const isDone = status === "done";
  const isError = status === "error";
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  // Compute progress percentage for the progress bar
  const progressPct = getProgressPercent(status, emailsFound, emailsFetched);

  const handleSync = async () => {
    if (isRunning) return;
    if (isDone || isError) resetSync();
    await startSync();
    if (isDone && onSyncComplete) onSyncComplete();
  };

  return (
    <div className="sync-container">
      {/* Sync Button */}
      <button
        className={`btn-sync ${isRunning ? "btn-sync--running" : ""}`}
        onClick={handleSync}
        disabled={isRunning}
      >
        <span className={`sync-icon ${isRunning ? "spin" : ""}`}>
          {config.icon}
        </span>
        {isRunning ? "Syncing..." : isDone ? "Sync Again" : "Sync Gmail"}
      </button>

      {/* Progress Panel — only visible during/after sync */}
      {status !== "idle" && (
        <div className="sync-panel">
          {/* Status row */}
          <div className={`sync-status sync-status--${status}`}>
            <span className={`sync-dot ${isRunning ? "pulse" : ""}`} />
            <span className="sync-label">{config.label}</span>
          </div>

          {/* Progress bar (shown during active sync) */}
          {isRunning && emailsFound > 0 && (
            <div className="sync-bar-wrap">
              <div
                className="sync-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}

          {/* Step counters */}
          {status !== "idle" && status !== "error" && (
            <div className="sync-stats">
              <StatPill label="Found" value={emailsFound} active={status === "searching"} />
              <StatPill label="Fetched" value={emailsFetched} active={status === "fetching"} />
              <StatPill label="Parsed" value={rewardsParsed} active={status === "parsing"} />
              <StatPill label="Saved" value={rewardsSaved} active={status === "saving" || status === "done"} highlight={isDone} />
            </div>
          )}

          {/* Error message */}
          {isError && (
            <p className="sync-error">{error || "An unknown error occurred."}</p>
          )}

          {/* Done summary */}
          {isDone && (
            <p className="sync-done-msg">
              {rewardsSaved > 0
                ? `${rewardsSaved} new reward${rewardsSaved !== 1 ? "s" : ""} added to your dashboard.`
                : "No new rewards found. Your dashboard is up to date."}
            </p>
          )}
        </div>
      )}

      {/* Inline styles (scoped to this component) */}
      <style>{`
        .sync-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-sync {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--accent-primary);
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
          width: fit-content;
        }
        .btn-sync:hover:not(:disabled) { background: #059669; }
        .btn-sync:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-sync--running { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-default); }

        .sync-icon { font-size: 16px; display: inline-block; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .sync-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sync-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .sync-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
          flex-shrink: 0;
        }
        .sync-status--searching .sync-dot,
        .sync-status--fetching .sync-dot,
        .sync-status--parsing .sync-dot,
        .sync-status--saving .sync-dot { background: var(--color-info); }
        .sync-status--done .sync-dot { background: var(--color-success); }
        .sync-status--error .sync-dot { background: var(--color-danger); }
        .pulse { animation: pulse 1.2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .sync-bar-wrap {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }
        .sync-bar-fill {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .sync-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          min-width: 60px;
          transition: background 0.2s;
        }
        .stat-pill--active { background: rgba(16,185,129,0.1); }
        .stat-pill--highlight { background: rgba(16,185,129,0.2); }
        .stat-pill__value {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-pill--highlight .stat-pill__value { color: var(--accent-primary); }
        .stat-pill__label {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .sync-error {
          font-size: 13px;
          color: var(--color-danger);
          margin: 0;
          padding: 8px 12px;
          background: rgba(239,68,68,0.1);
          border-radius: 6px;
        }

        .sync-done-msg {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value, active, highlight }) {
  return (
    <div className={`stat-pill ${active ? "stat-pill--active" : ""} ${highlight ? "stat-pill--highlight" : ""}`}>
      <span className="stat-pill__value">{value}</span>
      <span className="stat-pill__label">{label}</span>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getProgressPercent(status, emailsFound, emailsFetched) {
  if (!emailsFound) return 10;
  if (status === "searching") return 10;
  if (status === "fetching") return 10 + (emailsFetched / emailsFound) * 60;
  if (status === "parsing") return 75;
  if (status === "saving") return 90;
  return 100;
}
