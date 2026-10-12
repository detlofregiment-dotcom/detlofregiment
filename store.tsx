import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  Student,
  ResultRow,
  TimetableEntry,
  BillItem,
  Announcement,
  seedStudents,
  seedResults,
  seedTimetable,
  seedBills,
  seedAnnouncements,
} from './data/school';

const STORAGE_KEY = 'detlof-portal-v1';

interface Persisted {
  students: Student[];
  results: ResultRow[];
  timetable: TimetableEntry[];
  bills: BillItem[];
  announcements: Announcement[];
}

interface NewStudentInput {
  name: string;
  classCategory: string;
  academicYear: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentWhatsApp: string;
  parentEmail: string;
  emergencyContact: string;
  homeAddress: string;
  allergies: string;
  interests: string;
  compound: string;
  club: string;
}

interface SchoolStore extends Persisted {
  addStudent: (data: NewStudentInput) => Student;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  publishResults: (
    cls: string,
    term: string,
    rows: { studentId: string; subject: string; sba1: number; sba2: number; projectWork: number; examination: number }[],
  ) => void;
  setBills: (studentId: string, items: { item: string; billed: number; paid: number }[]) => void;
  addAnnouncement: (a: { title: string; category: string; message: string; audience: string }) => void;
  setTimetable: (cls: string, entries: { day: string; time: string; subject: string; teacher: string; venue: string }[]) => void;
  setPromotion: (studentId: string, status: string, promotedTo: string) => void;
  setMessage: (studentId: string, message: { title: string; body: string } | null) => void;
  resetAll: () => void;
}

const SchoolContext = createContext<SchoolStore | null>(null);

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.students && parsed.results) return parsed as Persisted;
    }
  } catch {
    /* ignore */
  }
  return {
    students: seedStudents,
    results: seedResults,
    timetable: seedTimetable,
    bills: seedBills,
    announcements: seedAnnouncements,
  };
}

function nextStudentId(students: Student[], cls: string, year: string): string {
  const yy = year.slice(2, 4);
  const existing = students
    .filter((s) => s.classCategory === cls)
    .map((s) => {
      const m = s.id.match(/DPS-\d+-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    });
  const seq = Math.max(0, ...existing) + 1;
  return `DPS-${yy}-${String(seq).padStart(4, '0')}`;
}

function makeLoginCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function makeEmail(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] || 'student';
  const last = parts[parts.length - 1] || 'detlof';
  return `${first.toLowerCase()}.${last.toLowerCase()}@detlof.edu.gh`;
}

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const addStudent = useCallback(
    (data: NewStudentInput): Student => {
      const id = nextStudentId(state.students, data.classCategory, data.academicYear);
      const student: Student = {
        id,
        name: data.name,
        classCategory: data.classCategory,
        academicYear: data.academicYear,
        gender: data.gender,
        dob: data.dob,
        bloodGroup: data.bloodGroup,
        email: makeEmail(data.name),
        loginCode: makeLoginCode(),
        photo: '',
        parentName: data.parentName,
        parentRelation: data.parentRelation,
        parentPhone: data.parentPhone,
        parentWhatsApp: data.parentWhatsApp,
        parentEmail: data.parentEmail,
        emergencyContact: data.emergencyContact,
        homeAddress: data.homeAddress,
        allergies: data.allergies,
        interests: data.interests,
        notes: '',
        compound: data.compound,
        club: data.club,
        promotionStatus: 'Promoted',
        promotedTo: '',
        message: null,
        createdAt: Date.now(),
      };
      setState((prev) => ({ ...prev, students: [...prev.students, student] }));
      return student;
    },
    [state.students],
  );

  const updateStudent = useCallback((id: string, patch: Partial<Student>) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }, []);

  const publishResults = useCallback(
    (
      cls: string,
      term: string,
      rows: { studentId: string; subject: string; sba1: number; sba2: number; projectWork: number; examination: number }[],
    ) => {
      setState((prev) => {
        const classStudents = prev.students.filter((s) => s.classCategory === cls).map((s) => s.id);
        const kept = prev.results.filter(
          (r) => !(classStudents.includes(r.studentId) && r.term === term),
        );
        const fresh: ResultRow[] = rows.map((r) => ({
          studentId: r.studentId,
          subject: r.subject,
          sba1: r.sba1,
          sba2: r.sba2,
          projectWork: r.projectWork,
          examination: r.examination,
          term,
          academicYear: '2025/2026',
        }));
        return { ...prev, results: [...kept, ...fresh] };
      });
    },
    [],
  );

  const setBills = useCallback(
    (studentId: string, items: { item: string; billed: number; paid: number }[]) => {
      setState((prev) => ({
        ...prev,
        bills: [...prev.bills.filter((b) => b.studentId !== studentId), ...items.map((i) => ({ ...i, studentId }))],
      }));
    },
    [],
  );

  const addAnnouncement = useCallback(
    (a: { title: string; category: string; message: string; audience: string }) => {
      setState((prev) => ({
        ...prev,
        announcements: [
          {
            id: `a${Date.now()}`,
            title: a.title,
            category: a.category,
            message: a.message,
            date: new Date().toISOString().slice(0, 10),
            audience: a.audience,
          },
          ...prev.announcements,
        ],
      }));
    },
    [],
  );

  const setTimetable = useCallback(
    (cls: string, entries: { day: string; time: string; subject: string; teacher: string; venue: string }[]) => {
      setState((prev) => ({
        ...prev,
        timetable: [
          ...prev.timetable.filter((t) => t.classCategory !== cls),
          ...entries.map((e) => ({ ...e, classCategory: cls })),
        ],
      }));
    },
    [],
  );

  const setPromotion = useCallback((studentId: string, status: string, promotedTo: string) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, promotionStatus: status, promotedTo } : s,
      ),
    }));
  }, []);

  const setMessage = useCallback((studentId: string, message: { title: string; body: string } | null) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, message } : s)),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState({
      students: seedStudents,
      results: seedResults,
      timetable: seedTimetable,
      bills: seedBills,
      announcements: seedAnnouncements,
    });
  }, []);

  const value = useMemo<SchoolStore>(
    () => ({
      ...state,
      addStudent,
      updateStudent,
      publishResults,
      setBills,
      addAnnouncement,
      setTimetable,
      setPromotion,
      setMessage,
      resetAll,
    }),
    [state, addStudent, updateStudent, publishResults, setBills, addAnnouncement, setTimetable, setPromotion, setMessage, resetAll],
  );

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export function useSchool(): SchoolStore {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used within SchoolProvider');
  return ctx;
}
