import { useState } from "react";
import { Av, Pill, Bdg } from "./ui/Atoms.jsx";
import { fmtDate, isOverdue } from "../utils/formatters.js";
import { statusColor, priorityColor, tagColor } from "../utils/constants.js";

export default function TaskRow({ task, members, depth = 0, onEdit, onDelete, onToggleSub, onMessage }) {
  const [open, setOpen] = useState(true);

  const m    = members.find((x) => x.id === task.assigneeId);
  const done = task.status === "Зроблено" || task.done;
  const late = isOverdue(task.deadline, task.status || (task.done ? "Зроблено" : ""));

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 130px 90px 80px 76px",
          alignItems: "center", height: 38,
          paddingLeft: 14 + depth * 22, paddingRight: 12,
          borderBottom: "1px solid var(--border)",
          background: depth > 0 ? "var(--surface2)" : "var(--surface)",
          cursor: "pointer", transition: "background .1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = depth > 0 ? "var(--surface3)" : "var(--surface2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = depth > 0 ? "var(--surface2)" : "var(--surface)")}
      >
        {/* Назва */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, overflow: "hidden" }}>
          {task.subtasks?.length > 0 ? (
            <button onClick={() => setOpen(!open)} style={{
              width: 15, height: 15, borderRadius: 4, border: "1px solid var(--border2)",
              background: "transparent", color: "var(--text3)", fontSize: 8, flexShrink: 0, cursor: "pointer",
            }}>
              {open ? "▾" : "▸"}
            </button>
          ) : <div style={{ width: 15, flexShrink: 0 }} />}

          {depth > 0 && (
            <input type="checkbox" checked={!!task.done} onChange={() => onToggleSub(task.id)}
              style={{ width: 13, height: 13, accentColor: "var(--accent)", flexShrink: 0, cursor: "pointer" }} />
          )}

          {depth === 0 && (
            <div style={{ width: 3, height: 14, borderRadius: 99, background: priorityColor(task.priority), flexShrink: 0 }} />
          )}

          <span onClick={() => depth === 0 && onEdit(task)} style={{
            fontSize: 12, fontWeight: depth === 0 ? 600 : 400,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            textDecoration: done ? "line-through" : "none",
            color: done ? "var(--text3)" : "var(--text)",
          }}>
            {task.title}
          </span>
        </div>

        {/* Статус */}
        <div>{depth === 0 && <Pill label={task.status} color={statusColor(task.status)} />}</div>

        {/* Виконавець */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
          {m && <Av m={m} size={22} />}
          <span style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {m?.name || "—"}
          </span>
        </div>

        {/* Дедлайн */}
        <div style={{ fontSize: 11, color: late ? "var(--red)" : "var(--text2)" }}>
          {fmtDate(task.deadline)}
        </div>

        {/* Тег */}
        <div>{task.tag && <Bdg label={task.tag} color={tagColor(task.tag)} />}</div>

        {/* Дії */}
        <div style={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
          {depth === 0 && m && (
            <button onClick={() => onMessage(task, m)} title="Написати повідомлення" style={{
              padding: "2px 5px", borderRadius: 5, border: "1px solid var(--border2)",
              background: "transparent", color: "var(--accent)", fontSize: 11, cursor: "pointer",
            }}>💬</button>
          )}
          {depth === 0 && (
            <>
              <button onClick={() => onEdit(task)} style={{
                padding: "2px 5px", borderRadius: 5, border: "1px solid var(--border2)",
                background: "transparent", color: "var(--text3)", fontSize: 11, cursor: "pointer",
              }}>✎</button>
              <button onClick={() => onDelete(task.id)} style={{
                padding: "2px 5px", borderRadius: 5, border: "1px solid var(--border2)",
                background: "transparent", color: "var(--text3)", fontSize: 11, cursor: "pointer",
              }}>✕</button>
            </>
          )}
        </div>
      </div>

      {/* Підзадачі */}
      {open && task.subtasks?.map((s) => (
        <TaskRow key={s.id} task={s} members={members} depth={depth + 1}
          onEdit={onEdit} onDelete={onDelete} onToggleSub={onToggleSub} onMessage={onMessage} />
      ))}
    </>
  );
}
