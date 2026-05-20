import { Av } from "./ui/Atoms.jsx";

export default function TopBar({ project, members, onInvite, onMembers }) {
  return (
    <div style={{
      height: 52, display: "flex", alignItems: "center", padding: "0 18px",
      borderBottom: "1px solid var(--border)", background: "var(--surface)",
      gap: 14, flexShrink: 0,
    }}>
      <span style={{ fontSize: 18 }}>{project?.icon}</span>
      <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>{project?.name}</span>

      {/* Аватари команди */}
      <div style={{ display: "flex" }}>
        {members.slice(0, 4).map((m, i) => (
          <div key={m.id} title={m.name} style={{ marginLeft: i > 0 ? -7 : 0, zIndex: 10 - i }}>
            <Av m={m} size={28} />
          </div>
        ))}
        {members.length > 4 && (
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "var(--surface3)",
            border: "2px solid var(--surface)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 10, fontWeight: 700,
            color: "var(--text2)", marginLeft: -7,
          }}>+{members.length - 4}</div>
        )}
      </div>

      <button onClick={onMembers} style={{
        padding: "5px 13px", borderRadius: 8,
        border: "1px solid var(--border2)", background: "transparent",
        color: "var(--text2)", fontSize: 12, cursor: "pointer",
      }}>👥 Команда</button>

      <button onClick={onInvite} style={{
        padding: "5px 13px", borderRadius: 8,
        border: "none", background: "var(--accent)",
        color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>＋ Запросити</button>
    </div>
  );
}
