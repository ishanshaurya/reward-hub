// src/components/Dashboard/RewardTimeline.jsx
// FinPulse — Scrollable reward list with claimed toggle and app-colored badges

const APP_BADGE_STYLES = {
  Paytm: { background: "rgba(0,186,242,0.1)", color: "#00BAF2" },
  PhonePe: { background: "rgba(95,37,159,0.2)", color: "#9B6FD4" },
  "Google Pay": { background: "rgba(66,133,244,0.1)", color: "#4285F4" },
  "Amazon Pay": { background: "rgba(255,153,0,0.1)", color: "#FF9900" },
  Swiggy: { background: "rgba(252,128,25,0.1)", color: "#FC8019" },
  Zomato: { background: "rgba(226,55,68,0.1)", color: "#E23744" },
  Other: { background: "rgba(107,114,128,0.1)", color: "#6B7280" },
};

const TYPE_STYLES = {
  cashback: { background: "rgba(0,208,132,0.1)", color: "#00D084", label: "Cashback" },
  coupon: { background: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Coupon" },
  refund: { background: "rgba(240,165,0,0.1)", color: "#F0A500", label: "Refund" },
  points: { background: "rgba(139,92,246,0.1)", color: "#8B5CF6", label: "Points" },
  other: { background: "rgba(107,114,128,0.1)", color: "#6B7280", label: "Other" },
};

const PILL_BASE = {
  fontSize: "10px",
  fontWeight: 600,
  padding: "3px 8px",
  borderRadius: "6px",
  whiteSpace: "nowrap",
  fontFamily: "var(--font-primary)",
  letterSpacing: "0.02em",
  flexShrink: 0,
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatAmount(amount) {
  if (amount == null) return "\u2014";
  return `\u20B9${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function RewardTimeline({ rewards, toggleClaimed }) {
  if (!rewards || rewards.length === 0) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          borderRadius: "16px",
          padding: "28px 24px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", margin: "0 0 12px" }}>
          Reward History
        </h3>
        <div className="flex flex-col items-center justify-center py-12 gap-3" style={{ color: "var(--text-muted)" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity={0.3}>
            <rect x="6" y="4" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 12h12M12 18h8M12 24h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: "13px", textAlign: "center", margin: 0, fontFamily: "var(--font-primary)" }}>
            No rewards found.<br />Try adjusting filters or sync your Gmail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "16px",
        padding: "28px 24px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", margin: 0 }}>
          Reward History
        </h3>
        <span
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            padding: "3px 10px",
            borderRadius: "20px",
            border: "1px solid var(--border-default)",
          }}
        >
          {rewards.length} reward{rewards.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Scrollable list */}
      <div style={{ maxHeight: "520px", overflowY: "auto" }}>
        {rewards.map((reward, idx) => {
          const appBadge = APP_BADGE_STYLES[reward.app_name] || APP_BADGE_STYLES.Other;
          const typeStyle = TYPE_STYLES[reward.reward_type] || TYPE_STYLES.other;
          const isExpired = reward.is_expired;

          return (
            <div
              key={reward.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 8px",
                borderBottom: idx < rewards.length - 1 ? "1px solid var(--border-default)" : "none",
                cursor: "default",
                transition: "background 0.15s",
                borderRadius: "8px",
                opacity: isExpired ? 0.5 : 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {/* App badge */}
              <span style={{ ...PILL_BASE, background: appBadge.background, color: appBadge.color }}>
                {reward.app_name}
              </span>

              {/* Type tag */}
              <span style={{ ...PILL_BASE, background: typeStyle.background, color: typeStyle.color }}>
                {typeStyle.label}
              </span>

              {/* Subject line */}
              <span
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "280px",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {reward.subject_line || `${typeStyle.label} from ${reward.app_name}`}
              </span>

              {/* Snippet */}
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                  flexShrink: 0,
                }}
              >
                {reward.snippet || ""}
              </span>

              {/* Amount + date */}
              <div className="flex flex-col items-end" style={{ flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#00D084",
                    letterSpacing: "-0.02em",
                    ...(isExpired && { opacity: 0.35, textDecoration: "line-through" }),
                  }}
                >
                  {formatAmount(reward.amount)}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>
                  {formatDate(reward.email_date)}
                </span>
              </div>

              {/* Claimed toggle */}
              {reward.is_claimed ? (
                <button
                  onClick={() => toggleClaimed?.(reward.id, reward.is_claimed)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(0,208,132,0.15)",
                    border: "1px solid rgba(0,208,132,0.4)",
                    color: "#00D084",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  title="Mark as unclaimed"
                >
                  ✓
                </button>
              ) : (
                <button
                  onClick={() => toggleClaimed?.(reward.id, reward.is_claimed)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "transparent",
                    border: "1px solid var(--border-hover)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  title="Mark as claimed"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
