import React, { useState } from 'react';
import { Mechanic, Claim } from '../../types';
import { db } from '../../services/db';
import { Star, MapPin, Briefcase, Phone, Mail, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  mechanics: Mechanic[];
  claims: Claim[];
  onRefresh: () => void;
}

export const StaffMechanicsPage: React.FC<Props> = ({ mechanics, claims, onRefresh }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Field Service Force</span>
        <h2 className="text-2xl font-black text-slate-900 mt-0.5">Technicians & Mechanic Roster</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor technician locations, active workload capacities, service ratings, and domain specializations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((mech) => {
          const activeJobsCount = claims.filter(
            c => c.assignedMechanicId === mech.id && c.status === 'In Progress'
          ).length;

          return (
            <div
              key={mech.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={mech.avatar}
                      alt={mech.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{mech.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mech.location}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      mech.availableToday
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {mech.availableToday ? '● Available' : '○ Off-duty'}
                  </span>
                </div>

                {/* Specialties */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mech.specialization.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Workload and Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Distance</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{mech.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Current Jobs</span>
                    <span className="font-bold text-indigo-600 mt-0.5 block">{mech.currentJobs}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Rating</span>
                    <span className="font-bold text-amber-600 mt-0.5 block flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {mech.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  {mech.phone}
                </span>
                <span className="font-semibold text-slate-700">
                  {mech.completedJobs} Lifetime Repairs
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
