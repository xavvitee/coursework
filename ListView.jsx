import TaskRow from "./TaskRow.jsx";
import { filterTasks } from "../services/taskService.js";

export default function ListView({ tasks, members, filter, onAdd, onEdit, onDelete, onToggleSub, onMessage }) {
  const filtered = filterTasks(tasks, filter);

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Заголовки колонок */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 120px 130px 90px 80px 76px",
        padding: "0 12px", height: 32, borderBottom: "1px solid var(--border)",
        alignItems: "center", position: "sticky", top: 0, background: "var(--surface)", zIndex: 5,
      }}>
        {["Назва", "Статус", "Виконавець", "Термін", "Мітка", ""].map((h, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {h}
          </span>
        ))}
      </div>

      {/* Порожній стан */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 13 }}>Задач не знайдено</div>
        </div>
      )}

      {/* Рядки задач */}
      {filtered.map((t) => (
        <TaskRow key={t.id} task={t} members={members}
          onEdit={onEdit} onDelete={onDelete} onToggleSub={onToggleSub} onMessage={onMessage} />
      ))}

      {/* Кнопка додати */}
      <button onClick={onAdd} style={{
        width: "100%", textAlign: "left", padding: "9px 18px",
        border: "none", background: "transparent", color: "var(--text3)",
        fontSize: 12, borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", gap: 8,
      }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text3)")}
      >
        ＋ Додати задачу
      </button>
    </div>
  );
}
