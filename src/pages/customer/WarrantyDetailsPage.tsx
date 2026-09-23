import React from 'react';
import { Product } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Receipt,
  FileText,
  Clock,
  ArrowLeft,
  Wrench,
  CheckCircle2
} from 'lucide-react';

interface Props {
  product: Product;
  onBack: () => void;
  onRaiseClaim: (p: Product) => void;
}

export const WarrantyDetailsPage: React.FC<Props> = ({ product, onBack, onRaiseClaim }) => {
  const purchaseDate = new Date(product.purchaseDate);
  const expiryDate = new Date(product.warrantyExpiryDate);
  const today = new Date();

  const isExpired = today > expiryDate;
  const daysTotal = Math.max(1, (expiryDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const remainingMonths = Math.floor(daysRemaining / 30.4);
  const remainingYears = Math.floor(remainingMonths / 12);
  const leftMonths = remainingMonths % 12;

  let remainingText = '';
  if (isExpired) {
    remainingText = 'Warranty Expired';
  } else if (remainingYears > 0) {
    remainingText = `${remainingYears} Year${remainingYears > 1 ? 's' : ''} ${leftMonths} Month${leftMonths !== 1 ? 's' : ''}`;
  } else {
    remainingText = `${remainingMonths} Months`;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <button
          onClick={() => onRaiseClaim(product)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
        >
          <Wrench className="w-4 h-4" />
          <span>Raise Service Claim</span>
        </button>
      </div>

      {/* Main Warranty Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {product.serialNumber}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">{product.brand}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{product.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Purchased from {product.seller}</p>
            </div>
          </div>

          <div>
            <StatusBadge status={isExpired ? 'expired' : 'active'} type="warranty" size="lg" />
          </div>
        </div>

        {/* Big 3-Column Key Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Purchase Date
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {purchaseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Standard {Math.round(product.warrantyMonths / 12)} Year Warranty
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Warranty Expiry
            </span>
            <span className={`text-2xl font-black mt-1 block ${isExpired ? 'text-rose-600' : 'text-slate-900'}`}>
              {expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Coverage terminates on this date
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block">
              Remaining Warranty
            </span>
            <span className={`text-2xl font-black mt-1 block ${isExpired ? 'text-rose-600' : 'text-indigo-700'}`}>
              {remainingText}
            </span>
            <span className="text-xs text-indigo-600/80 mt-1 block">
              {isExpired ? 'Out of coverage period' : `${daysRemaining} days left`}
            </span>
          </div>
        </div>

        {/* VISUAL WARRANTY TIMELINE */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Visual Warranty Timeline
            </h4>
            <span className="text-xs font-mono text-slate-400">
              Total Duration: {product.warrantyMonths} Months
            </span>
          </div>

          {/* Timeline Bar */}
          <div className="relative pt-6 pb-2">
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  isExpired ? 'bg-rose-500 w-full' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                }`}
                style={{ width: isExpired ? '100%' : `${Math.min(100, Math.max(10, Math.round(((daysTotal - daysRemaining) / daysTotal) * 100)))}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-300 mt-3">
              <div>
                <span className="block text-[10px] text-slate-400 font-mono">PURCHASED</span>
                <span className="font-bold">{purchaseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-indigo-400 font-mono">TODAY</span>
                <span className="font-bold">{today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 font-mono">EXPIRATION</span>
                <span className={`font-bold ${isExpired ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner for Expired Products */}
        {isExpired ? (
          <div className="mt-6 p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-4">
            <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h5 className="font-bold text-rose-900 text-sm">WARRANTY EXPIRED</h5>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                Expiry Date: {expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-rose-700 mt-1 font-semibold">
                ⚠ This product is not covered under standard warranty. Service may be chargeable.
              </p>
              <p className="text-xs text-rose-600 mt-2">
                You can still raise a service claim. A transparent quote for parts and labor will be provided prior to dispatch.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h5 className="font-bold text-emerald-950 text-sm">Full Coverage Active</h5>
                <p className="text-xs text-emerald-800 mt-0.5">
                  100% free doorstep repair, original manufacturer parts, and certified technician visits.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
              Zero Deductible
            </span>
          </div>
        )}

        {/* Uploaded Bill Reference */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Receipt className="w-4 h-4 text-indigo-500" />
            <span>Digital Proof of Purchase: <strong>{product.billFileName || 'Purchase_Invoice.pdf'}</strong></span>
          </div>
          <button
            onClick={() => alert(`Opening archived proof of purchase: ${product.billFileName || 'Invoice.pdf'}`)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
          >
            Download Verified Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
