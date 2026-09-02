import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Send } from 'lucide-react';
import { canonicalizePhone } from '../utils/reconciliation';

export function ReminderModal({
  isOpen,
  onClose,
  student, // single student or null for bulk
  allUnpaidStudents = [],
  monthName = 'September 2026',
}) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState(
    `Dear {name},\n\nGreetings from Trinity! This is a gentle reminder regarding your monthly class fees for {month} ({batch}).\n\nOur records indicate that your fee payment is currently pending. Please arrange for the payment at your earliest convenience.\n\nIf you have already paid, please share the payment screenshot with us so we can update our records.\n\nThank you!\nTrinity Team`
  );

  const formatMessage = (s) => {
    return template
      .replace(/\{name\}/g, s?.name || 'Student')
      .replace(/\{batch\}/g, s?.batch || 'Regular')
      .replace(/\{month\}/g, monthName);
  };

  const handleCopySingle = () => {
    if (!student) return;
    const msg = formatMessage(student);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const allMessages = allUnpaidStudents.map(s => `--- ${s.name} (${s.phone || 'No Phone'}) ---\n${formatMessage(s)}\n`).join('\n');
    navigator.clipboard.writeText(allMessages);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phoneDigits = student ? canonicalizePhone(student.phone) : '';
  const canSendWhatsApp = Boolean(student && phoneDigits.length >= 10);
  const whatsappUrl = canSendWhatsApp
    ? `https://wa.me/91${phoneDigits}?text=${encodeURIComponent(formatMessage(student))}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E4DC] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F0ECE1] bg-[#FBF9F4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF3EE] text-emerald-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                {student ? `Fee Reminder: ${student.name}` : `Bulk Fee Reminders (${allUnpaidStudents.length})`}
              </h3>
              <p className="text-xs text-stone-500">
                {student?.phone ? `Contact: ${student.phone}` : 'Customize and dispatch reminder notification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-[#F5F3EC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 bg-[#FFFFFF]">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex justify-between items-center">
              <span>Message Template</span>
              <span className="text-[11px] text-stone-400 font-normal">Tags: &#123;name&#125;, &#123;batch&#125;, &#123;month&#125;</span>
            </label>
            <textarea
              rows={6}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full text-xs font-mono bg-[#F8F6F0] border border-[#E7E4DC] rounded-xl p-3 text-stone-800 focus:ring-1 focus:ring-emerald-700 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Live Preview */}
          {student && (
            <div>
              <div className="text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                Preview for {student.name}:
              </div>
              <div className="p-3.5 rounded-xl bg-[#EBF3EE]/60 border border-emerald-200/70 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                {formatMessage(student)}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#F0ECE1] bg-[#FBF9F4] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {student ? (
              <>
                <button
                  onClick={handleCopySingle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FFFFFF] text-stone-700 border border-[#DED9CE] hover:bg-[#F5F3EC] transition shadow-2xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                {canSendWhatsApp ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button
                    disabled
                    title="No valid 10-digit phone number"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 bg-[#F5F3EC] cursor-not-allowed border border-[#E7E4DC]"
                  >
                    <Send className="w-4 h-4" />
                    <span>No Phone</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied All!' : `Copy All (${allUnpaidStudents.length}) Reminders`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
