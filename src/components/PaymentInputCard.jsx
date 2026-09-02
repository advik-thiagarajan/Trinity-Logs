import React, { useState, useRef } from 'react';
import { 
  Receipt, 
  FileSpreadsheet, 
  Type, 
  CheckCircle2, 
  Trash2, 
  Layers, 
  Settings2, 
  Sparkles,
  UploadCloud 
} from 'lucide-react';

export function PaymentInputCard({
  paymentMode = 'file', // 'file' | 'text'
  setPaymentMode,
  paymentText = '',
  setPaymentText,
  parsedPayments = [],
  fileData,
  selectedSheet,
  onSheetChange,
  mapping,
  onOpenMapper,
  onFileUpload,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const samplePaymentText = `Aarav Patel - 2800 (UPI)
Diya Sharma - 2800 (Bank Transfer)
Ananya Singh - 2800 (UPI)
Meera Joshi - 2800 (Cash)
Arjun Reddy - 2800 (UPI)
Kapoor Sanya - 2800 (Card)
VIKRAM SETHI - 2800 (UPI)
Tanvi Nair - 2800 (UPI)
Aditya Kulkarni - 2800 (UPI)
Pooja Iyer - 2800 (Cash)
Zara Khan - 2800 (UPI)
Kavya Pillai - 2800 (UPI)`;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setPaymentMode('file');
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentMode('file');
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className="rounded-2xl border transition-all duration-200 overflow-hidden bg-[#FFFFFF] border-[#E7E4DC] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-[#F0ECE1] bg-[#FBF9F4] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-amber-800 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-base font-serif">
              2. Monthly Payment Log
            </h3>
            <p className="text-xs text-stone-500">
              Upload the fee collection log for who has paid this month
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#EFECE3] border border-[#E4DFD3] text-xs">
          <button
            onClick={() => setPaymentMode('file')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              paymentMode === 'file'
                ? 'bg-[#FFFFFF] text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
            <span>Upload Excel</span>
          </button>
          <button
            onClick={() => setPaymentMode('text')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              paymentMode === 'text'
                ? 'bg-[#FFFFFF] text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-amber-800" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {paymentMode === 'text' ? (
          /* TEXT ENTRY MODE FOR PAYMENTS */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-2">
                <span>Enter paid students (one per line):</span>
                {parsedPayments.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF5E7] text-amber-800 border border-amber-200/80">
                    <CheckCircle2 className="w-3 h-3" />
                    {parsedPayments.length} paid entries
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPaymentText(samplePaymentText)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-[#FEF5E7] hover:bg-[#FDF0D9] rounded-lg border border-amber-200/70 transition"
                  title="Paste sample list of payments"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Sample Log</span>
                </button>
                {paymentText && (
                  <button
                    onClick={() => setPaymentText('')}
                    className="p-1 text-stone-400 hover:text-rose-600 transition"
                    title="Clear text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={8}
              value={paymentText}
              onChange={(e) => setPaymentText(e.target.value)}
              placeholder={`Paste paid member names here (one per line, e.g.):

Aarav Patel
Diya Sharma
Ananya Singh
Meera Joshi

Optional: Include amount or mode:
Aarav Patel - 2800 (UPI)`}
              className="w-full text-xs font-mono bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl p-3.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:bg-[#FFFFFF] leading-relaxed transition resize-y"
            />

            {/* Quick Preview Chips of Parsed Payments */}
            {parsedPayments.length > 0 && (
              <div className="pt-2 border-t border-[#F0ECE1]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Parsed Payments Preview:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {parsedPayments.slice(0, 15).map((pay, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#FEF5E7] text-amber-900 border border-amber-200/70"
                    >
                      <span className="font-semibold">{pay.name}</span>
                      {pay.amount && (
                        <span className="text-[10px] text-amber-700">₹{pay.amount}</span>
                      )}
                    </span>
                  ))}
                  {parsedPayments.length > 15 && (
                    <span className="text-[11px] font-semibold text-amber-800 self-center pl-1">
                      +{parsedPayments.length - 15} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* EXCEL UPLOAD MODE FOR PAYMENTS */
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleFileChange}
            />

            {!fileData ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-10 px-4 flex flex-col items-center justify-center text-center cursor-pointer group bg-[#FDFCF9] border-dashed border-[#DED9CE] hover:border-[#BFB8A9] rounded-xl transition"
              >
                <div className="w-14 h-14 mb-3 rounded-2xl flex items-center justify-center bg-[#FEF5E7] text-amber-700 transition group-hover:scale-105">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-stone-800 mb-1">
                  Click to browse or drag & drop payment log
                </p>
                <p className="text-xs text-stone-400">
                  Supports Excel (.xlsx, .xls) and CSV files
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Details Bar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F0] border border-[#EBE7DD]">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileSpreadsheet className="w-5 h-5 text-amber-700 shrink-0" />
                    <div className="truncate">
                      <div className="text-sm font-semibold text-stone-800 truncate">
                        {fileData.fileName}
                      </div>
                      <div className="text-xs text-stone-500">
                        {fileData.fileSize ? `${(fileData.fileSize / 1024).toFixed(1)} KB • ` : ''}
                        {fileData.sheets[selectedSheet]?.length || 0} receipts logged
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-[#FFFFFF] rounded-lg border border-[#DED9CE] shadow-2xs hover:bg-[#F5F3EC] transition"
                      title="Replace file"
                    >
                      Change
                    </button>
                    <button
                      onClick={onRemoveFile}
                      className="p-1 text-stone-400 hover:text-rose-600 transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sheet Selector (if multi-sheet) */}
                {fileData.sheetNames.length > 1 && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <Layers className="w-3.5 h-3.5" />
                      Sheet Tab:
                    </span>
                    <select
                      value={selectedSheet}
                      onChange={(e) => onSheetChange(e.target.value)}
                      className="bg-[#FFFFFF] border border-[#DED9CE] rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    >
                      {fileData.sheetNames.map((name) => (
                        <option key={name} value={name}>
                          {name} ({fileData.sheets[name]?.length || 0} rows)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Detected Columns & Mapping Status */}
                <div className="pt-2 border-t border-[#F0ECE1]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Detected Columns
                    </span>
                    <button
                      onClick={onOpenMapper}
                      className="inline-flex items-center gap-1 text-xs text-amber-800 hover:text-amber-950 font-semibold"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Adjust Mapping
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#ECE8DE]">
                      <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                        Member Name
                      </div>
                      <div className="font-semibold text-stone-800 truncate mt-0.5">
                        {mapping.nameCol ? (
                          <span className="text-amber-800">✓ {mapping.nameCol}</span>
                        ) : (
                          <span className="text-rose-600">⚠ Not detected</span>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#ECE8DE]">
                      <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                        Amount Paid
                      </div>
                      <div className="font-semibold text-stone-800 truncate mt-0.5">
                        {mapping.amountCol ? (
                          <span className="text-amber-800 font-bold">₹ {mapping.amountCol}</span>
                        ) : (
                          <span className="text-stone-400 font-normal">Optional</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
