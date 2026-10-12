import { motion } from 'framer-motion';
import {
  GraduationCap,
  CalendarDays,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  LogIn,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Crest } from '../components/Crest';
import { FadeIn } from '../components/ui';

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Academic Results',
    body: 'Termly scores, grades and cumulative GPA — published the moment results are approved.',
  },
  {
    icon: CalendarDays,
    title: 'Class Timetable',
    body: 'Your weekly schedule, teachers and venues — always up to date for every class.',
  },
  {
    icon: Megaphone,
    title: 'School Notices',
    body: 'Announcements, events and fee reminders delivered straight to your portal.',
  },
];

const STEPS = [
  { n: '01', title: 'Sign In', body: 'Use your Student ID and Login Code to enter the portal.' },
  { n: '02', title: 'Explore', body: 'View results, timetable, bills, notices and your profile.' },
  { n: '03', title: 'Stay Updated', body: 'Parents receive reports and timetables via WhatsApp.' },
];

export default function Landing({ go }: { go: (r: 'portal' | 'admin') => void }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-brand/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Crest className="h-9 w-9" />
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-brand">
                Detlof Preparatory
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Wisdom · Balance
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => go('portal')}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-mid"
            >
              <LogIn className="h-4 w-4" /> Student Portal
            </button>
            <button
              onClick={() => go('admin')}
              className="inline-flex items-center gap-2 rounded-xl border border-brand/20 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft"
            >
              <Lock className="h-4 w-4" /> Admin Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand">
        <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-floaty">
              <Crest className="h-28 w-28 drop-shadow-[0_10px_30px_rgba(255,201,0,0.4)] sm:h-32 sm:w-32" />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold"
          >
            Est. 1998 · Accra, Ghana
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-3 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl"
          >
            Detlof Preparatory
            <br />
            <span className="text-gold-grad">School</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-4 font-display text-lg italic text-gold"
          >
            Wisdom · Balance
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
          >
            Student Information Portal — academic results, class timetable, and school notices.
            One secure sign-in for every student, from Creche to JHS 3.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              onClick={() => go('portal')}
              className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-ink shadow-[0_12px_30px_-10px_rgba(255,201,0,0.8)] transition-all hover:bg-yellow hover:shadow-[0_16px_40px_-10px_rgba(255,201,0,0.9)] active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              Sign In to Student Portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => go('admin')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              <Lock className="h-4 w-4" /> Admin Login
            </button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-3"
          >
            {[
              ['Creche – JHS 3', 'Full school coverage'],
              ['100% Digital', 'Results & reports'],
              ['Real-time', 'Timetables & notices'],
            ].map(([big, small]) => (
              <div
                key={big}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
              >
                <p className="font-display text-sm font-semibold text-white sm:text-base">{big}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">{small}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Everything in one place
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              The Student Experience
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-mist">
              Results, timetables and notices — published by the school and visible on your portal
              the moment they are approved.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="lift group h-full rounded-2xl border border-brand/10 bg-paper p-6 card-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-gold transition-transform group-hover:scale-110">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-brand/10 bg-brand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Simple by design
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
              How It Works
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="font-display text-4xl font-semibold text-gold/40">{s.n}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <FadeIn>
            <Sparkles className="mx-auto h-8 w-8 text-accent" />
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Ready to see your results?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist">
              Sign in with your Student ID and Login Code. Your results, timetable, bills and
              notices are waiting.
            </p>
            <button
              onClick={() => go('portal')}
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-mid active:scale-[0.98]"
            >
              <ShieldCheck className="h-4 w-4 text-gold" />
              Open Student Portal
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand/10 bg-paper py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center">
          <Crest className="h-10 w-10" />
          <p className="font-display text-lg font-semibold text-brand">
            Detlof Preparatory School
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Wisdom · Balance</p>
          <p className="text-sm text-mist">© 2026 Detlof Preparatory School</p>
          <button
            onClick={() => go('admin')}
            className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            Admin Login
          </button>
        </div>
      </footer>
    </div>
  );
}
