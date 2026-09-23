import React from 'react';
import { db } from '../../services/db';
import { AlertTriangle, ArrowRight, ShieldAlert, History, CheckCircle, Info } from 'lucide-react';

interface Props {
  onInspectProduct?: (productId: string) => void;
}

export const RepeatIssueBanner: React.FC<Props> = ({ onInspectProduct }) => {
  const repeatedData = db.getRepeatedIssueProducts();

  if (repeatedData.length === 0) return null;

  return (
    <div className="space-y-3">
      {repeatedData.map(({ product, claims }) => (
        <div
          key={product.id}
          className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 p-5 shadow-sm relative overflow-hidden"
        >
          {/* Subtle warning backdrop badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 shadow-md shadow-amber-200">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white">
                    ⚠ Rule-Based Quality Flag
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    REPEATED ISSUE DETECTED ({claims.length} Claims in 60 Days)
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">
                  {product.name} (SN: <span className="font-mono text-indigo-700">{product.serialNumber}</span>)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Customer: <strong>{claims[0]?.customerName}</strong> ({claims[0]?.customerAddress})
                </p>

                {/* List recurring issues */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Recurrence History:</span>
                  {claims.map((c, i) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-xs font-medium text-slate-700 shadow-2xs"
                    >
                      <History className="w-3 h-3 text-amber-600" />
                      #{i + 1}: {c.issueCategory} ({c.id}) - <span className="font-bold text-slate-900">{c.status}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action for Staff */}
            <div className="shrink-0 flex flex-col sm:items-end justify-center gap-2">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-lg border border-amber-300">
                Action: Escalated Quality Audit Recommended
              </span>
              {onInspectProduct && (
                <button
                  onClick={() => onInspectProduct(product.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Inspect Appliance History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
