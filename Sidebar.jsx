import { Av } from "./ui/Atoms.jsx";

export default function Sidebar({ data, activeProject, setActiveProject, onAddProject }) {
  return (
    <aside style={{
      width: 210, minWidth: 210, background: "var(--surface)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", height: "100%",
    }}>
      {/* Логотип */}
      <div style={{
        padding: "14px 14px 10px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 9,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "linear-gradient(135deg,#4f8ef7,#a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
        }}>✦</div>
        <span style={{ fontWeight: 800, fontSize: 14 }}>TaskFlow</span>
      </div>

      {/* Список проектів */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: "var(--text3)",
          textTransform: "uppercase", letterSpacing: 1, padding: "8px 8px 4px",
        }}>Проекти</div>

        {data.projects.map((p) => {
          const isOwner = p.ownerId === data.me.id;
          const active  = activeProject === p.id;
          return (
            <button key={p.id} onClick={() => setActiveProject(p.id)} style={{
              width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8,
              border: "none", background: active ? "var(--surface3)" : "transparent",
              color: active ? "var(--text)" : "var(--text2)",
              fontSize: 12, fontWeight: active ? 600 : 400,
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            }}>
              <span style={{ fontSize: 14 }}>{p.icon}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </span>
              {isOwner && <span style={{ fontSize: 9, color: "var(--accent)", opacity: 0.7 }}>👑</span>}
            </button>
          );
        })}

        <button onClick={onAddProject} style={{
          width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8,
          border: "1px dashed var(--border2)", background: "transparent",
          color: "var(--text3)", fontSize: 12, marginTop: 4, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
        }}>＋ Новий проект</button>
      </div>

      {/* Поточний користувач */}
      <div style={{
        padding: "12px 14px", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 9,
      }}>
        <Av m={data.me} size={30} />
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.me.name}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Власник</div>
        </div>
      </div>
    </aside>
  );
}
