import React, { useState } from 'react';
import { Claim, Product } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';
import {
  Search,
  Filter,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
  User,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface Props {
  claims: Claim[];
  products: Product[];
  onRaiseNewClaim: () => void;
}

export const CustomerClaimsPage: React.FC<Props> = ({ claims, products, onRaiseNewClaim }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');
  const [warrantyFilter, setWarrantyFilter] = useState('ALL');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showReportModal, setShowReportModal] = useState<Claim | null>(null);

  // Filtered claims
  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issueCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesProduct = productFilter === 'ALL' || c.productId === productFilter;
    const matchesWarranty = warrantyFilter === 'ALL' ||
      (warrantyFilter === 'ACTIVE' && c.isWarrantyActive) ||
      (warrantyFilter === 'EXPIRED' && !c.isWarrantyActive);

    return matchesSearch && matchesStatus && matchesProduct && matchesWarranty;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Track & Manage</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">My Service Claims & History</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates from claim registration to technician resolution.
          </p>
        </div>

        <button
          onClick={onRaiseNewClaim}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
        >
          <Wrench className="w-4 h-4" />
          <span>Raise New Service Claim</span>
        </button>
      </div>

      {/* Selected Claim Live Timeline Tracker */}
      {selectedClaim && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Live Tracking View: {selectedClaim.id}
            </span>
            <button
              onClick={() => setSelectedClaim(null)}
              className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
            >
              Close Tracker ✕
            </button>
          </div>
          <Timeline
            claim={selectedClaim}
            onViewReport={() => setShowReportModal(selectedClaim)}
          />
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Claim ID (e.g. CLM-2026-1048), product, or issue..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Raised">Raised</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Filter by Product */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Products</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Filter by Warranty */}
          <select
            value={warrantyFilter}
            onChange={(e) => setWarrantyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Warranties</option>
            <option value="ACTIVE">Under Warranty</option>
            <option value="EXPIRED">Expired Warranty</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Reported Issue</th>
                <th className="py-3 px-4">Claim Date</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4">Mechanic</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No service claims found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {claim.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="truncate max-w-[180px]">{claim.productName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">SN: {claim.serialNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold">{claim.issueCategory}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{claim.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {claim.createdAt}
                    </td>
                    <td className="py-3.5 px-4">
                      {claim.isWarrantyActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <ShieldAlert className="w-3 h-3 text-rose-600" /> Expired
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {claim.assignedMechanicName ? (
                        <span className="font-semibold text-slate-800">{claim.assignedMechanicName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Assigning...</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={claim.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClaim(claim);
                        }}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition"
                      >
                        Track →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Service Report Modal for Customer */}
      {showReportModal && showReportModal.serviceReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Certified Repair Record</span>
                <h3 className="text-xl font-extrabold mt-0.5">Digital Service Report</h3>
              </div>
              <button
                onClick={() => setShowReportModal(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Claim ID:</span>
                  <span className="font-mono font-bold text-indigo-600">{showReportModal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="font-bold text-slate-800">{showReportModal.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Engineer:</span>
                  <span className="font-bold text-slate-800">{showReportModal.serviceReport.mechanicName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Completion Date:</span>
                  <span className="font-medium text-slate-700">{showReportModal.serviceReport.serviceDate}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Technician Diagnosis:</span>
                <p className="p-3 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  {showReportModal.serviceReport.diagnosis}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Action Taken / Resolution:</span>
                <p className="p-3 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  {showReportModal.serviceReport.actionTaken}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Parts Replaced:</span>
                <div className="flex flex-wrap gap-2">
                  {showReportModal.serviceReport.partsReplaced.map((part, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
                      ✓ {part}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Customer verified and verified operational status on-site.</span>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowReportModal(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
