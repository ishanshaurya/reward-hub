// src/components/Dashboard/Dashboard.jsx
// FinPulse — Dashboard content area (sync state passed in from pages/Dashboard)

import { useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import AppBreakdownChart from "./AppBreakdownChart";
import RewardTimeline from "./RewardTimeline";
import ExpiryAlerts from "./ExpiryAlerts";
import FilterBar from "./FilterBar";

const STATUS_LABELS = {
  searching: "Searching Gmail…",
  fetching:  "Fetching emails…",
  parsing:   "Parsing rewards…",
  saving:    "Saving to dashboard…",
};

export default function Dashboard({
  rewards,
  allRewards,
  stats,
  loading,
  error,
  filters,
  setFilters,
  filterOptions,
  fetchRewards,
  toggleClaimed,
  // Sync state — provided by pages/Dashboard.jsx
  syncState,
  resetSync,
  isDemo = false,
}) {
  const [errorDismissed, setErrorDismissed] = useState(false)

  const isSyncing = syncState
    ? ["searching", "fetching", "parsing", "saving"].includes(syncState.status)
    : false
  const syncLabel   = syncState ? STATUS_LABELS[syncState.status] : null
  const syncDone    = syncState?.status === "done"
  const syncError   = syncState?.status === "error"
  const displayError = syncError ? syncState.errorMessage : error

  // After sync completes, refetch and auto-clear status
  useEffect(() => {
    if (!syncDone || !fetchRewards || !resetSync) return
    fetchRewards()
    const t = setTimeout(() => resetSync(), 3000)
    return () => clearTimeout(t)
  }, [syncDone, fetchRewards, resetSync])

  // Reset dismiss when a new error appears
  useEffect(() => { setErrorDismissed(false) }, [displayError])

  const isEmpty = !loading && rewards?.length === 0

  return (
    <div style={{ padding: "32px", maxWidth: "1320px", margin: "0 auto" }}>

      {/* Error banner */}
      {displayError && !errorDismissed && (
        <div
          className="flex items-center justify-between"
          style={{
            background: "rgba(255,71,87,0.08)",
            border: "1px solid rgba(255,71,87,0.3)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "13px", fontFamily: "var(--font-primary)", color: "#FF4757" }}>
            {displayError}
          </span>
          <button
            onClick={() => { setErrorDismissed(true); if (syncError && resetSync) resetSync() }}
            style={{ background: "none", border: "none", color: "#FF4757", fontSize: "18px", fontWeight: 700, cursor: "pointer", opacity: 0.7, marginLeft: "12px" }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {isDemo ? "Demo Dashboard" : "Your Reward Dashboard"}
        </h1>

        {/* Sync status line */}
        {syncLabel && (
          <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--accent-primary)", margin: "6px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-primary)", animation: "pulse-dot 1s ease-in-out infinite" }} />
            {syncLabel}
            {syncState?.found > 0 && ` (${syncState.fetched}/${syncState.found})`}
          </p>
        )}
        {syncDone && (
          <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--accent-primary)", margin: "6px 0 0" }}>
            ✓ Sync complete —{" "}
            {syncState.saved > 0
              ? `${syncState.saved} new reward${syncState.saved !== 1 ? "s" : ""} added`
              : "no new rewards found"}
            {syncState.skipped > 0 && ` (${syncState.skipped} duplicate${syncState.skipped !== 1 ? "s" : ""} skipped)`}
          </p>
        )}
        {isDemo && (
          <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-muted)", margin: "6px 0 0" }}>
            You're viewing sample data · Sign in to sync your real Gmail rewards
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: "24px" }}>
        <FilterBar filters={filters} setFilters={setFilters} filterOptions={filterOptions} allRewards={allRewards} />
      </div>

      {/* Summary cards */}
      <div style={{ marginBottom: "24px" }}>
        <SummaryCards stats={stats} loading={loading} />
      </div>

      {/* Chart + Expiry */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <AppBreakdownChart stats={stats} />
        <ExpiryAlerts expiringSoon={stats?.expiringSoon || []} />
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: "24px" }}>
        {isEmpty && !isSyncing ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              padding: "60px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px" }}>
              No rewards found
            </p>
            <p style={{ fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Click <strong style={{ color: "var(--accent-primary)" }}>Sync Now</strong> in the top bar to import your Gmail rewards.
            </p>
          </div>
        ) : (
          <RewardTimeline rewards={rewards} toggleClaimed={toggleClaimed} />
        )}
      </div>

      <style>{`@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
