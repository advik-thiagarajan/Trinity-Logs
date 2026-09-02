export const DEMO_ATTENDANCE_DATA = [
  { 'Student Name': 'Aarav Patel', 'Phone Number': '9876543201', 'Batch': 'Morning Karate', 'Sessions Attended': 14 },
  { 'Student Name': 'Diya Sharma', 'Phone Number': '9876543202', 'Batch': 'Evening Dance', 'Sessions Attended': 12 },
  { 'Student Name': 'Rohan Gupta', 'Phone Number': '9876543203', 'Batch': 'Morning Karate', 'Sessions Attended': 15 },
  { 'Student Name': 'Ananya Singh', 'Phone Number': '9876543204', 'Batch': 'Weekend Art', 'Sessions Attended': 8 },
  { 'Student Name': 'Kabir Verma', 'Phone Number': '9876543205', 'Batch': 'Evening Dance', 'Sessions Attended': 11 },
  { 'Student Name': 'Meera Joshi', 'Phone Number': '9876543206', 'Batch': 'Morning Karate', 'Sessions Attended': 16 },
  { 'Student Name': 'Ishaan Malhotra', 'Phone Number': '9876543207', 'Batch': 'Weekend Art', 'Sessions Attended': 9 },
  { 'Student Name': 'Riya Chawla', 'Phone Number': '9876543208', 'Batch': 'Evening Dance', 'Sessions Attended': 13 },
  { 'Student Name': 'Arjun Reddy', 'Phone Number': '9876543209', 'Batch': 'Morning Karate', 'Sessions Attended': 10 },
  { 'Student Name': 'Sanya Kapoor', 'Phone Number': '9876543210', 'Batch': 'Weekend Art', 'Sessions Attended': 7 },
  { 'Student Name': 'Vikram Sethi', 'Phone Number': '9876543211', 'Batch': 'Morning Karate', 'Sessions Attended': 14 },
  { 'Student Name': 'Tanvi Nair', 'Phone Number': '9876543212', 'Batch': 'Evening Dance', 'Sessions Attended': 12 },
  { 'Student Name': 'Aditya Kulkarni', 'Phone Number': '9876543213', 'Batch': 'Morning Karate', 'Sessions Attended': 15 },
  { 'Student Name': 'Pooja Iyer', 'Phone Number': '9876543214', 'Batch': 'Weekend Art', 'Sessions Attended': 8 },
  { 'Student Name': 'Nikhil Bhat', 'Phone Number': '9876543215', 'Batch': 'Evening Dance', 'Sessions Attended': 10 },
  { 'Student Name': 'Zara Khan', 'Phone Number': '9876543216', 'Batch': 'Morning Karate', 'Sessions Attended': 13 },
  { 'Student Name': 'Dhruv Sen', 'Phone Number': '9876543217', 'Batch': 'Weekend Art', 'Sessions Attended': 9 },
  { 'Student Name': 'Kavya Pillai', 'Phone Number': '9876543218', 'Batch': 'Evening Dance', 'Sessions Attended': 14 },
];

export const DEMO_PAYMENT_DATA = [
  // Exact matches
  { 'Member Name': 'Aarav Patel', 'Contact': '9876543201', 'Amount Paid': 2800, 'Payment Date': '2026-09-02', 'Mode': 'UPI' },
  { 'Member Name': 'Diya Sharma', 'Contact': '9876543202', 'Amount Paid': 2800, 'Payment Date': '2026-09-03', 'Mode': 'Bank Transfer' },
  { 'Member Name': 'Ananya Singh', 'Contact': '9876543204', 'Amount Paid': 2800, 'Payment Date': '2026-09-01', 'Mode': 'UPI' },
  { 'Member Name': 'Meera Joshi', 'Contact': '9876543206', 'Amount Paid': 2800, 'Payment Date': '2026-09-04', 'Mode': 'Cash' },
  { 'Member Name': 'Arjun Reddy', 'Contact': '9876543209', 'Amount Paid': 2800, 'Payment Date': '2026-09-05', 'Mode': 'UPI' },
  // Name variation / Case difference
  { 'Member Name': 'Kapoor Sanya', 'Contact': '9876543210', 'Amount Paid': 2800, 'Payment Date': '2026-09-06', 'Mode': 'Credit Card' },
  { 'Member Name': 'VIKRAM SETHI', 'Contact': '9876543211', 'Amount Paid': 2800, 'Payment Date': '2026-09-02', 'Mode': 'UPI' },
  { 'Member Name': 'Tanvi Nair', 'Contact': '+91 9876543212', 'Amount Paid': 2800, 'Payment Date': '2026-09-03', 'Mode': 'Net Banking' },
  { 'Member Name': 'Aditya Kulkarni', 'Contact': '9876543213', 'Amount Paid': 2800, 'Payment Date': '2026-09-07', 'Mode': 'UPI' },
  { 'Member Name': 'Pooja Iyer', 'Contact': '9876543214', 'Amount Paid': 2800, 'Payment Date': '2026-09-01', 'Mode': 'Cash' },
  { 'Member Name': 'Zara Khan', 'Contact': '9876543216', 'Amount Paid': 2800, 'Payment Date': '2026-09-05', 'Mode': 'UPI' },
  { 'Member Name': 'Kavya Pillai', 'Contact': '9876543218', 'Amount Paid': 2800, 'Payment Date': '2026-09-08', 'Mode': 'UPI' },

  // Paid but Zero Attendance this month (Advance or on Medical Leave)
  { 'Member Name': 'Manish Saxena', 'Contact': '9876543299', 'Amount Paid': 2800, 'Payment Date': '2026-09-01', 'Mode': 'UPI' },
  { 'Member Name': 'Sneha Roy', 'Contact': '9876543298', 'Amount Paid': 2800, 'Payment Date': '2026-09-02', 'Mode': 'Cash' },
  
  // NOTE:
  // Unpaid Defaulters in Attendance:
  // - Rohan Gupta
  // - Kabir Verma
  // - Ishaan Malhotra
  // - Riya Chawla
  // - Nikhil Bhat
  // - Dhruv Sen
];
