import { describe, it, expect, beforeEach } from "vitest";
import {
  addTask,
  updateTask,
  deleteTask,
  toggleSubtask,
  filterTasks,
  inviteMember,
  removeMember,
  sendMessage,
  createProject,
} from "../services/taskService.js";

// Тестові дані
const makeData = () => ({
  me: { id: 1, name: "Тестер", email: "test@test.ua", avatar: "ТТ", color: "#4f8ef7" },
  projects: [{ id: 1, name: "Проект А", icon: "🔧", ownerId: 1 }],
  members: {
    1: [
      { id: 1, name: "Тестер",    email: "test@test.ua",  role: "Менеджер",  avatar: "ТТ", color: "#4f8ef7" },
      { id: 2, name: "Виконавець", email: "exec@test.ua", role: "Розробник", avatar: "ВВ", color: "#22c55e" },
    ],
  },
  tasks: {
    1: [
      {
        id: 10, title: "Задача 1", status: "Зробити", priority: 1,
        assigneeId: 2, deadline: "2026-12-01", tag: "Розробка",
        subtasks: [
          { id: 101, title: "Підзадача 1", done: false, assigneeId: 2 },
          { id: 102, title: "Підзадача 2", done: true,  assigneeId: 1 },
        ],
      },
      {
        id: 11, title: "Задача 2", status: "В роботі", priority: 3,
        assigneeId: 1, deadline: "2026-11-15", tag: "Дизайн",
        subtasks: [],
      },
      {
        id: 12, title: "Задача 3", status: "Зроблено", priority: 2,
        assigneeId: 2, deadline: "2026-10-01", tag: "Тестування",
        subtasks: [],
      },
    ],
  },
  messages: {},
  nextId: 100,
});

describe("addTask — додавання задачі", () => {
  it("TC-01: додає задачу з коректними даними", () => {
    const data = makeData();
    const form = {
      title: "Нова задача", status: "Зробити", priority: 1,
      assigneeId: 1, deadline: "2026-12-31", tag: "Загальне", subtasks: [],
    };
    const result = addTask(data, 1, form);

    expect(result.tasks[1]).toHaveLength(4);
    expect(result.tasks[1].at(-1).title).toBe("Нова задача");
    expect(result.tasks[1].at(-1).id).toBe(101);
  });

  it("TC-02: кидає помилку якщо назва порожня", () => {
    const data = makeData();
    expect(() => addTask(data, 1, { title: "  " })).toThrow("Назва задачі не може бути порожньою");
  });

  it("TC-03: кидає помилку якщо назва не передана", () => {
    const data = makeData();
    expect(() => addTask(data, 1, {})).toThrow();
  });

  it("TC-04: не мутує оригінальний стан", () => {
    const data = makeData();
    const original = JSON.stringify(data);
    addTask(data, 1, { title: "Тест", status: "Зробити", priority: 1, subtasks: [] });
    expect(JSON.stringify(data)).toBe(original);
  });
});

describe("updateTask — оновлення задачі", () => {
  it("TC-05: оновлює поля існуючої задачі", () => {
    const data = makeData();
    const result = updateTask(data, 1, { id: 10, title: "Оновлена назва", status: "В роботі" });

    const updated = result.tasks[1].find((t) => t.id === 10);
    expect(updated.title).toBe("Оновлена назва");
    expect(updated.status).toBe("В роботі");
  });

  it("TC-06: не змінює інші задачі", () => {
    const data = makeData();
    const result = updateTask(data, 1, { id: 10, title: "Змінена" });
    const other = result.tasks[1].find((t) => t.id === 11);
    expect(other.title).toBe("Задача 2");
  });
});

describe("deleteTask — видалення задачі", () => {
  it("TC-07: видаляє задачу за id", () => {
    const data = makeData();
    const result = deleteTask(data, 1, 10);
    expect(result.tasks[1].find((t) => t.id === 10)).toBeUndefined();
    expect(result.tasks[1]).toHaveLength(2);
  });

  it("TC-08: не видаляє інші задачі", () => {
    const data = makeData();
    const result = deleteTask(data, 1, 10);
    expect(result.tasks[1].find((t) => t.id === 11)).toBeDefined();
  });

  it("TC-09: повертає той самий стан якщо задача не знайдена", () => {
    const data = makeData();
    const result = deleteTask(data, 1, 9999);
    expect(result.tasks[1]).toHaveLength(3);
  });
});

describe("toggleSubtask — перемикання підзадачі", () => {
  it("TC-10: перемикає done з false на true", () => {
    const data = makeData();
    const result = toggleSubtask(data, 1, 101);
    const sub = result.tasks[1].find((t) => t.id === 10).subtasks.find((s) => s.id === 101);
    expect(sub.done).toBe(true);
  });

  it("TC-11: перемикає done з true на false", () => {
    const data = makeData();
    const result = toggleSubtask(data, 1, 102);
    const sub = result.tasks[1].find((t) => t.id === 10).subtasks.find((s) => s.id === 102);
    expect(sub.done).toBe(false);
  });

  it("TC-12: не впливає на інші підзадачі", () => {
    const data = makeData();
    const result = toggleSubtask(data, 1, 101);
    const sub102 = result.tasks[1].find((t) => t.id === 10).subtasks.find((s) => s.id === 102);
    expect(sub102.done).toBe(true); // залишається true
  });
});

describe("filterTasks — фільтрація задач", () => {
  let tasks;
  beforeEach(() => { tasks = makeData().tasks[1]; });

  it("TC-13: без фільтрів повертає всі задачі", () => {
    expect(filterTasks(tasks, {})).toHaveLength(3);
  });

  it("TC-14: фільтрує за статусом", () => {
    const result = filterTasks(tasks, { status: "Зроблено" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(12);
  });

  it("TC-15: фільтрує за виконавцем", () => {
    const result = filterTasks(tasks, { member: 2 });
    expect(result.every((t) => t.assigneeId === 2)).toBe(true);
  });

  it("TC-16: фільтрує за пошуком (регістронезалежно)", () => {
    const result = filterTasks(tasks, { search: "задача 2" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Задача 2");
  });

  it("TC-17: комбінований фільтр статус + пошук", () => {
    const result = filterTasks(tasks, { status: "В роботі", search: "2" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(11);
  });

  it("TC-18: повертає порожній масив якщо нічого не знайдено", () => {
    const result = filterTasks(tasks, { search: "неіснуюча задача xyz" });
    expect(result).toHaveLength(0);
  });
});

describe("inviteMember — запрошення учасника", () => {
  it("TC-19: додає нового учасника за email", () => {
    const data = makeData();
    const result = inviteMember(data, 1, "newuser@example.com", "Дизайнер");
    expect(result.members[1]).toHaveLength(3);
    expect(result.members[1].at(-1).email).toBe("newuser@example.com");
    expect(result.members[1].at(-1).role).toBe("Дизайнер");
  });

  it("TC-20: генерує ім'я та ініціали з email", () => {
    const data = makeData();
    const result = inviteMember(data, 1, "ivan.petrov@company.ua", "Аналітик");
    const newMember = result.members[1].at(-1);
    expect(newMember.name).toBe("Ivan Petrov");
    expect(newMember.avatar).toBe("IP");
  });

  it("TC-21: кидає помилку при некоректному email", () => {
    const data = makeData();
    expect(() => inviteMember(data, 1, "notanemail", "Розробник")).toThrow("Введіть коректний email");
  });

  it("TC-22: кидає помилку якщо учасник вже є в команді", () => {
    const data = makeData();
    expect(() => inviteMember(data, 1, "test@test.ua", "Розробник")).toThrow("Цей користувач вже в команді");
  });
});

describe("removeMember — видалення учасника", () => {
  it("TC-23: видаляє учасника за id", () => {
    const data = makeData();
    const result = removeMember(data, 1, 2);
    expect(result.members[1].find((m) => m.id === 2)).toBeUndefined();
    expect(result.members[1]).toHaveLength(1);
  });

  it("TC-24: не видаляє інших учасників", () => {
    const data = makeData();
    const result = removeMember(data, 1, 2);
    expect(result.members[1].find((m) => m.id === 1)).toBeDefined();
  });
});

describe("sendMessage — повідомлення", () => {
  it("TC-25: додає повідомлення до задачі", () => {
    const data = makeData();
    const result = sendMessage(data, 10, "Привіт!", "14:30");
    expect(result.messages[10]).toHaveLength(1);
    expect(result.messages[10][0].text).toBe("Привіт!");
    expect(result.messages[10][0].fromMe).toBe(true);
    expect(result.messages[10][0].time).toBe("14:30");
  });

  it("TC-26: додає кілька повідомлень до однієї задачі", () => {
    const data = makeData();
    let result = sendMessage(data, 10, "Перше",  "10:00");
    result      = sendMessage(result, 10, "Друге", "10:01");
    expect(result.messages[10]).toHaveLength(2);
  });

  it("TC-27: не впливає на повідомлення інших задач", () => {
    const data = makeData();
    const result = sendMessage(data, 10, "Тест", "09:00");
    expect(result.messages[11]).toBeUndefined();
  });
});

describe("createProject — створення проекту", () => {
  it("TC-28: створює проект з вказаною назвою", () => {
    const data = makeData();
    const { newData } = createProject(data, "Новий проект", "🚀");
    expect(newData.projects).toHaveLength(2);
    expect(newData.projects.at(-1).name).toBe("Новий проект");
    expect(newData.projects.at(-1).icon).toBe("🚀");
  });

  it("TC-29: власником проекту є поточний користувач", () => {
    const data = makeData();
    const { newData } = createProject(data, "Мій проект");
    expect(newData.projects.at(-1).ownerId).toBe(data.me.id);
  });

  it("TC-30: автоматично додає власника до учасників", () => {
    const data = makeData();
    const { newData, newId } = createProject(data, "Тест");
    expect(newData.members[newId]).toHaveLength(1);
    expect(newData.members[newId][0].id).toBe(data.me.id);
  });

  it("TC-31: кидає помилку якщо назва порожня", () => {
    const data = makeData();
    expect(() => createProject(data, "")).toThrow("Назва проекту не може бути порожньою");
    expect(() => createProject(data, "   ")).toThrow();
  });

  it("TC-32: створює порожній список задач для нового проекту", () => {
    const data = makeData();
    const { newData, newId } = createProject(data, "Тест2");
    expect(newData.tasks[newId]).toEqual([]);
  });
});

describe("Task Service", () => {
  it("should create task object", () => {
    const task = {
      title: "Test task",
      status: "To Do"
    };

    expect(task.title).toBe("Test task");
  });
});
