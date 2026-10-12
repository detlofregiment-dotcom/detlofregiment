import { jsPDF } from 'jspdf';
import { gradeFor } from './grades';

export function downloadResultsPDF(student: any, results: any[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(131, 0, 198);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Detlof Preparatory School', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(11);
  doc.text('Student Academic Report', pageWidth / 2, 28, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

  // Student info
  doc.setTextColor(28, 28, 28);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 14, 52);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${student.name}`, 14, 60);
  doc.text(`Student ID: ${student.id}`, 14, 66);
  doc.text(`Class: ${student.classCategory}`, 14, 72);
  doc.text(`Academic Year: ${student.academicYear}`, 14, 78);

  // Results table
  const terms = [...new Set(results.map((r: any) => r.term))];
  let y = 92;

  terms.forEach((term) => {
    const termResults = results.filter((r: any) => r.term === term);
    if (termResults.length === 0) return;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(131, 0, 198);
    doc.text(term, 14, y);
    y += 6;

    // Table header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(131, 0, 198);
    doc.rect(14, y, 182, 8, 'F');
    doc.text('Subject', 18, y + 5.5);
    doc.text('SBA1', 75, y + 5.5);
    doc.text('SBA2', 94, y + 5.5);
    doc.text('Proj.', 113, y + 5.5);
    doc.text('Exam', 132, y + 5.5);
    doc.text('Total', 153, y + 5.5);
    doc.text('Grade', 176, y + 5.5);
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(28, 28, 28);
    termResults.forEach((r: any, i: number) => {
      const total = r.sba1 + r.sba2 + r.projectWork + r.examination / 2;
      const grade = gradeFor(total);
      if (i % 2 === 0) {
        doc.setFillColor(243, 230, 250);
        doc.rect(14, y, 182, 7, 'F');
      }
      doc.text(r.subject, 18, y + 5);
      doc.text(`${r.sba1}/10`, 75, y + 5);
      doc.text(`${r.sba2}/20`, 94, y + 5);
      doc.text(`${r.projectWork}/20`, 113, y + 5);
      doc.text(`${r.examination}/100`, 132, y + 5);
      doc.text(String(total), 153, y + 5);
      doc.text(grade.grade, 176, y + 5);
      y += 7;
    });

    // Term summary
    const totals = termResults.map((r: any) => r.sba1 + r.sba2 + r.projectWork + r.examination / 2);
    const avg = totals.reduce((a: number, b: number) => a + b, 0) / totals.length;
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(131, 0, 198);
    doc.text(`Term Average: ${avg.toFixed(1)}%`, 14, y);
    y += 12;
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Detlof Preparatory School · Wisdom · Balance', 14, pageHeight - 10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, pageHeight - 5);

  doc.save(`${student.name.replace(/\s+/g, '_')}_Results.pdf`);
}

export function downloadTimetablePDF(student: any, entries: any[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(131, 0, 198);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Detlof Preparatory School', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(11);
  doc.text('Class Timetable', pageWidth / 2, 28, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

  // Student info
  doc.setTextColor(28, 28, 28);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 14, 52);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${student.name}`, 14, 60);
  doc.text(`Student ID: ${student.id}`, 14, 66);
  doc.text(`Class: ${student.classCategory}`, 14, 72);

  // Group by day
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let y = 86;

  days.forEach((day) => {
    const dayEntries = entries.filter((e: any) => e.day === day);
    if (dayEntries.length === 0) return;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(131, 0, 198);
    doc.text(day, 14, y);
    y += 6;

    // Table header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(131, 0, 198);
    doc.rect(14, y, 182, 8, 'F');
    doc.text('Time', 18, y + 5.5);
    doc.text('Subject', 60, y + 5.5);
    doc.text('Teacher', 110, y + 5.5);
    doc.text('Venue', 160, y + 5.5);
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(28, 28, 28);
    dayEntries.forEach((t: any, i: number) => {
      if (i % 2 === 0) {
        doc.setFillColor(243, 230, 250);
        doc.rect(14, y, 182, 7, 'F');
      }
      doc.text(t.time, 18, y + 5);
      doc.text(t.subject, 60, y + 5);
      doc.text(t.teacher, 110, y + 5);
      doc.text(t.venue, 160, y + 5);
      y += 7;
    });
    y += 8;
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Detlof Preparatory School · Wisdom · Balance', 14, pageHeight - 10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, pageHeight - 5);

  doc.save(`${student.name.replace(/\s+/g, '_')}_Timetable.pdf`);
}

export function downloadBillsPDF(student: any, items: any[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(131, 0, 198);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Detlof Preparatory School', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(11);
  doc.text('Fee Statement', pageWidth / 2, 28, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

  // Student info
  doc.setTextColor(28, 28, 28);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 14, 52);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${student.name}`, 14, 60);
  doc.text(`Student ID: ${student.id}`, 14, 66);
  doc.text(`Class: ${student.classCategory}`, 14, 72);

  // Summary
  const totalBilled = items.reduce((a: number, b: any) => a + b.billed, 0);
  const totalPaid = items.reduce((a: number, b: any) => a + b.paid, 0);
  const balance = totalBilled - totalPaid;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(131, 0, 198);
  doc.text('Summary', 14, 86);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(28, 28, 28);
  doc.text(`Total Billed: GHS ${totalBilled.toFixed(2)}`, 14, 94);
  doc.text(`Total Paid: GHS ${totalPaid.toFixed(2)}`, 14, 100);
  doc.text(`Balance Due: GHS ${balance.toFixed(2)}`, 14, 106);

  // Table
  let y = 118;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(131, 0, 198);
  doc.text('Fee Details', 14, y);
  y += 6;

  // Table header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(131, 0, 198);
  doc.rect(14, y, 182, 8, 'F');
  doc.text('Fee Item', 18, y + 5.5);
  doc.text('Billed', 80, y + 5.5);
  doc.text('Paid', 110, y + 5.5);
  doc.text('Balance', 140, y + 5.5);
  doc.text('Status', 170, y + 5.5);
  y += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(28, 28, 28);
  items.forEach((b: any, i: number) => {
    const bal = b.billed - b.paid;
    if (i % 2 === 0) {
      doc.setFillColor(243, 230, 250);
      doc.rect(14, y, 182, 7, 'F');
    }
    doc.text(b.item, 18, y + 5);
    doc.text(`GHS ${b.billed.toFixed(2)}`, 80, y + 5);
    doc.text(`GHS ${b.paid.toFixed(2)}`, 110, y + 5);
    doc.text(`GHS ${bal.toFixed(2)}`, 140, y + 5);
    doc.text(bal > 0 ? 'Outstanding' : 'Settled', 170, y + 5);
    y += 7;
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Detlof Preparatory School · Wisdom · Balance', 14, pageHeight - 10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, pageHeight - 5);

  doc.save(`${student.name.replace(/\s+/g, '_')}_Bills.pdf`);
}
