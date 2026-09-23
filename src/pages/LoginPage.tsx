import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, ArrowRight, UserCheck, Wrench, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('customer@warrantyplus.in');
  const [password, setPassword] = useState('••••••••');

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('staff') || email.includes('admin')) {
      onLogin('staff');
    } else if (email.includes('mechanic') || email.includes('tech')) {
      onLogin('mechanic');
    } else {
      onLogin('customer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative ambient elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100/20 overflow-hidden relative z-10">
        {/* Brand Header */}
        <div className="bg-slate-900 p-8 text-center border-b border-slate-800">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30 mb-4">
            <Shield className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            WARRANTY<span className="text-indigo-400">+</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Smart Warranty & Home Service Management
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
            <Sparkles className="w-3 h-3 text-indigo-400" /> PS73 Working Prototype
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          {/* Quick 1-Click Demo Buttons (Evaluator friendly!) */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onLogin('customer')}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 transition text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800 block">Customer</span>
                <span className="text-[10px] text-slate-400 block">Priya S.</span>
              </button>

              <button
                type="button"
                onClick={() => onLogin('staff')}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 transition text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800 block">Staff / Admin</span>
                <span className="text-[10px] text-slate-400 block">Dispatch</span>
              </button>

              <button
                type="button"
                onClick={() => onLogin('mechanic')}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 transition text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800 block">Mechanic</span>
                <span className="text-[10px] text-slate-400 block">Arun K.</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold uppercase">Or Log In With Password</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset link simulated.'); }} className="text-xs text-indigo-600 hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* End-to-end workflow hint */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center leading-relaxed">
            Automatic Warranty Check • Bill OCR • Smart Dispatch • Field Repair Sign-off
          </div>
        </div>
      </div>
    </div>
  );
};
