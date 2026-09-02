import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send,
  Sparkles
} from 'lucide-react';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { canonicalizePhone } from '../utils/reconciliation';

export function ComparisonResults({
  reconciliationData,
  onOpenReminder,
  onOpenBulkReminder,
  onPrintReport,
}) {
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' | 'paid' | 'absent' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');

  const { unpaid, paidAndAttended, paidAbsent, allStudents, stats } = reconciliationData;

  // Extract all distinct batches for filter
  const batches = useMemo(() => {
    const set = new Set();
    allStudents.forEach((s) => {
      if (s.batch && s.batch !== 'General') set.add(s.batch);
    });
    return Array.from(set).sort();
  }, [allStudents]);

  // Determine current list based on active tab
  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'unpaid':
        return unpaid;
      case 'paid':
        return paidAndAttended;
      case 'absent':
        return paidAbsent;
      case 'all':
      default:
        return allStudents;
    }
  }, [activeTab, unpaid, paidAndAttended, paidAbsent, allStudents]);

  // Filter list by search query and batch
  const filteredList = useMemo(() => {
    return currentList.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.phone && student.phone.includes(searchQuery));
      const matchesBatch = selectedBatch === 'ALL' || student.batch === selectedBatch;
      return matchesSearch && matchesBatch;
    });
  }, [currentList, searchQuery, selectedBatch]);

  // Initials generator
  const getInitials = (name) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E4DC] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden mb-12 transition-colors">
      {/* Tab Navigation Header */}
      <div className="border-b border-[#EAE6DD] bg-[#FAF8F3] px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('unpaid')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'unpaid'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-[#F2EFE8]'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Unpaid Students</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'unpaid'
                  ? 'bg-white text-rose-700'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {unpaid.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('paid')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'paid'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-stone-600 hover:bg-[#F2EFE8]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Paid & Attended</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'paid'
                  ? 'bg-white text-emerald-900'
                  : 'bg-[#EBF3EE] text-emerald-800'
              }`}
            >
              {paidAndAttended.length}
            </span>
          </button>

          {paidAbsent.length > 0 && (
            <button
              onClick={() => setActiveTab('absent')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'absent'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-[#F2EFE8]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Paid (Absent)</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'absent'
                    ? 'bg-white text-amber-900'
                    : 'bg-[#FEF5E7] text-amber-800'
                }`}
              >
                {paidAbsent.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-600 hover:bg-[#F2EFE8]'
            }`}
          >
            <span>All Records</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900'
                  : 'bg-[#EBE7DD] text-stone-800'
              }`}
            >
              {allStudents.length}
            </span>
          </button>
        </div>

        {/* Global Export & Action Tools */}
        <div className="flex items-center flex-wrap gap-2 pb-2">
          {unpaid.length > 0 && (
            <button
              onClick={onOpenBulkReminder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-800 bg-[#FEECEB] hover:bg-[#FCD8D6] border border-[#F8D2D0] transition"
              title="Copy fee reminder message for all unpaid students"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bulk Reminders</span>
            </button>
          )}

          <button
            onClick={() => exportToExcel(unpaid, 'Trinity_Unpaid_Students.xlsx', 'Unpaid Defaulters')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-emerald-800 bg-[#EBF3EE] hover:bg-[#DDF0E3] border border-emerald-200/80 transition"
            title="Download unpaid students as an Excel sheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Unpaid (.xlsx)</span>
          </button>

          <button
            onClick={() => exportToCSV(filteredList, `Trinity_${activeTab}_records.csv`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-stone-700 bg-[#F5F3EC] hover:bg-[#EAE6DC] border border-[#E7E4DC] transition"
            title="Export current view to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onPrintReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-stone-700 bg-[#F5F3EC] hover:bg-[#EAE6DC] border border-[#E7E4DC] transition"
            title="Print formal audit report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className="p-4 border-b border-[#EAE6DD] flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF]">
        <div className="flex items-center flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8F6F0] border border-[#E7E4DC] text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-xs text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>

        {batches.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-semibold">Batch:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Batches ({allStudents.length})</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {filteredList.length === 0 ? (
          <div className="py-16 px-4 text-center">
            {activeTab === 'unpaid' && unpaid.length === 0 ? (
              <div className="max-w-sm mx-auto space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#EBF3EE] text-emerald-800 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900 font-serif">
                  100% Fees Settled!
                </h4>
                <p className="text-xs text-stone-500">
                  Every attendee in this month's class list has a verified payment in the log.
                </p>
              </div>
            ) : (
              <div className="max-w-sm mx-auto space-y-2">
                <AlertCircle className="w-8 h-8 text-stone-300 mx-auto" />
                <h4 className="text-sm font-semibold text-stone-700">
                  No matching students found
                </h4>
                <p className="text-xs text-stone-400">
                  Try clearing the search query or batch filter.
                </p>
              </div>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5EF] text-stone-600 font-bold uppercase tracking-wider text-[10.5px] border-b border-[#EAE6DD]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Student / Member</th>
                <th className="py-3.5 px-4">Batch / Class</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment Log Details</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE3]">
              {filteredList.map((student, idx) => {
                const isUnpaid = student.status === 'UNPAID';
                const isPaid = student.status === 'PAID';
                const isAbsent = student.status === 'PAID_ABSENT';
                const cleanPhone = canonicalizePhone(student.phone);

                return (
                  <tr
                    key={student.id || idx}
                    className={`hover:bg-[#FAF8F3] transition-colors ${
                      isUnpaid ? 'bg-[#FCF8F8]' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono text-stone-400">
                      {idx + 1}
                    </td>

                    {/* Name + Initials */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isUnpaid
                              ? 'bg-[#FEECEB] text-rose-800'
                              : isPaid
                              ? 'bg-[#EBF3EE] text-emerald-800'
                              : 'bg-[#FEF5E7] text-amber-800'
                          }`}
                        >
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">
                            {student.name}
                          </div>
                          {student.matchType && (
                            <div className="text-[10px] text-stone-400">
                              {student.matchType}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Batch */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#F5F3EB] text-stone-700 border border-[#E7E4DC]">
                        {student.batch || 'General'}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      {student.phone ? (
                        <div className="font-mono text-stone-700 font-medium">
                          {student.phone}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">No contact</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      {isUnpaid && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEECEB] text-rose-800 border border-[#F8D2D0]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Fee Pending
                        </span>
                      )}
                      {isPaid && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF3EE] text-emerald-800 border border-emerald-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid & Verified
                        </span>
                      )}
                      {isAbsent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF5E7] text-amber-800 border border-amber-200/80">
                          <Clock className="w-3.5 h-3.5" />
                          Advance / Absent
                        </span>
                      )}
                    </td>

                    {/* Payment Info */}
                    <td className="py-3.5 px-4 text-stone-600">
                      {isUnpaid ? (
                        <span className="text-rose-700 font-semibold">
                          No payment record found
                        </span>
                      ) : (
                        <div>
                          <div className="font-semibold text-stone-900">
                            {student.amountPaid ? `₹${student.amountPaid.toLocaleString()}` : 'Cleared'}
                          </div>
                          {student.paymentDate && (
                            <div className="text-[11px] text-stone-400">
                              Date: {student.paymentDate}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isUnpaid ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenReminder(student)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs active:scale-95 transition"
                            title="Send WhatsApp or SMS reminder"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reminder</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenReminder(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 hover:bg-[#F5F3EC] rounded-lg transition"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Message</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-[#FAF8F3] border-t border-[#EAE6DD] text-xs text-stone-500 flex items-center justify-between">
        <span>
          Showing {filteredList.length} of {currentList.length} records in this view
        </span>
        <span className="text-[11px] text-stone-400">
          Reconciliation engine: Exact, Token-sort & Secondary Phone match
        </span>
      </div>
    </div>
  );
}
