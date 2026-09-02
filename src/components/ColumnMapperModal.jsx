import React, { useState } from 'react';
import { X, Check, Table } from 'lucide-react';

export function ColumnMapperModal({
  isOpen,
  onClose,
  title,
  availableColumns = [],
  sampleRows = [],
  currentMapping = {},
  onSaveMapping,
  isPaymentSheet = false,
}) {
  if (!isOpen) return null;

  const [mapping, setMapping] = useState({
    nameCol: currentMapping.nameCol || '',
    phoneCol: currentMapping.phoneCol || '',
    batchCol: currentMapping.batchCol || '',
    amountCol: currentMapping.amountCol || '',
    dateCol: currentMapping.dateCol || '',
  });

  const handleSave = () => {
    if (!mapping.nameCol) {
      alert('Please select the column containing the Student / Member Name.');
      return;
    }
    onSaveMapping(mapping);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E4DC] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#F0ECE1] bg-[#FBF9F4] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              {title}
            </h3>
            <p className="text-xs text-stone-500">
              Verify and match the column headers from your file
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-[#F5F3EC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FFFFFF]">
          {/* Mapping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <span>Student / Member Name</span>
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={mapping.nameCol}
                onChange={(e) => setMapping({ ...mapping, nameCol: e.target.value })}
                className="w-full text-xs bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="">-- Select Name Column --</option>
                {availableColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Required for matching records
              </span>
            </div>

            {/* Phone / Contact */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <span>Phone / Contact Number</span>
                <span className="text-xs text-stone-400 font-normal">(Optional)</span>
              </label>
              <select
                value={mapping.phoneCol}
                onChange={(e) => setMapping({ ...mapping, phoneCol: e.target.value })}
                className="w-full text-xs bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="">-- None / Auto-match --</option>
                {availableColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Enables WhatsApp reminder messaging
              </span>
            </div>

            {/* Batch / Class */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <span>Batch / Class / Course</span>
                <span className="text-xs text-stone-400 font-normal">(Optional)</span>
              </label>
              <select
                value={mapping.batchCol}
                onChange={(e) => setMapping({ ...mapping, batchCol: e.target.value })}
                className="w-full text-xs bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="">-- None / Unassigned --</option>
                {availableColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Allows batch filtering in the defaulter table
              </span>
            </div>

            {/* Fee Amount (Payment Sheet) or Date */}
            {isPaymentSheet ? (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <span>Fee Amount Paid</span>
                  <span className="text-xs text-stone-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={mapping.amountCol}
                  onChange={(e) => setMapping({ ...mapping, amountCol: e.target.value })}
                  className="w-full text-xs bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-stone-900 focus:ring-1 focus:ring-amber-700 focus:outline-none"
                >
                  <option value="">-- None --</option>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Used for total revenue calculations
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <span>Date / Attendance Sessions</span>
                  <span className="text-xs text-stone-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={mapping.dateCol}
                  onChange={(e) => setMapping({ ...mapping, dateCol: e.target.value })}
                  className="w-full text-xs bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="">-- None --</option>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Sessions attended or date column
                </span>
              </div>
            )}
          </div>

          {/* Sample Data Preview */}
          {sampleRows && sampleRows.length > 0 && (
            <div className="border border-[#E7E4DC] rounded-xl overflow-hidden">
              <div className="bg-[#FAF8F3] px-4 py-2 text-xs font-medium text-stone-700 flex items-center gap-1.5 border-b border-[#E7E4DC]">
                <Table className="w-3.5 h-3.5" />
                Raw File Preview (First {Math.min(sampleRows.length, 3)} rows)
              </div>
              <div className="overflow-x-auto max-h-48 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F7F5EF] text-stone-500 font-bold uppercase text-[10px]">
                    <tr>
                      {availableColumns.map((col) => (
                        <th key={col} className="p-2 border-b border-[#E7E4DC] whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE3]">
                    {sampleRows.slice(0, 3).map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F5]">
                        {availableColumns.map((col) => (
                          <td key={col} className="p-2 text-stone-800 whitespace-nowrap">
                            {String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#F0ECE1] bg-[#FBF9F4] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition shadow-sm"
          >
            <Check className="w-4 h-4" />
            Apply Mapping
          </button>
        </div>
      </div>
    </div>
  );
}
