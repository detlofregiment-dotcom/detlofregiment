export const CLASSES = [
  'Creche', 'Nursery', 'KG 1', 'KG 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  'JHS 1', 'JHS 2', 'JHS 3',
] as const;

export type ClassCategory = (typeof CLASSES)[number];

export const CLASS_PREFIX: Record<string, string> = {
  Creche: 'CR', Nursery: 'NR', 'KG 1': 'KG1', 'KG 2': 'KG2',
  'Primary 1': 'P1', 'Primary 2': 'P2', 'Primary 3': 'P3',
  'Primary 4': 'P4', 'Primary 5': 'P5', 'Primary 6': 'P6',
  'JHS 1': 'J1', 'JHS 2': 'J2', 'JHS 3': 'J3',
};

// NaCCA Common Core Programme learning areas for JHS; confirm the school's approved language options.
export const SUBJECTS = [
  'English Language', 'Mathematics', 'Science', 'Social Studies',
  'French Language', 'Ghanaian Language', 'Arabic', 'Physical Education and Health',
  'Religious and Moral Education', 'Creative Arts and Design', 'Career Technology', 'Computing',
] as const;

export const TERMS = ['Term 1', 'Term 2', 'Term 3'] as const;
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export interface Student {
  id: string;
  name: string;
  classCategory: string;
  academicYear: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  email: string;
  loginCode: string;
  photo: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentWhatsApp: string;
  parentEmail: string;
  emergencyContact: string;
  homeAddress: string;
  allergies: string;
  interests: string;
  notes: string;
  compound: string;
  club: string;
  promotionStatus: string;
  promotedTo: string;
  message: { title: string; body: string } | null;
  createdAt: number;
}

export interface ResultRow {
  studentId: string;
  subject: string;
  sba1: number; // /10
  sba2: number; // /20
  projectWork: number; // /20
  examination: number; // /100
  term: string;
  academicYear: string;
}

export interface TimetableEntry {
  classCategory: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  venue: string;
}

export interface BillItem {
  studentId: string;
  item: string;
  billed: number;
  paid: number;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  message: string;
  date: string;
  audience: string; // 'all' or student id
}

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const JHS2_ROSTER: [string, string][] = [
  ['Ama Serwaa Mensah', 'Female'],
  ['Kwame Osei Boateng', 'Male'],
  ['Efua Adwoa Boateng', 'Female'],
  ['Kofi Adu Darko', 'Male'],
  ['Abena Ama Kyei', 'Female'],
  ['Yaw Boakye Mensah', 'Male'],
  ['Akosua Pokua Owusu', 'Female'],
  ['Kwabena Acheampong', 'Male'],
  ['Adwoa Serwaa Frimpong', 'Female'],
  ['Isaac Ofori Atta', 'Male'],
];

function makeStudent(
  i: number,
  name: string,
  gender: string,
  cls: string,
  year: string,
  seq: number,
): Student {
  const parts = name.split(' ');
  const first = parts[0];
  const last = parts[parts.length - 1];
  return {
    id: `DPS-${year.slice(2, 4)}-${String(seq).padStart(4, '0')}`,
    name,
    classCategory: cls,
    academicYear: year,
    gender,
    dob: '2012-04-18',
    bloodGroup: 'O+',
    email: `${first.toLowerCase()}.${last.toLowerCase()}@detlof.edu.gh`,
    loginCode: String(1000 + ((i * 373) % 9000)),
    photo: '',
    parentName: `Mr./Mrs. ${last}`,
    parentRelation: 'Parent',
    parentPhone: `024 ${String(1000000 + i * 111111).slice(0, 7)}`,
    parentWhatsApp: `23324${String(1000000 + i * 111111).slice(0, 7)}`,
    parentEmail: `parent.${last.toLowerCase()}@example.com`,
    emergencyContact: `${last} Family — 020 000 0000`,
    homeAddress: 'Detlof Avenue, Accra',
    allergies: 'None',
    interests: 'Reading, Football',
    notes: '',
    compound: 'Day Student',
    club: 'Science Club',
    promotionStatus: 'Promoted',
    promotedTo: '',
    message: null,
    createdAt: Date.now(),
  };
}

export const seedStudents: Student[] = (() => {
  const list: Student[] = [];
  JHS2_ROSTER.forEach(([name, gender], i) => {
    list.push(makeStudent(i, name, gender, 'JHS 2', '2025/2026', 187 + i));
  });
  const others: [string, string, string][] = [
    ['Naa Dedei Otoo', 'Female', 'JHS 1'],
    ['Samuel Kwarteng', 'Male', 'JHS 1'],
    ['Mawuli Kumasi', 'Male', 'JHS 1'],
    ['Serwaa Ama Bonsu', 'Female', 'JHS 3'],
    ['Daniel Tetteh', 'Male', 'JHS 3'],
    ['Linda Esi Hammond', 'Female', 'JHS 3'],
    ['Kofi Nti', 'Male', 'Primary 6'],
    ['Adwoa Kissi', 'Female', 'Primary 6'],
  ];
  others.forEach(([name, gender, cls], i) => {
    list.push(makeStudent(20 + i, name, gender, cls, '2025/2026', 300 + i * 3));
  });
  // Personal message for the demo student
  const ama = list.find((s) => s.name === 'Ama Serwaa Mensah');
  if (ama) {
    ama.message = {
      title: 'Well done this term!',
      body: 'Your consistency in Mathematics and English Language has been outstanding. Keep it up, Ama — the whole school is proud of you.',
    };
  }
  return list;
})();

export const seedResults: ResultRow[] = (() => {
  const rows: ResultRow[] = [];
  const subjects = [...SUBJECTS];
  seedStudents
    .filter((s) => s.classCategory === 'JHS 2')
    .forEach((stu, i) => {
      subjects.forEach((subject, s) => {
        const sba1 = 6 + ((i + s) % 5);
        const sba2 = 13 + ((i * 2 + s) % 8);
        const projectWork = 13 + ((i + s * 2) % 8);
        const examination = 55 + ((i * 5 + s * 7) % 41);
        rows.push({ studentId: stu.id, subject, sba1, sba2, projectWork, examination, term: 'Term 2', academicYear: '2025/2026' });
        rows.push({ studentId: stu.id, subject, sba1: Math.max(0, sba1 - 1), sba2: Math.max(0, sba2 - 2), projectWork: Math.max(0, projectWork - 1), examination: Math.max(0, examination - 5), term: 'Term 1', academicYear: '2025/2026' });
      });
    });
  return rows;
})();

const TEACHERS: Record<string, string> = {
  Mathematics: 'Mr. K. Osei',
  'English Language': 'Mrs. A. Mensah',
  'Science': 'Dr. E. Boateng',
  'Social Studies': 'Mr. Y. Awuah',
  'Computing': 'Ms. F. Ofori',
  'Religious and Moral Education': 'Mrs. G. Tetteh',
  'Ghanaian Language': 'School Language Teacher',
  Arabic: 'Arabic Teacher',
  'Creative Arts and Design': 'Creative Arts Teacher',
  'Physical Education and Health': 'Coach D. Laryea',
  'French Language': 'Mme. H. Dubois',
  'Career Technology': 'Mr. P. Nkrumah',
};

const VENUES: Record<string, string> = {
  Mathematics: 'Room 12',
  'English Language': 'Room 8',
  'Science': 'Lab 2',
  'Social Studies': 'Room 5',
  'Computing': 'ICT Lab',
  'Religious and Moral Education': 'Chapel',
  'Ghanaian Language': 'Room 4',
  Arabic: 'Room 6',
  'Creative Arts and Design': 'Arts Studio',
  'Physical Education and Health': 'Field',
  'French Language': 'Room 3',
  'Career Technology': 'Room 9',
};

const WEEK_SUBJECTS = [
   'English Language', 'Mathematics', 'Science', 'Social Studies', 'French Language',
  'Ghanaian Language', 'Arabic', 'Physical Education and Health', 'Religious and Moral Education',
  'Creative Arts and Design', 'Career Technology', 'Computing',
];

const SLOTS = ['8:00 – 9:00', '9:00 – 10:00', '10:30 – 11:30', '11:30 – 12:30', '1:30 – 2:30', '2:30 – 3:30'];

function buildTimetable(cls: string): TimetableEntry[] {
  const entries: TimetableEntry[] = [];
  DAYS.forEach((day, d) => {
    SLOTS.forEach((time, t) => {
      const idx = (d * 3 + t * 2) % WEEK_SUBJECTS.length;
      const subject = WEEK_SUBJECTS[idx];
      entries.push({
        classCategory: cls,
        day,
        time,
        subject,
        teacher: TEACHERS[subject],
        venue: VENUES[subject],
      });
    });
  });
  return entries;
}

export const seedTimetable: TimetableEntry[] = [
  ...buildTimetable('JHS 1'),
  ...buildTimetable('JHS 2'),
  ...buildTimetable('JHS 3'),
];

export const seedBills: BillItem[] = [
  { studentId: 'DPS-24-0187', item: 'Tuition', billed: 1200, paid: 800 },
  { studentId: 'DPS-24-0187', item: 'Registration', billed: 150, paid: 150 },
  { studentId: 'DPS-24-0187', item: 'Textbooks', billed: 220, paid: 100 },
  { studentId: 'DPS-24-0187', item: 'Sports & PE', billed: 60, paid: 60 },
  { studentId: 'DPS-24-0187', item: 'ICT & Labs', billed: 90, paid: 0 },
  { studentId: 'DPS-24-0187', item: 'Lunch Programme', billed: 180, paid: 180 },
  { studentId: 'DPS-24-0196', item: 'Tuition', billed: 1200, paid: 1200 },
  { studentId: 'DPS-24-0196', item: 'Registration', billed: 150, paid: 150 },
  { studentId: 'DPS-24-0196', item: 'Textbooks', billed: 220, paid: 220 },
  { studentId: 'DPS-24-0196', item: 'Sports & PE', billed: 60, paid: 60 },
  { studentId: 'DPS-24-0196', item: 'ICT & Labs', billed: 90, paid: 90 },
  { studentId: 'DPS-24-0196', item: 'Lunch Programme', billed: 180, paid: 120 },
];

export const seedAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Term 2 Results Released',
    category: 'Academics',
    message: 'Term 2 results are now live on every student portal. Log in to view your scores, grades and cumulative GPA.',
    date: '2026-02-14',
    audience: 'all',
  },
  {
    id: 'a2',
    title: 'Inter-House Sports Day',
    category: 'Events',
    message: 'Our annual Inter-House Sports Day takes place on Friday, 6th March at the school field. All students should come in their house colours.',
    date: '2026-02-20',
    audience: 'all',
  },
  {
    id: 'a3',
    title: 'Parent–Teacher Conferences',
    category: 'Notice',
    message: 'Parent–Teacher conferences are scheduled for Thursday, 5th March, 2:00 PM – 5:00 PM. Please book a slot with your form teacher.',
    date: '2026-02-25',
    audience: 'all',
  },
  {
    id: 'a4',
    title: 'School Fees Reminder',
    category: 'Finance',
    message: 'A friendly reminder that second-term fees are due by Friday, 27th February. Receipts can be sent to the school office via WhatsApp.',
    date: '2026-02-28',
    audience: 'all',
  },
  {
    id: 'a5',
    title: 'Science & Innovation Week',
    category: 'Events',
    message: 'Science & Innovation Week runs 9th–13th March. JHS students will present projects in the ICT Lab. Parents are welcome to attend the exhibition on Wednesday.',
    date: '2026-03-02',
    audience: 'all',
  },
];
