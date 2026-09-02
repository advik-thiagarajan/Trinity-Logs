import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileSpreadsheet, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  Type,
  ArrowRight
} from 'lucide-react';

import { Header } from './components/Header';
import { AttendanceInputCard } from './components/AttendanceInputCard';
import { PaymentInputCard } from './components/PaymentInputCard';
import { ColumnMapperModal } from './components/ColumnMapperModal';
import { DashboardStats } from './components/DashboardStats';
import { ComparisonResults } from './components/ComparisonResults';
import { ReminderModal } from './components/ReminderModal';
import { ReportPrintView } from './components/ReportPrintView';

import { parseExcelFile, autoDetectColumns, normalizeSheetRows } from './utils/excelParser';
import { parseAttendanceText, parsePaymentText } from './utils/textParser';
import { reconcileLogs } from './utils/reconciliation';
import { DEMO_ATTENDANCE_DATA, DEMO_PAYMENT_DATA } from './utils/demoData';

export function App() {
  const [monthName, setMonthName] = useState(() => {
    const d = new Date();
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });

  // Attendance states (Text mode is default as requested!)
  const [attendanceMode, setAttendanceMode] = useState('text'); // 'text' | 'file'
  const [attendanceText, setAttendanceText] = useState('');
  const [attendanceFile, setAttendanceFile] = useState(null);
  const [attendanceSheet, setAttendanceSheet] = useState('');
  const [attendanceMapping, setAttendanceMapping] = useState({
    nameCol: '',
    phoneCol: '',
    batchCol: '',
    amountCol: '',
    dateCol: '',
  });

  // Payment states (File mode is default)
  const [paymentMode, setPaymentMode] = useState('file'); // 'file' | 'text'
  const [paymentText, setPaymentText] = useState('');
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentSheet, setPaymentSheet] = useState('');
  const [paymentMapping, setPaymentMapping] = useState({
    nameCol: '',
    phoneCol: '',
    batchCol: '',
    amountCol: '',
    dateCol: '',
  });

  // Modals
  const [mapperModal, setMapperModal] = useState({ isOpen: false, type: 'attendance' });
  const [reminderModal, setReminderModal] = useState({ isOpen: false, student: null });

  // Parse text inputs dynamically
  const parsedAttendeesFromText = useMemo(() => {
    return parseAttendanceText(attendanceText);
  }, [attendanceText]);

  const parsedPaymentsFromText = useMemo(() => {
    return parsePaymentText(paymentText);
  }, [paymentText]);

  // Load Demo Data
  const handleLoadDemo = () => {
    // 1. Fill attendance as text list
    setAttendanceMode('text');
    const demoNamesText = DEMO_ATTENDANCE_DATA.map(
      (s) => `${s['Student Name']} - ${s['Batch']} (${s['Phone Number']})`
    ).join('\n');
    setAttendanceText(demoNamesText);

    // 2. Fill payment file
    setPaymentMode('file');
    const payFile = {
      fileName: 'Trinity_September_Fee_Collection.xlsx',
      fileSize: 15200,
      sheetNames: ['Fee Receipts'],
      sheets: {
        'Fee Receipts': DEMO_PAYMENT_DATA,
      },
    };
    setPaymentFile(payFile);
    setPaymentSheet('Fee Receipts');
    setPaymentMapping(autoDetectColumns(Object.keys(DEMO_PAYMENT_DATA[0] || {})));
  };

  // Reset all
  const handleReset = () => {
    setAttendanceText('');
    setAttendanceFile(null);
    setAttendanceSheet('');
    setAttendanceMapping({ nameCol: '', phoneCol: '', batchCol: '', amountCol: '', dateCol: '' });

    setPaymentText('');
    setPaymentFile(null);
    setPaymentSheet('');
    setPaymentMapping({ nameCol: '', phoneCol: '', batchCol: '', amountCol: '', dateCol: '' });
  };

  // Upload handlers
  const handleUploadAttendance = async (file) => {
    try {
      const parsed = await parseExcelFile(file);
      const firstSheet = parsed.sheetNames[0] || '';
      setAttendanceFile(parsed);
      setAttendanceSheet(firstSheet);

      const rows = parsed.sheets[firstSheet] || [];
      if (rows.length > 0) {
        const detected = autoDetectColumns(Object.keys(rows[0]));
        setAttendanceMapping(detected);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUploadPayment = async (file) => {
    try {
      const parsed = await parseExcelFile(file);
      const firstSheet = parsed.sheetNames[0] || '';
      setPaymentFile(parsed);
      setPaymentSheet(firstSheet);

      const rows = parsed.sheets[firstSheet] || [];
      if (rows.length > 0) {
        const detected = autoDetectColumns(Object.keys(rows[0]));
        setPaymentMapping(detected);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Sheet change handlers
  const handleAttendanceSheetChange = (sheetName) => {
    setAttendanceSheet(sheetName);
    const rows = attendanceFile?.sheets[sheetName] || [];
    if (rows.length > 0) {
      setAttendanceMapping(autoDetectColumns(Object.keys(rows[0])));
    }
  };

  const handlePaymentSheetChange = (sheetName) => {
    setPaymentSheet(sheetName);
    const rows = paymentFile?.sheets[sheetName] || [];
    if (rows.length > 0) {
      setPaymentMapping(autoDetectColumns(Object.keys(rows[0])));
    }
  };

  // Normalized rows for reconciliation
  const activeAttendanceRows = useMemo(() => {
    if (attendanceMode === 'text') {
      return parsedAttendeesFromText;
    }
    if (!attendanceFile || !attendanceSheet) return [];
    const rows = attendanceFile.sheets[attendanceSheet] || [];
    return normalizeSheetRows(rows, attendanceMapping);
  }, [attendanceMode, parsedAttendeesFromText, attendanceFile, attendanceSheet, attendanceMapping]);

  const activePaymentRows = useMemo(() => {
    if (paymentMode === 'text') {
      return parsedPaymentsFromText;
    }
    if (!paymentFile || !paymentSheet) return [];
    const rows = paymentFile.sheets[paymentSheet] || [];
    return normalizeSheetRows(rows, paymentMapping);
  }, [paymentMode, parsedPaymentsFromText, paymentFile, paymentSheet, paymentMapping]);

  // Reconciliation calculation
  const reconciliationData = useMemo(() => {
    if (activeAttendanceRows.length === 0 && activePaymentRows.length === 0) return null;
    return reconcileLogs(activeAttendanceRows, activePaymentRows, { fuzzyMatch: true });
  }, [activeAttendanceRows, activePaymentRows]);

  // Trigger confetti if 100% paid
  useEffect(() => {
    if (
      reconciliationData &&
      reconciliationData.stats.totalAttended > 0 &&
      reconciliationData.stats.unpaidCount === 0
    ) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [reconciliationData]);

  // Modal mapper configuration
  const activeMapperConfig = useMemo(() => {
    if (!mapperModal.isOpen) return null;
    if (mapperModal.type === 'attendance') {
      const rows = attendanceFile?.sheets[attendanceSheet] || [];
      return {
        title: `Map Attendance Columns: ${attendanceFile?.fileName}`,
        availableColumns: rows.length > 0 ? Object.keys(rows[0]) : [],
        sampleRows: rows,
        currentMapping: attendanceMapping,
        isPaymentSheet: false,
        onSave: setAttendanceMapping,
      };
    } else {
      const rows = paymentFile?.sheets[paymentSheet] || [];
      return {
        title: `Map Payment Columns: ${paymentFile?.fileName}`,
        availableColumns: rows.length > 0 ? Object.keys(rows[0]) : [],
        sampleRows: rows,
        currentMapping: paymentMapping,
        isPaymentSheet: true,
        onSave: setPaymentMapping,
      };
    }
  }, [mapperModal, attendanceFile, paymentFile, attendanceSheet, paymentSheet, attendanceMapping, paymentMapping]);

  const hasData = Boolean(
    (attendanceMode === 'text' ? attendanceText.trim() : attendanceFile) ||
    (paymentMode === 'text' ? paymentText.trim() : paymentFile)
  );

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans antialiased flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Top Header */}
      <Header
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        hasData={hasData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        {/* Month Selector & Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 font-serif">
              Monthly Reconciliation
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Type or paste your attendees on the left, load your monthly payment log on the right, and find who hasn't paid.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E7E4DC] rounded-xl px-3.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <Calendar className="w-4 h-4 text-emerald-800" />
            <input
              type="text"
              value={monthName}
              onChange={(e) => setMonthName(e.target.value)}
              placeholder="e.g. September 2026"
              className="text-xs font-bold bg-transparent text-stone-800 focus:outline-none w-36"
              title="Audit Month"
            />
          </div>
        </div>

        {/* Dual Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* 1. Attendance Input (Text or Excel) */}
          <AttendanceInputCard
            attendanceMode={attendanceMode}
            setAttendanceMode={setAttendanceMode}
            attendanceText={attendanceText}
            setAttendanceText={setAttendanceText}
            parsedAttendees={parsedAttendeesFromText}
            fileData={attendanceFile}
            selectedSheet={attendanceSheet}
            onSheetChange={handleAttendanceSheetChange}
            mapping={attendanceMapping}
            onOpenMapper={() => setMapperModal({ isOpen: true, type: 'attendance' })}
            onFileUpload={handleUploadAttendance}
            onRemoveFile={() => {
              setAttendanceFile(null);
              setAttendanceSheet('');
            }}
          />

          {/* 2. Payment Log Input (Excel or Text) */}
          <PaymentInputCard
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            paymentText={paymentText}
            setPaymentText={setPaymentText}
            parsedPayments={parsedPaymentsFromText}
            fileData={paymentFile}
            selectedSheet={paymentSheet}
            onSheetChange={handlePaymentSheetChange}
            mapping={paymentMapping}
            onOpenMapper={() => setMapperModal({ isOpen: true, type: 'payment' })}
            onFileUpload={handleUploadPayment}
            onRemoveFile={() => {
              setPaymentFile(null);
              setPaymentSheet('');
            }}
          />
        </div>

        {/* When data is reconciled */}
        {reconciliationData ? (
          <>
            {/* Metric Cards */}
            <DashboardStats stats={reconciliationData.stats} />

            {/* Comparison Table with filters, tabs and search */}
            <ComparisonResults
              reconciliationData={reconciliationData}
              onOpenReminder={(student) => setReminderModal({ isOpen: true, student })}
              onOpenBulkReminder={() => setReminderModal({ isOpen: true, student: null })}
              onPrintReport={() => window.print()}
            />
          </>
        ) : (
          /* Empty / Welcome State */
          <div className="rounded-3xl border border-[#E7E4DC] bg-[#FFFFFF] p-8 sm:p-12 text-center max-w-3xl mx-auto my-12 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF3EE] text-emerald-800 flex items-center justify-center mx-auto mb-5 ring-1 ring-emerald-700/20">
              <Type className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mb-2">
              Fast Monthly Reconciliation
            </h3>
            <p className="text-sm text-stone-500 max-w-lg mx-auto mb-8 leading-relaxed">
              Simply <strong>paste your student names into the text box</strong> on the left, and upload your <strong>monthly payment Excel sheet</strong> on the right. Trinity Logs will cross-check the two lists instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto mb-8">
              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EBE7DD]">
                <div className="w-6 h-6 rounded-full bg-[#EBF3EE] text-emerald-800 flex items-center justify-center text-xs font-bold mb-2">
                  1
                </div>
                <div className="font-bold text-xs text-stone-800 mb-1">
                  Paste Names
                </div>
                <div className="text-[11px] text-stone-500">
                  Paste attendee names directly from WhatsApp, Notes, or any roster.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EBE7DD]">
                <div className="w-6 h-6 rounded-full bg-[#EBF3EE] text-emerald-800 flex items-center justify-center text-xs font-bold mb-2">
                  2
                </div>
                <div className="font-bold text-xs text-stone-800 mb-1">
                  Upload Payment Log
                </div>
                <div className="text-[11px] text-stone-500">
                  Drop your monthly fee collection spreadsheet.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EBE7DD]">
                <div className="w-6 h-6 rounded-full bg-[#EBF3EE] text-emerald-800 flex items-center justify-center text-xs font-bold mb-2">
                  3
                </div>
                <div className="font-bold text-xs text-stone-800 mb-1">
                  Identify Defaulters
                </div>
                <div className="text-[11px] text-stone-500">
                  Get the unpaid list, export to Excel & copy WhatsApp fee reminders.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleLoadDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-95 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Try with Sample Attendees & Payments</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Printable Report View */}
      <ReportPrintView
        reconciliationData={reconciliationData}
        monthName={monthName}
      />

      {/* Modals */}
      {activeMapperConfig && (
        <ColumnMapperModal
          isOpen={mapperModal.isOpen}
          onClose={() => setMapperModal({ isOpen: false, type: 'attendance' })}
          title={activeMapperConfig.title}
          availableColumns={activeMapperConfig.availableColumns}
          sampleRows={activeMapperConfig.sampleRows}
          currentMapping={activeMapperConfig.currentMapping}
          onSaveMapping={activeMapperConfig.onSave}
          isPaymentSheet={activeMapperConfig.isPaymentSheet}
        />
      )}

      <ReminderModal
        isOpen={reminderModal.isOpen}
        onClose={() => setReminderModal({ isOpen: false, student: null })}
        student={reminderModal.student}
        allUnpaidStudents={reconciliationData?.unpaid || []}
        monthName={monthName}
      />

      {/* Footer */}
      <footer className="border-t border-[#E7E4DC] py-6 text-center text-xs text-stone-500 bg-[#FFFFFF] no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800">Trinity Logs</span>
            <span>• Private & Secure Monthly Reconciliation</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Processing • Your student data never leaves your browser</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
