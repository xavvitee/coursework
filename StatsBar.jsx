import { calcStats } from "../utils/formatters.js";

export default function StatsBar({ tasks }) {
  const { total, done, inpro, overdue, pct } = calcStats(tasks);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18, padding: "7px 18px",
      borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0,
    }}>
      {[
        ["Всього",     total,   "var(--text2)"],
        ["В роботі",  inpro,   "var(--accent)"],
        ["Готово",    done,    "var(--green)"],
        ["Прострочено", overdue, "var(--red)"],
      ].map(([l, v, c]) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: c }}>{v}</span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>{l}</span>
        </div>
      ))}

      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
        <div style={{ flex: 1, height: 4, background: "var(--surface3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "var(--green)", borderRadius: 99, transition: "width .5s" }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", minWidth: 32 }}>{pct}%</span>
      </div>
    </div>
  );
}
