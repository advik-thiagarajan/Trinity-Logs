/**
 * Clean and canonicalize name string for matching.
 */
export function canonicalizeName(name) {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|master)\b\.?/gi, '') // remove titles
    .replace(/[^a-z0-9\s]/g, '') // remove special chars
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
}

/**
 * Clean phone number to compare digits.
 */
export function canonicalizePhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  // Return last 10 digits for standard mobile match
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Token sort comparison: checks if words match regardless of order (e.g. "Advik Sharma" == "Sharma Advik").
 */
function tokenSortMatch(name1, name2) {
  const tokens1 = canonicalizeName(name1).split(' ').filter(Boolean).sort().join(' ');
  const tokens2 = canonicalizeName(name2).split(' ').filter(Boolean).sort().join(' ');
  return tokens1 === tokens2 && tokens1.length > 0;
}

/**
 * Reconciles the Attendance records against the Payment records.
 * @param {Array} attendanceRows - Array of normalized attendance rows
 * @param {Array} paymentRows - Array of normalized payment rows
 * @param {Object} options - Match settings { fuzzyMatch: boolean }
 */
export function reconcileLogs(attendanceRows = [], paymentRows = [], options = { fuzzyMatch: true }) {
  const matchedPaymentIds = new Set();
  const unpaid = [];
  const paidAndAttended = [];
  const allAttendees = [];

  // Index payments for fast lookup
  const paymentByPhone = new Map();
  const paymentByName = new Map();
  const paymentByTokenSort = new Map();

  paymentRows.forEach((p) => {
    const cleanP = canonicalizePhone(p.phone);
    if (cleanP && cleanP.length >= 7) {
      paymentByPhone.set(cleanP, p);
    }
    const cleanN = canonicalizeName(p.name);
    if (cleanN) {
      paymentByName.set(cleanN, p);
      const sortedTokens = cleanN.split(' ').filter(Boolean).sort().join(' ');
      if (sortedTokens) {
        paymentByTokenSort.set(sortedTokens, p);
      }
    }
  });

  // Check each attendee
  attendanceRows.forEach((att) => {
    const cleanPhone = canonicalizePhone(att.phone);
    const cleanName = canonicalizeName(att.name);
    const sortedTokens = cleanName.split(' ').filter(Boolean).sort().join(' ');

    let paymentMatch = null;
    let matchType = null;

    // 1. Check phone match first (if present)
    if (cleanPhone && paymentByPhone.has(cleanPhone)) {
      paymentMatch = paymentByPhone.get(cleanPhone);
      matchType = 'Phone Match';
    }

    // 2. Exact normalized name match
    if (!paymentMatch && cleanName && paymentByName.has(cleanName)) {
      paymentMatch = paymentByName.get(cleanName);
      matchType = 'Exact Name Match';
    }

    // 3. Token sort match (e.g. Lastname Firstname)
    if (!paymentMatch && sortedTokens && paymentByTokenSort.has(sortedTokens)) {
      paymentMatch = paymentByTokenSort.get(sortedTokens);
      matchType = 'Name Order Match';
    }

    // 4. Optional fuzzy match for minor spelling discrepancies
    if (!paymentMatch && options.fuzzyMatch && cleanName.length >= 4) {
      for (const p of paymentRows) {
        if (matchedPaymentIds.has(p.id)) continue;
        const pClean = canonicalizeName(p.name);
        if (isFuzzyMatch(cleanName, pClean)) {
          paymentMatch = p;
          matchType = 'Fuzzy Match';
          break;
        }
      }
    }

    if (paymentMatch) {
      matchedPaymentIds.add(paymentMatch.id);
      const record = {
        id: att.id,
        name: att.name,
        phone: att.phone || paymentMatch.phone || '',
        batch: att.batch || paymentMatch.batch || 'General',
        status: 'PAID',
        statusLabel: 'Paid & Attended',
        amountPaid: paymentMatch.amount,
        paymentDate: paymentMatch.date,
        matchType,
        attendanceRaw: att.raw,
        paymentRaw: paymentMatch.raw,
      };
      paidAndAttended.push(record);
      allAttendees.push(record);
    } else {
      const record = {
        id: att.id,
        name: att.name,
        phone: att.phone || '',
        batch: att.batch || 'General',
        status: 'UNPAID',
        statusLabel: 'Fees Pending',
        amountPaid: 0,
        paymentDate: null,
        matchType: 'No Payment Record',
        attendanceRaw: att.raw,
        paymentRaw: null,
      };
      unpaid.push(record);
      allAttendees.push(record);
    }
  });

  // Identify students who paid but were not in the attendance list
  const paidAbsent = paymentRows
    .filter((p) => !matchedPaymentIds.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      phone: p.phone || '',
      batch: p.batch || 'General',
      status: 'PAID_ABSENT',
      statusLabel: 'Paid (Zero Attendance)',
      amountPaid: p.amount,
      paymentDate: p.date,
      matchType: 'Payment Only',
      attendanceRaw: null,
      paymentRaw: p.raw,
    }));

  // Unified list of all students involved
  const allStudents = [...allAttendees, ...paidAbsent];

  // Calculate statistics
  const totalAttended = attendanceRows.length;
  const totalPaidInLog = paymentRows.length;
  const unpaidCount = unpaid.length;
  const paidAndAttendedCount = paidAndAttended.length;
  const paidAbsentCount = paidAbsent.length;
  const complianceRate = totalAttended > 0 ? Math.round((paidAndAttendedCount / totalAttended) * 100) : 0;

  // Calculate revenue if amounts were detected
  const totalRevenue = paymentRows.reduce((acc, p) => acc + (typeof p.amount === 'number' ? p.amount : 0), 0);
  
  // Calculate average fee if amount is available to estimate unpaid amount
  const amounts = paymentRows.map(p => p.amount).filter(a => typeof a === 'number' && a > 0);
  const avgFee = amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  const estimatedUnpaidRevenue = Math.round(unpaidCount * avgFee);

  return {
    unpaid,
    paidAndAttended,
    paidAbsent,
    allAttendees,
    allStudents,
    stats: {
      totalAttended,
      totalPaidInLog,
      unpaidCount,
      paidAndAttendedCount,
      paidAbsentCount,
      complianceRate,
      totalRevenue,
      estimatedUnpaidRevenue,
      hasAmounts: amounts.length > 0,
    },
  };
}

/**
 * Basic Levenshtein distance based fuzzy match
 */
function isFuzzyMatch(str1, str2) {
  if (Math.abs(str1.length - str2.length) > 2) return false;
  const dist = levenshteinDistance(str1, str2);
  // Allow 1 edit distance for words >= 4 chars, 2 edits for words >= 8 chars
  if (str1.length >= 8 && dist <= 2) return true;
  if (str1.length >= 4 && dist <= 1) return true;
  return false;
}

function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const d = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return d[m][n];
}
