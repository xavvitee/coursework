/**
 * Базові UI-компоненти (атоми)
 * View-шар у шаблоні MVC
 */

/** Аватар учасника */
export const Av = ({ m, size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: m?.color || "#4f8ef7",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.34, fontWeight: 700, color: "#fff", flexShrink: 0,
    border: "2px solid var(--surface)",
  }}>
    {m?.avatar || "?"}
  </div>
);

/** Статусна мітка (пігулка) */
export const Pill = ({ label, color }) => (
  <span style={{
    background: color + "18", color, borderRadius: 99, padding: "2px 9px",
    fontSize: 11, fontWeight: 700, border: `1px solid ${color}33`, whiteSpace: "nowrap",
  }}>
    {label}
  </span>
);

/** Значок (бейдж) */
export const Bdg = ({ label, color }) => (
  <span style={{
    background: color + "22", color, borderRadius: 6, padding: "2px 8px",
    fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
  }}>
    {label}
  </span>
);
