/**
 * Parses raw text input into structured attendee records.
 * Supports:
 * - Simple names: "Aarav Patel", "Diya Sharma"
 * - Numbered/bullet lists: "1. Aarav Patel", "- Diya Sharma", "• Rohan Gupta"
 * - Name with phone: "Aarav Patel 9876543201" or "Diya Sharma, 9876543202"
 * - Name with batch: "Aarav Patel (Morning Karate)" or "Diya Sharma - Evening Dance"
 * - Comma-separated names: "Aarav Patel, Diya Sharma, Rohan Gupta"
 */
export function parseAttendanceText(text) {
  if (!text || typeof text !== 'string') return [];

  const rawLines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  // If user pasted a single comma-separated line
  let items = [];
  if (rawLines.length === 1 && rawLines[0].includes(',')) {
    items = rawLines[0].split(',').map(s => s.trim()).filter(Boolean);
  } else {
    items = rawLines;
  }

  const parsed = [];

  items.forEach((item, index) => {
    // 1. Strip leading numbering or bullets: e.g. "1.", "1)", "[1]", "-", "•", "*"
    let clean = item.replace(/^(\d+[\.\)\-:]\s*|[\-\•\*\>]\s*)/, '').trim();
    if (!clean) return;

    let phone = '';
    let batch = '';

    // 2. Extract 10-digit phone number if present
    const phoneMatch = clean.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
    if (phoneMatch) {
      phone = phoneMatch[0].replace(/\D/g, '').slice(-10);
      clean = clean.replace(phoneMatch[0], '').trim();
    }

    // 3. Extract batch if in parentheses or separated by '-' / '|'
    const parenMatch = clean.match(/\(([^)]+)\)/);
    if (parenMatch) {
      batch = parenMatch[1].trim();
      clean = clean.replace(parenMatch[0], '').trim();
    } else if (clean.includes(' - ')) {
      const parts = clean.split(' - ');
      if (parts.length >= 2) {
        clean = parts[0].trim();
        batch = parts.slice(1).join(' - ').trim();
      }
    } else if (clean.includes(' | ')) {
      const parts = clean.split(' | ');
      if (parts.length >= 2) {
        clean = parts[0].trim();
        batch = parts.slice(1).join(' | ').trim();
      }
    }

    // Clean up trailing commas or dashes from name
    const studentName = clean.replace(/^[\s,\-]+|[\s,\-]+$/g, '').trim();

    if (studentName.length > 0) {
      parsed.push({
        id: `text-att-${index}-${studentName.toLowerCase().replace(/\s+/g, '-')}`,
        name: studentName,
        phone,
        batch: batch || 'General',
        amount: null,
        date: '',
        raw: {
          'Student Name': studentName,
          'Contact': phone,
          'Batch': batch || 'General',
        },
      });
    }
  });

  return parsed;
}

/**
 * Parses raw text input into payment records.
 * Supports:
 * - "Aarav Patel - 2800"
 * - "Diya Sharma, 2500"
 * - "Rohan Gupta (UPI)"
 */
export function parsePaymentText(text) {
  if (!text || typeof text !== 'string') return [];

  const rawLines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  let items = [];
  if (rawLines.length === 1 && rawLines[0].includes(',')) {
    items = rawLines[0].split(',').map(s => s.trim()).filter(Boolean);
  } else {
    items = rawLines;
  }

  const parsed = [];

  items.forEach((item, index) => {
    let clean = item.replace(/^(\d+[\.\)\-:]\s*|[\-\•\*\>]\s*)/, '').trim();
    if (!clean) return;

    let amount = null;
    let phone = '';

    // Extract amount like ₹2800 or 2800 or 2,800
    const amountMatch = clean.match(/(?:₹|rs\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)/i);
    // Be careful: avoid matching phone numbers as amounts
    const phoneMatch = clean.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
    if (phoneMatch) {
      phone = phoneMatch[0].replace(/\D/g, '').slice(-10);
      clean = clean.replace(phoneMatch[0], '').trim();
    }

    // If amount pattern found and it's not a phone number
    const standaloneNumberMatch = clean.match(/(?:^|\s|-|,)(?:₹|rs\.?\s*)?(\d{2,6})(?:\s|-|,|$)/i);
    if (standaloneNumberMatch && (!phone || standaloneNumberMatch[1] !== phone)) {
      amount = parseFloat(standaloneNumberMatch[1]);
      clean = clean.replace(standaloneNumberMatch[0], ' ').trim();
    }

    // Clean parentheses
    clean = clean.replace(/\([^)]*\)/g, '').trim();
    const memberName = clean.replace(/^[\s,\-]+|[\s,\-]+$/g, '').trim();

    if (memberName.length > 0) {
      parsed.push({
        id: `text-pay-${index}-${memberName.toLowerCase().replace(/\s+/g, '-')}`,
        name: memberName,
        phone,
        batch: 'General',
        amount: amount || 0,
        date: new Date().toISOString().split('T')[0],
        raw: {
          'Member Name': memberName,
          'Amount': amount || 0,
          'Contact': phone,
        },
      });
    }
  });

  return parsed;
}
