import React from 'react';
import { Claim, ClaimStage } from '../../types';
import { Check, Clock, UserCheck, Calendar, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  claim: Claim;
  onViewReport?: () => void;
}

const STAGES: { key: ClaimStage; label: string; icon: any; desc: string }[] = [
  { key: 'claim_raised', label: 'Claim Raised', icon: Clock, desc: 'Ticket registered into system' },
  { key: 'staff_reviewing', label: 'Staff Reviewing', icon: AlertCircle, desc: 'Warranty validation & routing' },
  { key: 'mechanic_assigned', label: 'Mechanic Assigned', icon: UserCheck, desc: 'Field technician allocated' },
  { key: 'visit_scheduled', label: 'Home Visit Scheduled', icon: Calendar, desc: 'Confirmed slot with customer' },
  { key: 'service_completed', label: 'Service Completed', icon: Wrench, desc: 'On-site repair executed' },
  { key: 'claim_resolved', label: 'Claim Resolved', icon: CheckCircle2, desc: 'Digital report signed & closed' },
];

export const Timeline: React.FC<Props> = ({ claim, onViewReport }) => {
  // Determine index of current stage
  const stageOrder: ClaimStage[] = [
    'claim_raised',
    'staff_reviewing',
    'mechanic_assigned',
    'visit_scheduled',
    'service_completed',
    'claim_resolved'
  ];

  let currentIndex = stageOrder.indexOf(claim.stage);
  if (claim.status === 'Resolved') currentIndex = 5;
  if (claim.status === 'Rejected') currentIndex = 1; // halted at review

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Claim Lifecycle</span>
          <h4 className="text-lg font-bold text-slate-900 mt-0.5">Tracking Timeline: {claim.id}</h4>
        </div>
        {claim.status === 'Rejected' && (
          <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
            CLAIM REJECTED
          </span>
        )}
      </div>

      {/* Horizontal / Stepper Timeline for desktop, vertical for mobile */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {STAGES.map((s, idx) => {
            const isCompleted = idx < currentIndex || (idx === currentIndex && claim.status === 'Resolved');
            const isCurrent = idx === currentIndex && claim.status !== 'Resolved' && claim.status !== 'Rejected';
            const isPending = idx > currentIndex;
            const Icon = s.icon;

            return (
              <div key={s.key} className="relative flex md:flex-col items-start md:items-center text-left md:text-center group">
                {/* Connecting bar for desktop */}
                {idx < STAGES.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-5 left-1/2 w-full h-1 -z-0 transition-all ${
                      idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                </div>

                {/* Text Content */}
                <div className="ml-4 md:ml-0 md:mt-3">
                  <p
                    className={`text-xs font-bold ${
                      isCompleted ? 'text-emerald-700' : isCurrent ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Tracking Highlights Card */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Current Status</span>
          <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{claim.status}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Updated: {claim.updatedAt}</span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Assigned Mechanic</span>
          <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
            {claim.assignedMechanicName || 'Pending Assignment'}
          </span>
          {claim.assignedMechanicPhone && (
            <span className="text-[11px] text-indigo-600 block">{claim.assignedMechanicPhone}</span>
          )}
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Scheduled Visit</span>
          <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
            {claim.visitDate ? `${claim.visitDate} (${claim.visitTime})` : 'To be scheduled'}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Location: {claim.customerAddress}</span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Staff Note</span>
          <p className="font-medium text-slate-700 text-xs mt-0.5 italic">
            "{claim.staffRemarks || 'Claim is under standard evaluation.'}"
          </p>
          {claim.serviceReport && onViewReport && (
            <button
              onClick={onViewReport}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline block"
            >
              View Completed Service Report →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
