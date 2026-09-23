import React, { useState } from 'react';
import { Claim, Mechanic } from '../../types';
import { db } from '../../services/db';
import {
  Sparkles,
  MapPin,
  Star,
  Briefcase,
  CheckCircle,
  X,
  Wrench,
  Calendar,
  Clock,
  ThumbsUp,
  UserCheck
} from 'lucide-react';

interface Props {
  claim: Claim;
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

export const MechanicAssignModal: React.FC<Props> = ({ claim, isOpen, onClose, onAssigned }) => {
  const mechanics = db.getMechanics();
  const recommended = db.recommendMechanic(claim.productCategory, claim.customerAddress);

  const [selectedMechanicId, setSelectedMechanicId] = useState<string>(recommended.id);
  const [visitDate, setVisitDate] = useState<string>(claim.preferredDate || '2026-09-25');
  const [visitTime, setVisitTime] = useState<string>(claim.preferredTime || '10:30 AM');

  if (!isOpen) return null;

  const handleConfirmAssignment = () => {
    if (!selectedMechanicId) {
      alert('Please select a mechanic.');
      return;
    }

    db.assignMechanicToClaim(claim.id, selectedMechanicId, visitDate, visitTime);
    onAssigned();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Dispatch Dispatcher</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                {claim.id}
              </span>
            </div>
            <h3 className="text-xl font-extrabold mt-0.5">Smart Mechanic Assignment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim context summary */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Customer: </span>
            <span className="font-bold text-slate-800">{claim.customerName}</span>
            <span className="text-slate-400 ml-3">Location: </span>
            <span className="font-semibold text-slate-700">{claim.customerAddress}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Product: </span>
            <span className="font-bold text-indigo-700">{claim.productName} ({claim.productCategory})</span>
          </div>
        </div>

        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-5">
          {/* SMART RECOMMENDATION BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-lg border border-indigo-500/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner">
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Smart AI / Rule-Based Match
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                      98% Best Match
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold mt-0.5">
                    Recommended Match: {recommended.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Matched on: <strong>Specialization ({recommended.specialization.join(', ')})</strong> • <strong>Distance ({recommended.distanceKm} km away)</strong> • <strong>Low Workload ({recommended.currentJobs} active jobs)</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMechanicId(recommended.id)}
                className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Select Match
              </button>
            </div>
          </div>

          {/* List of Available Mechanics */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 text-slate-500">
              Available Technicians in Service Area
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {mechanics.map((mech) => {
                const isSelected = selectedMechanicId === mech.id;
                const isRec = recommended.id === mech.id;

                return (
                  <div
                    key={mech.id}
                    onClick={() => setSelectedMechanicId(mech.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={mech.avatar}
                        alt={mech.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-sm">{mech.name}</h5>
                          {isRec && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-md">
                              Recommended
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                              mech.availableToday
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {mech.availableToday ? '● Available Today' : '○ Busy'}
                          </span>
                        </div>

                        {/* Specialization Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mech.specialization.map((spec) => (
                            <span
                              key={spec}
                              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {mech.distanceKm} km away ({mech.location})
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            Current Jobs: {mech.currentJobs}
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {mech.rating} ({mech.completedJobs} repairs)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:justify-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule Confirmation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Confirm Service Slot
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Visit Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAssignment}
            className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Confirm Mechanic Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
