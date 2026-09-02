import React from 'react';
import { Users, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export function DashboardStats({ stats }) {
  if (!stats) return null;

  const {
    totalAttended,
    totalPaidInLog,
    unpaidCount,
    paidAndAttendedCount,
    paidAbsentCount,
    complianceRate,
    totalRevenue,
    estimatedUnpaidRevenue,
    hasAmounts,
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Attended */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:border-[#D5D0C4]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Total Attended
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#F4F1EA] text-stone-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
            {totalAttended}
          </span>
          <span className="text-xs text-stone-500 font-medium">students</span>
        </div>
        <div className="mt-2 text-xs text-stone-500 flex items-center gap-1">
          <span>Active attendees this month</span>
        </div>
      </div>

      {/* 2. Paid & Verified */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:border-emerald-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Paid & Verified
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#EBF3EE] text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-800 tracking-tight font-serif">
            {paidAndAttendedCount}
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-[#EBF3EE] px-2 py-0.5 rounded-md border border-emerald-200/60">
            {complianceRate}%
          </span>
        </div>
        <div className="mt-2 text-xs text-stone-500 flex items-center gap-1">
          <span>{paidAbsentCount > 0 ? `+${paidAbsentCount} advance / absent` : 'Fully verified'}</span>
        </div>
      </div>

      {/* 3. Unpaid Students (Defaulters) */}
      <div className={`rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border transition ${
        unpaidCount > 0
          ? 'bg-[#FDF6F6] border-[#F7D4D4] ring-1 ring-rose-300/40'
          : 'bg-[#FFFFFF] border-[#E7E4DC]'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
            Unpaid Defaulters
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-rose-700 tracking-tight font-serif">
            {unpaidCount}
          </span>
          <span className="text-xs font-semibold text-rose-800">
            {unpaidCount === 0 ? 'All fees settled! 🎉' : 'Action needed'}
          </span>
        </div>
        <div className="mt-2 text-xs text-rose-900/70">
          {unpaidCount > 0 ? 'Attended classes without fee record' : 'Zero outstanding dues'}
        </div>
      </div>

      {/* 4. Financial Rate / Revenue */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:border-[#D5D0C4]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {hasAmounts ? 'Fee Reconciliation' : 'Settlement Rate'}
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#FEF5E7] text-amber-800 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {hasAmounts ? (
            <>
              <span className="text-2xl font-extrabold text-stone-900 tracking-tight font-serif">
                ₹{totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400 font-medium">collected</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
                {complianceRate}%
              </span>
              <span className="text-xs text-stone-400 font-medium">settled</span>
            </>
          )}
        </div>
        <div className="mt-2 text-xs text-stone-500">
          {hasAmounts && unpaidCount > 0 ? (
            <span className="text-rose-700 font-semibold">
              ~₹{estimatedUnpaidRevenue.toLocaleString()} pending dues
            </span>
          ) : (
            <span>{totalPaidInLog} total receipts verified</span>
          )}
        </div>
      </div>
    </div>
  );
}
