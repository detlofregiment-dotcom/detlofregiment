CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','academic_admin','student','parent')),
  student_id TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS results (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  term TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  sba1 NUMERIC(5,2) NOT NULL CHECK (sba1 BETWEEN 0 AND 10),
  sba2 NUMERIC(5,2) NOT NULL CHECK (sba2 BETWEEN 0 AND 20),
  project_work NUMERIC(5,2) NOT NULL CHECK (project_work BETWEEN 0 AND 20),
  examination NUMERIC(5,2) NOT NULL CHECK (examination BETWEEN 0 AND 100),
  final_score NUMERIC(5,2) NOT NULL CHECK (final_score BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','published')),
  uploaded_batch TEXT,
  created_by BIGINT REFERENCES users(id),
  approved_by BIGINT REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, subject, term, academic_year)
);
CREATE TABLE IF NOT EXISTS timetable_entries (
  id BIGSERIAL PRIMARY KEY,
  class_name TEXT NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  teacher TEXT,
  venue TEXT,
  academic_year TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  CHECK (end_time > start_time)
);
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','published')),
  created_by BIGINT REFERENCES users(id),
  approved_by BIGINT REFERENCES users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS notification_jobs (
  id BIGSERIAL PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('sms','whatsapp')),
  recipient TEXT NOT NULL,
  student_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed')),
  provider_reference TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_results_student_status ON results(student_id, status);
CREATE INDEX IF NOT EXISTS idx_timetable_class_day ON timetable_entries(class_name, day_of_week);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
