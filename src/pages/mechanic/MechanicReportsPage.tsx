import React from 'react';
import { Claim } from '../../types';
import { FileText, CheckCircle2, ShieldCheck, Wrench, Calendar, User } from 'lucide-react';

interface Props {
  claims: Claim[];
}

export const MechanicReportsPage: React.FC<Props> = ({ claims }) => {
  const resolvedClaimsWithReports = claims.filter(c => c.status === 'Resolved' && c.serviceReport);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Digital Archive</span>
        <h2 className="text-2xl font-black text-slate-900 mt-0.5">Completed Service Reports</h2>
        <p className="text-xs text-slate-500 mt-1">
          Historical record of on-site diagnoses, replaced parts, and customer sign-offs.
        </p>
      </div>

      {resolvedClaimsWithReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
          <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-medium">No service reports completed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resolvedClaimsWithReports.map((c) => {
            const report = c.serviceReport!;
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-xs text-indigo-600 block">{report.id}</span>
                    <span className="text-[11px] text-slate-400">Ticket: {c.id}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.productName}</h4>
                  <p className="text-xs text-slate-500 font-mono">SN: {c.serialNumber} • Customer: {c.customerName}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Diagnosis:</span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{report.diagnosis}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Action Taken:</span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{report.actionTaken}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Replaced Parts:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {report.partsReplaced.map((part, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-md border border-indigo-100">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Signed off on {report.serviceDate}</span>
                  <span className="text-emerald-600 font-bold">✓ Customer Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
