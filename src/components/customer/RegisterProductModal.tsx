import React, { useState } from 'react';
import { Product, ExtractedBillData } from '../../types';
import { simulateOcrExtraction, SAMPLE_BILLS, SampleBillTemplate } from '../../services/ocrService';
import { db } from '../../services/db';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  X,
  FileCheck,
  Calculator,
  AlertCircle
} from 'lucide-react';

interface Props {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterProductModal: React.FC<Props> = ({ customerId, isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'ocr' | 'manual'>('ocr');

  // OCR state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Editable fields (shared between OCR extracted & manual)
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Home Appliances');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2026-06-12');
  const [warrantyMonths, setWarrantyMonths] = useState(24);
  const [purchaseAmount, setPurchaseAmount] = useState('38990');
  const [seller, setSeller] = useState('');

  if (!isOpen) return null;

  // Calculate Expiry Date automatically: Purchase Date + Warranty Period
  const calculateExpiry = (pDate: string, months: number): string => {
    try {
      const d = new Date(pDate);
      if (isNaN(d.getTime())) return 'Invalid Date';
      const expiry = new Date(d);
      expiry.setMonth(expiry.getMonth() + Number(months));
      return expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const calculatedExpiryText = calculateExpiry(purchaseDate, warrantyMonths);

  // Trigger simulated OCR
  const handleOcrProcess = async (fileOrSample: File | string) => {
    setIsScanning(true);
    setScanSuccess(false);

    if (typeof fileOrSample === 'string') {
      const sample = SAMPLE_BILLS.find(s => s.id === fileOrSample);
      setUploadedFileName(sample ? sample.name : 'Sample_Invoice.pdf');
    } else {
      setUploadedFileName(fileOrSample.name);
    }

    try {
      const data = await simulateOcrExtraction(fileOrSample, (status, percent) => {
        setScanStatus(status);
        setScanProgress(percent);
      });

      // Populate extracted information
      setProductName(data.productName);
      setSerialNumber(data.serialNumber);
      setPurchaseDate(data.purchaseDate);
      setSeller(data.seller);
      setPurchaseAmount(data.purchaseAmount.replace(/,/g, ''));
      setWarrantyMonths(data.warrantyPeriodMonths);

      // Guess brand
      if (data.productName.toLowerCase().includes('lg')) setBrand('LG');
      else if (data.productName.toLowerCase().includes('samsung')) setBrand('Samsung');
      else if (data.productName.toLowerCase().includes('daikin')) setBrand('Daikin');
      else setBrand('Standard Brand');

      setScanSuccess(true);
    } catch (e) {
      setScanStatus('Error reading document');
    } finally {
      setIsScanning(false);
    }
  };

  // Submit product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !serialNumber || !purchaseDate) {
      alert('Please fill in product name, serial number, and purchase date.');
      return;
    }

    db.addProduct({
      customerId,
      name: productName,
      category,
      brand: brand || 'Brand',
      model: model || 'Standard Model',
      serialNumber,
      purchaseDate,
      warrantyMonths: Number(warrantyMonths),
      purchaseAmount: Number(purchaseAmount) || 0,
      seller: seller || 'Authorized Dealer',
      billFileName: uploadedFileName || 'Purchase_Invoice.pdf',
      imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80',
      warrantyExpiryDate: '' // Auto-calculated in db.addProduct
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Smart Registration</span>
            <h3 className="text-xl font-extrabold mt-0.5">Register New Purchased Product</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs transition border-b-2 ${
              activeTab === 'ocr'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Option A – Upload Bill (AI / OCR Auto-Scan)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs transition border-b-2 ${
              activeTab === 'manual'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Option B – Manual Registration
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'ocr' && (
            <div className="space-y-6">
              {/* Drag & Drop Upload Bill Area */}
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center bg-indigo-50/30 hover:bg-indigo-50/60 transition group">
                <input
                  type="file"
                  id="bill-upload"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleOcrProcess(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="bill-upload" className="cursor-pointer block">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:scale-110 transition">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Upload Purchase Bill</h4>
                  <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, and PDF receipts</p>
                  <span className="inline-block mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition">
                    Browse Files
                  </span>
                </label>
              </div>

              {/* Quick Sample Bills for Demo */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Or test with 1-click sample tax invoices:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_BILLS.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleOcrProcess(sample.id)}
                      className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 transition text-xs flex items-center gap-2.5 shadow-2xs"
                    >
                      <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">{sample.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{sample.seller}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scanning Progress Bar */}
              {isScanning && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                      OCR Engine Processing...
                    </span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-indigo-700 mt-2 font-medium">{scanStatus}</p>
                </div>
              )}

              {/* OCR Success Banner */}
              {scanSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-emerald-900 text-sm">✓ Bill details extracted successfully</h5>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Review and verify the extracted parameters below before saving.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Fields: Editable Extracted Information or Manual Registration */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                {activeTab === 'ocr' ? 'Extracted Information (Verify Details)' : 'Product Registration Details'}
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">All fields editable</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. LG Washing Machine 8kg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Serial Number *</label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. LGWM12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Kitchen Appliances">Kitchen Appliances</option>
                  <option value="Consumer Electronics">Consumer Electronics</option>
                  <option value="Air Conditioners">Air Conditioners</option>
                  <option value="Smart Gadgets">Smart Gadgets</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. LG, Samsung, Sony"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purchase Date *</label>
                <input
                  type="date"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Warranty Period</label>
                <select
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={12}>1 Year (12 Months)</option>
                  <option value={24}>2 Years (24 Months)</option>
                  <option value={36}>3 Years (36 Months)</option>
                  <option value={60}>5 Years (60 Months)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seller / Retailer</label>
                <input
                  type="text"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                  placeholder="e.g. Reliance Digital, Croma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purchase Amount (₹)</label>
                <input
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="38990"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* AUTOMATIC WARRANTY EXPIRY CALCULATION CALLOUT */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                    Automatic Warranty Engine
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Warranty Expiry Date = Purchase Date ({purchaseDate}) + {warrantyMonths} Months
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Calculated Expiry</span>
                <span className="text-base font-extrabold text-emerald-400">{calculatedExpiryText}</span>
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
                <CheckCircle2 className="w-4 h-4" />
                <span>Register Product</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
