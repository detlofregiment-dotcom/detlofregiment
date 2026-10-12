import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Megaphone,
  LogOut,
  ArrowLeft,
  Phone,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  Download,
  Search,
  RefreshCw,
  Eye,
  Send,
  FileSpreadsheet,
  Lock,
  KeyRound,
  UserPlus,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useSchool } from '../store';
import { Crest } from '../components/Crest';
import {
  Button,
  Input,
  Select,
  Field,
  inputCls,
} from '../components/ui';
import { gradeFor } from '../utils/grades';
import { CLASSES, SUBJECTS, TERMS } from '../data/school';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function parseCSV(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(',').map((s) => s.trim()))
    .filter((r) => r.length && r.some((c) => c !== ''));
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* Admin gate                                                          */
/* ------------------------------------------------------------------ */

const ADMIN_CODE = import.meta.env.DEV ? 'DPS-ADMIN-2026' : '';

function AdminGate({ onSuccess, go }: { onSuccess: () => void; go: (r: 'landing') => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!import.meta.env.DEV || code.trim() !== ADMIN_CODE) {
      setError('Incorrect admin code.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSuccess();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12" style={{ background: 'linear-gradient(180deg, #8300c6 0%, #5e0091 100%)' }}>
      <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <button
        onClick={() => go('landing')}
        className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full max-w-md rounded-3xl border border-white/10 bg-paper p-8 shadow-2xl ${shake ? 'animate-shake' : ''}`}
      >
        <div className="flex flex-col items-center text-center">
          <Crest className="h-20 w-20" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Academic Administration
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
            Detlof Preparatory School
          </h1>
          <p className="mt-2 text-sm text-mist">
            Enter the admin code to continue.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">
              Admin Code
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••••••"
              className={inputCls}
            />
          </div>
          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-accent-soft px-3.5 py-2.5 text-sm font-medium text-accent">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          <Button type="submit" className="w-full py-3">
            <Lock className="h-4 w-4" /> Unlock Admin Panel
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-gold/40 bg-yellow/10 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Demo Access
          </p>
          <p className="mt-2 text-sm text-ink">
            Admin code:{' '}
            <span className="font-mono font-bold">{ADMIN_CODE}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion section wrapper                                           */
/* ------------------------------------------------------------------ */

function AccordionSection({
  index,
  title,
  desc,
  isOpen,
  onToggle,
  children,
}: {
  index: string;
  title: string;
  desc: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-brand/10 bg-paper card-shadow">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-brand-soft/30"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand font-display text-sm font-semibold text-white">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 truncate text-xs text-mist">{desc}</p>
        </div>
        <span className="shrink-0 text-brand">
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-t border-brand/10 px-5 py-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Admin app                                                           */
/* ------------------------------------------------------------------ */

function AdminApp({ go }: { go: (r: 'landing') => void }) {
  const school = useSchool();
  const {
    students,
    results,
    timetable,
    bills,
    addStudent,
    updateStudent,
    publishResults,
    setBills,
    addAnnouncement,
    setTimetable,
    resetAll,
  } = school;

  const [toast, setToast] = useState<string | null>(null);
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* Accordion state — one open at a time */
  const [openSection, setOpenSection] = useState<string | null>('1');
  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  /* ---------- Section 0: New Admission ---------- */
  const [s0Name, setS0Name] = useState('');
  const [s0Class, setS0Class] = useState('JHS 1');
  const [s0Gender, setS0Gender] = useState('Male');
  const [s0Dob, setS0Dob] = useState('2012-04-18');
  const [s0Parent, setS0Parent] = useState('');
  const [s0Phone, setS0Phone] = useState('');
  const [s0WhatsApp, setS0WhatsApp] = useState('');
  const [s0Result, setS0Result] = useState<any>(null);

  const admitNewStudent = () => {
    if (!s0Name.trim()) {
      notify('Enter a student name first.');
      return;
    }
    const student = addStudent({
      name: s0Name.trim(),
      classCategory: s0Class,
      academicYear: '2025/2026',
      gender: s0Gender,
      dob: s0Dob,
      bloodGroup: 'O+',
      parentName: s0Parent || 'Mr./Mrs. Family',
      parentRelation: 'Parent',
      parentPhone: s0Phone || '024 000 0000',
      parentWhatsApp: s0WhatsApp || '233240000000',
      parentEmail: 'parent@example.com',
      emergencyContact: 'Family — 020 000 0000',
      homeAddress: 'Detlof Avenue, Accra',
      allergies: 'None',
      interests: 'Reading',
      compound: 'Day Student',
      club: 'Science Club',
    });
    setS0Result(student);
    notify('New student admitted and credentials generated.');
  };

  /* ---------- Section 1 ---------- */
  const [s1Class, setS1Class] = useState('JHS 2');
  const [s1Name, setS1Name] = useState('');
  const [s1Result, setS1Result] = useState<any>(null);

  const generateSingle = () => {
    if (!s1Name.trim()) {
      notify('Enter a student name first.');
      return;
    }
    const student = addStudent({
      name: s1Name.trim(),
      classCategory: s1Class,
      academicYear: '2025/2026',
      gender: 'Male',
      dob: '2012-04-18',
      bloodGroup: 'O+',
      parentName: 'Mr./Mrs. Family',
      parentRelation: 'Parent',
      parentPhone: '024 000 0000',
      parentWhatsApp: '233240000000',
      parentEmail: 'parent@example.com',
      emergencyContact: 'Family — 020 000 0000',
      homeAddress: 'Detlof Avenue, Accra',
      allergies: 'None',
      interests: 'Reading',
      compound: 'Day Student',
      club: 'Science Club',
    });
    setS1Result(student);
    notify('Student login code generated.');
  };

  /* ---------- Section 2 ---------- */
  const [s2Class, setS2Class] = useState('JHS 2');
  const [s2Generated, setS2Generated] = useState<any[]>([]);

  const generateClass = () => {
    const classStudents = students.filter((s) => s.classCategory === s2Class);
    const generated = classStudents.map((s) => ({
      ...s,
      loginCode: String(Math.floor(1000 + Math.random() * 9000)),
    }));
    generated.forEach((g) => updateStudent(g.id, { loginCode: g.loginCode }));
    setS2Generated(generated);
    notify(`Generated codes for ${generated.length} students.`);
  };

  /* ---------- Section 3 ---------- */
  const [s3Class, setS3Class] = useState('JHS 2');
  const downloadCredentials = () => {
    const rows = [['Student ID', 'Name', 'Class', 'Email', 'Login Code']];
    students
      .filter((s) => s.classCategory === s3Class)
      .forEach((s) => rows.push([s.id, s.name, s.classCategory, s.email, s.loginCode]));
    downloadCSV(`detlof-credentials-${s3Class.replace(/\s/g, '')}.csv`, rows);
    notify('Credentials downloaded.');
  };

  /* ---------- Section 4 ---------- */
  const [s4Class, setS4Class] = useState('JHS 2');
  const [s4StudentId, setS4StudentId] = useState('');
  const [s4Form, setS4Form] = useState<any>(null);

  const openProfile = (id: string) => {
    const s = students.find((x) => x.id === id);
    if (!s) return;
    setS4Form({ ...s });
  };

  const saveProfile = () => {
    if (!s4Form) return;
    updateStudent(s4Form.id, { ...s4Form });
    notify('Profile updated.');
  };

  /* ---------- Section 5 ---------- */
  const [s5Name, setS5Name] = useState('');
  const [s5Class, setS5Class] = useState('JHS 2');
  const [s5Year, setS5Year] = useState('2025/2026');
  const [s5Gender, setS5Gender] = useState('Male');
  const [s5Dob, setS5Dob] = useState('2012-04-18');
  const [s5Blood, setS5Blood] = useState('O+');
  const [s5Parent, setS5Parent] = useState('');
  const [s5Relation, setS5Relation] = useState('Parent');
  const [s5Phone, setS5Phone] = useState('');
  const [s5WhatsApp, setS5WhatsApp] = useState('');
  const [s5Email, setS5Email] = useState('');
  const [s5Emergency, setS5Emergency] = useState('');
  const [s5Address, setS5Address] = useState('');
  const [s5Allergies, setS5Allergies] = useState('');
  const [s5Interests, setS5Interests] = useState('');
  const [s5Compound, setS5Compound] = useState('Day Student');
  const [s5Club, setS5Club] = useState('Science Club');

  const admitStudent = () => {
    if (!s5Name.trim()) {
      notify('Enter a student name first.');
      return;
    }
    addStudent({
      name: s5Name.trim(),
      classCategory: s5Class,
      academicYear: s5Year,
      gender: s5Gender,
      dob: s5Dob,
      bloodGroup: s5Blood,
      parentName: s5Parent || 'Mr./Mrs. Family',
      parentRelation: s5Relation,
      parentPhone: s5Phone || '024 000 0000',
      parentWhatsApp: s5WhatsApp || '233240000000',
      parentEmail: s5Email || 'parent@example.com',
      emergencyContact: s5Emergency || 'Family — 020 000 0000',
      homeAddress: s5Address || 'Detlof Avenue, Accra',
      allergies: s5Allergies || 'None',
      interests: s5Interests || 'Reading',
      compound: s5Compound,
      club: s5Club,
    });
    notify('New student admitted.');
    setS5Name('');
  };

  /* ---------- Section 6 ---------- */
  const [s6Class, setS6Class] = useState('JHS 2');
  const [s6StudentId, setS6StudentId] = useState('');
  const [s6Form, setS6Form] = useState<any>(null);

  const openPortalEditor = (id: string) => {
    const s = students.find((x) => x.id === id);
    if (!s) return;
    const studentBills = bills.filter((b) => b.studentId === id);
    setS6Form({
      ...s,
      bills: studentBills.length
        ? studentBills
        : [
            { item: 'Tuition', billed: 1200, paid: 0 },
            { item: 'Registration', billed: 150, paid: 0 },
            { item: 'Textbooks', billed: 220, paid: 0 },
          ],
    });
  };

  const savePortalEditor = () => {
    if (!s6Form) return;
    updateStudent(s6Form.id, {
      name: s6Form.name,
      classCategory: s6Form.classCategory,
      academicYear: s6Form.academicYear,
      gender: s6Form.gender,
      dob: s6Form.dob,
      bloodGroup: s6Form.bloodGroup,
      parentName: s6Form.parentName,
      parentRelation: s6Form.parentRelation,
      parentPhone: s6Form.parentPhone,
      parentWhatsApp: s6Form.parentWhatsApp,
      parentEmail: s6Form.parentEmail,
      emergencyContact: s6Form.emergencyContact,
      homeAddress: s6Form.homeAddress,
      allergies: s6Form.allergies,
      interests: s6Form.interests,
      compound: s6Form.compound,
      club: s6Form.club,
      promotionStatus: s6Form.promotionStatus,
      promotedTo: s6Form.promotedTo,
      message: s6Form.message,
    });
    setBills(s6Form.id, s6Form.bills);
    notify('Portal updated.');
  };

  /* ---------- Section 7 ---------- */
  const [s7Class, setS7Class] = useState('JHS 2');
  const [s7StudentId, setS7StudentId] = useState('');
  const [s7Title, setS7Title] = useState('');
  const [s7Category, setS7Category] = useState('Notice');
  const [s7Message, setS7Message] = useState('');

  const sendIndividualUpdate = () => {
    if (!s7StudentId || !s7Title.trim() || !s7Message.trim()) {
      notify('Fill in all fields.');
      return;
    }
    addAnnouncement({
      title: s7Title.trim(),
      category: s7Category,
      message: s7Message.trim(),
      audience: s7StudentId,
    });
    notify('Portal update sent.');
    setS7Title('');
    setS7Message('');
  };

  /* ---------- Section 8 ---------- */
  const [s8Class, setS8Class] = useState('JHS 2');
  const [s8Term, setS8Term] = useState('Term 2');
  const [s8Grid, setS8Grid] = useState<Record<string, Record<string, { a: string; b: string; p: string; e: string }>>>({});

  const s8Students = students.filter((s) => s.classCategory === s8Class);

  const initGrid = () => {
    const grid: Record<string, Record<string, { a: string; b: string; p: string; e: string }>> = {};
    s8Students.forEach((s) => {
      grid[s.id] = {};
      SUBJECTS.forEach((sub) => {
        grid[s.id][sub] = { a: '', b: '', p: '', e: '' };
      });
    });
    setS8Grid(grid);
  };

  const setCell = (sid: string, sub: string, key: 'a' | 'b' | 'p' | 'e', val: string) => {
    setS8Grid((prev) => ({
      ...prev,
      [sid]: { ...prev[sid], [sub]: { ...prev[sid]?.[sub], [key]: val } },
    }));
  };

  const publishClassResults = () => {
    const rows: any[] = [];
    try { Object.entries(s8Grid).forEach(([sid, subjects]) => {
      Object.entries(subjects).forEach(([sub, scores]) => {
        const a = Number(scores.a), b = Number(scores.b), p = Number(scores.p), e = Number(scores.e);
        const hasAny = [scores.a, scores.b, scores.p, scores.e].some((v) => v !== '');
        if (hasAny) {
          if ([scores.a, scores.b, scores.p, scores.e].some((v) => v === '') ||
              !Number.isFinite(a) || a < 0 || a > 10 ||
              !Number.isFinite(b) || b < 0 || b > 20 ||
              !Number.isFinite(p) || p < 0 || p > 20 ||
              !Number.isFinite(e) || e < 0 || e > 100) {
            throw new Error(`Invalid or incomplete marks for ${sid} — ${sub}. Limits: SBA1 /10, SBA2 /20, Project /20, Exam /100.`);
          }
          rows.push({ studentId: sid, subject: sub, sba1: a, sba2: b, projectWork: p, examination: e });
        }
      });
    });
    } catch (error) { notify(error instanceof Error ? error.message : 'Invalid marks.'); return; }
    if (!rows.length) {
      notify('Enter at least one complete set of scores.');
      return;
    }
    publishResults(s8Class, s8Term, rows);
    notify(`Published ${rows.length} result rows for ${s8Class} · ${s8Term}.`);
  };

  /* ---------- Section 9 ---------- */
  const [s9Class, setS9Class] = useState('JHS 2');

  const downloadRoster = () => {
    const rows = [['Student ID', 'Name', 'Class', 'Email', 'Login Code']];
    students
      .filter((s) => s.classCategory === s9Class)
      .forEach((s) => rows.push([s.id, s.name, s.classCategory, s.email, s.loginCode]));
    downloadCSV(`detlof-roster-${s9Class.replace(/\s/g, '')}.csv`, rows);
    notify('Roster downloaded.');
  };

  const downloadResults = () => {
    const rows = [['Student ID', 'Name', 'Subject', 'SBA 1 /10', 'SBA 2 /20', 'Project /20', 'Exam /100', 'Final /100', 'Grade', 'Term']];
    results
      .filter((r) => {
        const stu = students.find((s) => s.id === r.studentId);
        return stu && stu.classCategory === s9Class;
      })
      .forEach((r) => {
        const stu = students.find((s) => s.id === r.studentId);
        const total = r.sba1 + r.sba2 + r.projectWork + r.examination / 2;
        rows.push([
          r.studentId,
          stu?.name ?? '',
          r.subject,
          String(r.sba1),
          String(r.sba2),
          String(r.projectWork),
          String(r.examination),
          String(total),
          gradeFor(total).grade,
          r.term,
        ]);
      });
    downloadCSV(`detlof-results-${s9Class.replace(/\s/g, '')}.csv`, rows);
    notify('Results downloaded.');
  };

  const downloadTimetable = () => {
    const rows = [['Day', 'Time', 'Subject', 'Teacher', 'Venue', 'Class']];
    timetable
      .filter((t) => t.classCategory === s9Class)
      .forEach((t) => rows.push([t.day, t.time, t.subject, t.teacher, t.venue, t.classCategory]));
    downloadCSV(`detlof-timetable-${s9Class.replace(/\s/g, '')}.csv`, rows);
    notify('Timetable downloaded.');
  };

  /* ---------- Section 10 ---------- */
  const [s10Search, setS10Search] = useState('');
  const s10Filtered = students.filter((s) =>
    `${s.name} ${s.id} ${s.email} ${s.loginCode}`.toLowerCase().includes(s10Search.toLowerCase()),
  );

  /* ---------- Section 11 ---------- */
  const [s11Class, setS11Class] = useState('JHS 2');
  const [s11CSV, setS11CSV] = useState('');
  const [s11Preview, setS11Preview] = useState<string[][]>([]);

  const parseTimetableCSV = () => {
    const rows = parseCSV(s11CSV);
    setS11Preview(rows);
  };

  const applyTimetable = () => {
    const rows = s11Preview.length ? s11Preview : parseCSV(s11CSV);
    const entries = rows
      .filter((r) => r.length >= 5)
      .map((r) => ({ day: r[0], time: r[1], subject: r[2], teacher: r[3], venue: r[4] }));
    if (!entries.length) {
      notify('No valid rows found.');
      return;
    }
    setTimetable(s11Class, entries);
    notify(`Timetable applied to ${s11Class}.`);
    setS11CSV('');
    setS11Preview([]);
  };

  /* ---------- Section 12 ---------- */
  const [s12Class, setS12Class] = useState('JHS 2');
  const [s12StudentId, setS12StudentId] = useState('');
  const s12Student = students.find((s) => s.id === s12StudentId);

  const waReport = () => {
    if (!s12Student) return;
    const myResults = results.filter((r) => r.studentId === s12Student.id);
    const terms = [...new Set(myResults.map((r) => r.term))];
    const latest = terms[terms.length - 1] ?? 'Term 2';
    const rows = myResults.filter((r) => r.term === latest);
    const lines = rows.map((r) => {
      const total = r.sba1 + r.sba2 + r.projectWork + r.examination / 2;
      return `${r.subject}: ${total} (${gradeFor(total).grade})`;
    });
    const msg = `Academic Report — ${s12Student.name} (${s12Student.id})\nClass: ${s12Student.classCategory}\nTerm: ${latest}\n\n${lines.join('\n')}\n\nDetlof Preparatory School`;
    window.open(
      `https://wa.me/${s12Student.parentWhatsApp.replace(/\s/g, '')}?text=${encodeURIComponent(msg)}`,
      '_blank',
    );
  };

  const waTimetable = () => {
    if (!s12Student) return;
    const entries = timetable.filter((t) => t.classCategory === s12Student.classCategory);
    const lines = entries.map((t) => `${t.day} ${t.time} — ${t.subject} (${t.venue})`);
    const msg = `Class Timetable — ${s12Student.name} (${s12Student.id})\nClass: ${s12Student.classCategory}\n\n${lines.join('\n')}\n\nDetlof Preparatory School`;
    window.open(
      `https://wa.me/${s12Student.parentWhatsApp.replace(/\s/g, '')}?text=${encodeURIComponent(msg)}`,
      '_blank',
    );
  };

  /* ---------- Section 13 ---------- */
  const [s13Title, setS13Title] = useState('');
  const [s13Category, setS13Category] = useState('Notice');
  const [s13Message, setS13Message] = useState('');

  const broadcast = () => {
    if (!s13Title.trim() || !s13Message.trim()) {
      notify('Fill in all fields.');
      return;
    }
    addAnnouncement({
      title: s13Title.trim(),
      category: s13Category,
      message: s13Message.trim(),
      audience: 'all',
    });
    notify('Announcement broadcast to all portals.');
    setS13Title('');
    setS13Message('');
  };

  /* ---------- Section definitions ---------- */
  const SECTIONS = [
    {
      id: '0',
      title: 'New Student Admission',
      desc: 'Admit a new student and generate their login credentials automatically.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <Input value={s0Name} onChange={(e) => setS0Name(e.target.value)} placeholder="e.g. Kofi Mensah" />
            </Field>
            <Field label="Class">
              <Select value={s0Class} onChange={(e) => setS0Class(e.target.value)}>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Gender">
              <Select value={s0Gender} onChange={(e) => setS0Gender(e.target.value)}>
                <option>Male</option><option>Female</option>
              </Select>
            </Field>
            <Field label="Date of Birth">
              <Input type="date" value={s0Dob} onChange={(e) => setS0Dob(e.target.value)} />
            </Field>
            <Field label="Parent / Guardian">
              <Input value={s0Parent} onChange={(e) => setS0Parent(e.target.value)} placeholder="Mr./Mrs. Family" />
            </Field>
            <Field label="Parent Phone">
              <Input value={s0Phone} onChange={(e) => setS0Phone(e.target.value)} placeholder="024 000 0000" />
            </Field>
            <Field label="Parent WhatsApp">
              <Input value={s0WhatsApp} onChange={(e) => setS0WhatsApp(e.target.value)} placeholder="233240000000" />
            </Field>
          </div>
          <Button onClick={admitNewStudent}>
            <UserPlus className="h-4 w-4" /> Admit & Generate Credentials
          </Button>
          {s0Result && (
            <div className="rounded-2xl border border-gold/40 bg-yellow/10 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Student Admitted</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-mist">Student ID</p>
                  <p className="font-mono text-sm font-bold text-ink">{s0Result.id}</p>
                </div>
                <div>
                  <p className="text-xs text-mist">Login Code</p>
                  <p className="font-mono text-sm font-bold text-ink">{s0Result.loginCode}</p>
                </div>
                <div>
                  <p className="text-xs text-mist">Email</p>
                  <p className="font-mono text-xs font-bold text-ink">{s0Result.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '1',
      title: 'Quick Generate Single Student Login Code',
      desc: 'Create a unique Student ID and Login Code/PIN for any class from Creche to JHS 3.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <Select value={s1Class} onChange={(e) => setS1Class(e.target.value)}>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Student Full Name">
              <Input value={s1Name} onChange={(e) => setS1Name(e.target.value)} placeholder="e.g. Ama Serwaa Mensah" />
            </Field>
          </div>
          <Button onClick={generateSingle}>
            <KeyRound className="h-4 w-4" /> Generate Login Code
          </Button>
          {s1Result && (
            <div className="rounded-2xl border border-gold/40 bg-yellow/10 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Student Created</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-mist">Student ID</p>
                  <p className="font-mono text-sm font-bold text-ink">{s1Result.id}</p>
                </div>
                <div>
                  <p className="text-xs text-mist">Login Code</p>
                  <p className="font-mono text-sm font-bold text-ink">{s1Result.loginCode}</p>
                </div>
                <div>
                  <p className="text-xs text-mist">Email</p>
                  <p className="font-mono text-xs font-bold text-ink">{s1Result.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '2',
      title: 'Generate Credentials for Entire Class',
      desc: 'Select a class, generate unique login codes for all students, and download as Excel.',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Class">
              <Select value={s2Class} onChange={(e) => setS2Class(e.target.value)}>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Button onClick={generateClass}>
              <Users className="h-4 w-4" /> Generate for Class
            </Button>
            {s2Generated.length > 0 && (
              <Button variant="ghost" onClick={() => {
                const rows = [['Student ID', 'Name', 'Class', 'Email', 'Login Code']];
                s2Generated.forEach((s) => rows.push([s.id, s.name, s.classCategory, s.email, s.loginCode]));
                downloadCSV(`detlof-class-codes-${s2Class.replace(/\s/g, '')}.csv`, rows);
                notify('Class credentials downloaded.');
              }}>
                <Download className="h-4 w-4" /> Download Excel
              </Button>
            )}
          </div>
          {s2Generated.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-brand/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                    <th className="px-4 py-2.5">Student ID</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Login Code</th>
                  </tr>
                </thead>
                <tbody>
                  {s2Generated.map((s) => (
                    <tr key={s.id} className="border-b border-brand/5 last:border-0">
                      <td className="px-4 py-2.5 font-mono text-ink">{s.id}</td>
                      <td className="px-4 py-2.5 text-ink">{s.name}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-brand">{s.loginCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '3',
      title: 'Download Credentials by Class',
      desc: 'Download existing student credentials as Excel for any class.',
      content: (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Class">
            <Select value={s3Class} onChange={(e) => setS3Class(e.target.value)}>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Button onClick={downloadCredentials}>
            <Download className="h-4 w-4" /> Download Credentials
          </Button>
        </div>
      ),
    },
    {
      id: '4',
      title: 'Student Profile, Contact & Photo',
      desc: 'Administrator-only controls for the details shown on each student profile.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Filter by Class">
              <Select value={s4Class} onChange={(e) => { setS4Class(e.target.value); setS4StudentId(''); setS4Form(null); }}>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Student">
              <Select value={s4StudentId} onChange={(e) => { setS4StudentId(e.target.value); openProfile(e.target.value); }}>
                <option value="">Select a student…</option>
                {students.filter((s) => s.classCategory === s4Class).map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </Select>
            </Field>
          </div>
          {s4Form && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Full Name">
                <Input value={s4Form.name} onChange={(e) => setS4Form({ ...s4Form, name: e.target.value })} />
              </Field>
              <Field label="Class">
                <Select value={s4Form.classCategory} onChange={(e) => setS4Form({ ...s4Form, classCategory: e.target.value })}>
                  {CLASSES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Gender">
                <Select value={s4Form.gender} onChange={(e) => setS4Form({ ...s4Form, gender: e.target.value })}>
                  <option>Male</option><option>Female</option>
                </Select>
              </Field>
              <Field label="Date of Birth">
                <Input type="date" value={s4Form.dob} onChange={(e) => setS4Form({ ...s4Form, dob: e.target.value })} />
              </Field>
              <Field label="Blood Group">
                <Select value={s4Form.bloodGroup} onChange={(e) => setS4Form({ ...s4Form, bloodGroup: e.target.value })}>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Academic Year">
                <Input value={s4Form.academicYear} onChange={(e) => setS4Form({ ...s4Form, academicYear: e.target.value })} />
              </Field>
              <Field label="Parent / Guardian Name">
                <Input value={s4Form.parentName} onChange={(e) => setS4Form({ ...s4Form, parentName: e.target.value })} />
              </Field>
              <Field label="Relationship">
                <Input value={s4Form.parentRelation} onChange={(e) => setS4Form({ ...s4Form, parentRelation: e.target.value })} />
              </Field>
              <Field label="Parent Phone">
                <Input value={s4Form.parentPhone} onChange={(e) => setS4Form({ ...s4Form, parentPhone: e.target.value })} />
              </Field>
              <Field label="Parent WhatsApp">
                <Input value={s4Form.parentWhatsApp} onChange={(e) => setS4Form({ ...s4Form, parentWhatsApp: e.target.value })} />
              </Field>
              <Field label="Parent Email">
                <Input value={s4Form.parentEmail} onChange={(e) => setS4Form({ ...s4Form, parentEmail: e.target.value })} />
              </Field>
              <Field label="Emergency Contact">
                <Input value={s4Form.emergencyContact} onChange={(e) => setS4Form({ ...s4Form, emergencyContact: e.target.value })} />
              </Field>
              <Field label="Home Address">
                <Input value={s4Form.homeAddress} onChange={(e) => setS4Form({ ...s4Form, homeAddress: e.target.value })} />
              </Field>
              <Field label="Allergies / Health Notes">
                <Input value={s4Form.allergies} onChange={(e) => setS4Form({ ...s4Form, allergies: e.target.value })} />
              </Field>
              <Field label="Interests / Talents">
                <Input value={s4Form.interests} onChange={(e) => setS4Form({ ...s4Form, interests: e.target.value })} />
              </Field>
              <Field label="Residence / Compound">
                <Select value={s4Form.compound} onChange={(e) => setS4Form({ ...s4Form, compound: e.target.value })}>
                  <option>Day Student</option><option>Boarding House</option><option>Residential Compound</option>
                </Select>
              </Field>
              <Field label="Club / Activity">
                <Input value={s4Form.club} onChange={(e) => setS4Form({ ...s4Form, club: e.target.value })} />
              </Field>
              <div className="sm:col-span-2 lg:col-span-3">
                <Button onClick={saveProfile}>
                  <Check className="h-4 w-4" /> Save Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '5',
      title: 'Student Records Maintenance',
      desc: 'Correct a name, admit a new student, reissue a lost code, or mark a student who has left.',
      content: (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-ink">Admit a New Student</h3>
            <p className="text-sm text-mist">Creates the record, generates a Student ID, email and Login Code.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full Name">
                <Input value={s5Name} onChange={(e) => setS5Name(e.target.value)} placeholder="Student's full name" />
              </Field>
              <Field label="Class">
                <Select value={s5Class} onChange={(e) => setS5Class(e.target.value)}>
                  {CLASSES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Academic Year">
                <Input value={s5Year} onChange={(e) => setS5Year(e.target.value)} />
              </Field>
              <Field label="Gender">
                <Select value={s5Gender} onChange={(e) => setS5Gender(e.target.value)}>
                  <option>Male</option><option>Female</option>
                </Select>
              </Field>
              <Field label="Date of Birth">
                <Input type="date" value={s5Dob} onChange={(e) => setS5Dob(e.target.value)} />
              </Field>
              <Field label="Blood Group">
                <Select value={s5Blood} onChange={(e) => setS5Blood(e.target.value)}>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Parent / Guardian">
                <Input value={s5Parent} onChange={(e) => setS5Parent(e.target.value)} placeholder="Mr./Mrs. Family" />
              </Field>
              <Field label="Relationship">
                <Input value={s5Relation} onChange={(e) => setS5Relation(e.target.value)} />
              </Field>
              <Field label="Parent Phone">
                <Input value={s5Phone} onChange={(e) => setS5Phone(e.target.value)} />
              </Field>
              <Field label="Parent WhatsApp">
                <Input value={s5WhatsApp} onChange={(e) => setS5WhatsApp(e.target.value)} />
              </Field>
              <Field label="Parent Email">
                <Input value={s5Email} onChange={(e) => setS5Email(e.target.value)} />
              </Field>
              <Field label="Emergency Contact">
                <Input value={s5Emergency} onChange={(e) => setS5Emergency(e.target.value)} />
              </Field>
              <Field label="Home Address">
                <Input value={s5Address} onChange={(e) => setS5Address(e.target.value)} />
              </Field>
              <Field label="Allergies / Health">
                <Input value={s5Allergies} onChange={(e) => setS5Allergies(e.target.value)} />
              </Field>
              <Field label="Interests / Talents">
                <Input value={s5Interests} onChange={(e) => setS5Interests(e.target.value)} />
              </Field>
              <Field label="Residence / Compound">
                <Select value={s5Compound} onChange={(e) => setS5Compound(e.target.value)}>
                  <option>Day Student</option><option>Boarding House</option><option>Residential Compound</option>
                </Select>
              </Field>
              <Field label="Club / Activity">
                <Input value={s5Club} onChange={(e) => setS5Club(e.target.value)} />
              </Field>
            </div>
            <Button onClick={admitStudent} className="mt-2">
              <UserPlus className="h-4 w-4" /> Admit Student
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-ink">Correct a Student's Name</h3>
            <p className="text-sm text-mist">The name you set here is what the student and their parents see.</p>
            <Field label="Find the Student">
              <Select value={s4StudentId} onChange={(e) => { setS4StudentId(e.target.value); openProfile(e.target.value); }}>
                <option value="">Select a student…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </Select>
            </Field>
            {s4Form && (
              <>
                <Field label="Corrected Full Name">
                  <Input value={s4Form.name} onChange={(e) => setS4Form({ ...s4Form, name: e.target.value })} />
                </Field>
                <Button onClick={saveProfile}>
                  <Check className="h-4 w-4" /> Save Correction
                </Button>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      id: '6',
      title: 'Student Portal Editor',
      desc: 'Edit everything the school controls on a student portal — profile, fees, promotion, messages.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <Select value={s6Class} onChange={(e) => { setS6Class(e.target.value); setS6StudentId(''); setS6Form(null); }}>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Student">
              <Select value={s6StudentId} onChange={(e) => { setS6StudentId(e.target.value); openPortalEditor(e.target.value); }}>
                <option value="">Select a student…</option>
                {students.filter((s) => s.classCategory === s6Class).map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </Select>
            </Field>
          </div>

          {s6Form && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Full Name">
                  <Input value={s6Form.name} onChange={(e) => setS6Form({ ...s6Form, name: e.target.value })} />
                </Field>
                <Field label="Class">
                  <Select value={s6Form.classCategory} onChange={(e) => setS6Form({ ...s6Form, classCategory: e.target.value })}>
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Promotion Status">
                  <Select value={s6Form.promotionStatus} onChange={(e) => setS6Form({ ...s6Form, promotionStatus: e.target.value })}>
                    <option>Promoted</option><option>Repeat</option><option>Promoted (Conditional)</option>
                  </Select>
                </Field>
                <Field label="Promoted To">
                  <Select value={s6Form.promotedTo} onChange={(e) => setS6Form({ ...s6Form, promotedTo: e.target.value })}>
                    <option value="">—</option>
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Message Title">
                  <Input value={s6Form.message?.title ?? ''} onChange={(e) => setS6Form({ ...s6Form, message: { title: e.target.value, body: s6Form.message?.body ?? '' } })} />
                </Field>
                <Field label="Message Body">
                  <Input value={s6Form.message?.body ?? ''} onChange={(e) => setS6Form({ ...s6Form, message: { title: s6Form.message?.title ?? '', body: e.target.value } })} />
                </Field>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Fees & Club Dues (GHS)</h3>
                <p className="mt-1 text-sm text-mist">These appear on the student's My Bills tab.</p>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-brand/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                        <th className="px-4 py-2.5">Fee Item</th>
                        <th className="px-4 py-2.5">Billed (GHS)</th>
                        <th className="px-4 py-2.5">Paid (GHS)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s6Form.bills.map((b: any, i: number) => (
                        <tr key={i} className="border-b border-brand/5 last:border-0">
                          <td className="px-4 py-2">
                            <Input value={b.item} onChange={(e) => {
                              const bills = [...s6Form.bills];
                              bills[i] = { ...bills[i], item: e.target.value };
                              setS6Form({ ...s6Form, bills });
                            }} />
                          </td>
                          <td className="px-4 py-2">
                            <Input type="number" value={b.billed} onChange={(e) => {
                              const bills = [...s6Form.bills];
                              bills[i] = { ...bills[i], billed: parseFloat(e.target.value) || 0 };
                              setS6Form({ ...s6Form, bills });
                            }} />
                          </td>
                          <td className="px-4 py-2">
                            <Input type="number" value={b.paid} onChange={(e) => {
                              const bills = [...s6Form.bills];
                              bills[i] = { ...bills[i], paid: parseFloat(e.target.value) || 0 };
                              setS6Form({ ...s6Form, bills });
                            }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Button onClick={savePortalEditor}>
                <Check className="h-4 w-4" /> Save Portal Changes
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '7',
      title: 'Select a Student for Records & Actions',
      desc: 'Pick a student to send portal updates, reports and timetables to their parent.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <Select value={s7Class} onChange={(e) => { setS7Class(e.target.value); setS7StudentId(''); }}>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Student">
              <Select value={s7StudentId} onChange={(e) => setS7StudentId(e.target.value)}>
                <option value="">Select a student…</option>
                {students.filter((s) => s.classCategory === s7Class).map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Update Title">
              <Input value={s7Title} onChange={(e) => setS7Title(e.target.value)} placeholder="e.g. Results Published" />
            </Field>
            <Field label="Category">
              <Select value={s7Category} onChange={(e) => setS7Category(e.target.value)}>
                <option>Notice</option><option>Academics</option><option>Events</option><option>Finance</option>
              </Select>
            </Field>
          </div>
          <Field label="Message">
            <textarea rows={3} className={inputCls} value={s7Message} onChange={(e) => setS7Message(e.target.value)} placeholder="This appears on the student's dashboard and announcements." />
          </Field>
          <Button onClick={sendIndividualUpdate}>
            <Send className="h-4 w-4" /> Send Portal Update
          </Button>
        </div>
      ),
    },
    {
      id: '8',
      title: 'Publish Class Results',
      desc: "Enter the whole class's scores in one table. Every student gets their results automatically.",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <Select value={s8Class} onChange={(e) => { setS8Class(e.target.value); setS8Grid({}); }}>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Term">
              <Select value={s8Term} onChange={(e) => setS8Term(e.target.value)}>
                {TERMS.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
          </div>
          <Button onClick={initGrid}>
            <RefreshCw className="h-4 w-4" /> Load Score Sheet
          </Button>

          {Object.keys(s8Grid).length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-brand/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                    <th className="px-4 py-2.5">Student</th>
                    {SUBJECTS.map((s) => (
                      <th key={s} className="px-4 py-2.5">{s}<span className="block text-[10px] font-normal text-mist">SBA1 · SBA2 · Project · Exam</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s8Students.map((s) => (
                    <tr key={s.id} className="border-b border-brand/5 last:border-0">
                      <td className="px-4 py-2 font-medium text-ink">{s.name}</td>
                      {SUBJECTS.map((sub) => (
                        <td key={sub} className="px-4 py-2">
                          <div className="flex min-w-[17rem] gap-1">
                            <Input type="number" aria-label="SBA 1 out of 10" title="SBA 1 /10" placeholder="S1/10" className="w-16 px-1 py-1.5 text-center" value={s8Grid[s.id]?.[sub]?.a ?? ''} onChange={(e) => setCell(s.id, sub, 'a', e.target.value)} />
                            <Input type="number" aria-label="SBA 2 out of 20" title="SBA 2 /20" placeholder="S2/20" className="w-16 px-1 py-1.5 text-center" value={s8Grid[s.id]?.[sub]?.b ?? ''} onChange={(e) => setCell(s.id, sub, 'b', e.target.value)} />
                            <Input type="number" aria-label="Project work out of 20" title="Project /20" placeholder="P/20" className="w-16 px-1 py-1.5 text-center" value={s8Grid[s.id]?.[sub]?.p ?? ''} onChange={(e) => setCell(s.id, sub, 'p', e.target.value)} />
                            <Input type="number" aria-label="Examination out of 100" title="Exam /100" placeholder="E/100" className="w-16 px-1 py-1.5 text-center" value={s8Grid[s.id]?.[sub]?.e ?? ''} onChange={(e) => setCell(s.id, sub, 'e', e.target.value)} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {Object.keys(s8Grid).length > 0 && (
            <Button onClick={publishClassResults}>
              <Check className="h-4 w-4" /> Publish Results
            </Button>
          )}
        </div>
      ),
    },
    {
      id: '9',
      title: 'Download Existing Data',
      desc: 'Download the class roster, published results and the live timetable.',
      content: (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Class">
            <Select value={s9Class} onChange={(e) => setS9Class(e.target.value)}>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Button onClick={downloadRoster}><FileSpreadsheet className="h-4 w-4" /> Roster</Button>
          <Button onClick={downloadResults}><FileSpreadsheet className="h-4 w-4" /> Results</Button>
          <Button onClick={downloadTimetable}><FileSpreadsheet className="h-4 w-4" /> Timetable</Button>
        </div>
      ),
    },
    {
      id: '10',
      title: 'All Generated Student Credentials',
      desc: 'Every roster student has a Student ID, email and Login Code. Search and download.',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
              <Input className="pl-9" placeholder="Search name, ID, email or code…" value={s10Search} onChange={(e) => setS10Search(e.target.value)} />
            </div>
            <Button variant="ghost" onClick={() => {
              const rows = [['Student ID', 'Name', 'Class', 'Email', 'Login Code']];
              s10Filtered.forEach((s) => rows.push([s.id, s.name, s.classCategory, s.email, s.loginCode]));
              downloadCSV('detlof-all-credentials.csv', rows);
              notify('All credentials downloaded.');
            }}>
              <Download className="h-4 w-4" /> Download All
            </Button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-brand/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                  <th className="px-4 py-2.5">Student ID</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Class</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Login Code</th>
                </tr>
              </thead>
              <tbody>
                {s10Filtered.map((s) => (
                  <tr key={s.id} className="border-b border-brand/5 last:border-0 hover:bg-brand-soft/30">
                    <td className="px-4 py-2.5 font-mono text-ink">{s.id}</td>
                    <td className="px-4 py-2.5 text-ink">{s.name}</td>
                    <td className="px-4 py-2.5 text-ink">{s.classCategory}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-ink">{s.email}</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-brand">{s.loginCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: '11',
      title: 'Class Timetable Management',
      desc: 'Upload a CSV timetable for an entire class. It applies to all students in that class.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <Select value={s11Class} onChange={(e) => setS11Class(e.target.value)}>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="CSV Format: day,time,subject,teacher,venue" hint="One row per slot. Example: Monday,8:00 – 9:00,Mathematics,Mr. K. Osei,Room 12">
            <textarea rows={5} className={inputCls} placeholder="Monday,8:00 – 9:00,Mathematics,Mr. K. Osei,Room 12&#10;Monday,9:00 – 10:00,English Language,Mrs. A. Mensah,Room 8&#10;..." value={s11CSV} onChange={(e) => setS11CSV(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button onClick={parseTimetableCSV}><Eye className="h-4 w-4" /> Preview</Button>
            <Button onClick={applyTimetable}><Check className="h-4 w-4" /> Apply Timetable</Button>
          </div>
          {s11Preview.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-brand/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                    <th className="px-4 py-2.5">Day</th>
                    <th className="px-4 py-2.5">Time</th>
                    <th className="px-4 py-2.5">Subject</th>
                    <th className="px-4 py-2.5">Teacher</th>
                    <th className="px-4 py-2.5">Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {s11Preview.map((r, i) => (
                    <tr key={i} className="border-b border-brand/5 last:border-0">
                      {r.map((c, j) => (
                        <td key={j} className="px-4 py-2.5 text-ink">{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '12',
      title: 'Preview & Send',
      desc: 'Review what a student sees on their portal and send reports or timetables to their parent.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <Select value={s12Class} onChange={(e) => { setS12Class(e.target.value); setS12StudentId(''); }}>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Student">
              <Select value={s12StudentId} onChange={(e) => setS12StudentId(e.target.value)}>
                <option value="">Select a student…</option>
                {students.filter((s) => s.classCategory === s12Class).map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </Select>
            </Field>
          </div>

          {s12Student && (
            <div className="rounded-2xl border border-brand/10 bg-brand-soft/40 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-mist">Portal Preview</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-mist">Student</p>
                  <p className="font-display text-sm font-semibold text-ink">{s12Student.name}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-mist">Class</p>
                  <p className="font-display text-sm font-semibold text-ink">{s12Student.classCategory}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-mist">Standing</p>
                  <p className="font-display text-sm font-semibold text-ink">{s12Student.promotionStatus}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={waReport}><Phone className="h-4 w-4" /> Send Report via WhatsApp</Button>
                <Button onClick={waTimetable}><CalendarDays className="h-4 w-4" /> Send Timetable via WhatsApp</Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '13',
      title: 'Broadcast Announcement to All Student Portals',
      desc: 'Compose an announcement that appears in every student portal.',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={s13Title} onChange={(e) => setS13Title(e.target.value)} placeholder="e.g. School Closed Friday" />
            </Field>
            <Field label="Category">
              <Select value={s13Category} onChange={(e) => setS13Category(e.target.value)}>
                <option>Notice</option><option>Academics</option><option>Events</option><option>Finance</option>
              </Select>
            </Field>
          </div>
          <Field label="Message">
            <textarea rows={3} className={inputCls} value={s13Message} onChange={(e) => setS13Message(e.target.value)} placeholder="This appears on every student's portal." />
          </Field>
          <Button onClick={broadcast}>
            <Megaphone className="h-4 w-4" /> Broadcast to All Portals
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-brand/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <Crest className="h-8 w-8" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-semibold leading-tight text-brand">
                Detlof Preparatory
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Academic Administration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={resetAll}>
              <RefreshCw className="h-3.5 w-3.5" /> Reset Data
            </Button>
            <Button variant="secondary" onClick={() => go('landing')}>
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-3 px-5 py-8">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
            >
              <div className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-xl">
                <CheckCircle2 className="h-4 w-4 text-gold" /> {toast}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Academic Administration</h1>
          <p className="mt-1 text-sm text-mist">
            Click any section to expand it and perform that action.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <AccordionSection
            key={section.id}
            index={section.id}
            title={section.title}
            desc={section.desc}
            isOpen={openSection === section.id}
            onToggle={() => toggle(section.id)}
          >
            {section.content}
          </AccordionSection>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-brand/10 bg-paper py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 text-center">
          <Crest className="h-8 w-8" />
          <p className="text-xs text-mist">© 2026 Detlof Preparatory School · Wisdom · Balance</p>
        </div>
      </footer>
    </div>
  );
}

export default function Admin({ go }: { go: (r: 'landing') => void }) {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <AdminGate onSuccess={() => setUnlocked(true)} go={go} />;
  return <AdminApp go={go} />;
}
