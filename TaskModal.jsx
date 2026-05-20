import { useState } from "react";
import { STATUSES, PRIORITIES, TAGS } from "../../utils/constants.js";

export default function TaskModal({ task, members, onClose, onSave }) {
  const [form, setForm] = useState(task || {
    title: "", status: "Зробити", priority: 1,
    assigneeId: members[0]?.id || 1, deadline: "", tag: "Загальне", subtasks: [],
  });
  const [newSub, setNewSub] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addSub = () => {
    if (!newSub.trim()) return;
    set("subtasks", [...form.subtasks, {
      id: Date.now(), title: newSub.trim(), done: false,
      assigneeId: form.assigneeId, deadline: "",
    }]);
    setNewSub("");
  };

  return (
    <div className="fade" style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", borderRadius: 14,
        width: 510, maxHeight: "88vh", overflow: "hidden",
        border: "1px solid var(--border)", boxShadow: "var(--shadow)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Заголовок */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>{task ? "Редагувати" : "Нова"} задача</span>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "var(--text3)", fontSize: 17, cursor: "pointer" }}>✕</button>
        </div>

        {/* Форма */}
        <div style={{ overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 13 }}>
          {/* Назва */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>Назва *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="Що потрібно зробити?"
              style={{ width: "100%", padding: "9px 11px", borderRadius: 8,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text)", fontSize: 13 }} />
          </div>

          {/* Поля 2 колонки */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
            {[
              ["Статус",     "status",     "select", STATUSES.map((s) => ({ v: s, l: s }))],
              ["Пріоритет",  "priority",   "select", PRIORITIES.map((p, i) => ({ v: i, l: p }))],
              ["Виконавець", "assigneeId", "select", members.map((m) => ({ v: m.id, l: m.name }))],
              ["Дедлайн",   "deadline",   "date",   []],
              ["Мітка",     "tag",        "select", TAGS.map((t) => ({ v: t, l: t }))],
            ].map(([label, key, type, opts]) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>{label}</label>
                {type === "date" ? (
                  <input type="date" value={form[key]} onChange={(e) => set(key, e.target.value)}
                    style={{ width: "100%", padding: "9px 11px", borderRadius: 8,
                      background: "var(--surface2)", border: "1px solid var(--border)",
                      color: "var(--text)", fontSize: 13 }} />
                ) : (
                  <select value={form[key]}
                    onChange={(e) => set(key, key === "priority" || key === "assigneeId" ? +e.target.value : e.target.value)}
                    style={{ width: "100%", padding: "9px 11px", borderRadius: 8,
                      background: "var(--surface2)", border: "1px solid var(--border)",
                      color: "var(--text)", fontSize: 13 }}>
                    {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Підзадачі */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 7 }}>Підзадачі</label>
            {form.subtasks.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <input type="checkbox" checked={s.done}
                  onChange={() => set("subtasks", form.subtasks.map((x, j) => j === i ? { ...x, done: !x.done } : x))}
                  style={{ accentColor: "var(--accent)", cursor: "pointer" }} />
                <span style={{ fontSize: 12, flex: 1, textDecoration: s.done ? "line-through" : "none",
                  color: s.done ? "var(--text3)" : "var(--text)" }}>{s.title}</span>
                <button onClick={() => set("subtasks", form.subtasks.filter((_, j) => j !== i))}
                  style={{ border: "none", background: "transparent", color: "var(--text3)", cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 7, marginTop: 4 }}>
              <input value={newSub} onChange={(e) => setNewSub(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSub()} placeholder="Нова підзадача..."
                style={{ flex: 1, padding: "7px 11px", borderRadius: 8,
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  color: "var(--text)", fontSize: 12 }} />
              <button onClick={addSub} style={{ padding: "7px 11px", borderRadius: 8,
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>＋</button>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div style={{ padding: "13px 20px", borderTop: "1px solid var(--border)",
          display: "flex", gap: 9, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 17px", borderRadius: 8,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text2)", fontSize: 13, cursor: "pointer" }}>Скасувати</button>
          <button onClick={() => { if (form.title.trim()) onSave(form); }}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none",
              background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {task ? "Зберегти" : "Створити"}
          </button>
        </div>
      </div>
    </div>
  );
}
