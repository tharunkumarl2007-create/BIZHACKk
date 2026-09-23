import React, { useState } from 'react';
import { UserRole, NotificationItem } from '../../types';
import { Shield, Bell, User, LogOut, RotateCcw, Check, Sparkles } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onResetData: () => void;
  onLogout: () => void;
  userName: string;
}

export const Header: React.FC<Props> = ({
  currentRole,
  onRoleChange,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onResetData,
  onLogout,
  userName
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">WARRANTY<span className="text-indigo-600">+</span></span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60 hidden sm:inline-block">
                v2.6 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">
              Smart Warranty & Home Service Management
            </p>
          </div>
        </div>

        {/* Center: Live Role Switcher Pill */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 px-3 py-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Mode:
          </span>
          {(['customer', 'staff', 'mechanic'] as UserRole[]).map((r) => {
            const isActive = currentRole === r;
            const labels = {
              customer: 'Customer',
              staff: 'Staff / Admin',
              mechanic: 'Service Mechanic'
            };
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Reset, Notifications, User info, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick reset mock data */}
          <button
            onClick={onResetData}
            title="Reset to fresh demo data"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 p-4 text-center">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => onMarkAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 items-start ${
                          !n.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.read ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">{userName}</span>
              <span className="text-[10px] font-semibold text-slate-400 capitalize block leading-tight">
                {currentRole === 'customer' ? 'Verified Customer' : currentRole === 'staff' ? 'Service Ops Lead' : 'Field Technician'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Log out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher Pill */}
      <div className="lg:hidden mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1">
        {(['customer', 'staff', 'mechanic'] as UserRole[]).map((r) => {
          const isActive = currentRole === r;
          const labels = {
            customer: 'Customer',
            staff: 'Staff',
            mechanic: 'Mechanic'
          };
          return (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {labels[r]}
            </button>
          );
        })}
      </div>
    </header>
  );
};
