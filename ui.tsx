import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { gradeFor } from '../utils/grades';

/* ---------------- Badge ---------------- */

const TONES: Record<string, string> = {
  excellent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'very-good': 'bg-green-100 text-green-800 border-green-200',
  good: 'bg-lime-100 text-lime-800 border-lime-200',
  credit: 'bg-sky-100 text-sky-800 border-sky-200',
  pass: 'bg-amber-100 text-amber-800 border-amber-200',
  below: 'bg-orange-100 text-orange-800 border-orange-200',
  fail: 'bg-red-100 text-red-800 border-red-200',
  neutral: 'bg-brand-soft text-brand border-brand/20',
  gold: 'bg-yellow/20 text-brand border-gold/40',
};

export function Badge({ tone = 'neutral', children }: { tone?: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONES[tone] ?? TONES.neutral}`}
    >
      {children}
    </span>
  );
}

/* ---------------- Card ---------------- */

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-brand/10 bg-paper card-shadow ${className}`}>
      {children}
    </div>
  );
}

/* ---------------- Stat ---------------- */

const STAT_TONES: Record<string, string> = {
  forest: 'bg-brand text-white',
  gold: 'bg-gold text-ink',
  cream: 'bg-brand-soft text-brand',
};

export function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'forest',
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: 'forest' | 'gold' | 'cream';
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${STAT_TONES[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">{label}</p>
          <p className="truncate font-display text-2xl font-semibold text-ink">{value}</p>
        </div>
      </div>
      {sub && <p className="mt-3 text-xs text-mist">{sub}</p>}
    </Card>
  );
}

/* ---------------- Field / inputs ---------------- */

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-mist">{hint}</span>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-xl border border-brand/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-mist/70 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputCls} ${className}`}>
      {children}
    </select>
  );
}

/* ---------------- Button ---------------- */

const BUTTON_VARIANTS: Record<string, string> = {
  primary: 'bg-brand text-white hover:bg-brand-mid',
  secondary: 'bg-accent text-white hover:bg-accent/90',
  ghost: 'border border-brand/20 text-brand hover:bg-brand-soft',
  danger: 'bg-accent text-white hover:bg-accent/90',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${className}`}
    />
  );
}

/* ---------------- Empty state ---------------- */

export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand/20 bg-brand-soft/40 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
        <Icon className="h-6 w-6 text-mist" />
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-mist">{body}</p>}
    </div>
  );
}

/* ---------------- CountUp ---------------- */

export function CountUp({
  value,
  decimals = 0,
  suffix = '',
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------------- Grade pill ---------------- */

export function GradePill({ total }: { total: number }) {
  const info = gradeFor(total);
  return <Badge tone={info.tone}>{info.grade}</Badge>;
}

/* ---------------- Section heading (admin) ---------------- */

export function SectionHeading({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-display text-sm font-semibold text-white">
          {index}
        </span>
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      </div>
      <p className="mt-1.5 text-sm text-mist">{desc}</p>
    </div>
  );
}

/* ---------------- Fade-in wrapper ---------------- */

export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
