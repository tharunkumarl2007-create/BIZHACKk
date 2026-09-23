import React, { useState } from 'react';
import { Claim, Mechanic } from '../../types';
import { db } from '../../services/db';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ServiceReportModal } from '../../components/mechanic/ServiceReportModal';
import { Timeline } from '../../components/common/Timeline';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Check,
  Play,
  Eye,
  X,
  FileCheck2,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface Props {
  mechanic: Mechanic;
  claims: Claim[];
  onRefresh: () => void;
}

export const MechanicDashboard: React.FC<Props> = ({ mechanic, claims, onRefresh }) => {
  const [reportModalClaim, setReportModalClaim] = useState<Claim | null>(null);
  const [detailClaim, setDetailClaim] = useState<Claim | null>(null);

  // Filter claims assigned to this mechanic
  const myClaims = claims.filter(c => c.assignedMechanicId === mechanic.id);

  // KPIs
  const assignedJobs = myClaims.length;
  const todaysVisits = myClaims.filter(c => c.status === 'In Progress').length;
  const completedJobs = myClaims.filter(c => c.status === 'Resolved').length;
  const pendingJobs = myClaims.filter(c => c.status === 'In Progress' || c.status === 'Raised').length;

  const handleStartService = (claimId: string) => {
    db.updateClaimStatus(claimId, 'In Progress', 'visit_scheduled', 'Technician arrived at doorstep. Diagnostic in progress.');
    onRefresh();
    alert(`Service started for claim ${claimId}. Customer notified that technician has commenced diagnosis.`);
  };

  return (
    <div className="space-y-8">
      {/* Top Mechanic Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-5">
          <img
            src={mechanic.avatar}
            alt={mechanic.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ● On-Duty Field Technician
              </span>
              <span className="text-xs text-slate-400">{mechanic.location}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">{mechanic.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Specialist in {mechanic.specialization.join(' • ')} | Rating: ★ {mechanic.rating}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Today's Route</span>
            <span className="font-extrabold text-white">{todaysVisits} Doorstep Stops</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (4 KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Assigned Jobs"
          value={assignedJobs}
          subtext="Total ticket queue"
          icon={Wrench}
          color="indigo"
        />
        <KpiCard
          title="Today's Visits"
          value={todaysVisits}
          subtext="Scheduled home visits"
          icon={Calendar}
          color="blue"
        />
        <KpiCard
          title="Completed"
          value={completedJobs}
          subtext="Signed off & resolved"
          icon={CheckCircle2}
          color="emerald"
        />
        <KpiCard
          title="Pending"
          value={pendingJobs}
          subtext="Action required"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Today's Service Visits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Today's Service Visits</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute doorstep diagnostic, capture before/after photos, and submit digital repair sign-off.
            </p>
          </div>
        </div>

        {myClaims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No service visits assigned to your queue currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myClaims.map((claim) => {
              const isResolved = claim.status === 'Resolved';

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    {/* Top Row: Claim ID & Warranty Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-mono font-bold text-xs text-indigo-600 block">{claim.id}</span>
                        <span className="text-[11px] text-slate-400">{claim.createdAt}</span>
                      </div>
                      <div>
                        {claim.isWarrantyActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Under Warranty
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <ShieldAlert className="w-3 h-3 text-rose-600" /> ⚠ Expired Warranty
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer & Product Information */}
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{claim.productName}</h4>
                      <p className="text-xs text-slate-500 font-mono">SN: {claim.serialNumber}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Customer:</span>
                        <span className="font-bold text-slate-900">{claim.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Contact:</span>
                        <a href={`tel:${claim.customerPhone}`} className="font-semibold text-indigo-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {claim.customerPhone}
                        </a>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-slate-400 font-medium">Address:</span>
                        <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                          {claim.customerAddress}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Time Slot:</span>
                        <span className="font-bold text-indigo-700">{claim.visitTime || '10:30 AM'}</span>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-0.5">Problem Reported:</span>
                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                        "{claim.issueCategory}: {claim.description}"
                      </p>
                    </div>

                    {claim.isRepeatIssue && (
                      <div className="p-2 rounded-lg bg-amber-100/60 border border-amber-300 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <span>⚠ Repeat failure on this unit ({claim.repeatIssueCount}x). Inspect compressor/motor thoroughly.</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailClaim(claim)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-200/60 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!isResolved && (
                        <button
                          onClick={() => handleStartService(claim.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Service</span>
                        </button>
                      )}

                      {!isResolved ? (
                        <button
                          onClick={() => setReportModalClaim(claim)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Complete Service</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Service Report Completion Modal */}
      {reportModalClaim && (
        <ServiceReportModal
          claim={reportModalClaim}
          mechanic={mechanic}
          isOpen={true}
          onClose={() => setReportModalClaim(null)}
          onCompleted={() => {
            onRefresh();
            setReportModalClaim(null);
          }}
        />
      )}

      {/* Claim Detail Modal */}
      {detailClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Job Detail</span>
                <h3 className="text-xl font-extrabold mt-0.5">{detailClaim.id}</h3>
              </div>
              <button
                onClick={() => setDetailClaim(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
              <Timeline claim={detailClaim} />

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-slate-900">{detailClaim.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-bold text-indigo-600">{detailClaim.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Full Address:</span>
                  <span className="font-medium text-slate-800">{detailClaim.customerAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Appliance:</span>
                  <span className="font-bold text-slate-900">{detailClaim.productName} ({detailClaim.serialNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Status:</span>
                  <span className={`font-bold ${detailClaim.isWarrantyActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {detailClaim.isWarrantyActive ? '✓ Active Warranty' : '⚠ Expired Warranty'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                {detailClaim.status !== 'Resolved' && (
                  <button
                    onClick={() => {
                      const c = detailClaim;
                      setDetailClaim(null);
                      setReportModalClaim(c);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Service</span>
                  </button>
                )}
                <button
                  onClick={() => setDetailClaim(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
