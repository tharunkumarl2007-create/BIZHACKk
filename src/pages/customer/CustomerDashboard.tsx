import React, { useState } from 'react';
import { Customer, Product, Claim } from '../../types';
import { KpiCard } from '../../components/common/KpiCard';
import { ProductCard } from '../../components/customer/ProductCard';
import { Timeline } from '../../components/common/Timeline';
import {
  Package,
  ShieldCheck,
  Clock,
  CheckCircle2,
  PlusCircle,
  Wrench,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface Props {
  customer: Customer;
  products: Product[];
  claims: Claim[];
  onOpenRegister: () => void;
  onOpenRaiseClaim: (product?: Product) => void;
  onViewProductWarranty: (product: Product) => void;
  onViewAllClaims: () => void;
  onViewAllProducts: () => void;
}

export const CustomerDashboard: React.FC<Props> = ({
  customer,
  products,
  claims,
  onOpenRegister,
  onOpenRaiseClaim,
  onViewProductWarranty,
  onViewAllClaims,
  onViewAllProducts
}) => {
  // KPI Metrics
  const registeredCount = products.length;
  const activeWarrantiesCount = products.filter(p => p.status === 'active').length;
  const openClaimsCount = claims.filter(c => c.status === 'Raised' || c.status === 'In Progress').length;
  const resolvedClaimsCount = claims.filter(c => c.status === 'Resolved').length;

  // Active claim highlight (e.g. In Progress claim)
  const activeClaim = claims.find(c => c.status === 'In Progress' || c.status === 'Raised');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Welcome back
              </span>
              <span className="text-xs text-slate-400">Bengaluru Resident Member</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hello, {customer.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your appliance warranties, register newly purchased products via Bill OCR, and request doorstep service mechanics in a single click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold shadow-md transition"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Register Product</span>
            </button>

            <button
              onClick={() => onOpenRaiseClaim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/30 transition"
            >
              <Wrench className="w-4 h-4" />
              <span>Raise Service Claim</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Registered Products"
          value={registeredCount}
          subtext="Total household assets"
          icon={Package}
          color="indigo"
          onClick={onViewAllProducts}
        />
        <KpiCard
          title="Active Warranties"
          value={activeWarrantiesCount}
          subtext="Under free manufacturer cover"
          icon={ShieldCheck}
          color="emerald"
          onClick={onViewAllProducts}
        />
        <KpiCard
          title="Open Claims"
          value={openClaimsCount}
          subtext="In review or assigned"
          icon={Clock}
          color="amber"
          onClick={onViewAllClaims}
        />
        <KpiCard
          title="Resolved Claims"
          value={resolvedClaimsCount}
          subtext="Repairs completed"
          icon={CheckCircle2}
          color="blue"
          onClick={onViewAllClaims}
        />
      </div>

      {/* Active Claim Live Timeline Banner (if any) */}
      {activeClaim && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-slate-900 text-sm">Active Service Claim in Progress</h3>
            </div>
            <button
              onClick={onViewAllClaims}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Claims</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <Timeline claim={activeClaim} />
        </div>
      )}

      {/* My Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Registered Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated remaining warranty tracking with real-time status indicators.
            </p>
          </div>

          <button
            onClick={onViewAllProducts}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRaiseClaim={() => onOpenRaiseClaim(product)}
              onViewWarranty={() => onViewProductWarranty(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
