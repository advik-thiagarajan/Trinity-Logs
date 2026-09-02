import * as XLSX from 'xlsx';

/**
 * Parses an Excel or CSV file buffer into structured sheet data.
 * @param {File} file - The file object from file input or drop event.
 * @returns {Promise<{ sheetNames: string[], sheets: Record<string, any[]> }>}
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        const sheets = {};
        workbook.SheetNames.forEach((name) => {
          const worksheet = workbook.Sheets[name];
          // Convert to array of objects with raw values preserved
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          sheets[name] = json;
        });

        resolve({
          fileName: file.name,
          fileSize: file.size,
          sheetNames: workbook.SheetNames,
          sheets,
        });
      } catch (err) {
        reject(new Error(`Failed to parse file "${file.name}": ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error(`Error reading file "${file.name}"`));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Automatically inspects column headers to guess the role of each column.
 * @param {string[]} columns - Array of header strings
 * @returns {{ nameCol: string, phoneCol: string, batchCol: string, amountCol: string, dateCol: string }}
 */
export function autoDetectColumns(columns) {
  const normalized = columns.map(c => ({
    original: c,
    clean: String(c).toLowerCase().replace(/[^a-z0-9]/g, '')
  }));

  const findCol = (patterns) => {
    for (const pat of patterns) {
      const match = normalized.find(c => c.clean.includes(pat) || pat.includes(c.clean));
      if (match) return match.original;
    }
    return '';
  };

  const nameCol = findCol([
    'studentname', 'membername', 'fullname', 'student', 'member', 'name', 
    'clientname', 'candidatename', 'attendee', 'studentnames'
  ]) || (columns.length > 0 ? columns[0] : '');

  const phoneCol = findCol([
    'phonenumber', 'contactnumber', 'mobilenumber', 'phone', 'mobile', 
    'contact', 'whatsapp', 'cell', 'tel', 'studentid', 'rollno', 'id'
  ]);

  const batchCol = findCol([
    'batch', 'class', 'course', 'grade', 'group', 'section', 'timing', 'slot', 'program'
  ]);

  const amountCol = findCol([
    'amountpaid', 'feespaid', 'amount', 'fee', 'fees', 'paidamount', 'price', 'total'
  ]);

  const dateCol = findCol([
    'paymentdate', 'paiddate', 'transactiondate', 'date', 'timestamp', 'attendeddate'
  ]);

  return { nameCol, phoneCol, batchCol, amountCol, dateCol };
}

/**
 * Standardizes raw sheet rows based on mapped column names.
 */
export function normalizeSheetRows(rows, mapping) {
  if (!rows || !Array.isArray(rows)) return [];

  return rows
    .filter(row => {
      // Filter out blank rows
      const nameVal = row[mapping.nameCol];
      return nameVal && String(nameVal).trim().length > 0;
    })
    .map((row, index) => {
      const name = String(row[mapping.nameCol] || '').trim();
      const phone = mapping.phoneCol ? String(row[mapping.phoneCol] || '').trim() : '';
      const batch = mapping.batchCol ? String(row[mapping.batchCol] || '').trim() : '';
      const amount = mapping.amountCol ? parseAmount(row[mapping.amountCol]) : null;
      const date = mapping.dateCol ? String(row[mapping.dateCol] || '').trim() : '';

      return {
        id: `row-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        raw: row,
        name,
        phone,
        batch,
        amount,
        date,
      };
    });
}

function parseAmount(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
