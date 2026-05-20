// ── Початкові дані ────────────────────────────────────────────────────────────
export const DEFAULT_DATA = {
  me: { id: 1, name: "Валерія", email: "valeria@team.ua", avatar: "ВА", color: "#4f8ef7" },
  projects: [
    { id: 1, name: "Створення брендбуку",   icon: "🎨", ownerId: 1 },
    { id: 2, name: "Запуск YouTube-каналу", icon: "▶",  ownerId: 1 },
    { id: 3, name: "Оновлення промосайту",  icon: "🌐", ownerId: 2 },
  ],
  members: {
    1: [
      { id: 1, name: "Валерія",  email: "valeria@team.ua", role: "Менеджер", avatar: "ВА", color: "#4f8ef7" },
      { id: 2, name: "Олег Д.",  email: "oleg@team.ua",    role: "Дизайнер", avatar: "ОД", color: "#a855f7" },
      { id: 3, name: "Дарія Т.", email: "daria@team.ua",   role: "Аналітик", avatar: "ДТ", color: "#22c55e" },
    ],
    2: [
      { id: 1, name: "Валерія",  email: "valeria@team.ua", role: "Менеджер",  avatar: "ВА", color: "#4f8ef7" },
      { id: 4, name: "Роман Г.", email: "roman@team.ua",   role: "Розробник", avatar: "РГ", color: "#f59e0b" },
    ],
    3: [
      { id: 2, name: "Олег Д.",      email: "oleg@team.ua",    role: "Менеджер",  avatar: "ОД", color: "#a855f7" },
      { id: 5, name: "Христина М.", email: "khryst@team.ua", role: "Розробник", avatar: "ХМ", color: "#ef4444" },
    ],
  },
  tasks: {
    1: [
      {
        id: 101, title: "Розробити складові айдентики", status: "В роботі", priority: 3,
        assigneeId: 2, deadline: "2025-11-18", tag: "Дизайн",
        subtasks: [
          { id: 1011, title: "Сформувати типографіку", done: true,  assigneeId: 2, deadline: "2025-11-10" },
          { id: 1012, title: "Оновити логотип",         done: false, assigneeId: 3, deadline: "2025-11-27" },
        ],
      },
      { id: 102, title: "Затвердити кольорову палітру", status: "Зробити",  priority: 2, assigneeId: 3, deadline: "2025-11-20", tag: "Дизайн",    subtasks: [] },
      { id: 103, title: "Провести аналіз конкурентів",  status: "Зроблено", priority: 2, assigneeId: 2, deadline: "2025-10-05", tag: "Маркетинг", subtasks: [] },
    ],
    2: [
      { id: 201, title: "Написати сценарій першого відео", status: "В роботі",      priority: 3, assigneeId: 4, deadline: "2025-12-01", tag: "Маркетинг", subtasks: [] },
      { id: 202, title: "Зняти та змонтувати пілот",        status: "Зробити",       priority: 2, assigneeId: 1, deadline: "2025-12-15", tag: "Розробка",  subtasks: [] },
      { id: 203, title: "Оформити банер і аватар каналу",   status: "Перевіряється", priority: 1, assigneeId: 4, deadline: "2025-11-28", tag: "Дизайн",   subtasks: [] },
    ],
    3: [
      { id: 301, title: "Редизайн головної сторінки",  status: "В роботі", priority: 3, assigneeId: 2, deadline: "2025-12-10", tag: "Дизайн",    subtasks: [] },
      { id: 302, title: "Оптимізація швидкості сайту", status: "Зробити",  priority: 2, assigneeId: 5, deadline: "2025-12-20", tag: "Розробка",  subtasks: [] },
      { id: 303, title: "Написати контент для блогу",  status: "Зроблено", priority: 1, assigneeId: 5, deadline: "2025-11-15", tag: "Маркетинг", subtasks: [] },
    ],
  },
  messages: {},
  nextId: 500,
};
