export interface GradeInfo {
  grade: string;
  gpa: number;
  remark: string;
  tone: 'excellent' | 'very-good' | 'good' | 'credit' | 'pass' | 'below' | 'fail';
}

/** Requested school formula: SBA1 /10 + SBA2 /20 + project /20 + exam /100 scaled to /50. */
export function calculateFinalScore(sba1: number, sba2: number, projectWork: number, examination: number): number {
  const values: [string, number, number][] = [
    ['SBA 1', sba1, 10], ['SBA 2', sba2, 20], ['Project work', projectWork, 20], ['Examination', examination, 100],
  ];
  for (const [label, value, max] of values) {
    if (!Number.isFinite(value) || value < 0 || value > max) throw new Error(`${label} must be between 0 and ${max}.`);
  }
  return Math.round((sba1 + sba2 + projectWork + examination / 2) * 100) / 100;
}

export function gradeFor(total: number): GradeInfo {
  if (total >= 90) return { grade: 'A1', gpa: 4.0, remark: 'Excellent', tone: 'excellent' };
  if (total >= 80) return { grade: 'B2', gpa: 3.5, remark: 'Very Good', tone: 'very-good' };
  if (total >= 70) return { grade: 'B3', gpa: 3.0, remark: 'Good', tone: 'good' };
  if (total >= 60) return { grade: 'C4', gpa: 2.5, remark: 'Credit', tone: 'credit' };
  if (total >= 55) return { grade: 'C5', gpa: 2.0, remark: 'Pass', tone: 'pass' };
  if (total >= 50) return { grade: 'C6', gpa: 1.5, remark: 'Pass', tone: 'pass' };
  if (total >= 40) return { grade: 'D7', gpa: 1.0, remark: 'Below Average', tone: 'below' };
  return { grade: 'E8', gpa: 0.0, remark: 'Fail', tone: 'fail' };
}
export const GRADE_SCALE: GradeInfo[] = [gradeFor(95),gradeFor(85),gradeFor(75),gradeFor(65),gradeFor(57),gradeFor(52),gradeFor(45),gradeFor(30)];
export function average(nums: number[]): number { return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0; }
export function gpaFromGrades(gpas: number[]): number { return gpas.length ? gpas.reduce((a,b)=>a+b,0)/gpas.length : 0; }
