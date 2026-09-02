import React from 'react';

export function ReportPrintView({ reconciliationData, monthName = 'Current Month' }) {
  if (!reconciliationData) return null;

  const { unpaid, paidAndAttended, paidAbsent, stats } = reconciliationData;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block p-8 bg-white text-black max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-serif font-black tracking-wide uppercase">
            Trinity Logs
          </h1>
          <p className="text-xs text-gray-600 tracking-wider uppercase font-semibold">
            Monthly Attendance & Fee Settlement Audit Report
          </p>
        </div>
        <div className="text-right text-xs">
          <div><strong>Report Period:</strong> {monthName}</div>
          <div><strong>Generated On:</strong> {currentDate}</div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-4 gap-4 p-4 border border-gray-300 rounded mb-6 text-center text-xs">
        <div>
          <div className="text-gray-500 uppercase">Total Attended</div>
          <div className="text-xl font-bold">{stats.totalAttended}</div>
        </div>
        <div>
          <div className="text-gray-500 uppercase">Fees Cleared</div>
          <div className="text-xl font-bold text-green-700">{stats.paidAndAttendedCount}</div>
        </div>
        <div>
          <div className="text-gray-500 uppercase">Fees Pending</div>
          <div className="text-xl font-bold text-red-600">{stats.unpaidCount}</div>
        </div>
        <div>
          <div className="text-gray-500 uppercase">Settlement Rate</div>
          <div className="text-xl font-bold">{stats.complianceRate}%</div>
        </div>
      </div>

      {/* Defaulter Table */}
      <div className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
          Unpaid Students (Action Required - {unpaid.length} Defaulters)
        </h2>
        {unpaid.length === 0 ? (
          <p className="text-xs italic text-gray-600">All student fees for this month are fully settled.</p>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="py-2">#</th>
                <th className="py-2">Student Name</th>
                <th className="py-2">Batch / Class</th>
                <th className="py-2">Contact Number</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {unpaid.map((student, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-1.5">{idx + 1}</td>
                  <td className="py-1.5 font-semibold">{student.name}</td>
                  <td className="py-1.5">{student.batch || 'General'}</td>
                  <td className="py-1.5">{student.phone || 'N/A'}</td>
                  <td className="py-1.5 text-red-700 font-bold">Unpaid</td>
                  <td className="py-1.5 text-right italic text-gray-500">Notice Pending</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Verified Paid Students Summary */}
      <div className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
          Paid & Cleared Attendees ({paidAndAttended.length})
        </h2>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          {paidAndAttended.map((student, idx) => (
            <div key={idx} className="truncate">
              • {student.name} <span className="text-gray-500">({student.batch || 'Gen'})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-off signatures */}
      <div className="mt-16 pt-8 border-t border-gray-400 flex justify-between text-xs">
        <div>
          <div className="w-44 border-b border-black mb-1"></div>
          <div>Audited & Verified By</div>
        </div>
        <div className="text-right">
          <div className="w-44 border-b border-black mb-1 ml-auto"></div>
          <div>Authorized Administrator</div>
        </div>
      </div>
    </div>
  );
}
