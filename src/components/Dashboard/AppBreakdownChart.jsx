// src/components/Dashboard/AppBreakdownChart.jsx
// RewardHub — Donut chart showing reward breakdown by payment app

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const APP_COLORS = {
  Paytm: "#00BAF2",
  PhonePe: "#5F259F",
  "Google Pay": "#4285F4",
  "Amazon Pay": "#FF9900",
  Swiggy: "#FC8019",
  Zomato: "#E23744",
  Other: "#6B7280",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;

  return (
    <div
      style={{
        background: "#0E1118",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "#EEF0F6", fontSize: "12px", fontWeight: 500, marginBottom: "4px", margin: "0 0 4px" }}>
        {payload[0].name}
      </p>
      <p style={{ color: "#00D084", fontFamily: "JetBrains Mono", fontSize: "14px", fontWeight: 600, margin: 0 }}>
        ₹{payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

function CustomLegend({ data }) {
  return (
    <div className="flex flex-wrap justify-center" style={{ gap: "16px", marginTop: "20px" }}>
      {data.map((entry) => {
        const color = APP_COLORS[entry.name] || APP_COLORS.Other;
        return (
          <div key={entry.name} className="flex items-center" style={{ gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}60`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontFamily: "var(--font-primary)" }}>
              {entry.name}
            </span>
            <span
              style={{
                color: "var(--text-primary)",
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                marginLeft: "4px",
              }}
            >
              ₹{entry.value.toLocaleString("en-IN")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AppBreakdownChart({ stats }) {
  const byApp = stats?.byApp || {};
  const data = Object.entries(byApp)
    .map(([name, amount]) => ({ name, value: typeof amount === "object" ? amount.total || 0 : amount }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const isEmpty = data.length === 0;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "16px",
        padding: "28px 24px",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          marginBottom: "20px",
          margin: "0 0 20px",
        }}
      >
        Rewards by App
      </h3>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3" style={{ color: "var(--text-muted)" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity={0.3}>
            <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 16l14 8 4-3 14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="28" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p style={{ fontSize: "13px", textAlign: "center", margin: 0, fontFamily: "var(--font-primary)" }}>
            No reward data yet.<br />Sync your Gmail to get started.
          </p>
        </div>
      ) : (
        <>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={APP_COLORS[entry.name] || APP_COLORS.Other}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend data={data} />
        </>
      )}
    </div>
  );
}
