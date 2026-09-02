import React, { useState, useRef } from 'react';
import { 
  UserCheck, 
  FileSpreadsheet, 
  Type, 
  CheckCircle2, 
  Trash2, 
  Layers, 
  Settings2, 
  Sparkles,
  UploadCloud 
} from 'lucide-react';

export function AttendanceInputCard({
  attendanceMode, // 'text' | 'file'
  setAttendanceMode,
  attendanceText,
  setAttendanceText,
  parsedAttendees = [],
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

  const sampleAttendeesText = `Aarav Patel - Morning Karate (9876543201)
Diya Sharma - Evening Dance (9876543202)
Rohan Gupta - Morning Karate (9876543203)
Ananya Singh - Weekend Art (9876543204)
Kabir Verma - Evening Dance (9876543205)
Meera Joshi - Morning Karate (9876543206)
Ishaan Malhotra - Weekend Art (9876543207)
Riya Chawla - Evening Dance (9876543208)
Arjun Reddy - Morning Karate (9876543209)
Sanya Kapoor - Weekend Art (9876543210)
Vikram Sethi - Morning Karate (9876543211)
Tanvi Nair - Evening Dance (9876543212)
Aditya Kulkarni - Morning Karate (9876543213)
Pooja Iyer - Weekend Art (9876543214)
Nikhil Bhat - Evening Dance (9876543215)
Zara Khan - Morning Karate (9876543216)
Dhruv Sen - Weekend Art (9876543217)
Kavya Pillai - Evening Dance (9876543218)`;

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
      setAttendanceMode('file');
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttendanceMode('file');
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-[#FFFFFF] border-[#E7E4DC] shadow-[0_2px_12px_rgba(0,0,0,0.02)]`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-[#F0ECE1] bg-[#FBF9F4] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] text-emerald-800 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-base font-serif">
              1. Class Attendance
            </h3>
            <p className="text-xs text-stone-500">
              Enter the members who attended classes this month
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#EFECE3] border border-[#E4DFD3] text-xs">
          <button
            onClick={() => setAttendanceMode('text')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              attendanceMode === 'text'
                ? 'bg-[#FFFFFF] text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-emerald-800" />
            <span>Type / Paste Text</span>
          </button>
          <button
            onClick={() => setAttendanceMode('file')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              attendanceMode === 'file'
                ? 'bg-[#FFFFFF] text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            <span>Upload Excel</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {attendanceMode === 'text' ? (
          /* TEXT ENTRY MODE */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-2">
                <span>Enter student names (one per line):</span>
                {parsedAttendees.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF3EE] text-emerald-800 border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3" />
                    {parsedAttendees.length} {parsedAttendees.length === 1 ? 'attendee' : 'attendees'} ready
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAttendanceText(sampleAttendeesText)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-[#EBF3EE] hover:bg-[#DDF0E3] rounded-lg border border-emerald-200/70 transition"
                  title="Paste sample list of attendees"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Sample Names</span>
                </button>
                {attendanceText && (
                  <button
                    onClick={() => setAttendanceText('')}
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
              value={attendanceText}
              onChange={(e) => setAttendanceText(e.target.value)}
              placeholder={`Paste or type names here (one per line, e.g.):

Aarav Patel
Diya Sharma
Rohan Gupta
Ananya Singh
Kabir Verma

Optional: You can also include batch or phone, like:
Aarav Patel - Morning Karate (9876543201)`}
              className="w-full text-xs font-mono bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl p-3.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-[#FFFFFF] leading-relaxed transition resize-y"
            />

            {/* Quick Preview Chips of Parsed Names */}
            {parsedAttendees.length > 0 && (
              <div className="pt-2 border-t border-[#F0ECE1]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Parsed Attendees Preview:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {parsedAttendees.slice(0, 15).map((att, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#F5F3EB] text-stone-700 border border-[#E6E2D7]"
                    >
                      <span className="font-semibold">{att.name}</span>
                      {att.batch && att.batch !== 'General' && (
                        <span className="text-[10px] text-stone-400">({att.batch})</span>
                      )}
                    </span>
                  ))}
                  {parsedAttendees.length > 15 && (
                    <span className="text-[11px] font-semibold text-emerald-800 self-center pl-1">
                      +{parsedAttendees.length - 15} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* EXCEL UPLOAD MODE */
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
                <div className="w-14 h-14 mb-3 rounded-2xl flex items-center justify-center bg-[#EBF3EE] text-emerald-700 transition group-hover:scale-105">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-stone-800 mb-1">
                  Click to browse or drag & drop attendance sheet
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
