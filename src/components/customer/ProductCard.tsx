import React from 'react';
import { Product } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, Tag, ShieldCheck, AlertTriangle, ArrowRight, Wrench } from 'lucide-react';

interface Props {
  product: Product;
  onRaiseClaim: (product: Product) => void;
  onViewWarranty: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onRaiseClaim, onViewWarranty }) => {
  const purchaseDate = new Date(product.purchaseDate);
  const expiryDate = new Date(product.warrantyExpiryDate);
  const today = new Date();

  const totalWarrantyDays = Math.max(1, (expiryDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.max(0, (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  const isExpired = today > expiryDate;
  const progressPercent = isExpired ? 0 : Math.min(100, Math.max(5, Math.round(((totalWarrantyDays - daysPassed) / totalWarrantyDays) * 100)));

  // Calculate human remaining
  const remainingMonths = Math.floor(daysRemaining / 30.4);
  const remainingYears = Math.floor(remainingMonths / 12);
  const leftOverMonths = remainingMonths % 12;

  let remainingText = '';
  if (isExpired) {
    remainingText = 'Expired';
  } else if (remainingYears > 0) {
    remainingText = `${remainingYears} Yr ${leftOverMonths > 0 ? `${leftOverMonths} Mo` : ''} remaining`;
  } else {
    remainingText = `${remainingMonths} Months remaining`;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Product Image & Badges */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
              <Tag className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <StatusBadge status={isExpired ? 'expired' : 'active'} type="warranty" size="sm" />
          </div>
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-mono">
            {product.category}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {product.name}
            </h4>
          </div>

          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-400">Serial Number:</span>
              <span className="font-mono font-semibold text-slate-800">{product.serialNumber}</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-400">Purchased:</span>
              <span className="font-medium text-slate-800">
                {new Date(product.purchaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-400">Warranty Period:</span>
              <span className="font-medium text-slate-800">{Math.round(product.warrantyMonths / 12)} Years ({product.warrantyMonths} Mo)</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-400">Warranty Expiry:</span>
              <span className={`font-semibold ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                {new Date(product.warrantyExpiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Warranty Progress Bar or Expired Warning */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            {isExpired ? (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>⚠ This product is not covered under standard warranty. Service may be chargeable.</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Remaining Warranty
                  </span>
                  <span className="font-bold text-indigo-600">{remainingText}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      progressPercent > 40 ? 'bg-emerald-500' : progressPercent > 15 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewWarranty(product)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-200/60 transition"
        >
          View Warranty
        </button>
        <button
          onClick={() => onRaiseClaim(product)}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-3.5 rounded-xl shadow-sm transition"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Raise Claim</span>
        </button>
      </div>
    </div>
  );
};
