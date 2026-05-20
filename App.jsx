import { useState, useEffect, useRef } from "react";

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

// Константи
const STATUSES   = ["Зробити","В роботі","Перевіряється","Зроблено"];
const PRIORITIES = ["Низький","Нормальний","Високий","Критичний"];
const TAGS       = ["Маркетинг","Дизайн","Розробка","Тестування","Загальне"];
const ROLES      = ["Менеджер","Розробник","Дизайнер","Тестувальник","Аналітик"];

const SC = s => ({"Зробити":"#64748b","В роботі":"#4f8ef7","Перевіряється":"#f59e0b","Зроблено":"#22c55e"}[s]||"#64748b");
const PC = p => ["#64748b","#22c55e","#f59e0b","#ef4444"][p]||"#64748b";
const TC = t => ({"Маркетинг":"#4f8ef7","Дизайн":"#a855f7","Розробка":"#22c55e","Тестування":"#f59e0b","Загальне":"#64748b"}[t]||"#64748b");
const fmtDate = d => d ? new Date(d).toLocaleDateString("uk-UA",{day:"2-digit",month:"short"}) : "—";
const nowTime = () => new Date().toLocaleTimeString("uk-UA",{hour:"2-digit",minute:"2-digit"});
const COLORS = ["#4f8ef7","#a855f7","#22c55e","#f59e0b","#f97316","#ef4444","#06b6d4"];

// Початкові дані
const DEFAULT_DATA = {
  me: { id:1, name:"Валерія", email:"valeria@team.ua", avatar:"ВА", color:"#4f8ef7" },
  projects: [
    { id:1, name:"Створення брендбуку",   icon:"🎨", ownerId:1 },
    { id:2, name:"Запуск YouTube-каналу", icon:"▶",  ownerId:1 },
    { id:3, name:"Оновлення промосайту",  icon:"🌐", ownerId:2 },
  ],
  members: {
    1: [
      { id:1, name:"Валерія",  email:"valeria@team.ua", role:"Менеджер", avatar:"ВА", color:"#4f8ef7" },
      { id:2, name:"Олег Д.",  email:"oleg@team.ua",    role:"Дизайнер", avatar:"ОД", color:"#a855f7" },
      { id:3, name:"Дарія Т.", email:"daria@team.ua",   role:"Аналітик", avatar:"ДТ", color:"#22c55e" },
    ],
    2: [
      { id:1, name:"Валерія", email:"valeria@team.ua", role:"Менеджер",  avatar:"ВА", color:"#4f8ef7" },
      { id:4, name:"Роман Г.", email:"roman@team.ua",  role:"Розробник", avatar:"РГ", color:"#f59e0b" },
    ],
    3: [
      { id:2, name:"Олег Д.",     email:"oleg@team.ua",   role:"Менеджер",  avatar:"ОД", color:"#a855f7" },
      { id:5, name:"Христина М.", email:"khryst@team.ua", role:"Розробник", avatar:"ХМ", color:"#ef4444" },
    ],
  },
  tasks: {
    1: [
      { id:101, title:"Розробити складові айдентики",  status:"В роботі",  priority:3, assigneeId:2, deadline:"2025-11-18", tag:"Дизайн",    subtasks:[
        { id:1011, title:"Сформувати типографіку", done:true,  assigneeId:2, deadline:"2025-11-10" },
        { id:1012, title:"Оновити логотип",         done:false, assigneeId:3, deadline:"2025-11-27" },
      ]},
      { id:102, title:"Затвердити кольорову палітру", status:"Зробити",   priority:2, assigneeId:3, deadline:"2025-11-20", tag:"Дизайн",    subtasks:[] },
      { id:103, title:"Провести аналіз конкурентів",  status:"Зроблено",  priority:2, assigneeId:2, deadline:"2025-10-05", tag:"Маркетинг", subtasks:[] },
    ],
    2: [
      { id:201, title:"Написати сценарій першого відео", status:"В роботі",     priority:3, assigneeId:4, deadline:"2025-12-01", tag:"Маркетинг", subtasks:[] },
      { id:202, title:"Зняти та змонтувати пілот",        status:"Зробити",      priority:2, assigneeId:1, deadline:"2025-12-15", tag:"Розробка",  subtasks:[] },
      { id:203, title:"Оформити банер і аватар каналу",   status:"Перевіряється",priority:1, assigneeId:4, deadline:"2025-11-28", tag:"Дизайн",   subtasks:[] },
    ],
    3: [
      { id:301, title:"Редизайн головної сторінки",  status:"В роботі", priority:3, assigneeId:2, deadline:"2025-12-10", tag:"Дизайн",    subtasks:[] },
      { id:302, title:"Оптимізація швидкості сайту", status:"Зробити",  priority:2, assigneeId:5, deadline:"2025-12-20", tag:"Розробка",  subtasks:[] },
      { id:303, title:"Написати контент для блогу",   status:"Зроблено", priority:1, assigneeId:5, deadline:"2025-11-15", tag:"Маркетинг", subtasks:[] },
    ],
  },
  messages: {},
  nextId: 500,
};

//  localStorage 
// ВИПРАВЛЕННЯ #5: зберігати і завантажувати всі дані з localStorage
function load() {
  try {
    const s = localStorage.getItem("tf_v3");
    if (s) return JSON.parse(s);
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function save(data) {
  try { localStorage.setItem("tf_v3", JSON.stringify(data)); } catch {}
}

//Маленькі компоненти
const Av = ({ m, size=28 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:m?.color||"#4f8ef7",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*.34, fontWeight:700, color:"#fff", flexShrink:0,
    border:"2px solid var(--surface)" }}>
    {m?.avatar||"?"}
  </div>
);
const Pill = ({ label, color }) => (
  <span style={{ background:color+"18", color, borderRadius:99, padding:"2px 9px",
    fontSize:11, fontWeight:700, border:`1px solid ${color}33`, whiteSpace:"nowrap" }}>
    {label}
  </span>
);
const Bdg = ({ label, color }) => (
  <span style={{ background:color+"22", color, borderRadius:6, padding:"2px 8px",
    fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
    {label}
  </span>
);

// Sidebar
function Sidebar({ data, activeProject, setActiveProject, onAddProject }) {
  return (
    <aside style={{ width:210, minWidth:210, background:"var(--surface)",
      borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid var(--border)",
        display:"flex", alignItems:"center", gap:9 }}>
        <div style={{ width:30, height:30, borderRadius:8,
          background:"linear-gradient(135deg,#4f8ef7,#a855f7)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>✦</div>
        <span style={{ fontWeight:800, fontSize:14 }}>TaskFlow</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"8px 6px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"var(--text3)",
          textTransform:"uppercase", letterSpacing:1, padding:"8px 8px 4px" }}>Проекти</div>
        {data.projects.map(p => {
          const isOwner = p.ownerId === data.me.id;
          const active  = activeProject === p.id;
          return (
            <button key={p.id} onClick={() => setActiveProject(p.id)} style={{
              width:"100%", textAlign:"left", padding:"8px 10px", borderRadius:8,
              border:"none", background: active ? "var(--surface3)" : "transparent",
              color: active ? "var(--text)" : "var(--text2)",
              fontSize:12, fontWeight: active ? 600 : 400,
              display:"flex", alignItems:"center", gap:8, cursor:"pointer", transition:"all .15s",
            }}>
              <span style={{ fontSize:14 }}>{p.icon}</span>
              <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
              {isOwner && <span style={{ fontSize:9, color:"var(--accent)", opacity:.7 }}>👑</span>}
            </button>
          );
        })}
        <button onClick={onAddProject} style={{
          width:"100%", textAlign:"left", padding:"8px 10px", borderRadius:8,
          border:"1px dashed var(--border2)", background:"transparent",
          color:"var(--text3)", fontSize:12, marginTop:4, cursor:"pointer",
          display:"flex", alignItems:"center", gap:8,
        }}>＋ Новий проект</button>
      </div>
      <div style={{ padding:"12px 14px", borderTop:"1px solid var(--border)",
        display:"flex", alignItems:"center", gap:9 }}>
        <Av m={data.me} size={30} />
        <div style={{ overflow:"hidden" }}>
          <div style={{ fontSize:12, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{data.me.name}</div>
          <div style={{ fontSize:10, color:"var(--text3)" }}>Власник</div>
        </div>
      </div>
    </aside>
  );
}

// TopBar 
function TopBar({ project, members, onInvite, onMembers }) {
  return (
    <div style={{ height:52, display:"flex", alignItems:"center", padding:"0 18px",
      borderBottom:"1px solid var(--border)", background:"var(--surface)",
      gap:14, flexShrink:0 }}>
      <span style={{ fontSize:18 }}>{project?.icon}</span>
      <span style={{ fontWeight:700, fontSize:15, flex:1 }}>{project?.name}</span>
      <div style={{ display:"flex" }}>
        {members.slice(0,4).map((m,i) => (
          <div key={m.id} title={m.name} style={{ marginLeft:i>0?-7:0, zIndex:10-i }}>
            <Av m={m} size={28} />
          </div>
        ))}
        {members.length>4 && (
          <div style={{ width:28,height:28,borderRadius:"50%",background:"var(--surface3)",
            border:"2px solid var(--surface)",display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--text2)",marginLeft:-7 }}>
            +{members.length-4}
          </div>
        )}
      </div>
      <button onClick={onMembers} style={{ padding:"5px 13px",borderRadius:8,
        border:"1px solid var(--border2)",background:"transparent",
        color:"var(--text2)",fontSize:12,cursor:"pointer" }}>👥 Команда</button>
      <button onClick={onInvite} style={{ padding:"5px 13px",borderRadius:8,
        border:"none",background:"var(--accent)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer" }}>
        ＋ Запросити
      </button>
    </div>
  );
}

// StatsBar
function StatsBar({ tasks }) {
  const total   = tasks.length;
  const done    = tasks.filter(t=>t.status==="Зроблено").length;
  const inpro   = tasks.filter(t=>t.status==="В роботі").length;
  const overdue = tasks.filter(t=>t.deadline&&new Date(t.deadline)<new Date()&&t.status!=="Зроблено").length;
  const pct     = total ? Math.round(done/total*100) : 0;
  return (
    <div style={{ display:"flex",alignItems:"center",gap:18,padding:"7px 18px",
      borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0 }}>
      {[["Всього",total,"var(--text2)"],["В роботі",inpro,"var(--accent)"],
        ["Готово",done,"var(--green)"],["Прострочено",overdue,"var(--red)"]].map(([l,v,c])=>(
        <div key={l} style={{ display:"flex",alignItems:"center",gap:5 }}>
          <span style={{ fontSize:17,fontWeight:800,color:c }}>{v}</span>
          <span style={{ fontSize:11,color:"var(--text3)" }}>{l}</span>
        </div>
      ))}
      <div style={{ flex:1,display:"flex",alignItems:"center",gap:8,marginLeft:4 }}>
        <div style={{ flex:1,height:4,background:"var(--surface3)",borderRadius:99,overflow:"hidden" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:"var(--green)",borderRadius:99,transition:"width .5s" }} />
        </div>
        <span style={{ fontSize:12,fontWeight:700,color:"var(--green)",minWidth:32 }}>{pct}%</span>
      </div>
    </div>
  );
}

// Рядок задачі
function TaskRow({ task, members, depth=0, onEdit, onDelete, onToggleSub, onMessage }) {
  const [open, setOpen] = useState(true);
  const m    = members.find(x=>x.id===task.assigneeId);
  const done = task.status==="Зроблено"||task.done;
  const late = task.deadline && new Date(task.deadline)<new Date() && !done;
  return (
    <>
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 120px 130px 90px 80px 76px",
        alignItems:"center", height:38, paddingLeft:14+depth*22, paddingRight:12,
        borderBottom:"1px solid var(--border)",
        background:depth>0?"var(--surface2)":"var(--surface)",
        cursor:"pointer", transition:"background .1s",
      }}
        onMouseEnter={e=>e.currentTarget.style.background=depth>0?"var(--surface3)":"var(--surface2)"}
        onMouseLeave={e=>e.currentTarget.style.background=depth>0?"var(--surface2)":"var(--surface)"}
      >
        <div style={{ display:"flex",alignItems:"center",gap:7,overflow:"hidden" }}>
          {task.subtasks?.length>0 ? (
            <button onClick={()=>setOpen(!open)} style={{ width:15,height:15,borderRadius:4,
              border:"1px solid var(--border2)",background:"transparent",
              color:"var(--text3)",fontSize:8,flexShrink:0,cursor:"pointer" }}>
              {open?"▾":"▸"}
            </button>
          ) : <div style={{ width:15,flexShrink:0 }} />}
          {depth>0 && (
            <input type="checkbox" checked={!!task.done} onChange={()=>onToggleSub(task.id)}
              style={{ width:13,height:13,accentColor:"var(--accent)",flexShrink:0,cursor:"pointer" }} />
          )}
          {depth===0 && <div style={{ width:3,height:14,borderRadius:99,background:PC(task.priority),flexShrink:0 }} />}
          <span onClick={()=>depth===0&&onEdit(task)} style={{
            fontSize:12, fontWeight:depth===0?600:400, overflow:"hidden",
            textOverflow:"ellipsis", whiteSpace:"nowrap",
            textDecoration:done?"line-through":"none",
            color:done?"var(--text3)":"var(--text)",
          }}>{task.title}</span>
        </div>
        <div>{depth===0&&<Pill label={task.status} color={SC(task.status)}/>}</div>
        <div style={{ display:"flex",alignItems:"center",gap:6,overflow:"hidden" }}>
          {m&&<Av m={m} size={22}/>}
          <span style={{ fontSize:11,color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m?.name||"—"}</span>
        </div>
        <div style={{ fontSize:11,color:late?"var(--red)":"var(--text2)" }}>{fmtDate(task.deadline)}</div>
        <div>{task.tag&&<Bdg label={task.tag} color={TC(task.tag)}/>}</div>
        <div style={{ display:"flex",gap:3,justifyContent:"flex-end" }}>
          {depth===0&&m&&(
            <button onClick={()=>onMessage(task,m)} title="Написати повідомлення" style={{
              padding:"2px 5px",borderRadius:5,border:"1px solid var(--border2)",
              background:"transparent",color:"var(--accent)",fontSize:11,cursor:"pointer" }}>💬</button>
          )}
          {depth===0&&(
            <>
              <button onClick={()=>onEdit(task)} style={{ padding:"2px 5px",borderRadius:5,
                border:"1px solid var(--border2)",background:"transparent",
                color:"var(--text3)",fontSize:11,cursor:"pointer" }}>✎</button>
              <button onClick={()=>onDelete(task.id)} style={{ padding:"2px 5px",borderRadius:5,
                border:"1px solid var(--border2)",background:"transparent",
                color:"var(--text3)",fontSize:11,cursor:"pointer" }}>✕</button>
            </>
          )}
        </div>
      </div>
      {open&&task.subtasks?.map(s=>(
        <TaskRow key={s.id} task={s} members={members} depth={depth+1}
          onEdit={onEdit} onDelete={onDelete} onToggleSub={onToggleSub} onMessage={onMessage}/>
      ))}
    </>
  );
}

// ListView 
function ListView({ tasks, members, filter, onAdd, onEdit, onDelete, onToggleSub, onMessage }) {
  const filtered = tasks.filter(t=>{
    if (filter.status && t.status!==filter.status) return false;
    if (filter.member && t.assigneeId!==filter.member) return false;
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
  return (
    <div style={{ flex:1,overflowY:"auto" }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 120px 130px 90px 80px 76px",
        padding:"0 12px",height:32,borderBottom:"1px solid var(--border)",
        alignItems:"center",position:"sticky",top:0,background:"var(--surface)",zIndex:5 }}>
        {["Назва","Статус","Виконавець","Термін","Мітка",""].map((h,i)=>(
          <span key={i} style={{ fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5 }}>{h}</span>
        ))}
      </div>
      {filtered.length===0&&(
        <div style={{ textAlign:"center",padding:"50px 0",color:"var(--text3)" }}>
          <div style={{ fontSize:28,marginBottom:8 }}>📋</div>
          <div style={{ fontSize:13 }}>Задач не знайдено</div>
        </div>
      )}
      {filtered.map(t=>(
        <TaskRow key={t.id} task={t} members={members}
          onEdit={onEdit} onDelete={onDelete} onToggleSub={onToggleSub} onMessage={onMessage}/>
      ))}
      <button onClick={onAdd} style={{ width:"100%",textAlign:"left",padding:"9px 18px",
        border:"none",background:"transparent",color:"var(--text3)",fontSize:12,
        borderBottom:"1px solid var(--border)",cursor:"pointer",display:"flex",gap:8 }}
        onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"}
        onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>
        ＋ Додати задачу
      </button>
    </div>
  );
}

// KanbanView 
function KanbanView({ tasks, members, onEdit, onAdd }) {
  return (
    <div style={{ display:"flex",gap:10,padding:14,overflowX:"auto",flex:1,alignItems:"flex-start" }}>
      {STATUSES.map(st=>{
        const cols=tasks.filter(t=>t.status===st);
        return (
          <div key={st} style={{ width:240,minWidth:240,background:"var(--surface2)",
            borderRadius:12,border:"1px solid var(--border)",overflow:"hidden" }}>
            <div style={{ padding:"9px 12px",borderBottom:"1px solid var(--border)",
              display:"flex",alignItems:"center",gap:7 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:SC(st) }}/>
              <span style={{ fontSize:12,fontWeight:700 }}>{st}</span>
              <span style={{ marginLeft:"auto",fontSize:10,color:"var(--text3)",
                background:"var(--surface3)",borderRadius:99,padding:"1px 6px" }}>{cols.length}</span>
            </div>
            <div style={{ padding:8,display:"flex",flexDirection:"column",gap:6 }}>
              {cols.map(t=>{
                const m=members.find(x=>x.id===t.assigneeId);
                return (
                  <div key={t.id} onClick={()=>onEdit(t)} style={{
                    background:"var(--surface)",borderRadius:8,padding:"10px 12px",
                    border:"1px solid var(--border)",cursor:"pointer",transition:"border-color .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                    <div style={{ fontSize:12,fontWeight:600,marginBottom:8,lineHeight:1.35 }}>{t.title}</div>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      {m&&<Av m={m} size={20}/>}
                      <span style={{ fontSize:10,color:"var(--text3)",flex:1 }}>{fmtDate(t.deadline)}</span>
                      {t.tag&&<Bdg label={t.tag} color={TC(t.tag)}/>}
                    </div>
                  </div>
                );
              })}
              <button onClick={onAdd} style={{ padding:"7px",borderRadius:8,
                border:"1px dashed var(--border2)",background:"transparent",
                color:"var(--text3)",fontSize:11,cursor:"pointer",width:"100%" }}>＋ Додати</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Модалка задачі
function TaskModal({ task, members, onClose, onSave }) {
  const [form, setForm] = useState(task||{
    title:"", status:"Зробити", priority:1,
    assigneeId:members[0]?.id||1, deadline:"", tag:"Загальне", subtasks:[]
  });
  const [newSub, setNewSub] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const addSub = () => {
    if (!newSub.trim()) return;
    set("subtasks",[...form.subtasks,{id:Date.now(),title:newSub.trim(),done:false,assigneeId:form.assigneeId,deadline:""}]);
    setNewSub("");
  };
  return (
    <div className="fade" style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",borderRadius:14,
        width:510,maxHeight:"88vh",overflow:"hidden",border:"1px solid var(--border)",
        boxShadow:"var(--shadow)",display:"flex",flexDirection:"column" }}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--border)",
          display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontWeight:800,fontSize:15 }}>{task?"Редагувати":"Нова"} задача</span>
          <button onClick={onClose} style={{ border:"none",background:"transparent",color:"var(--text3)",fontSize:17,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:13 }}>
          <div>
            <label style={{ fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5 }}>Назва *</label>
            <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Що потрібно зробити?"
              style={{ width:"100%",padding:"9px 11px",borderRadius:8,background:"var(--surface2)",
                border:"1px solid var(--border)",color:"var(--text)",fontSize:13 }}/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11 }}>
            {[
              ["Статус","status","select",STATUSES.map(s=>({v:s,l:s}))],
              ["Пріоритет","priority","select",PRIORITIES.map((p,i)=>({v:i,l:p}))],
              ["Виконавець","assigneeId","select",members.map(m=>({v:m.id,l:m.name}))],
              ["Дедлайн","deadline","date",[]],
              ["Мітка","tag","select",TAGS.map(t=>({v:t,l:t}))],
            ].map(([label,key,type,opts])=>(
              <div key={key}>
                <label style={{ fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5 }}>{label}</label>
                {type==="date"?(
                  <input type="date" value={form[key]} onChange={e=>set(key,e.target.value)}
                    style={{ width:"100%",padding:"9px 11px",borderRadius:8,background:"var(--surface2)",
                      border:"1px solid var(--border)",color:"var(--text)",fontSize:13 }}/>
                ):(
                  <select value={form[key]} onChange={e=>set(key,key==="priority"||key==="assigneeId"?+e.target.value:e.target.value)}
                    style={{ width:"100%",padding:"9px 11px",borderRadius:8,background:"var(--surface2)",
                      border:"1px solid var(--border)",color:"var(--text)",fontSize:13 }}>
                    {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:7 }}>Підзадачі</label>
            {form.subtasks.map((s,i)=>(
              <div key={s.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
                <input type="checkbox" checked={s.done}
                  onChange={()=>set("subtasks",form.subtasks.map((x,j)=>j===i?{...x,done:!x.done}:x))}
                  style={{ accentColor:"var(--accent)",cursor:"pointer" }}/>
                <span style={{ fontSize:12,flex:1,textDecoration:s.done?"line-through":"none",
                  color:s.done?"var(--text3)":"var(--text)" }}>{s.title}</span>
                <button onClick={()=>set("subtasks",form.subtasks.filter((_,j)=>j!==i))}
                  style={{ border:"none",background:"transparent",color:"var(--text3)",cursor:"pointer" }}>✕</button>
              </div>
            ))}
            <div style={{ display:"flex",gap:7,marginTop:4 }}>
              <input value={newSub} onChange={e=>setNewSub(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addSub()} placeholder="Нова підзадача..."
                style={{ flex:1,padding:"7px 11px",borderRadius:8,background:"var(--surface2)",
                  border:"1px solid var(--border)",color:"var(--text)",fontSize:12 }}/>
              <button onClick={addSub} style={{ padding:"7px 11px",borderRadius:8,
                border:"1px solid var(--border)",background:"transparent",color:"var(--text2)",fontSize:12,cursor:"pointer" }}>＋</button>
            </div>
          </div>
        </div>
        <div style={{ padding:"13px 20px",borderTop:"1px solid var(--border)",
          display:"flex",gap:9,justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 17px",borderRadius:8,
            border:"1px solid var(--border)",background:"transparent",color:"var(--text2)",fontSize:13,cursor:"pointer" }}>Скасувати</button>
          <button onClick={()=>{if(form.title.trim()) onSave(form);}}
            style={{ padding:"8px 18px",borderRadius:8,border:"none",
              background:"var(--accent)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}>
            {task?"Зберегти":"Створити"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Модалка запрошення (ВИПРАВЛЕННЯ #6) 
function InviteModal({ members, onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("Розробник");
  const [sent,  setSent]  = useState("");
  const [err,   setErr]   = useState("");

  const handle = () => {
    if (!email.includes("@")) { setErr("Введіть коректний email"); return; }
    if (members.some(m=>m.email===email)) { setErr("Цей користувач вже в команді"); return; }
    onInvite(email, role);
    setSent(email);
    setEmail("");
    setErr("");
  };

  return (
    <div className="fade" style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",borderRadius:14,
        width:400,border:"1px solid var(--border)",boxShadow:"var(--shadow)",overflow:"hidden" }}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--border)",
          display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontWeight:800,fontSize:15 }}>✉ Запросити до команди</span>
          <button onClick={onClose} style={{ border:"none",background:"transparent",color:"var(--text3)",fontSize:17,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:20,display:"flex",flexDirection:"column",gap:13 }}>
          {sent&&(
            <div style={{ background:"#22c55e18",border:"1px solid #22c55e44",borderRadius:8,
              padding:"10px 13px",fontSize:12,color:"var(--green)" }}>
              ✓ Запрошення надіслано на <b>{sent}</b> — учасника додано до команди!
            </div>
          )}
          <div>
            <label style={{ fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5 }}>Email адреса</label>
            <input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
              placeholder="name@example.com" type="email"
              onKeyDown={e=>e.key==="Enter"&&handle()}
              style={{ width:"100%",padding:"9px 11px",borderRadius:8,
                background:"var(--surface2)",border:`1px solid ${err?"var(--red)":"var(--border)"}`,
                color:"var(--text)",fontSize:13 }}/>
            {err&&<div style={{ fontSize:11,color:"var(--red)",marginTop:4 }}>{err}</div>}
          </div>
          <div>
            <label style={{ fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5 }}>Роль в команді</label>
            <select value={role} onChange={e=>setRole(e.target.value)}
              style={{ width:"100%",padding:"9px 11px",borderRadius:8,
                background:"var(--surface2)",border:"1px solid var(--border)",
                color:"var(--text)",fontSize:13 }}>
              {ROLES.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <button onClick={handle} style={{ padding:"10px",borderRadius:8,border:"none",
            background:"var(--accent)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}>
            Надіслати запрошення
          </button>
          <div style={{ fontSize:11,color:"var(--text3)",textAlign:"center",lineHeight:1.5 }}>
            Щоб відправляти реальні листи — підключи Nodemailer.<br/>
            Інструкція є у файлі <code style={{ color:"var(--accent)" }}>email_invite.js</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// Модалка команди (ВИПРАВЛЕННЯ #2)
function MembersModal({ members, tasks, isOwner, meId, onClose, onRemove }) {
  return (
    <div className="fade" style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",borderRadius:14,
        width:500,maxHeight:"78vh",overflow:"hidden",border:"1px solid var(--border)",
        boxShadow:"var(--shadow)",display:"flex",flexDirection:"column" }}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--border)",
          display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontWeight:800,fontSize:15 }}>👥 Команда проекту</span>
          <button onClick={onClose} style={{ border:"none",background:"transparent",color:"var(--text3)",fontSize:17,cursor:"pointer" }}>✕</button>
        </div>
        {isOwner&&(
          <div style={{ padding:"7px 20px",background:"var(--surface2)",fontSize:11,color:"var(--text3)",
            borderBottom:"1px solid var(--border)" }}>
            👑 Ви власник — можете видаляти учасників
          </div>
        )}
        <div style={{ overflowY:"auto",padding:"8px 20px 20px" }}>
          {members.map(m=>{
            const mt=tasks.filter(t=>t.assigneeId===m.id);
            const dn=mt.filter(t=>t.status==="Зроблено").length;
            const pct=mt.length?Math.round(dn/mt.length*100):0;
            const isMe=m.id===meId;
            return (
              <div key={m.id} style={{ display:"flex",alignItems:"center",gap:12,
                padding:"13px 0",borderBottom:"1px solid var(--border)" }}>
                <Av m={m} size={42}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
                    <span style={{ fontWeight:700,fontSize:13 }}>{m.name}</span>
                    <Bdg label={m.role} color="#64748b"/>
                    {isMe&&<span style={{ fontSize:10,color:"var(--accent)" }}>(ви)</span>}
                  </div>
                  <div style={{ fontSize:11,color:"var(--text3)",marginBottom:7 }}>{m.email}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ flex:1,height:3,background:"var(--surface3)",borderRadius:99,overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`,height:"100%",background:"var(--accent)",borderRadius:99 }}/>
                    </div>
                    <span style={{ fontSize:10,color:"var(--text3)",minWidth:65 }}>{dn}/{mt.length} ({pct}%)</span>
                  </div>
                </div>
                {isOwner&&!isMe&&(
                  <button onClick={()=>{ if(window.confirm(`Видалити ${m.name} з команди?`)) onRemove(m.id); }}
                    style={{ padding:"5px 11px",borderRadius:7,border:"1px solid var(--red)",
                      background:"transparent",color:"var(--red)",fontSize:11,cursor:"pointer",flexShrink:0 }}>
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

// Модалка повідомлень (ВИПРАВЛЕННЯ #4) 
function MessagesModal({ task, member, messages, onClose, onSend }) {
  const [text, setText] = useState("");
  const msgs = messages[task.id] || [];
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs.length]);

  const send = () => {
    if (!text.trim()) return;
    onSend(task.id, text.trim());
    setText("");
  };

  return (
    <div className="fade" style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",borderRadius:14,
        width:440,border:"1px solid var(--border)",boxShadow:"var(--shadow)",
        display:"flex",flexDirection:"column",maxHeight:"70vh" }}>
        <div style={{ padding:"14px 18px",borderBottom:"1px solid var(--border)",
          display:"flex",alignItems:"center",gap:10 }}>
          <Av m={member} size={32}/>
          <div>
            <div style={{ fontWeight:700,fontSize:13 }}>{member?.name}</div>
            <div style={{ fontSize:10,color:"var(--text3)" }}>Задача: {task.title}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto",border:"none",
            background:"transparent",color:"var(--text3)",fontSize:17,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"14px 18px",
          display:"flex",flexDirection:"column",gap:9,minHeight:150 }}>
          {msgs.length===0&&(
            <div style={{ textAlign:"center",color:"var(--text3)",fontSize:12,paddingTop:20 }}>
              Напиши перше повідомлення 👋
            </div>
          )}
          {msgs.map((msg,i)=>(
            <div key={i} style={{
              alignSelf:msg.fromMe?"flex-end":"flex-start",
              background:msg.fromMe?"var(--accent)":"var(--surface3)",
              color:"#fff",
              borderRadius:msg.fromMe?"12px 12px 2px 12px":"12px 12px 12px 2px",
              padding:"8px 13px",fontSize:12,maxWidth:"80%" }}>
              <div>{msg.text}</div>
              <div style={{ fontSize:10,opacity:.65,marginTop:3 }}>{msg.time}</div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:"11px 18px",borderTop:"1px solid var(--border)",display:"flex",gap:8 }}>
          <input value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Написати повідомлення..."
            style={{ flex:1,padding:"8px 11px",borderRadius:8,background:"var(--surface2)",
              border:"1px solid var(--border)",color:"var(--text)",fontSize:12 }}/>
          <button onClick={send} style={{ padding:"8px 14px",borderRadius:8,border:"none",
            background:"var(--accent)",color:"#fff",fontSize:13,cursor:"pointer" }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// Головний App 
export default function App() {
  const [data, setData] = useState(()=>load());
  const [pid,  setPid]  = useState(data.projects[0]?.id||1);
  const [view, setView] = useState("list");
  const [modal,setModal]= useState(null);
  const [editTask,  setEditTask]  = useState(null);
  const [msgTask,   setMsgTask]   = useState(null);
  const [msgMember, setMsgMember] = useState(null);
  const [filter,    setFilter]    = useState({});

  // ВИПРАВЛЕННЯ #5: автозбереження при кожній зміні
  useEffect(()=>{ save(data); }, [data]);
  // ВИПРАВЛЕННЯ #1: скидати фільтр при зміні проекту
  useEffect(()=>{ setFilter({}); }, [pid]);

  const upd = fn => setData(d=>{ const nd=JSON.parse(JSON.stringify(d)); fn(nd); return nd; });

  const project = data.projects.find(p=>p.id===pid);
  const members = data.members[pid] || [];
  const tasks   = data.tasks[pid]   || [];
  const isOwner = project?.ownerId === data.me.id;

  const addProject = () => {
    const name = prompt("Назва нового проекту:");
    if (!name?.trim()) return;
    const id = Date.now();
    upd(d=>{
      d.projects.push({ id, name:name.trim(), icon:"📁", ownerId:d.me.id });
      d.members[id] = [{ ...d.me, role:"Менеджер" }];
      d.tasks[id]   = [];
    });
    setPid(id);
  };

  const saveTask = form => {
    upd(d=>{
      if (editTask) {
        d.tasks[pid]=d.tasks[pid].map(t=>t.id===editTask.id?{...t,...form}:t);
      } else {
        d.tasks[pid].push({...form, id:++d.nextId});
      }
    });
    setModal(null); setEditTask(null);
  };

  const deleteTask = id => {
    if (!window.confirm("Видалити задачу?")) return;
    upd(d=>{ d.tasks[pid]=d.tasks[pid].filter(t=>t.id!==id); });
  };

  const toggleSub = sid => {
    upd(d=>{ d.tasks[pid].forEach(t=>{
      if(t.subtasks) t.subtasks=t.subtasks.map(s=>s.id===sid?{...s,done:!s.done}:s);
    }); });
  };

  const inviteMember = (email, role) => {
    const parts = email.split("@")[0].split(".");
    const name  = parts.map(w=>w[0].toUpperCase()+w.slice(1)).join(" ");
    const avatar= parts.map(w=>w[0].toUpperCase()).join("").slice(0,2);
    const color = COLORS[members.length % COLORS.length];
    upd(d=>{
      if (!d.members[pid]) d.members[pid]=[];
      d.members[pid].push({ id:++d.nextId, name, email, role, avatar, color });
    });
  };

  const removeMember = uid => {
    upd(d=>{ d.members[pid]=d.members[pid].filter(m=>m.id!==uid); });
  };

  const sendMessage = (taskId, text) => {
    upd(d=>{
      if (!d.messages[taskId]) d.messages[taskId]=[];
      d.messages[taskId].push({ fromMe:true, text, time:nowTime() });
    });
  };

  return (
    <div style={{ display:"flex",height:"100vh",overflow:"hidden" }}>
      <GlobalStyle/>
      <Sidebar data={data} activeProject={pid} setActiveProject={setPid} onAddProject={addProject}/>
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <TopBar project={project} members={members}
          onInvite={()=>setModal("invite")} onMembers={()=>setModal("members")}/>
        <StatsBar tasks={tasks}/>

        {/* Фільтри */}
        <div style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 14px",
          borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0,flexWrap:"wrap" }}>
          <button onClick={()=>{setEditTask(null);setModal("task");}} style={{
            padding:"6px 15px",borderRadius:8,border:"none",background:"var(--accent)",
            color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer" }}>＋ Додати</button>
          <input value={filter.search||""} onChange={e=>setFilter(f=>({...f,search:e.target.value}))}
            placeholder="🔍 Пошук..." style={{ padding:"6px 11px",borderRadius:8,
              background:"var(--surface2)",border:"1px solid var(--border)",
              color:"var(--text)",fontSize:12,width:170 }}/>
          <select value={filter.status||""} onChange={e=>setFilter(f=>({...f,status:e.target.value}))}
            style={{ padding:"6px 9px",borderRadius:8,background:"var(--surface2)",
              border:"1px solid var(--border)",color:"var(--text)",fontSize:12 }}>
            <option value="">Всі статуси</option>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={filter.member||""} onChange={e=>setFilter(f=>({...f,member:e.target.value?+e.target.value:""}))}
            style={{ padding:"6px 9px",borderRadius:8,background:"var(--surface2)",
              border:"1px solid var(--border)",color:"var(--text)",fontSize:12 }}>
            <option value="">Всі виконавці</option>
            {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          {(filter.search||filter.status||filter.member)&&(
            <button onClick={()=>setFilter({})} style={{ padding:"6px 11px",borderRadius:8,
              border:"1px solid var(--border2)",background:"transparent",
              color:"var(--text3)",fontSize:11,cursor:"pointer" }}>✕ Очистити</button>
          )}
          <div style={{ marginLeft:"auto",display:"flex",gap:4 }}>
            {[["list","☰ Список"],["kanban","◫ Канбан"]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{ padding:"5px 13px",
                borderRadius:8,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",
                background:view===v?"var(--surface3)":"transparent",
                color:view===v?"var(--accent)":"var(--text3)" }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ flex:1,overflow:"hidden",display:"flex" }}>
          {view==="list"&&(
            <ListView tasks={tasks} members={members} filter={filter}
              onAdd={()=>{setEditTask(null);setModal("task");}}
              onEdit={t=>{setEditTask(t);setModal("task");}}
              onDelete={deleteTask} onToggleSub={toggleSub}
              onMessage={(t,m)=>{setMsgTask(t);setMsgMember(m);setModal("messages");}}/>
          )}
          {view==="kanban"&&(
            <KanbanView tasks={tasks} members={members}
              onEdit={t=>{setEditTask(t);setModal("task");}}
              onAdd={()=>{setEditTask(null);setModal("task");}}/>
          )}
        </div>
      </div>

      {modal==="task"&&(
        <TaskModal task={editTask} members={members}
          onClose={()=>{setModal(null);setEditTask(null);}} onSave={saveTask}/>
      )}
      {modal==="invite"&&(
        <InviteModal members={members} onClose={()=>setModal(null)} onInvite={inviteMember}/>
      )}
      {modal==="members"&&(
        <MembersModal members={members} tasks={tasks} isOwner={isOwner} meId={data.me.id}
          onClose={()=>setModal(null)} onRemove={removeMember}/>
      )}
      {modal==="messages"&&msgTask&&(
        <MessagesModal task={msgTask} member={msgMember} messages={data.messages}
          onClose={()=>setModal(null)} onSend={sendMessage}/>
      )}
    </div>
  );
}
