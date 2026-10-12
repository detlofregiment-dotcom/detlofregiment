export function calculateFinalScore({ sba1, sba2, projectWork, examination }) {
  const values = [
    ['SBA 1', sba1, 10],
    ['SBA 2', sba2, 20],
    ['Project work', projectWork, 20],
    ['Examination', examination, 100],
  ];
  for (const [label, value, max] of values) {
    if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) {
      throw new Error(`${label} mark is required.`);
    }
    if (Number(value) < 0 || Number(value) > max) {
      throw new Error(`${label} must be between 0 and ${max}.`);
    }
  }
  const internal = Number(sba1) + Number(sba2) + Number(projectWork); // already out of 50
  const examContribution = Number(examination) / 2; // examination scaled from /100 to /50
  return Math.round((internal + examContribution) * 100) / 100;
}
