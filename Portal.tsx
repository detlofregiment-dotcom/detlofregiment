import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  CalendarDays,
  Megaphone,
  CreditCard,
  UserRound,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Award,
  MessageSquareText,
  Phone,
  Sparkles,
  AlertCircle,
  CalendarClock,
  ChevronRight,
} from 'lucide-react';
import { useSchool } from '../store';
import { Crest } from '../components/Crest';
import {
  Badge,
  Button,
  Card,
  CountUp,
  EmptyState,
  GradePill,
  Stat,
  inputCls,
} from '../components/ui';
import { gradeFor, average, gpaFromGrades, GRADE_SCALE } from '../utils/grades';
import { DAYS } from '../data/school';
import { downloadResultsPDF, downloadTimetablePDF, downloadBillsPDF } from '../utils/pdf';
import { Download } from 'lucide-react';

/* ============================== LOGIN ============================== */

function LoginScreen({
  onSuccess,
  go,
}: {
  onSuccess: (id: string) => void;
  go: (r: 'landing') => void;
}) {
  const { students } = useSchool();
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const demo = students.find((s) => s.name === 'Ama Serwaa Mensah');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const s = students.find(
      (x) => x.id.toLowerCase() === studentId.trim().toLowerCase(),
    );
    if (!s) {
      setError('No student found with that ID.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (s.loginCode !== pin.trim()) {
      setError('Incorrect login code. Check your PIN and try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSuccess(s.id);
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
            Student Portal
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
            Detlof Preparatory School
          </h1>
          <p className="mt-2 text-sm text-mist">
            Sign in with your Student ID and Login Code.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">
              Student ID
            </label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. DPS-24-0187"
              className={inputCls}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">
              Login Code (PIN)
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="4-digit code"
              className={inputCls}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-accent-soft px-3.5 py-2.5 text-sm font-medium text-accent">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <Button type="submit" className="w-full py-3">
            Sign In to Portal
          </Button>
        </form>

        {import.meta.env.DEV && demo && (
          <div className="mt-6 rounded-2xl border border-gold/40 bg-yellow/10 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Demo Account
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">{demo.name}</p>
            <p className="text-xs text-mist">
              ID: <span className="font-mono font-semibold">{demo.id}</span> · PIN:{' '}
              <span className="font-mono font-semibold">{demo.loginCode}</span>
            </p>
            <button
              onClick={() => {
                setStudentId(demo.id);
                setPin(demo.loginCode);
                setError('');
              }}
              className="mt-3 w-full rounded-xl border border-gold/40 bg-white/60 px-3 py-2 text-xs font-bold text-brand transition hover:bg-white"
            >
              Use Demo Account
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function Dashboard({ student, onNavigate }: { student: any; onNavigate: (t: string) => void }) {
  const { results, timetable, announcements } = useSchool();
  const myResults = results.filter((r) => r.studentId === student.id);
  const terms = [...new Set(myResults.map((r) => r.term))];
  const latestTerm = terms[terms.length - 1] ?? 'Term 2';
  const latest = myResults.filter((r) => r.term === latestTerm);
  const avg = latest.length ? average(latest.map((r) => r.sba1 + r.sba2 + r.projectWork + r.examination / 2)) : 0;

  const myTimetable = timetable.filter((t) => t.classCategory === student.classCategory);
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ?? 'Monday';
  const todayEntries = myTimetable.filter((t) => t.day === today);
  const nextLesson = todayEntries[0];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-brand p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Welcome back
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
              {student.name}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              {student.classCategory} · ID: <span className="font-mono">{student.id}</span>
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Crest className="h-9 w-9" />
          </div>
        </div>

        {student.message && (
          <div className="relative mt-5 rounded-2xl border border-gold/40 bg-gold/10 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
              <MessageSquareText className="h-3.5 w-3.5" /> Personal Notice
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-white">
              {student.message.title}
            </p>
            <p className="mt-1 text-sm text-white/70">{student.message.body}</p>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Stat icon={GraduationCap} label="Assigned Class" value={student.classCategory} sub={`ID: ${student.id}`} tone="forest" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Stat icon={TrendingUp} label="Overall Average" value={<CountUp value={avg} decimals={0} suffix="%" />} sub={`${latestTerm} · ${latest.length} Subjects`} tone="gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Stat icon={CalendarClock} label="Next Lesson" value={nextLesson ? nextLesson.subject : '—'} sub={nextLesson ? `${today} · ${nextLesson.time}` : 'No lessons today'} tone="cream" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Stat icon={Award} label="Standing" value={student.promotionStatus} sub={student.promotedTo ? `Promoted to ${student.promotedTo}` : 'Current term'} tone="forest" />
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'View Results', icon: GraduationCap, tab: 'results' },
          { label: 'My Timetable', icon: CalendarDays, tab: 'timetable' },
          { label: 'My Bills', icon: CreditCard, tab: 'bills' },
        ].map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => onNavigate(a.tab)}
            className="group flex items-center justify-between rounded-2xl border border-brand/10 bg-paper p-5 text-left card-shadow transition hover:bg-brand-soft/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-gold">
                <a.icon className="h-5 w-5" />
              </div>
              <span className="font-display text-base font-semibold text-ink">{a.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-mist transition group-hover:translate-x-1 group-hover:text-brand" />
          </motion.button>
        ))}
      </div>

      {/* Latest notices */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Latest Notices</h2>
            <button onClick={() => onNavigate('announcements')} className="text-xs font-bold text-accent hover:underline">
              View all →
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {announcements.slice(0, 4).map((a) => (
              <div key={a.id} className="rounded-xl border border-brand/10 bg-brand-soft/40 p-4">
                <div className="flex items-center gap-2">
                  <Badge tone="gold">{a.category}</Badge>
                  <span className="text-xs text-mist">{a.date}</span>
                </div>
                <p className="mt-2 font-display text-base font-semibold text-ink">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-mist">{a.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/* ============================== RESULTS ============================== */

function Results({ student }: { student: any }) {
  const { results } = useSchool();
  const myResults = results.filter((r) => r.studentId === student.id);
  const terms = [...new Set(myResults.map((r) => r.term))];
  const [term, setTerm] = useState(terms[terms.length - 1] ?? 'Term 2');

  const rows = myResults.filter((r) => r.term === term);
  const totals = rows.map((r) => r.sba1 + r.sba2 + r.projectWork + r.examination / 2);
  const avg = totals.length ? average(totals) : 0;
  const gpa = totals.length ? gpaFromGrades(totals.map((t) => gradeFor(t).gpa)) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Academic Results</h2>
              <p className="mt-1 text-sm text-mist">Published scores, grades and cumulative GPA.</p>
            </div>
            <div className="flex items-center gap-2">
              {terms.map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    term === t ? 'bg-brand text-white' : 'border border-brand/20 text-brand hover:bg-brand-soft'
                  }`}
                >
                  {t}
                </button>
              ))}
              <Button variant="ghost" onClick={() => downloadResultsPDF(student, myResults)}>
                <Download className="h-4 w-4" /> PDF
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {rows.length === 0 ? (
        <EmptyState icon={BookOpen} title="No results published" body={`No results for ${term} yet.`} />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-mist">Average</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  <CountUp value={avg} decimals={1} suffix="%" />
                </p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-mist">GPA</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  <CountUp value={gpa} decimals={2} />
                </p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-mist">Subjects</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">{rows.length}</p>
              </Card>
            </motion.div>
          </div>

          {/* Results table */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                    <th className="px-5 py-3">Subject</th>
                    <th className="px-5 py-3">SBA 1 /10</th>
                    <th className="px-5 py-3">SBA 2 /20</th>
                    <th className="px-5 py-3">Project /20</th>
                    <th className="px-5 py-3">Exam /100</th>
                    <th className="px-5 py-3">Total /100</th>
                    <th className="px-5 py-3">Grade</th>
                    <th className="px-5 py-3">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const total = r.sba1 + r.sba2 + r.projectWork + r.examination / 2;
                    const info = gradeFor(total);
                    return (
                      <tr key={r.subject} className="border-b border-brand/5 last:border-0 hover:bg-brand-soft/30">
                        <td className="px-5 py-3 font-medium text-ink">{r.subject}</td>
                        <td className="px-5 py-3 font-mono text-ink">{r.sba1}/10</td>
                        <td className="px-5 py-3 font-mono text-ink">{r.sba2}/20</td>
                        <td className="px-5 py-3 font-mono text-ink">{r.projectWork}/20</td>
                        <td className="px-5 py-3 font-mono text-ink">{r.examination}/100</td>
                        <td className="px-5 py-3 font-mono font-semibold text-ink">{total}</td>
                        <td className="px-5 py-3"><GradePill total={total} /></td>
                        <td className="px-5 py-3 text-ink">{info.remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </motion.div>

          {/* Grading scale */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold text-ink">Grading Scale</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {GRADE_SCALE.map((g) => (
                  <div key={g.grade} className="rounded-xl border border-brand/10 bg-brand-soft/40 p-3 text-center">
                    <p className="font-display text-lg font-semibold text-ink">{g.grade}</p>
                    <p className="text-xs text-mist">{g.gpa.toFixed(1)} · {g.remark}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ============================== TIMETABLE ============================== */

function Timetable({ student }: { student: any }) {
  const { timetable } = useSchool();
  const entries = timetable.filter((t) => t.classCategory === student.classCategory);
  const [day, setDay] = useState<string>(DAYS[0]);
  const dayEntries = entries.filter((t) => t.day === day);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Class Timetable</h2>
              <p className="mt-1 text-sm text-mist">{student.classCategory} · Weekly schedule, teachers and venues.</p>
            </div>
            <Button variant="ghost" onClick={() => downloadTimetablePDF(student, entries)}>
              <Download className="h-4 w-4" /> PDF
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  day === d ? 'bg-brand text-white' : 'border border-brand/20 text-brand hover:bg-brand-soft'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {dayEntries.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No lessons this day" body="There are no scheduled lessons for this day." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dayEntries.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="lift p-5">
                <div className="flex items-center justify-between">
                  <Badge tone="gold">{t.time}</Badge>
                  <span className="text-xs text-mist">{t.venue}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{t.subject}</h3>
                <p className="mt-1 text-sm text-mist">{t.teacher}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                <th className="px-5 py-3">Day</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Teacher</th>
                <th className="px-5 py-3">Venue</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((t, i) => (
                <tr key={i} className="border-b border-brand/5 last:border-0 hover:bg-brand-soft/30">
                  <td className="px-5 py-3 font-medium text-ink">{t.day}</td>
                  <td className="px-5 py-3 font-mono text-ink">{t.time}</td>
                  <td className="px-5 py-3 text-ink">{t.subject}</td>
                  <td className="px-5 py-3 text-ink">{t.teacher}</td>
                  <td className="px-5 py-3 text-ink">{t.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>
    </div>
  );
}

/* ============================== BILLS ============================== */

function Bills({ student }: { student: any }) {
  const { bills } = useSchool();
  const items = bills.filter((b) => b.studentId === student.id);
  const totalBilled = items.reduce((a, b) => a + b.billed, 0);
  const totalPaid = items.reduce((a, b) => a + b.paid, 0);
  const balance = totalBilled - totalPaid;

  const waMessage = `Hello, this is ${student.name} (${student.id}) from Detlof Preparatory School. I would like to confirm payment of GHS ${balance.toFixed(2)} outstanding school fees. Thank you.`;
  const waLink = `https://wa.me/${student.parentWhatsApp.replace(/\s/g, '')}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">My Bills</h2>
              <p className="mt-1 text-sm text-mist">Fee statement for {student.name} · All amounts in Ghana Cedi (GHS).</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => downloadBillsPDF(student, items)}>
                <Download className="h-4 w-4" /> PDF
              </Button>
              <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-mid">
                <Phone className="h-4 w-4 text-gold" /> Pay via WhatsApp
              </a>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-mist">Total Billed</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">GHS {totalBilled.toFixed(2)}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-mist">Total Paid</p>
            <p className="mt-1 font-display text-2xl font-semibold text-emerald-700">GHS {totalPaid.toFixed(2)}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-mist">Balance Due</p>
            <p className={`mt-1 font-display text-2xl font-semibold ${balance > 0 ? 'text-accent' : 'text-emerald-700'}`}>
              GHS {balance.toFixed(2)}
            </p>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand/10 bg-brand-soft/40 text-left text-xs uppercase tracking-wider text-mist">
                <th className="px-5 py-3">Fee Item</th>
                <th className="px-5 py-3">Billed</th>
                <th className="px-5 py-3">Paid</th>
                <th className="px-5 py-3">Balance</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b, i) => {
                const bal = b.billed - b.paid;
                return (
                  <tr key={i} className="border-b border-brand/5 last:border-0 hover:bg-brand-soft/30">
                    <td className="px-5 py-3 font-medium text-ink">{b.item}</td>
                    <td className="px-5 py-3 font-mono text-ink">GHS {b.billed.toFixed(2)}</td>
                    <td className="px-5 py-3 font-mono text-emerald-700">GHS {b.paid.toFixed(2)}</td>
                    <td className="px-5 py-3 font-mono text-ink">GHS {bal.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={bal > 0 ? 'below' : 'excellent'}>
                        {bal > 0 ? 'Outstanding' : 'Settled'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="rounded-2xl border border-gold/40 bg-yellow/10 p-5 text-sm text-ink">
          <p className="font-semibold">How to pay</p>
          <p className="mt-1 text-mist">
            Send the receipt to the number the school office has on file — it opens your
            phone's SMS or WhatsApp with the message already written.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================== ANNOUNCEMENTS ============================== */

function Announcements({ student }: { student: any }) {
  const { announcements } = useSchool();
  const mine = announcements.filter((a) => a.audience === 'all' || a.audience === student.id);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-ink">School Notices</h2>
          <p className="mt-1 text-sm text-mist">Announcements from the school office.</p>
        </Card>
      </motion.div>

      {mine.length === 0 ? (
        <EmptyState icon={Megaphone} title="No notices yet" body="Announcements will appear here when published." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="lift p-5">
                <div className="flex items-center gap-2">
                  <Badge tone="gold">{a.category}</Badge>
                  <span className="text-xs text-mist">{a.date}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{a.message}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== PROFILE ============================== */

function Profile({ student }: { student: any }) {
  const detail = (label: string, value: string) => (
    <div className="rounded-xl border border-brand/10 bg-brand-soft/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value || '—'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-gold">
              {student.photo ? (
                <img src={student.photo} alt={student.name} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <Crest className="h-12 w-12" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-display text-2xl font-semibold text-ink">{student.name}</h2>
              <p className="mt-1 text-sm text-mist">{student.classCategory} · {student.academicYear}</p>
              <p className="mt-1 font-mono text-xs text-mist">{student.email}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold text-ink">Student Details</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {detail('Student ID', student.id)}
              {detail('Assigned Class', student.classCategory)}
              {detail('Date of Birth', student.dob)}
              {detail('Gender', student.gender)}
              {detail('Blood Group', student.bloodGroup)}
              {detail('Compound', student.compound)}
              {detail('Club / Activity', student.club)}
              {detail('Interests', student.interests)}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold text-ink">Parent / Guardian</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {detail('Name', student.parentName)}
              {detail('Relationship', student.parentRelation)}
              {detail('Phone', student.parentPhone)}
              {detail('WhatsApp', student.parentWhatsApp)}
              {detail('Email', student.parentEmail)}
              {detail('Emergency Contact', student.emergencyContact)}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-ink">Additional Info</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {detail('Home Address', student.homeAddress)}
            {detail('Allergies / Health', student.allergies)}
            {detail('Notes', student.notes)}
            {detail('Promotion Status', student.promotionStatus)}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/* ============================== PORTAL APP ============================== */

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'results', label: 'Results', icon: GraduationCap },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
  { id: 'bills', label: 'My Bills', icon: CreditCard },
  { id: 'announcements', label: 'Notices', icon: Megaphone },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

function PortalApp({ studentId, go }: { studentId: string; go: (r: 'landing') => void }) {
  const { students } = useSchool();
  const student = students.find((s) => s.id === studentId);
  const [tab, setTab] = useState('dashboard');

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Card className="p-8 text-center">
          <p className="font-display text-xl font-semibold text-ink">Student not found</p>
          <Button className="mt-4" onClick={() => go('landing')}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-brand/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <Crest className="h-8 w-8" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-semibold leading-tight text-brand">Detlof Preparatory</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{student.name}</p>
              <p className="text-xs text-mist">{student.classCategory} · {student.id}</p>
            </div>
            <button onClick={() => go('landing')} className="inline-flex items-center gap-2 rounded-xl border border-brand/20 px-3 py-2 text-xs font-semibold text-brand transition hover:bg-brand-soft">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="sticky top-[57px] z-30 border-b border-brand/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? 'bg-brand text-white' : 'text-brand hover:bg-brand-soft'
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === 'dashboard' && <Dashboard student={student} onNavigate={setTab} />}
            {tab === 'results' && <Results student={student} />}
            {tab === 'timetable' && <Timetable student={student} />}
            {tab === 'bills' && <Bills student={student} />}
            {tab === 'announcements' && <Announcements student={student} />}
            {tab === 'profile' && <Profile student={student} />}
          </motion.div>
        </AnimatePresence>
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

export default function Portal({ go }: { go: (r: 'landing') => void }) {
  const [authedId, setAuthedId] = useState<string | null>(null);
  if (!authedId) return <LoginScreen onSuccess={setAuthedId} go={go} />;
  return <PortalApp studentId={authedId} go={go} />;
}
