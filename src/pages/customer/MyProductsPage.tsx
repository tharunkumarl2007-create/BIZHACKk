import React, { useState } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../../components/customer/ProductCard';
import { PlusCircle, Search, Filter } from 'lucide-react';

interface Props {
  products: Product[];
  onOpenRegister: () => void;
  onRaiseClaim: (p: Product) => void;
  onViewWarranty: (p: Product) => void;
}

export const MyProductsPage: React.FC<Props> = ({
  products,
  onOpenRegister,
  onRaiseClaim,
  onViewWarranty
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Household Asset Vault</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">My Registered Appliances</h2>
          <p className="text-xs text-slate-500 mt-1">
            Registered appliances with automatic warranty calculation and one-click claim filing.
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Product</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by appliance name, brand, or serial number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Kitchen Appliances">Kitchen Appliances</option>
            <option value="Consumer Electronics">Consumer Electronics</option>
            <option value="Air Conditioners">Air Conditioners</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none text-slate-700"
          >
            <option value="ALL">All Warranties</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired Only</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <p className="text-sm font-semibold">No registered products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onRaiseClaim={() => onRaiseClaim(p)}
              onViewWarranty={() => onViewWarranty(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
