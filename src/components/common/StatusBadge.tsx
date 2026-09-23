import React from 'react';
import { ClaimStatus, WarrantyStatus } from '../../types';
import { ShieldCheck, ShieldAlert, Clock, CheckCircle2, AlertTriangle, XCircle, Wrench } from 'lucide-react';

interface Props {
  status: ClaimStatus | WarrantyStatus | 'expiring_soon' | string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'claim' | 'warranty';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md', type = 'claim' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  // Warranty Status
  if (type === 'warranty' || status === 'active' || status === 'expired' || status === 'expiring_soon') {
    if (status === 'active' || status === 'UNDER WARRANTY') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>UNDER WARRANTY</span>
        </span>
      );
    }
    if (status === 'expired' || status === 'WARRANTY EXPIRED') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>WARRANTY EXPIRED</span>
        </span>
      );
    }
    if (status === 'expiring_soon') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>EXPIRING SOON</span>
        </span>
      );
    }
  }

  // Claim Status
  switch (status) {
    case 'Raised':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Raised</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses}`}>
          <Wrench className="w-3.5 h-3.5 text-indigo-600" />
          <span>In Progress</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Resolved</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Rejected</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-gray-100 text-gray-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
