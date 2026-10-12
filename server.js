import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import ExcelJS from 'exceljs';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool, migrate } from './db.js';
import { signToken, requireAuth, allowRoles } from './security.js';
import { calculateFinalScore } from './grades.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(cors({ origin: (process.env.FRONTEND_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean), credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
async function audit(req, action, type, id = null, details = {}) {
  await pool.query(
    'INSERT INTO audit_logs(actor_user_id, action, entity_type, entity_id, details, ip_address) VALUES($1,$2,$3,$4,$5,$6)',
    [req.user?.sub || null, action, type, id == null ? null : String(id), JSON.stringify(details), req.ip || null]
  );
}
const resultInput = z.object({
  studentId: z.string().min(1).max(80),
  subject: z.string().min(1).max(120),
  term: z.string().min(1).max(30),
  academicYear: z.string().min(4).max(20),
  sba1: z.coerce.number().min(0).max(10),
  sba2: z.coerce.number().min(0).max(20),
  projectWork: z.coerce.number().min(0).max(20),
  examination: z.coerce.number().min(0).max(100)
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'detlof-school-api' }));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const input = z.object({ email: z.string().email(), password: z.string().min(1).max(200) }).safeParse(req.body);
  if (!input.success) return res.status(400).json({ error: 'Enter a valid email and password.' });
  const { rows } = await pool.query('SELECT * FROM users WHERE lower(email)=lower($1) AND active=TRUE', [input.data.email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(input.data.password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid login details.' });
  }
  res.json({ token: signToken(user), user: { id: user.id, email: user.email, role: user.role, studentId: user.student_id } });
}));

app.get('/api/me', requireAuth, asyncRoute(async (req, res) => {
  const { rows } = await pool.query('SELECT id,email,role,student_id AS "studentId" FROM users WHERE id=$1 AND active=TRUE', [req.user.sub]);
  if (!rows[0]) return res.status(401).json({ error: 'Account is inactive.' });
  res.json(rows[0]);
}));

app.get('/api/students', requireAuth, allowRoles('admin','academic_admin'), asyncRoute(async (req, res) => {
  const { rows } = await pool.query('SELECT id,full_name AS "fullName",class_name AS "className",academic_year AS "academicYear",parent_name AS "parentName",parent_phone AS "parentPhone",parent_whatsapp AS "parentWhatsApp" FROM students ORDER BY class_name,full_name');
  res.json({ students: rows });
}));

app.post('/api/students', requireAuth, allowRoles('admin','academic_admin'), asyncRoute(async (req, res) => {
  const parsed = z.object({
    id: z.string().min(2).max(80), fullName: z.string().min(2).max(160),
    className: z.string().min(2).max(30), academicYear: z.string().min(4).max(20),
    parentName: z.string().max(160).optional().default(''),
    parentPhone: z.string().max(40).optional().default(''),
    parentWhatsApp: z.string().max(40).optional().default('')
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid student data.', issues: parsed.error.issues });
  const s = parsed.data;
  await pool.query('INSERT INTO students(id,full_name,class_name,academic_year,parent_name,parent_phone,parent_whatsapp) VALUES($1,$2,$3,$4,$5,$6,$7)',
    [s.id,s.fullName,s.className,s.academicYear,s.parentName,s.parentPhone,s.parentWhatsApp]);
  await audit(req, 'student.created', 'student', s.id);
  res.status(201).json({ student: s });
}));

app.get('/api/results/mine', requireAuth, allowRoles('student','parent'), asyncRoute(async (req, res) => {
  const sid = req.user.studentId;
  if (!sid) return res.status(403).json({ error: 'This account is not linked to a student.' });
  const { rows } = await pool.query(`SELECT subject,term,academic_year AS "academicYear",sba1,sba2,project_work AS "projectWork",examination,final_score AS "finalScore"
    FROM results WHERE student_id=$1 AND status='published' ORDER BY academic_year DESC,term,subject`, [sid]);
  res.json({ results: rows });
}));

app.get('/api/results', requireAuth, allowRoles('admin','academic_admin'), asyncRoute(async (req, res) => {
  const status = ['draft','approved','published'].includes(req.query.status) ? req.query.status : null;
  const args = status ? [status] : [];
  const { rows } = await pool.query(`SELECT r.*,s.full_name AS student_name,s.class_name FROM results r JOIN students s ON s.id=r.student_id
    ${status ? 'WHERE r.status=$1' : ''} ORDER BY r.academic_year DESC,r.term,s.class_name,s.full_name,r.subject`, args);
  res.json({ results: rows });
}));


const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});
app.post('/api/import/results', requireAuth, allowRoles('admin','academic_admin'), uploadMemory.single('file'), asyncRoute(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Attach an .xlsx or .csv file in the file field.' });
  const filename = req.file.originalname.toLowerCase();
  if (!filename.endsWith('.xlsx') && !filename.endsWith('.csv')) {
    return res.status(400).json({ error: 'Only .xlsx and .csv files are accepted.' });
  }
  const workbook = new ExcelJS.Workbook();
  if (filename.endsWith('.csv')) await workbook.csv.read(Readable.from([req.file.buffer]));
  else await workbook.xlsx.load(req.file.buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet || sheet.rowCount < 2) return res.status(400).json({ error: 'The file needs a header row and at least one data row.' });
  const header = sheet.getRow(1).values.slice(1).map(v => String(v ?? '').trim().toLowerCase());
  const required = ['student id','subject','term','academic year','sba 1','sba 2','project work','examination'];
  const missing = required.filter(name => !header.includes(name));
  if (missing.length) return res.status(400).json({ error: `Missing columns: ${missing.join(', ')}` });
  const idx = Object.fromEntries(required.map(name => [name, header.indexOf(name) + 1]));
  const batchId = randomUUID();
  const rows = [];
  const errors = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const get = key => row.getCell(idx[key]).value;
    if (required.every(key => String(get(key) ?? '').trim() === '')) continue;
    const candidate = {
      studentId: String(get('student id') ?? '').trim(),
      subject: String(get('subject') ?? '').trim(),
      term: String(get('term') ?? '').trim(),
      academicYear: String(get('academic year') ?? '').trim(),
      sba1: Number(get('sba 1')), sba2: Number(get('sba 2')),
      projectWork: Number(get('project work')), examination: Number(get('examination'))
    };
    const parsed = resultInput.safeParse(candidate);
    if (!parsed.success) {
      errors.push({ row: r, studentId: candidate.studentId, issues: parsed.error.issues.map(i => i.message) });
      continue;
    }
    rows.push(parsed.data);
  }
  if (errors.length) return res.status(422).json({ error: 'Upload has validation errors; nothing was saved.', errors: errors.slice(0, 100), errorCount: errors.length });
  if (!rows.length) return res.status(400).json({ error: 'No valid result rows were found.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const row of rows) {
      const exists = await client.query('SELECT 1 FROM students WHERE id=$1', [row.studentId]);
      if (!exists.rowCount) throw new Error(`Unknown student ID: ${row.studentId}`);
      const finalScore = calculateFinalScore(row);
      await client.query(`INSERT INTO results(student_id,subject,term,academic_year,sba1,sba2,project_work,examination,final_score,status,uploaded_batch,created_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft',$10,$11)
        ON CONFLICT(student_id,subject,term,academic_year) DO UPDATE SET sba1=EXCLUDED.sba1,sba2=EXCLUDED.sba2,
        project_work=EXCLUDED.project_work,examination=EXCLUDED.examination,final_score=EXCLUDED.final_score,status='draft',
        uploaded_batch=EXCLUDED.uploaded_batch,created_by=EXCLUDED.created_by,approved_by=NULL,approved_at=NULL,published_at=NULL`,
        [row.studentId,row.subject,row.term,row.academicYear,row.sba1,row.sba2,row.projectWork,row.examination,finalScore,batchId,req.user.sub]);
    }
    await client.query('COMMIT');
    await audit(req, 'results.imported', 'result_batch', batchId, { count: rows.length, filename: req.file.originalname });
    res.status(201).json({ batchId, count: rows.length, status: 'draft', message: 'Validated and saved as drafts; approval and publication are still required.' });
  } catch (e) {
    await client.query('ROLLBACK');
    if (e.message.startsWith('Unknown student ID:')) return res.status(422).json({ error: e.message, message: 'Nothing was saved.' });
    throw e;
  } finally { client.release(); }
}));

app.post('/api/results/drafts', requireAuth, allowRoles('admin','academic_admin'), asyncRoute(async (req, res) => {
  const parsed = z.object({ rows: z.array(resultInput).min(1).max(5000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid results upload.', issues: parsed.error.issues });
  const client = await pool.connect();
  const batchId = randomUUID();
  try {
    await client.query('BEGIN');
    for (const row of parsed.data.rows) {
      const finalScore = calculateFinalScore(row);
      await client.query(`INSERT INTO results(student_id,subject,term,academic_year,sba1,sba2,project_work,examination,final_score,status,uploaded_batch,created_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft',$10,$11)
        ON CONFLICT(student_id,subject,term,academic_year) DO UPDATE SET sba1=EXCLUDED.sba1,sba2=EXCLUDED.sba2,
        project_work=EXCLUDED.project_work,examination=EXCLUDED.examination,final_score=EXCLUDED.final_score,status='draft',
        uploaded_batch=EXCLUDED.uploaded_batch,created_by=EXCLUDED.created_by,approved_by=NULL,approved_at=NULL,published_at=NULL`,
        [row.studentId,row.subject,row.term,row.academicYear,row.sba1,row.sba2,row.projectWork,row.examination,finalScore,batchId,req.user.sub]);
    }
    await client.query('COMMIT');
    await audit(req, 'results.drafted', 'result_batch', batchId, { count: parsed.data.rows.length });
    res.status(201).json({ batchId, count: parsed.data.rows.length, status: 'draft' });
  } catch (e) { await client.query('ROLLBACK'); throw e; }
  finally { client.release(); }
}));

app.post('/api/results/:batchId/approve', requireAuth, allowRoles('admin','academic_admin'), asyncRoute(async (req, res) => {
  const { rowCount } = await pool.query(`UPDATE results SET status='approved',approved_by=$1,approved_at=NOW()
    WHERE uploaded_batch=$2 AND status='draft'`, [req.user.sub, req.params.batchId]);
  if (!rowCount) return res.status(404).json({ error: 'No draft results found for this batch.' });
  await audit(req, 'results.approved', 'result_batch', req.params.batchId, { count: rowCount });
  res.json({ batchId: req.params.batchId, approved: rowCount });
}));

app.post('/api/results/:batchId/publish', requireAuth, allowRoles('admin','academic_admin'), asyncRoute(async (req, res) => {
  const { rowCount } = await pool.query(`UPDATE results SET status='published',published_at=NOW()
    WHERE uploaded_batch=$1 AND status='approved'`, [req.params.batchId]);
  if (!rowCount) return res.status(409).json({ error: 'Only approved result batches can be published.' });
  await audit(req, 'results.published', 'result_batch', req.params.batchId, { count: rowCount });
  // Notification jobs are deliberately not sent until a provider is configured.
  res.json({ batchId: req.params.batchId, published: rowCount, notification: 'Configure a provider adapter before sending messages.' });
}));

app.get('/api/timetable/mine', requireAuth, asyncRoute(async (req, res) => {
  if (!['student','parent'].includes(req.user.role) || !req.user.studentId) return res.status(403).json({ error: 'Student-linked account required.' });
  const { rows } = await pool.query(`SELECT t.day_of_week AS day,t.start_time AS "startTime",t.end_time AS "endTime",t.subject,t.teacher,t.venue
    FROM timetable_entries t JOIN students s ON s.class_name=t.class_name
    WHERE s.id=$1 AND t.status='published' ORDER BY CASE t.day_of_week WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 ELSE 5 END,t.start_time`, [req.user.studentId]);
  res.json({ timetable: rows });
}));

app.get('/api/audit', requireAuth, allowRoles('admin'), asyncRoute(async (req, res) => {
  const { rows } = await pool.query('SELECT id,actor_user_id AS "actorUserId",action,entity_type AS "entityType",entity_id AS "entityId",details,ip_address AS "ipAddress",created_at AS "createdAt" FROM audit_logs ORDER BY created_at DESC LIMIT 500');
  res.json({ logs: rows });
}));

app.use((req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((err, req, res, next) => {
  console.error(err?.message || 'Unhandled server error');
  if (err?.code === '23505') return res.status(409).json({ error: 'A record with this identifier already exists.' });
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

const port = Number(process.env.PORT || 4000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to a random string of at least 32 characters.');
  process.exit(1);
}
try {
  await migrate();
  app.listen(port, () => console.log(`Detlof School API listening on port ${port}`));
} catch (err) {
  console.error('Database startup failed:', err.message);
  process.exit(1);
}
