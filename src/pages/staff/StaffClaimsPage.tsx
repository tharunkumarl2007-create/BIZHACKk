import React, { useState } from 'react';
import { Claim, Mechanic } from '../../types';
import { db } from '../../services/db';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MechanicAssignModal } from '../../components/staff/MechanicAssignModal';
import { Timeline } from '../../components/common/Timeline';
import {
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  MapPin,
  Calendar,
  X,
  ShieldCheck,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

interface Props {
  claims: Claim[];
  onRefresh: () => void;
}

export const StaffClaimsPage: React.FC<Props> = ({ claims, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [warrantyFilter, setWarrantyFilter] = useState('ALL');

  // Modals
  const [assignClaim, setAssignClaim] = useState<Claim | null>(null);
  const [viewClaim, setViewClaim] = useState<Claim | null>(null);
  const [statusModalClaim, setStatusModalClaim] = useState<Claim | null>(null);

  // Status update form states
  const [newStatus, setNewStatus] = useState<Claim['status']>('In Progress');
  const [newRemarks, setNewRemarks] = useState('');

  // Filter logic
  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issueCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesWarranty = warrantyFilter === 'ALL' ||
      (warrantyFilter === 'ACTIVE' && c.isWarrantyActive) ||
      (warrantyFilter === 'EXPIRED' && !c.isWarrantyActive);

    return matchesSearch && matchesStatus && matchesWarranty;
  });

  const handleOpenStatusModal = (claim: Claim) => {
    setStatusModalClaim(claim);
    setNewStatus(claim.status);
    setNewRemarks(claim.staffRemarks || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalClaim) return;

    db.updateClaimStatus(statusModalClaim.id, newStatus, undefined, newRemarks);
    setStatusModalClaim(null);
    onRefresh();
  };

  const handleQuickReject = (claimId: string) => {
    const reason = prompt('Enter reason for rejection (e.g. Out of warranty repair declined by customer):', 'Out of warranty - customer declined estimate.');
    if (reason) {
      db.updateClaimStatus(claimId, 'Rejected', 'claim_resolved', reason);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Central Service Queue</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Claims Operations & Dispatch</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming warranty requests, assign certified technicians, manage status lifecycles, and handle out-of-warranty estimates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Claim ID, customer name, product, or serial..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Raised">Raised (New)</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Warranty filter */}
          <select
            value={warrantyFilter}
            onChange={(e) => setWarrantyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Warranties</option>
            <option value="ACTIVE">Under Active Warranty</option>
            <option value="EXPIRED">⚠ Expired Warranty Only</option>
          </select>
        </div>
      </div>

      {/* Claims Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Claim ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Issue</th>
                <th className="py-3.5 px-4">Warranty</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Assigned Mechanic</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No claims found.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition">
                    {/* Claim ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      <div>{claim.id}</div>
                      {claim.isRepeatIssue && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-white animate-pulse">
                          Repeat ({claim.repeatIssueCount}x)
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{claim.customerName}</div>
                      <div className="text-[10px] text-slate-400">{claim.customerPhone}</div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 truncate max-w-[160px]">{claim.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SN: {claim.serialNumber}</div>
                    </td>

                    {/* Issue */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700">{claim.issueCategory}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{claim.description}</div>
                    </td>

                    {/* Warranty Badge (Prominent for expired!) */}
                    <td className="py-3.5 px-4">
                      {claim.isWarrantyActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border-2 border-rose-300 shadow-2xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> ⚠ EXPIRED WARRANTY
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="truncate max-w-[130px]">{claim.customerAddress}</div>
                    </td>

                    {/* Assigned Mechanic */}
                    <td className="py-3.5 px-4">
                      {claim.assignedMechanicName ? (
                        <div>
                          <span className="font-bold text-slate-900">{claim.assignedMechanicName}</span>
                          <div className="text-[10px] text-slate-400">{claim.visitDate} ({claim.visitTime})</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssignClaim(claim)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1 transition"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign</span>
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={claim.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewClaim(claim)}
                          title="View claim details"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setAssignClaim(claim)}
                          title="Assign or reassign mechanic"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenStatusModal(claim)}
                          title="Change status or add remarks"
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {claim.status !== 'Rejected' && claim.status !== 'Resolved' && (
                          <button
                            onClick={() => handleQuickReject(claim.id)}
                            title="Reject claim"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Mechanic Assignment Modal */}
      {assignClaim && (
        <MechanicAssignModal
          claim={assignClaim}
          isOpen={true}
          onClose={() => setAssignClaim(null)}
          onAssigned={() => {
            onRefresh();
            setAssignClaim(null);
          }}
        />
      )}

      {/* View Full Claim Details Modal */}
      {viewClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Claim Profile</span>
                <h3 className="text-xl font-extrabold mt-0.5">{viewClaim.id}</h3>
              </div>
              <button
                onClick={() => setViewClaim(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
              <Timeline claim={viewClaim} />

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-slate-900">{viewClaim.customerName} ({viewClaim.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="font-bold text-slate-900">{viewClaim.productName} (SN: {viewClaim.serialNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Coverage:</span>
                  <span className={`font-bold ${viewClaim.isWarrantyActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {viewClaim.isWarrantyActive ? '✓ Under Warranty' : '⚠ Out of Warranty'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Issue Description:</span>
                  <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">{viewClaim.description}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Staff Remarks:</span>
                  <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 italic">"{viewClaim.staffRemarks}"</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const c = viewClaim;
                    setViewClaim(null);
                    setAssignClaim(c);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Mechanic</span>
                </button>
                <button
                  onClick={() => setViewClaim(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Status & Remarks Modal */}
      {statusModalClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Review & Update</span>
                <h3 className="text-xl font-extrabold mt-0.5">Update {statusModalClaim.id}</h3>
              </div>
              <button
                onClick={() => setStatusModalClaim(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Claim Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Raised">Raised</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Staff Remarks / Notes</label>
                <textarea
                  rows={3}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Add evaluation note or inspection instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalClaim(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
