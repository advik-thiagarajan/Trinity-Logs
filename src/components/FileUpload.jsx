import React, { useRef, useState } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  Settings2, 
  Trash2, 
  Layers, 
  UserCheck, 
  Receipt 
} from 'lucide-react';

export function FileUploadCard({
  title,
  subtitle,
  icon: Icon,
  accentColor = 'emerald', // 'emerald' or 'amber'
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
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const isEmerald = accentColor === 'emerald';

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        fileData
          ? 'bg-[#FFFFFF] border-[#E7E4DC] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
          : isDragging
          ? isEmerald
            ? 'border-emerald-600 bg-[#EEF6F2] shadow-md ring-2 ring-emerald-600/20'
            : 'border-amber-600 bg-[#FDF8EE] shadow-md ring-2 ring-amber-600/20'
          : 'bg-[#FDFCF9] border-dashed border-[#DED9CE] hover:border-[#BFB8A9]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-[#F0ECE1] bg-[#FBF9F4] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isEmerald
                ? 'bg-[#EBF3EE] text-emerald-800'
                : 'bg-[#FEF5E7] text-amber-800'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-base font-serif">
              {title}
            </h3>
            <p className="text-xs text-stone-500">
              {subtitle}
            </p>
          </div>
        </div>

        {fileData && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-[#EBF3EE] px-2.5 py-1 rounded-full border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Loaded
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
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
            className="py-10 px-4 flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div
              className={`w-14 h-14 mb-3 rounded-2xl flex items-center justify-center transition group-hover:scale-105 ${
                isEmerald
                  ? 'bg-[#EBF3EE] text-emerald-700'
                  : 'bg-[#FEF5E7] text-amber-700'
              }`}
            >
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-stone-800 mb-1">
              Click to browse or drag & drop
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
                <FileSpreadsheet className="w-5 h-5 text-emerald-700 shrink-0" />
                <div className="truncate">
                  <div className="text-sm font-semibold text-stone-800 truncate">
                    {fileData.fileName}
                  </div>
                  <div className="text-xs text-stone-500">
                    {fileData.fileSize ? `${(fileData.fileSize / 1024).toFixed(1)} KB • ` : ''}
                    {fileData.sheets[selectedSheet]?.length || 0} rows found
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
                  className="bg-[#FFFFFF] border border-[#DED9CE] rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
                  className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Adjust Mapping
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#ECE8DE]">
                  <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                    Student Name
                  </div>
                  <div className="font-semibold text-stone-800 truncate mt-0.5">
                    {mapping.nameCol ? (
                      <span className="text-emerald-800">✓ {mapping.nameCol}</span>
                    ) : (
                      <span className="text-rose-600">⚠ Not detected</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#ECE8DE]">
                  <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                    Contact / Phone
                  </div>
                  <div className="font-semibold text-stone-800 truncate mt-0.5">
                    {mapping.phoneCol ? (
                      <span>{mapping.phoneCol}</span>
                    ) : (
                      <span className="text-stone-400 font-normal">Optional</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#ECE8DE]">
                  <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                    Batch / Class
                  </div>
                  <div className="font-semibold text-stone-800 truncate mt-0.5">
                    {mapping.batchCol ? (
                      <span>{mapping.batchCol}</span>
                    ) : (
                      <span className="text-stone-400 font-normal">Optional</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#ECE8DE]">
                  <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                    {isEmerald ? 'Sessions / Notes' : 'Fee Amount'}
                  </div>
                  <div className="font-semibold text-stone-800 truncate mt-0.5">
                    {isEmerald ? (
                      <span className="text-stone-600">Auto</span>
                    ) : mapping.amountCol ? (
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
    </div>
  );
}

export function FileUploadSection({
  attendanceFile,
  paymentFile,
  attendanceSheet,
  paymentSheet,
  onAttendanceSheetChange,
  onPaymentSheetChange,
  attendanceMapping,
  paymentMapping,
  onOpenAttendanceMapper,
  onOpenPaymentMapper,
  onUploadAttendance,
  onUploadPayment,
  onRemoveAttendance,
  onRemovePayment,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <FileUploadCard
        title="1. Monthly Attendance Sheet"
        subtitle="Upload the roster of members who attended classes this month"
        icon={UserCheck}
        accentColor="emerald"
        fileData={attendanceFile}
        selectedSheet={attendanceSheet}
        onSheetChange={onAttendanceSheetChange}
        mapping={attendanceMapping}
        onOpenMapper={onOpenAttendanceMapper}
        onFileUpload={onUploadAttendance}
        onRemoveFile={onRemoveAttendance}
      />

      <FileUploadCard
        title="2. Monthly Payment Log"
        subtitle="Upload the fee collection log for who has paid this month"
        icon={Receipt}
        accentColor="amber"
        fileData={paymentFile}
        selectedSheet={paymentSheet}
        onSheetChange={onPaymentSheetChange}
        mapping={paymentMapping}
        onOpenMapper={onOpenPaymentMapper}
        onFileUpload={onUploadPayment}
        onRemoveFile={onRemovePayment}
      />
    </div>
  );
}
