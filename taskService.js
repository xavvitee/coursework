/**
 * TaskService — Сервісний шар (бізнес-логіка)
 *
 * Відповідає за операції з задачами, учасниками, проектами та повідомленнями.
 * Виступає роллю Controller/Service у шаблоні MVC:
 *   Model    → дані (tasks, projects, members, messages)
 *   View     → React-компоненти
 *   Service  → цей файл (логіка між View та Model)
 *
 * Усі публічні функції приймають поточний стан `data` та повертають
 * новий стан — без мутацій (immutable approach).
 */

import { COLORS } from "../utils/constants.js";
import { emailToMember } from "../utils/formatters.js";

// ── Проекти ───────────────────────────────────────────────────────────────────

/**
 * Створює новий проект.
 * @param {object} data  - поточний стан
 * @param {string} name  - назва проекту
 * @param {string} icon  - емодзі-іконка
 * @returns {{ newData: object, newId: number }}
 */
export function createProject(data, name, icon = "📁") {
  if (!name || !name.trim()) throw new Error("Назва проекту не може бути порожньою");

  const id = data.nextId + 1;
  const newData = {
    ...data,
    nextId: id,
    projects: [...data.projects, { id, name: name.trim(), icon, ownerId: data.me.id }],
    members:  { ...data.members,  [id]: [{ ...data.me, role: "Менеджер" }] },
    tasks:    { ...data.tasks,    [id]: [] },
  };
  return { newData, newId: id };
}

// ── Задачі ────────────────────────────────────────────────────────────────────

/**
 * Додає нову задачу до проекту.
 * @param {object} data
 * @param {number} projectId
 * @param {object} taskForm  - поля задачі (title, status, priority, ...)
 * @returns {object} newData
 */
export function addTask(data, projectId, taskForm) {
  if (!taskForm.title || !taskForm.title.trim()) throw new Error("Назва задачі не може бути порожньою");

  const nextId = data.nextId + 1;
  const task = { ...taskForm, id: nextId };
  return {
    ...data,
    nextId,
    tasks: {
      ...data.tasks,
      [projectId]: [...(data.tasks[projectId] || []), task],
    },
  };
}

/**
 * Оновлює існуючу задачу.
 * @param {object} data
 * @param {number} projectId
 * @param {object} updatedTask
 * @returns {object} newData
 */
export function updateTask(data, projectId, updatedTask) {
  return {
    ...data,
    tasks: {
      ...data.tasks,
      [projectId]: data.tasks[projectId].map((t) =>
        t.id === updatedTask.id ? { ...t, ...updatedTask } : t
      ),
    },
  };
}

/**
 * Видаляє задачу за id.
 * @param {object} data
 * @param {number} projectId
 * @param {number} taskId
 * @returns {object} newData
 */
export function deleteTask(data, projectId, taskId) {
  return {
    ...data,
    tasks: {
      ...data.tasks,
      [projectId]: data.tasks[projectId].filter((t) => t.id !== taskId),
    },
  };
}

/**
 * Перемикає стан виконання підзадачі.
 * @param {object} data
 * @param {number} projectId
 * @param {number} subtaskId
 * @returns {object} newData
 */
export function toggleSubtask(data, projectId, subtaskId) {
  return {
    ...data,
    tasks: {
      ...data.tasks,
      [projectId]: data.tasks[projectId].map((t) => ({
        ...t,
        subtasks: (t.subtasks || []).map((s) =>
          s.id === subtaskId ? { ...s, done: !s.done } : s
        ),
      })),
    },
  };
}

// ── Фільтрація ────────────────────────────────────────────────────────────────

/**
 * Фільтрує задачі за критеріями.
 * @param {Array}  tasks
 * @param {object} filter  - { status, member, search }
 * @returns {Array}
 */
export function filterTasks(tasks, filter) {
  return tasks.filter((t) => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.member && t.assigneeId !== filter.member) return false;
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
}

// ── Учасники ──────────────────────────────────────────────────────────────────

/**
 * Додає нового учасника за email.
 * @param {object} data
 * @param {number} projectId
 * @param {string} email
 * @param {string} role
 * @returns {object} newData
 * @throws якщо email некоректний або учасник вже в команді
 */
export function inviteMember(data, projectId, email, role) {
  if (!email.includes("@")) throw new Error("Введіть коректний email");

  const existing = data.members[projectId] || [];
  if (existing.some((m) => m.email === email)) {
    throw new Error("Цей користувач вже в команді");
  }

  const { name, avatar, color } = emailToMember(email, existing.length, COLORS);
  const id = data.nextId + 1;
  const member = { id, name, email, role, avatar, color };

  return {
    ...data,
    nextId: id,
    members: {
      ...data.members,
      [projectId]: [...existing, member],
    },
  };
}

/**
 * Видаляє учасника з проекту.
 * @param {object} data
 * @param {number} projectId
 * @param {number} memberId
 * @returns {object} newData
 */
export function removeMember(data, projectId, memberId) {
  return {
    ...data,
    members: {
      ...data.members,
      [projectId]: (data.members[projectId] || []).filter((m) => m.id !== memberId),
    },
  };
}

// ── Повідомлення ──────────────────────────────────────────────────────────────

/**
 * Надсилає повідомлення до задачі.
 * @param {object} data
 * @param {number} taskId
 * @param {string} text
 * @param {string} time  - час у форматі HH:MM
 * @returns {object} newData
 */
export function sendMessage(data, taskId, text, time) {
  const prev = data.messages[taskId] || [];
  return {
    ...data,
    messages: {
      ...data.messages,
      [taskId]: [...prev, { fromMe: true, text, time }],
    },
  };
}
