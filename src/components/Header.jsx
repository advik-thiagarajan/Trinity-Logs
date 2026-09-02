import React from 'react';
import { Sparkles, Download, RotateCcw, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { downloadTemplates } from '../utils/exportUtils';

export function Header({ onLoadDemo, onReset, hasData }) {
  return (
    <header className="border-b border-[#E7E4DC] bg-[#FAF9F5]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-700 to-amber-600 flex items-center justify-center shadow-md shadow-emerald-900/10 text-white font-serif font-black text-xl tracking-wider ring-1 ring-emerald-700/20">
            TL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                Trinity Logs
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF3EE] text-emerald-800 border border-emerald-200/80">
                Monthly Audit
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Class Attendance & Fee Reconciliation Portal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {hasData && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-stone-600 hover:text-stone-900 bg-[#F5F3EC] hover:bg-[#EBE8DF] border border-[#E7E4DC] transition"
              title="Reset and start over"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={downloadTemplates}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-stone-700 bg-[#F5F3EC] hover:bg-[#EBE8DF] border border-[#E7E4DC] transition"
            title="Download blank sample Excel templates"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sample Templates</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 shadow-sm shadow-emerald-800/20 active:scale-95 transition"
            title="Load sample monthly attendance and payment logs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Load Demo Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}
