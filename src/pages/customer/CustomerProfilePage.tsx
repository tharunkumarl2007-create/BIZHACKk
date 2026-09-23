import React from 'react';
import { Customer, Product, Claim } from '../../types';
import { User, Mail, Phone, MapPin, Package, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  customer: Customer;
  products: Product[];
  claims: Claim[];
}

export const CustomerProfilePage: React.FC<Props> = ({ customer, products, claims }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-md"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900">{customer.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Customer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">Member ID: {customer.id} • Joined {customer.joinedDate}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 mt-4">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              {customer.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              {customer.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              {customer.city}
            </span>
          </div>
        </div>
      </div>

      {/* Addresses & Asset Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Addresses */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Saved Service Addresses</h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Primary Residence</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Default</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{customer.address}</p>
            <p className="text-xs text-slate-500 font-mono">{customer.city} - {customer.pincode}</p>
          </div>
        </div>

        {/* Account Assets Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Warranty Health Snapshot</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
              <span className="text-2xl font-black text-indigo-700">{products.length}</span>
              <span className="block text-xs font-semibold text-indigo-900 mt-0.5">Registered Products</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
              <span className="text-2xl font-black text-emerald-700">
                {products.filter(p => p.status === 'active').length}
              </span>
              <span className="block text-xs font-semibold text-emerald-900 mt-0.5">Active Warranties</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
            <span className="text-slate-600">Total Lifetime Service Claims:</span>
            <span className="font-bold text-slate-900">{claims.length} claims</span>
          </div>
        </div>
      </div>
    </div>
  );
};
