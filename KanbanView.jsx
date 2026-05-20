import { Av, Bdg } from "./ui/Atoms.jsx";
import { fmtDate } from "../utils/formatters.js";
import { STATUSES, statusColor, tagColor } from "../utils/constants.js";

export default function KanbanView({ tasks, members, onEdit, onAdd }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: 14, overflowX: "auto", flex: 1, alignItems: "flex-start" }}>
      {STATUSES.map((st) => {
        const cols = tasks.filter((t) => t.status === st);
        return (
          <div key={st} style={{
            width: 240, minWidth: 240, background: "var(--surface2)",
            borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden",
          }}>
            {/* Заголовок колонки */}
            <div style={{
              padding: "9px 12px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor(st) }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>{st}</span>
              <span style={{
                marginLeft: "auto", fontSize: 10, color: "var(--text3)",
                background: "var(--surface3)", borderRadius: 99, padding: "1px 6px",
              }}>{cols.length}</span>
            </div>

            {/* Картки */}
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {cols.map((t) => {
                const m = members.find((x) => x.id === t.assigneeId);
                return (
                  <div key={t.id} onClick={() => onEdit(t)} style={{
                    background: "var(--surface)", borderRadius: 8, padding: "10px 12px",
                    border: "1px solid var(--border)", cursor: "pointer", transition: "border-color .15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, lineHeight: 1.35 }}>
                      {t.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {m && <Av m={m} size={20} />}
                      <span style={{ fontSize: 10, color: "var(--text3)", flex: 1 }}>{fmtDate(t.deadline)}</span>
                      {t.tag && <Bdg label={t.tag} color={tagColor(t.tag)} />}
                    </div>
                  </div>
                );
              })}

              <button onClick={onAdd} style={{
                padding: "7px", borderRadius: 8,
                border: "1px dashed var(--border2)", background: "transparent",
                color: "var(--text3)", fontSize: 11, cursor: "pointer", width: "100%",
              }}>＋ Додати</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
