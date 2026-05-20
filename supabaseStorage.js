
// Конфігурація 
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isConfigured = () => SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("...");

// Базовий fetch до Supabase REST API
async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type":  "application/json",
      "apikey":        SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer":        "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
  return res.json();
}

// Projects
export async function fetchProjects() {
  if (!isConfigured()) return null;
  return sbFetch("projects?select=*&order=id");
}

export async function upsertProject(project) {
  if (!isConfigured()) return null;
  return sbFetch("projects", {
    method:  "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body:    JSON.stringify(project),
  });
}

export async function deleteProject(id) {
  if (!isConfigured()) return null;
  return sbFetch(`projects?id=eq.${id}`, { method: "DELETE" });
}

// Tasks 
export async function fetchTasks(projectId) {
  if (!isConfigured()) return null;
  return sbFetch(`tasks?project_id=eq.${projectId}&select=*,subtasks(*)&order=id`);
}

export async function upsertTask(task) {
  if (!isConfigured()) return null;
  const { subtasks, ...taskData } = task;
  return sbFetch("tasks", {
    method:  "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body:    JSON.stringify(taskData),
  });
}

export async function deleteTask(id) {
  if (!isConfigured()) return null;
  return sbFetch(`tasks?id=eq.${id}`, { method: "DELETE" });
}

// Subtasks 
export async function upsertSubtask(subtask) {
  if (!isConfigured()) return null;
  return sbFetch("subtasks", {
    method:  "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body:    JSON.stringify(subtask),
  });
}

// Members
export async function fetchMembers(projectId) {
  if (!isConfigured()) return null;
  return sbFetch(`project_members?project_id=eq.${projectId}&select=*`);
}

export async function upsertMember(member) {
  if (!isConfigured()) return null;
  return sbFetch("project_members", {
    method:  "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body:    JSON.stringify(member),
  });
}

export async function deleteMember(projectId, userId) {
  if (!isConfigured()) return null;
  return sbFetch(`project_members?project_id=eq.${projectId}&user_id=eq.${userId}`, {
    method: "DELETE",
  });
}

// Messages 
export async function fetchMessages(taskId) {
  if (!isConfigured()) return null;
  return sbFetch(`messages?task_id=eq.${taskId}&select=*&order=created_at`);
}

export async function insertMessage(message) {
  if (!isConfigured()) return null;
  return sbFetch("messages", {
    method: "POST",
    body:   JSON.stringify(message),
  });
}

// ── Export config status ──────────────────────────────────────────────────────
export const supabaseEnabled = isConfigured();
