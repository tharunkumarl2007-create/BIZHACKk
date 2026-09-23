import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FilePlus,
  Clock,
  ShieldCheck,
  User,
  Users,
  Wrench,
  BarChart3,
  Calendar,
  ClipboardList,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface Props {
  currentRole: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  openClaimsCount?: number;
  repeatIssueCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: number;
  alertBadge?: number;
}

export const Sidebar: React.FC<Props> = ({
  currentRole,
  activeTab,
  onSelectTab,
  openClaimsCount = 0,
  repeatIssueCount = 0
}) => {
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'customer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my-products', label: 'My Products', icon: Package },
          { id: 'register-product', label: 'Register Product', icon: PlusCircle, highlight: true },
          { id: 'raise-claim', label: 'Raise Claim', icon: FilePlus, highlight: true },
          { id: 'my-claims', label: 'My Claims', icon: Clock, badge: openClaimsCount > 0 ? openClaimsCount : undefined },
          { id: 'warranty-status', label: 'Warranty Check', icon: ShieldCheck },
          { id: 'profile', label: 'Profile', icon: User }
        ];

      case 'staff':
        return [
          { id: 'staff-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'staff-claims', label: 'All Claims', icon: ClipboardList, badge: openClaimsCount > 0 ? openClaimsCount : undefined },
          { id: 'staff-repeat-issues', label: 'Repeat Issues', icon: AlertTriangle, alertBadge: repeatIssueCount > 0 ? repeatIssueCount : undefined },
          { id: 'staff-mechanics', label: 'Mechanics & Assign', icon: Wrench },
          { id: 'staff-products', label: 'Registered Products', icon: Package },
          { id: 'staff-customers', label: 'Customer Directory', icon: Users },
          { id: 'staff-analytics', label: 'Analytics Reports', icon: BarChart3 }
        ];

      case 'mechanic':
        return [
          { id: 'mech-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'mech-today', label: "Today's Visits", icon: Calendar, badge: 2 },
          { id: 'mech-jobs', label: 'My Assigned Jobs', icon: Wrench },
          { id: 'mech-reports', label: 'Service Reports', icon: FileText },
          { id: 'mech-profile', label: 'Technician Profile', icon: User }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 selection:bg-indigo-500">
      {/* Role Tag & Welcome banner */}
      <div className="p-5 border-b border-slate-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
          {currentRole === 'customer' ? 'Customer Portal' : currentRole === 'staff' ? 'Service Operations' : 'Technician Field App'}
        </span>
        <h2 className="text-white font-extrabold text-base tracking-tight">
          {currentRole === 'customer' ? 'Priya Sharma' : currentRole === 'staff' ? 'Admin Ops Console' : 'Arun Kumar (Lead Tech)'}
        </h2>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}

              {item.alertBadge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  {item.alertBadge} Alert
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Status / Footnote */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            Warranty AI OCR Active
          </span>
          <span className="text-[10px] text-indigo-400 font-mono">v2.6</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          PS73 – Smart Warranty & Service Claim Tracker
        </p>
      </div>
    </aside>
  );
};
