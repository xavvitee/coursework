// ── Форматери ─────────────────────────────────────────────────────────────────

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("uk-UA", { day: "2-digit", month: "short" }) : "—";

export const nowTime = () =>
  new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

// Генерація ініціалів з email
export const emailToMember = (email, existingCount, colors) => {
  const parts  = email.split("@")[0].split(".");
  const name   = parts.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
  const avatar = parts.map((w) => w[0].toUpperCase()).join("").slice(0, 2);
  const color  = colors[existingCount % colors.length];
  return { name, avatar, color };
};

// Перевірка чи задача прострочена
export const isOverdue = (deadline, status) =>
  !!deadline && new Date(deadline) < new Date() && status !== "Зроблено";

// Статистика задач
export const calcStats = (tasks) => {
  const total   = tasks.length;
  const done    = tasks.filter((t) => t.status === "Зроблено").length;
  const inpro   = tasks.filter((t) => t.status === "В роботі").length;
  const overdue = tasks.filter((t) => isOverdue(t.deadline, t.status)).length;
  const pct     = total ? Math.round((done / total) * 100) : 0;
  return { total, done, inpro, overdue, pct };
};
