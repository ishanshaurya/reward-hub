// src/components/Dashboard/FilterBar.jsx
// FinPulse — Filter bar for app, type, and date range

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

const selectStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: "12px",
  fontFamily: "var(--font-primary)",
  color: "var(--text-primary)",
  outline: "none",
  cursor: "pointer",
  transition: "border-color 0.2s",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237B8299' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "28px",
};

export default function FilterBar({ filters, setFilters, filterOptions, allRewards }) {
  // Derive filter options from allRewards if filterOptions not provided
  const options = filterOptions || {
    apps: [...new Set((allRewards || []).map((r) => r.app_name).filter(Boolean))],
    types: [...new Set((allRewards || []).map((r) => r.reward_type).filter(Boolean))],
  };

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="flex flex-wrap items-center"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "12px",
        padding: "14px 18px",
        gap: "12px",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-primary)",
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Filters
      </span>

      {/* App filter */}
      <select
        value={filters.app}
        onChange={(e) => handleChange("app", e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Apps</option>
        {options.apps.map((app) => (
          <option key={app} value={app}>
            {app}
          </option>
        ))}
      </select>

      {/* Type filter */}
      <select
        value={filters.type}
        onChange={(e) => handleChange("type", e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Types</option>
        {options.types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {/* Date range pills */}
      <div className="flex ml-auto" style={{ gap: "4px" }}>
        {DATE_OPTIONS.map((opt) => {
          const isActive = filters.dateRange === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleChange("dateRange", opt.value)}
              style={{
                background: isActive ? "var(--accent-primary)" : "transparent",
                color: isActive ? "#000" : "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: isActive ? 600 : 500,
                fontFamily: "var(--font-primary)",
                padding: "5px 12px",
                borderRadius: "6px",
                border: isActive ? "none" : "1px solid var(--border-default)",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "-0.01em",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
