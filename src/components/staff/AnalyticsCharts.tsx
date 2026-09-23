import React from 'react';
import { Claim, Product } from '../../types';
import { BarChart3, PieChart, ShieldCheck, ShieldAlert, TrendingUp } from 'lucide-react';

interface Props {
  claims: Claim[];
  products: Product[];
}

export const AnalyticsCharts: React.FC<Props> = ({ claims, products }) => {
  // 1. Claims by Status
  const statusCounts = {
    Raised: claims.filter(c => c.status === 'Raised').length,
    'In Progress': claims.filter(c => c.status === 'In Progress').length,
    Resolved: claims.filter(c => c.status === 'Resolved').length,
    Rejected: claims.filter(c => c.status === 'Rejected').length
  };
  const totalClaims = claims.length || 1;

  // 2. Claims by Product Category
  const categoryCounts: Record<string, number> = {};
  claims.forEach(c => {
    categoryCounts[c.productCategory] = (categoryCounts[c.productCategory] || 0) + 1;
  });

  // 3. Warranty vs Expired
  const underWarrantyCount = claims.filter(c => c.isWarrantyActive).length;
  const expiredCount = claims.filter(c => !c.isWarrantyActive).length;

  // 4. Monthly Claim Volume (Mock realistic series)
  const monthlyData = [
    { month: 'Apr', volume: 4 },
    { month: 'May', volume: 6 },
    { month: 'Jun', volume: 9 },
    { month: 'Jul', volume: 14 },
    { month: 'Aug', volume: 18 },
    { month: 'Sep', volume: 22 }
  ];
  const maxVolume = Math.max(...monthlyData.map(d => d.volume));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Chart 1: Claims by Status */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <PieChart className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Claims Distribution by Status</h4>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{claims.length} Total</span>
        </div>

        <div className="space-y-3 pt-2">
          {Object.entries(statusCounts).map(([status, count]) => {
            const pct = Math.round((count / totalClaims) * 100);
            const colorClass = {
              Raised: 'bg-blue-500',
              'In Progress': 'bg-indigo-600',
              Resolved: 'bg-emerald-500',
              Rejected: 'bg-slate-400'
            }[status] || 'bg-slate-500';

            return (
              <div key={status}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{status}</span>
                  <span className="text-slate-500 font-medium">{count} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 2: Warranty vs Expired Claims */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Warranty vs Expired Claims</h4>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Eligibility Ratio</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <span className="text-2xl font-black text-emerald-700">{underWarrantyCount}</span>
            <p className="text-xs font-bold text-emerald-900 mt-0.5">Active Warranty</p>
            <span className="text-[10px] text-emerald-600">Free manufacturer service</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 text-center">
            <ShieldAlert className="w-6 h-6 text-rose-600 mx-auto mb-1" />
            <span className="text-2xl font-black text-rose-700">{expiredCount}</span>
            <p className="text-xs font-bold text-rose-900 mt-0.5">Expired Warranty</p>
            <span className="text-[10px] text-rose-600">Billable inspection/parts</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Warranty Compliance Rate</span>
          <span className="font-bold text-slate-800">
            {Math.round((underWarrantyCount / totalClaims) * 100)}%
          </span>
        </div>
      </div>

      {/* Chart 3: Claims by Product Category */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Claims by Product Category</h4>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / totalClaims) * 100);
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 truncate">{cat}</span>
                  <span className="text-slate-500 font-medium">{count} tickets</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 4: Monthly Claim Volume */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Monthly Claim Inflow Volume</h4>
          </div>
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            +22% MoM
          </span>
        </div>

        {/* Clean Bar Chart */}
        <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
          {monthlyData.map((d) => {
            const heightPct = Math.round((d.volume / maxVolume) * 100);
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                  {d.volume}
                </span>
                <div className="w-full bg-slate-100 rounded-t-lg h-28 flex items-end">
                  <div
                    className="w-full bg-indigo-600 group-hover:bg-indigo-700 rounded-t-lg transition-all duration-500 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
