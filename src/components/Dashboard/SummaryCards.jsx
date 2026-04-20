// src/components/Dashboard/SummaryCards.jsx
// FinPulse — Summary stat cards with skeleton loading and staggered fade-in

import { useState, useEffect } from "react";

const cardStyle = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
`;

function SkeletonCard({ delay }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "16px",
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
        animation: `fadeInUp 0.5s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, var(--text-muted), transparent)",
          borderRadius: "16px 16px 0 0",
        }}
      />
      <div
        style={{
          background: "var(--bg-tertiary)",
          borderRadius: "6px",
          height: "11px",
          width: "80px",
          marginBottom: "16px",
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          background: "var(--bg-tertiary)",
          borderRadius: "6px",
          height: "32px",
          width: "140px",
          marginBottom: "10px",
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          background: "var(--bg-tertiary)",
          borderRadius: "6px",
          height: "11px",
          width: "100px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
  );
}

export default function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <>
        <style>{cardStyle}</style>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SkeletonCard delay={0} />
          <SkeletonCard delay={120} />
          <SkeletonCard delay={240} />
        </div>
      </>
    );
  }

  const cards = [
    {
      label: "Total Earned",
      value: `₹${stats.totalEarned.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      accentColor: "#00D084",
      subtext: "Cashback + Refunds",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13" cy="12" r="1.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
    },
    {
      label: "Unclaimed Rewards",
      value: `₹${stats.pendingClaimed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      accentColor: "#F0A500",
      subtext: "Not yet claimed",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Expiring Soon",
      value: `${stats.expiringSoon.length} reward${stats.expiringSoon.length !== 1 ? "s" : ""}`,
      accentColor: stats.expiringSoon.length > 0 ? "#FF4757" : "var(--text-muted)",
      subtext: "Within 7 days",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{cardStyle}</style>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div
            key={card.label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              padding: "28px 24px",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.25s, box-shadow 0.25s",
              animation: "fadeInUp 0.5s ease both",
              animationDelay: `${i * 120}ms`,
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.boxShadow = "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Top accent gradient bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${card.accentColor}, transparent)`,
                borderRadius: "16px 16px 0 0",
              }}
            />

            {/* Background glow blob */}
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                right: "-40px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: card.accentColor,
                opacity: 0.04,
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            {/* Icon + label */}
            <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
              <span style={{ color: card.accentColor, opacity: 0.7 }}>{card.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {card.label}
              </span>
            </div>

            {/* Value */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "32px",
                fontWeight: 600,
                color: card.accentColor,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>

            {/* Subtext */}
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "8px",
                margin: "8px 0 0",
              }}
            >
              {card.subtext}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
