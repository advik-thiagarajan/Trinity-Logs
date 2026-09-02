import { reconcileLogs } from './src/utils/reconciliation.js';
import { autoDetectColumns, normalizeSheetRows } from './src/utils/excelParser.js';


const mockAttendance = [
  { 'Student Name': 'Aarav Patel', 'Phone Number': '9876543201', 'Batch': 'Morning Karate' },
  { 'Student Name': 'Diya Sharma', 'Phone Number': '9876543202', 'Batch': 'Evening Dance' },
  { 'Student Name': 'Rohan Gupta', 'Phone Number': '9876543203', 'Batch': 'Morning Karate' }, // unpaid
  { 'Student Name': 'Sanya Kapoor', 'Phone Number': '9876543210', 'Batch': 'Weekend Art' },
];

const mockPayment = [
  { 'Member Name': 'Aarav Patel', 'Contact': '9876543201', 'Amount Paid': 2800 },
  { 'Member Name': 'Sharma Diya', 'Contact': '+91-9876543202', 'Amount Paid': 2800 },
  { 'Member Name': 'KAPOOR SANYA', 'Contact': '', 'Amount Paid': 2800 },
  { 'Member Name': 'Manish Saxena', 'Contact': '9876543299', 'Amount Paid': 2800 }, // paid but absent
];

const attMapping = autoDetectColumns(Object.keys(mockAttendance[0]));
const payMapping = autoDetectColumns(Object.keys(mockPayment[0]));

const normAtt = normalizeSheetRows(mockAttendance, attMapping);
const normPay = normalizeSheetRows(mockPayment, payMapping);

const result = reconcileLogs(normAtt, normPay, { fuzzyMatch: true });

console.log('Reconciliation Test Results:');
console.log('Total Attended:', result.stats.totalAttended, '(Expected: 4)');
console.log('Paid & Attended:', result.stats.paidAndAttendedCount, '(Expected: 3)');
console.log('Unpaid Defaulters:', result.stats.unpaidCount, '(Expected: 1)');
console.log('Paid Absent:', result.stats.paidAbsentCount, '(Expected: 1)');
console.log('Compliance Rate:', result.stats.complianceRate + '%');

if (
  result.stats.totalAttended === 4 &&
  result.stats.paidAndAttendedCount === 3 &&
  result.stats.unpaidCount === 1 &&
  result.unpaid[0].name === 'Rohan Gupta' &&
  result.stats.paidAbsentCount === 1
) {
  console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ TEST FAILED!', result);
  process.exit(1);
}
