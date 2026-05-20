/**
 * App.jsx — Головний компонент
 *
 * Архітектура: React компонентна архітектура (аналог MVC)
 *  ┌─────────────────────────────────────────────────┐
 *  │  MODEL   → src/utils/defaultData.js             │
 *  │            Стан: data (projects, tasks, members) │
 *  │                                                  │
 *  │  SERVICE → src/services/taskService.js           │
 *  │            Бізнес-логіка: CRUD, фільтрація       │
 *  │                                                  │
 *  │  VIEW    → src/components/*.jsx                  │
 *  │            Відображення: Sidebar, ListView, ...  │
 *  │                                                  │
 *  │  STORAGE → src/storage/localStorage.js           │
 *  │            src/storage/supabaseStorage.js         │
 *  │            Персистентність даних                 │
 *  └─────────────────────────────────────────────────┘
 */

import { useState, useEffect } from "react";

// Storage
import { loadFromLocal, saveToLocal } from "./storage/localStorage.js";

// Service (Controller)
import {
  createProject,
  addTask, updateTask, deleteTask,
  toggleSubtask,
  inviteMember, removeMember,
  sendMessage,
} from "./services/taskService.js";

// Components (View)
import Sidebar        from "./components/Sidebar.jsx";
import TopBar         from "./components/TopBar.jsx";
import StatsBar       from "./components/StatsBar.jsx";
import ListView       from "./components/ListView.jsx";
import KanbanView     from "./components/KanbanView.jsx";
import TaskModal      from "./components/modals/TaskModal.jsx";
import InviteModal    from "./components/modals/InviteModal.jsx";
import MembersModal   from "./components/modals/MembersModal.jsx";
import MessagesModal  from "./components/modals/MessagesModal.jsx";

// Utils
import { nowTime }    from "./utils/formatters.js";
import { STATUSES }   from "./utils/constants.js";

// ── Глобальні стилі ───────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#0f1117; --surface:#161b27; --surface2:#1e2535; --surface3:#252d40;
      --border:#2a3349; --border2:#374059; --accent:#4f8ef7;
      --green:#22c55e; --yellow:#f59e0b; --red:#ef4444; --purple:#a855f7; --orange:#f97316;
      --text:#e2e8f0; --text2:#94a3b8; --text3:#64748b; --shadow:0 8px 32px rgba(0,0,0,0.5);
    }
    html,body,#root { height:100%; background:var(--bg); font-family:'Manrope',sans-serif; color:var(--text); }
    ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}
    input,textarea,select,button{font-family:'Manrope',sans-serif;outline:none;}
    .fade{animation:fadeIn .2s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
  `}</style>
);

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Стан (Model) ─────────────────────────────────────────────────────────
  const [data,      setData]     = useState(() => loadFromLocal());
  const [pid,       setPid]      = useState(() => loadFromLocal().projects[0]?.id || 1);
  const [view,      setView]     = useState("list");
  const [modal,     setModal]    = useState(null);
  const [editTask,  setEditTask] = useState(null);
  const [msgTask,   setMsgTask]  = useState(null);
  const [msgMember, setMsgMember]= useState(null);
  const [filter,    setFilter]   = useState({});

  // ── Збереження (Storage) ─────────────────────────────────────────────────
  useEffect(() => { saveToLocal(data); }, [data]);

  // Скидаємо фільтр при зміні проекту
  useEffect(() => { setFilter({}); }, [pid]);

  // ── Похідні дані ──────────────────────────────────────────────────────────
  const project  = data.projects.find((p) => p.id === pid);
  const members  = data.members[pid] || [];
  const tasks    = data.tasks[pid]   || [];
  const isOwner  = project?.ownerId === data.me.id;

  // ── Handlers (Controller) ────────────────────────────────────────────────

  const handleAddProject = () => {
    const name = prompt("Назва нового проекту:");
    if (!name?.trim()) return;
    try {
      const { newData, newId } = createProject(data, name);
      setData(newData);
      setPid(newId);
    } catch (e) { alert(e.message); }
  };

  const handleSaveTask = (form) => {
    try {
      // addTask/updateTask повертають новий стан без мутацій
      const newData = editTask
        ? updateTask(data, pid, { ...editTask, ...form })
        : addTask(data, pid, form);
      setData(newData);
      setModal(null);
      setEditTask(null);
    } catch (e) { alert(e.message); }
  };

  const handleDeleteTask = (id) => {
    if (!window.confirm("Видалити задачу?")) return;
    setData(deleteTask(data, pid, id));
  };

  const handleToggleSub = (sid) => {
    setData(toggleSubtask(data, pid, sid));
  };

  const handleInvite = (email, role) => {
    const newData = inviteMember(data, pid, email, role); // може кинути помилку
    setData(newData);
  };

  const handleRemoveMember = (uid) => {
    setData(removeMember(data, pid, uid));
  };

  const handleSendMessage = (taskId, text) => {
    setData(sendMessage(data, taskId, text, nowTime()));
  };

  // ── Render (View) ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <GlobalStyle />

      {/* Sidebar */}
      <Sidebar
        data={data}
        activeProject={pid}
        setActiveProject={setPid}
        onAddProject={handleAddProject}
      />

      {/* Основний контент */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar
          project={project}
          members={members}
          onInvite={() => setModal("invite")}
          onMembers={() => setModal("members")}
        />
        <StatsBar tasks={tasks} />

        {/* Фільтри та перемикач виду */}
        <div style={{
          display: "flex", alignItems: "center", gap: 9, padding: "8px 14px",
          borderBottom: "1px solid var(--border)", background: "var(--surface)",
          flexShrink: 0, flexWrap: "wrap",
        }}>
          <button onClick={() => { setEditTask(null); setModal("task"); }} style={{
            padding: "6px 15px", borderRadius: 8, border: "none",
            background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>＋ Додати</button>

          <input
            value={filter.search || ""}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            placeholder="🔍 Пошук..."
            style={{ padding: "6px 11px", borderRadius: 8, background: "var(--surface2)",
              border: "1px solid var(--border)", color: "var(--text)", fontSize: 12, width: 170 }}
          />

          <select value={filter.status || ""} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
            style={{ padding: "6px 9px", borderRadius: 8, background: "var(--surface2)",
              border: "1px solid var(--border)", color: "var(--text)", fontSize: 12 }}>
            <option value="">Всі статуси</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select value={filter.member || ""}
            onChange={(e) => setFilter((f) => ({ ...f, member: e.target.value ? +e.target.value : "" }))}
            style={{ padding: "6px 9px", borderRadius: 8, background: "var(--surface2)",
              border: "1px solid var(--border)", color: "var(--text)", fontSize: 12 }}>
            <option value="">Всі виконавці</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          {(filter.search || filter.status || filter.member) && (
            <button onClick={() => setFilter({})} style={{ padding: "6px 11px", borderRadius: 8,
              border: "1px solid var(--border2)", background: "transparent",
              color: "var(--text3)", fontSize: 11, cursor: "pointer" }}>✕ Очистити</button>
          )}

          {/* Перемикач виду */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {[["list", "☰ Список"], ["kanban", "◫ Канбан"]].map(([v, l]) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "5px 13px", borderRadius: 8, border: "none",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: view === v ? "var(--surface3)" : "transparent",
                color: view === v ? "var(--accent)" : "var(--text3)",
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Основний вид */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {view === "list" && (
            <ListView
              tasks={tasks} members={members} filter={filter}
              onAdd={() => { setEditTask(null); setModal("task"); }}
              onEdit={(t) => { setEditTask(t); setModal("task"); }}
              onDelete={handleDeleteTask}
              onToggleSub={handleToggleSub}
              onMessage={(t, m) => { setMsgTask(t); setMsgMember(m); setModal("messages"); }}
            />
          )}
          {view === "kanban" && (
            <KanbanView
              tasks={tasks} members={members}
              onEdit={(t) => { setEditTask(t); setModal("task"); }}
              onAdd={() => { setEditTask(null); setModal("task"); }}
            />
          )}
        </div>
      </div>

      {/* Модалки */}
      {modal === "task" && (
        <TaskModal task={editTask} members={members}
          onClose={() => { setModal(null); setEditTask(null); }}
          onSave={handleSaveTask} />
      )}
      {modal === "invite" && (
        <InviteModal members={members}
          onClose={() => setModal(null)}
          onInvite={handleInvite} />
      )}
      {modal === "members" && (
        <MembersModal members={members} tasks={tasks} isOwner={isOwner} meId={data.me.id}
          onClose={() => setModal(null)}
          onRemove={handleRemoveMember} />
      )}
      {modal === "messages" && msgTask && (
        <MessagesModal task={msgTask} member={msgMember} messages={data.messages}
          onClose={() => setModal(null)}
          onSend={handleSendMessage} />
      )}
    </div>
  );
}
