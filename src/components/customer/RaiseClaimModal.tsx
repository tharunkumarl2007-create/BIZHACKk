import React, { useState, useEffect } from 'react';
import { Product, Claim } from '../../types';
import { db } from '../../services/db';
import {
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  Camera,
  Trash2,
  Plus
} from 'lucide-react';

interface Props {
  customerId: string;
  initialProduct?: Product;
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: (newClaim: Claim) => void;
}

export const RaiseClaimModal: React.FC<Props> = ({
  customerId,
  initialProduct,
  isOpen,
  onClose,
  onClaimSubmitted
}) => {
  const products = db.getProducts(customerId);
  const customer = db.getCustomerById(customerId);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [issueCategory, setIssueCategory] = useState('Cooling Failure');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-09-25');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [contactNumber, setContactNumber] = useState(customer?.phone || '+91 98201 44552');
  const [serviceAddress, setServiceAddress] = useState(
    customer ? `${customer.address}, ${customer.city} - ${customer.pincode}` : ''
  );
  const [photosAttached, setPhotosAttached] = useState<string[]>([
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80'
  ]);
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map(file => URL.createObjectURL(file));
      setPhotosAttached(prev => [...prev, ...newUrls]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotosAttached(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [initialProduct, products]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId);
  const isWarrantyActive = currentProduct ? currentProduct.status === 'active' : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !description) {
      alert('Please select a product and enter the problem description.');
      return;
    }

    const created = db.createClaim({
      customerId,
      productId: selectedProductId,
      issueCategory,
      description,
      preferredDate,
      preferredTime,
      contactNumber,
      photos: photosAttached
    });

    setSubmittedClaim(created);
  };

  const handleFinish = () => {
    if (submittedClaim) {
      onClaimSubmitted(submittedClaim);
    }
    setSubmittedClaim(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Doorstep Assistance</span>
            <h3 className="text-xl font-extrabold mt-0.5">Raise After-Sales Service Claim</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedClaim ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold inline-block mb-2">
                Claim successfully raised
              </span>
              <h3 className="text-2xl font-black text-slate-900">Ticket ID: {submittedClaim.id}</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                Your service claim for <strong>{submittedClaim.productName}</strong> has been assigned to our central dispatch queue. A certified technician will be assigned shortly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="font-semibold text-slate-800">{submittedClaim.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Warranty Status:</span>
                <span className={`font-bold ${submittedClaim.isWarrantyActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {submittedClaim.isWarrantyActive ? '✓ Active Warranty' : '⚠ Expired (Chargeable)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Preferred:</span>
                <span className="font-medium text-slate-800">{submittedClaim.preferredDate} ({submittedClaim.preferredTime})</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full max-w-md py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition"
            >
              Track Claim Status Now →
            </button>
          </div>
        ) : (
          /* Claim Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* 1. Select registered product */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Registered Product *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (SN: {p.serialNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* AUTOMATIC WARRANTY STATUS BADGE CALLOUT */}
            {currentProduct && (
              <div
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isWarrantyActive
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50/70 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isWarrantyActive ? (
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">Warranty Status:</span>
                      <span className={`font-black text-xs ${isWarrantyActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isWarrantyActive ? '✓ Active' : '⚠ Expired'}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {isWarrantyActive
                        ? `Valid until ${new Date(currentProduct.warrantyExpiryDate).toLocaleDateString('en-GB')}. Zero service charge.`
                        : 'Product warranty expired. Inspection & repair may be chargeable.'}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-white/80 shadow-2xs">
                  {currentProduct.brand}
                </span>
              </div>
            )}

            {/* Problem Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Problem Category *</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Cooling Failure">Cooling Failure / Inefficient Cooling</option>
                  <option value="No Power / Not Turning On">No Power / Not Turning On</option>
                  <option value="Water Leakage / Drainage Error">Water Leakage / Drainage Error</option>
                  <option value="Abnormal Noise / Vibration">Abnormal Noise / Vibration</option>
                  <option value="Display / Control Panel Error">Display / Control Panel Error</option>
                  <option value="Physical Damage / Part Broken">Physical Damage / Part Broken</option>
                  <option value="General Periodic Maintenance">General Periodic Maintenance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Number *</label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98201 44552"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Problem Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail (e.g. error codes displayed, sounds, timeline)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Upload problem photos/videos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Upload Problem Photos / Video Clip
                </label>
                <span className="text-[11px] font-semibold text-indigo-600">
                  {photosAttached.length} photo(s) attached
                </span>
              </div>

              {/* Hidden real file input */}
              <input
                type="file"
                id="claim-photo-input"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />

              <div className="border border-dashed border-indigo-200 rounded-2xl p-4 bg-indigo-50/20 hover:bg-indigo-50/40 transition">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <label
                    htmlFor="claim-photo-input"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Photos from Device</span>
                  </label>
                  <span className="text-[11px] text-slate-500 text-center sm:text-right">
                    Click to select JPG, PNG images of the appliance defect
                  </span>
                </div>

                {/* Thumbnails of attached photos with removal */}
                {photosAttached.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-3 border-t border-indigo-100">
                    {photosAttached.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-black/10 shadow-2xs"
                      >
                        <img
                          src={url}
                          alt={`Problem photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md transition shadow-sm"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Service Address */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Home Service Address *</label>
              <input
                type="text"
                required
                value={serviceAddress}
                onChange={(e) => setServiceAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Preferred Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time Slot *</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
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
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Submit Service Claim</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
