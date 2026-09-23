import React, { useState } from 'react';
import { Claim, Product, Mechanic } from '../../types';
import { KpiCard } from '../../components/common/KpiCard';
import { RepeatIssueBanner } from '../../components/staff/RepeatIssueBanner';
import { AnalyticsCharts } from '../../components/staff/AnalyticsCharts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MechanicAssignModal } from '../../components/staff/MechanicAssignModal';
import {
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface Props {
  claims: Claim[];
  products: Product[];
  mechanics: Mechanic[];
  onNavigateToClaims: () => void;
  onRefresh: () => void;
}

export const StaffDashboard: React.FC<Props> = ({
  claims,
  products,
  mechanics,
  onNavigateToClaims,
  onRefresh
}) => {
  const [assigningClaim, setAssigningClaim] = useState<Claim | null>(null);

  // KPIs
  const totalClaims = claims.length;
  const newClaims = claims.filter(c => c.status === 'Raised').length;
  const inProgress = claims.filter(c => c.status === 'In Progress').length;
  const resolved = claims.filter(c => c.status === 'Resolved').length;
  const expiredWarrantyClaims = claims.filter(c => !c.isWarrantyActive).length;

  return (
    <div className="space-y-8">
      {/* Welcome & System Stats Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Operations Control
            </span>
            <span className="text-xs text-slate-400">Bengaluru Metro Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Staff & Warranty Operations Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live queue triage, smart technician routing, warranty coverage enforcement, and recurring failure analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToClaims}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/30 transition"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Manage All Claims ({claims.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (5 KPIs as specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Claims"
          value={totalClaims}
          subtext="All time filings"
          icon={ClipboardList}
          color="indigo"
          onClick={onNavigateToClaims}
        />
        <KpiCard
          title="New Claims"
          value={newClaims}
          subtext="Awaiting review"
          icon={Clock}
          color="blue"
          onClick={onNavigateToClaims}
        />
        <KpiCard
          title="In Progress"
          value={inProgress}
          subtext="Dispatched / active"
          icon={Wrench}
          color="purple"
          onClick={onNavigateToClaims}
        />
        <KpiCard
          title="Resolved"
          value={resolved}
          subtext="Completed repairs"
          icon={CheckCircle2}
          color="emerald"
          onClick={onNavigateToClaims}
        />
        <KpiCard
          title="Expired Warranty"
          value={expiredWarrantyClaims}
          subtext="Billable service cases"
          icon={ShieldAlert}
          color="rose"
          onClick={onNavigateToClaims}
        />
      </div>

      {/* SMART ANALYTICS: REPEAT ISSUE DETECTION BANNER */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Smart Analytics & Quality Monitoring
          </span>
          <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Rule: ≥2 claims / 60 days
          </span>
        </div>
        <RepeatIssueBanner onInspectProduct={() => onNavigateToClaims()} />
      </div>

      {/* Analytics Charts (4 clean charts) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Performance Analytics
          </span>
        </div>
        <AnalyticsCharts claims={claims} products={products} />
      </div>

      {/* High-Priority Queue / Needs Mechanic Assignment */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Priority Dispatch Queue (Unassigned Claims)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tickets awaiting technician allocation</p>
          </div>
          <button
            onClick={onNavigateToClaims}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {claims.filter(c => !c.assignedMechanicId && c.status !== 'Rejected' && c.status !== 'Resolved').length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All open claims currently have assigned technicians!</p>
          ) : (
            claims
              .filter(c => !c.assignedMechanicId && c.status !== 'Rejected' && c.status !== 'Resolved')
              .map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-indigo-600">{c.id}</span>
                      <span className="font-bold text-slate-900 text-xs">{c.productName}</span>
                      {c.isWarrantyActive ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Under Warranty
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          ⚠ Expired Warranty
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Issue: <strong>{c.issueCategory}</strong> – {c.description}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Customer: {c.customerName} • {c.customerAddress}
                    </p>
                  </div>

                  <button
                    onClick={() => setAssigningClaim(c)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Assign Mechanic</span>
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Smart Mechanic Modal */}
      {assigningClaim && (
        <MechanicAssignModal
          claim={assigningClaim}
          isOpen={true}
          onClose={() => setAssigningClaim(null)}
          onAssigned={() => {
            onRefresh();
            setAssigningClaim(null);
          }}
        />
      )}
    </div>
  );
};
