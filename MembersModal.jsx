import { Av, Bdg } from "../ui/Atoms.jsx";

export default function MembersModal({ members, tasks, isOwner, meId, onClose, onRemove }) {
  return (
    <div className="fade" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: 14,
        width: 500, maxHeight: "78vh", overflow: "hidden", border: "1px solid var(--border)",
        boxShadow: "var(--shadow)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>👥 Команда проекту</span>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "var(--text3)", fontSize: 17, cursor: "pointer" }}>✕</button>
        </div>
        {isOwner && (
          <div style={{ padding: "7px 20px", background: "var(--surface2)", fontSize: 11, color: "var(--text3)",
            borderBottom: "1px solid var(--border)" }}>
            👑 Ви власник — можете видаляти учасників
          </div>
        )}
        <div style={{ overflowY: "auto", padding: "8px 20px 20px" }}>
          {members.map((m) => {
            const mt  = tasks.filter((t) => t.assigneeId === m.id);
            const dn  = mt.filter((t) => t.status === "Зроблено").length;
            const pct = mt.length ? Math.round((dn / mt.length) * 100) : 0;
            const isMe = m.id === meId;
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
                <Av m={m} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</span>
                    <Bdg label={m.role} color="#64748b" />
                    {isMe && <span style={{ fontSize: 10, color: "var(--accent)" }}>(ви)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 7 }}>{m.email}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 3, background: "var(--surface3)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text3)", minWidth: 65 }}>{dn}/{mt.length} ({pct}%)</span>
                  </div>
                </div>
                {isOwner && !isMe && (
                  <button onClick={() => { if (window.confirm(`Видалити ${m.name} з команди?`)) onRemove(m.id); }}
                    style={{ padding: "5px 11px", borderRadius: 7, border: "1px solid var(--red)",
                      background: "transparent", color: "var(--red)", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
                    Видалити
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
