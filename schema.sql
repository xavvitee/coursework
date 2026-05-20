-- Таблиця проектів
CREATE TABLE IF NOT EXISTS projects (
  id         SERIAL PRIMARY KEY,
  name       TEXT    NOT NULL,
  icon       TEXT    DEFAULT '📁',
  owner_id   INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця учасників проекту
CREATE TABLE IF NOT EXISTS project_members (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  role       TEXT    DEFAULT 'Розробник',
  avatar     TEXT,
  color      TEXT    DEFAULT '#4f8ef7',
  UNIQUE(project_id, user_id)
);

-- Таблиця задач
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  status      TEXT    DEFAULT 'Зробити',
  priority    INTEGER DEFAULT 1,
  assignee_id INTEGER,
  deadline    DATE,
  tag         TEXT    DEFAULT 'Загальне',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця підзадач
CREATE TABLE IF NOT EXISTS subtasks (
  id          SERIAL PRIMARY KEY,
  task_id     INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  done        BOOLEAN DEFAULT FALSE,
  assignee_id INTEGER,
  deadline    DATE
);

-- Таблиця повідомлень
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  task_id    INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  from_me    BOOLEAN DEFAULT TRUE,
  text       TEXT    NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Дозволити анонімний доступ (Row Level Security)
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;

-- Публічний доступ (для навчального проекту)
CREATE POLICY "public_all" ON projects        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON project_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON tasks           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON subtasks        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON messages        FOR ALL USING (true) WITH CHECK (true);
