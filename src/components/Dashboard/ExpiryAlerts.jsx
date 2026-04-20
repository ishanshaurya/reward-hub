// src/components/Dashboard/ExpiryAlerts.jsx
// FinPulse — Rewards expiring in the next 7 days

const APP_BADGE_STYLES = {
  Paytm: { background: "rgba(0,186,242,0.1)", color: "#00BAF2" },
  PhonePe: { background: "rgba(95,37,159,0.2)", color: "#9B6FD4" },
  "Google Pay": { background: "rgba(66,133,244,0.1)", color: "#4285F4" },
  "Amazon Pay": { background: "rgba(255,153,0,0.1)", color: "#FF9900" },
  Swiggy: { background: "rgba(252,128,25,0.1)", color: "#FC8019" },
  Zomato: { background: "rgba(226,55,68,0.1)", color: "#E23744" },
  Other: { background: "rgba(107,114,128,0.1)", color: "#6B7280" },
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
}

function urgencyLabel(days) {
  if (days <= 1) return { text: "Expires today!", color: "#FF4757" };
  if (days <= 3) return { text: `${days} days left`, color: "#F0A500" };
  return { text: `${days} days left`, color: "var(--text-secondary)" };
}

export default function ExpiryAlerts({ expiringSoon = [] }) {
  if (expiringSoon.length === 0) {
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
          Expiring Soon
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-primary)", margin: 0 }}>
          Nothing expiring in the next 7 days.
        </p>
      </div>
    );
  }

  // Sort by most urgent first
  const sorted = [...expiringSoon].sort(
    (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)
  );

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "16px",
        padding: "28px 24px",
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: "20px" }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L2 18h16L10 2z"
            stroke="#F0A500"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 8v4M10 14v1"
            stroke="#F0A500"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", margin: 0 }}>
          Expiring Soon
        </h3>
        <span
          style={{
            marginLeft: "auto",
            background: "rgba(240,165,0,0.1)",
            color: "#F0A500",
            fontSize: "10px",
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            padding: "3px 10px",
            borderRadius: "20px",
            border: "1px solid rgba(240,165,0,0.2)",
          }}
        >
          {sorted.length}
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: "10px" }}>
        {sorted.map((reward) => {
          const days = daysUntil(reward.expiry_date);
          const urgency = urgencyLabel(days);
          const appBadge = APP_BADGE_STYLES[reward.app_name] || APP_BADGE_STYLES.Other;

          return (
            <div
              key={reward.id}
              className="flex items-center justify-between"
              style={{
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "10px",
                border: days <= 1 ? "1px solid rgba(255,71,87,0.25)" : "1px solid var(--border-default)",
                background: days <= 1 ? "rgba(255,71,87,0.04)" : "var(--bg-tertiary)",
                transition: "border-color 0.2s",
              }}
            >
              <div className="flex items-center min-w-0" style={{ gap: "10px" }}>
                {/* App badge */}
                <span
                  style={{
                    background: appBadge.background,
                    color: appBadge.color,
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-primary)",
                    letterSpacing: "0.02em",
                    flexShrink: 0,
                  }}
                >
                  {reward.app_name}
                </span>

                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-primary)",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {reward.reward_type === "coupon" && reward.coupon_code
                      ? `Code: ${reward.coupon_code}`
                      : reward.subject_line || `${reward.reward_type} reward`}
                  </p>
                  <p style={{ fontSize: "11px", color: urgency.color, margin: "2px 0 0", fontFamily: "var(--font-primary)" }}>
                    {urgency.text}
                  </p>
                </div>
              </div>

              {reward.amount && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    flexShrink: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{Number(reward.amount).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
