import React, { useState } from 'react';
import { Claim, Mechanic } from '../../types';
import { db } from '../../services/db';
import {
  FileCheck2,
  CheckCircle2,
  X,
  Upload,
  Plus,
  Trash2,
  Camera,
  UserCheck,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  claim: Claim;
  mechanic: Mechanic;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export const ServiceReportModal: React.FC<Props> = ({
  claim,
  mechanic,
  isOpen,
  onClose,
  onCompleted
}) => {
  const [problemReported, setProblemReported] = useState(claim.issueCategory + ': ' + claim.description);
  const [diagnosis, setDiagnosis] = useState('Condenser coil frosting and faulty thermal deflection sensor.');
  const [actionTaken, setActionTaken] = useState('Flushed defrost drain line, recalibrated temperature sensor, replaced defective coil thermistor.');
  const [parts, setParts] = useState<string[]>(['Defrost Thermistor 5k', 'Silicone Drain Grommet']);
  const [newPartInput, setNewPartInput] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('Ran 45-minute continuous cycle. Lower chamber temperature stabilized at 3.5°C.');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerConfirmed, setCustomerConfirmed] = useState(true);

  if (!isOpen) return null;

  const handleAddPart = () => {
    if (newPartInput.trim()) {
      setParts([...parts, newPartInput.trim()]);
      setNewPartInput('');
    }
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    db.submitServiceReport(claim.id, {
      mechanicId: mechanic.id,
      mechanicName: mechanic.name,
      problemReported,
      diagnosis,
      actionTaken,
      partsReplaced: parts,
      additionalRemarks,
      beforePhotoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80',
      serviceDate,
      customerConfirmed
    });

    onCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Digital Sign-off</span>
            <h3 className="text-xl font-extrabold mt-0.5">Submit On-Site Service Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim Info Header */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Claim ID: </span>
            <span className="font-bold text-slate-800">{claim.id}</span>
            <span className="text-slate-400 ml-3">Customer: </span>
            <span className="font-semibold text-slate-700">{claim.customerName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Product: </span>
            <span className="font-bold text-indigo-700">{claim.productName}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Problem Reported */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Problem Reported</label>
            <textarea
              rows={2}
              required
              value={problemReported}
              onChange={(e) => setProblemReported(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Technician Diagnosis *</label>
            <textarea
              rows={2}
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Root cause found upon disassembly and testing..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Action Taken */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Action Taken *</label>
            <textarea
              rows={2}
              required
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="Detail repair steps taken..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Parts Replaced */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Parts Replaced</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPartInput}
                onChange={(e) => setNewPartInput(e.target.value)}
                placeholder="e.g. Thermostat Valve, Motor Capacitor"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition"
              >
                <Plus className="w-4 h-4" /> Add Part
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {parts.map((p, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => handleRemovePart(idx)}
                    className="text-indigo-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Before & After Service Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Before-Service Photo</label>
              <div className="p-3 border border-dashed border-slate-300 rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Camera className="w-4 h-4 text-indigo-500" />
                  before_repair_unit.jpg
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Attached
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">After-Service Photo</label>
              <div className="p-3 border border-dashed border-slate-300 rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Camera className="w-4 h-4 text-emerald-500" />
                  after_fixed_tested.jpg
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Attached
                </span>
              </div>
            </div>
          </div>

          {/* Service Date & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Service Date</label>
              <input
                type="date"
                required
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Additional Remarks</label>
              <input
                type="text"
                value={additionalRemarks}
                onChange={(e) => setAdditionalRemarks(e.target.value)}
                placeholder="Maintenance advice provided..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Customer Confirmation Checkbox */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center gap-3">
            <input
              type="checkbox"
              id="cust-confirm"
              checked={customerConfirmed}
              onChange={(e) => setCustomerConfirmed(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="cust-confirm" className="cursor-pointer text-xs font-medium text-slate-800">
              <span className="font-bold text-indigo-900 block">Customer Verification & Sign-off</span>
              Customer inspected the unit and confirmed operational resolution on-site.
            </label>
          </div>

          {/* Notice on Resolution */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Upon submission, Claim status automatically transitions to <strong>RESOLVED</strong>.</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit Service Report & Resolve Claim</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
