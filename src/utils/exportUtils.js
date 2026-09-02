import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel (.xlsx) file with styled column widths.
 */
export function exportToExcel(records, filename = 'Trinity_Logs_Report.xlsx', sheetTitle = 'Unpaid Students') {
  if (!records || records.length === 0) {
    alert('No data to export.');
    return;
  }

  // Format records for clean Excel export
  const exportData = records.map((r, idx) => ({
    'S.No': idx + 1,
    'Student Name': r.name,
    'Batch / Class': r.batch || 'General',
    'Contact / Phone': r.phone || 'N/A',
    'Status': r.statusLabel,
    'Amount Paid': r.amountPaid !== undefined && r.amountPaid !== null ? r.amountPaid : 0,
    'Payment Date': r.paymentDate || 'N/A',
    'Match Remarks': r.matchType || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Auto calculate column widths
  const colWidths = [
    { wch: 6 },   // S.No
    { wch: 25 },  // Student Name
    { wch: 18 },  // Batch
    { wch: 16 },  // Contact / Phone
    { wch: 20 },  // Status
    { wch: 14 },  // Amount Paid
    { wch: 15 },  // Payment Date
    { wch: 22 },  // Remarks
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.slice(0, 31));

  XLSX.writeFile(workbook, filename);
}

/**
 * Exports data to a CSV file.
 */
export function exportToCSV(records, filename = 'Trinity_Logs_Report.csv') {
  if (!records || records.length === 0) return;

  const exportData = records.map((r, idx) => ({
    'S.No': idx + 1,
    'Student Name': r.name,
    'Batch / Class': r.batch || 'General',
    'Contact / Phone': r.phone || 'N/A',
    'Status': r.statusLabel,
    'Amount Paid': r.amountPaid || 0,
    'Payment Date': r.paymentDate || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads starter sample templates for monthly use.
 */
export function downloadTemplates() {
  const workbook = XLSX.utils.book_new();

  // 1. Attendance Sheet Template
  const sampleAttendance = [
    { 'Student Name': 'Aarav Patel', 'Phone Number': '9876543201', 'Batch': 'Morning Karate', 'Days Attended': 12 },
    { 'Student Name': 'Diya Sharma', 'Phone Number': '9876543202', 'Batch': 'Evening Dance', 'Days Attended': 10 },
    { 'Student Name': 'Rohan Gupta', 'Phone Number': '9876543203', 'Batch': 'Morning Karate', 'Days Attended': 14 },
    { 'Student Name': 'Ananya Singh', 'Phone Number': '9876543204', 'Batch': 'Weekend Art', 'Days Attended': 8 },
    { 'Student Name': 'Kabir Verma', 'Phone Number': '9876543205', 'Batch': 'Evening Dance', 'Days Attended': 11 },
  ];
  const wsAttendance = XLSX.utils.json_to_sheet(sampleAttendance);
  wsAttendance['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, wsAttendance, 'Attendance Log');

  // 2. Payment Sheet Template
  const samplePayment = [
    { 'Student Name': 'Aarav Patel', 'Contact Number': '9876543201', 'Amount Paid': 2500, 'Payment Date': '2026-09-02', 'Payment Mode': 'UPI' },
    { 'Student Name': 'Diya Sharma', 'Contact Number': '9876543202', 'Amount Paid': 2500, 'Payment Date': '2026-09-03', 'Payment Mode': 'Cash' },
    { 'Student Name': 'Ananya Singh', 'Contact Number': '9876543204', 'Amount Paid': 2500, 'Payment Date': '2026-09-04', 'Payment Mode': 'Card' },
    // Rohan and Kabir omitted to demonstrate unpaid defaulters
  ];
  const wsPayment = XLSX.utils.json_to_sheet(samplePayment);
  wsPayment['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, wsPayment, 'Payment Log');

  XLSX.writeFile(workbook, 'Trinity_Logs_Sample_Template.xlsx');
}
