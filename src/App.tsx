import React, { useState, useEffect } from 'react';
import { UserRole, Product, Claim, Customer, Mechanic } from './types';
import { db } from './services/db';

// Common Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginPage } from './pages/LoginPage';

// Customer Pages & Modals
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyProductsPage } from './pages/customer/MyProductsPage';
import { CustomerClaimsPage } from './pages/customer/CustomerClaimsPage';
import { WarrantyDetailsPage } from './pages/customer/WarrantyDetailsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { RegisterProductModal } from './components/customer/RegisterProductModal';
import { RaiseClaimModal } from './components/customer/RaiseClaimModal';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffClaimsPage } from './pages/staff/StaffClaimsPage';
import { StaffMechanicsPage } from './pages/staff/StaffMechanicsPage';
import { RepeatIssueBanner } from './components/staff/RepeatIssueBanner';
import { AnalyticsCharts } from './components/staff/AnalyticsCharts';

// Mechanic Pages
import { MechanicDashboard } from './pages/mechanic/MechanicDashboard';
import { MechanicReportsPage } from './pages/mechanic/MechanicReportsPage';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Triggered modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRaiseClaimModal, setShowRaiseClaimModal] = useState(false);
  const [selectedProductForClaim, setSelectedProductForClaim] = useState<Product | undefined>(undefined);
  const [selectedProductForWarranty, setSelectedProductForWarranty] = useState<Product | undefined>(undefined);

  // Reactive DB state counter to force re-render on data mutation
  const [dbVersion, setDbVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDbVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  // Sync role switch with default tab
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'customer') setActiveTab('dashboard');
    else if (role === 'staff') setActiveTab('staff-dashboard');
    else if (role === 'mechanic') setActiveTab('mech-dashboard');
  };

  const handleTabSelect = (tabId: string) => {
    if (tabId === 'register-product') {
      setShowRegisterModal(true);
      return;
    }
    if (tabId === 'raise-claim') {
      setSelectedProductForClaim(undefined);
      setShowRaiseClaimModal(true);
      return;
    }
    setActiveTab(tabId);
  };

  // Current entity lookups
  const customers = db.getCustomers();
  const currentCustomer: Customer = customers[0]; // Priya Sharma
  const mechanics = db.getMechanics();
  const currentMechanic: Mechanic = mechanics[0]; // Arun Kumar

  const allProducts = db.getProducts();
  const customerProducts = db.getProducts(currentCustomer.id);

  const allClaims = db.getClaims();
  const customerClaims = db.getClaims(currentCustomer.id);
  const notifications = db.getNotifications(currentRole);

  const openClaimsCount = allClaims.filter(c => c.status === 'Raised' || c.status === 'In Progress').length;
  const repeatIssues = db.getRepeatedIssueProducts();

  // If user logs out
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={(role) => {
          setIsLoggedIn(true);
          handleRoleChange(role);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        notifications={notifications}
        onMarkAsRead={(id) => db.markNotificationAsRead(id)}
        onMarkAllAsRead={() => db.markAllNotificationsAsRead(currentRole)}
        onResetData={() => {
          if (confirm('Reset prototype to default demo data?')) {
            db.resetToDefault();
          }
        }}
        onLogout={() => setIsLoggedIn(false)}
        userName={
          currentRole === 'customer'
            ? currentCustomer.name
            : currentRole === 'staff'
            ? 'Operations Lead'
            : currentMechanic.name
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          openClaimsCount={currentRole === 'customer' ? customerClaims.filter(c => c.status !== 'Resolved').length : openClaimsCount}
          repeatIssueCount={repeatIssues.length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {/* ================= CUSTOMER PORTAL ================= */}
          {currentRole === 'customer' && (
            <>
              {activeTab === 'dashboard' && (
                <CustomerDashboard
                  customer={currentCustomer}
                  products={customerProducts}
                  claims={customerClaims}
                  onOpenRegister={() => setShowRegisterModal(true)}
                  onOpenRaiseClaim={(prod) => {
                    setSelectedProductForClaim(prod);
                    setShowRaiseClaimModal(true);
                  }}
                  onViewProductWarranty={(prod) => {
                    setSelectedProductForWarranty(prod);
                    setActiveTab('warranty-status');
                  }}
                  onViewAllClaims={() => setActiveTab('my-claims')}
                  onViewAllProducts={() => setActiveTab('my-products')}
                />
              )}

              {activeTab === 'my-products' && (
                <MyProductsPage
                  products={customerProducts}
                  onOpenRegister={() => setShowRegisterModal(true)}
                  onRaiseClaim={(prod) => {
                    setSelectedProductForClaim(prod);
                    setShowRaiseClaimModal(true);
                  }}
                  onViewWarranty={(prod) => {
                    setSelectedProductForWarranty(prod);
                    setActiveTab('warranty-status');
                  }}
                />
              )}

              {activeTab === 'my-claims' && (
                <CustomerClaimsPage
                  claims={customerClaims}
                  products={customerProducts}
                  onRaiseNewClaim={() => {
                    setSelectedProductForClaim(undefined);
                    setShowRaiseClaimModal(true);
                  }}
                />
              )}

              {activeTab === 'warranty-status' && (
                <WarrantyDetailsPage
                  product={selectedProductForWarranty || customerProducts[0]}
                  onBack={() => setActiveTab('my-products')}
                  onRaiseClaim={(prod) => {
                    setSelectedProductForClaim(prod);
                    setShowRaiseClaimModal(true);
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <CustomerProfilePage
                  customer={currentCustomer}
                  products={customerProducts}
                  claims={customerClaims}
                />
              )}
            </>
          )}

          {/* ================= STAFF / ADMIN PORTAL ================= */}
          {currentRole === 'staff' && (
            <>
              {activeTab === 'staff-dashboard' && (
                <StaffDashboard
                  claims={allClaims}
                  products={allProducts}
                  mechanics={mechanics}
                  onNavigateToClaims={() => setActiveTab('staff-claims')}
                  onRefresh={() => setDbVersion(v => v + 1)}
                />
              )}

              {activeTab === 'staff-claims' && (
                <StaffClaimsPage
                  claims={allClaims}
                  onRefresh={() => setDbVersion(v => v + 1)}
                />
              )}

              {activeTab === 'staff-repeat-issues' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Product Quality Analytics</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">Recurring Defect Monitoring</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Rule-based detection highlighting appliances with repeated failure claims in a 60-day window.
                    </p>
                  </div>
                  <RepeatIssueBanner onInspectProduct={() => setActiveTab('staff-claims')} />
                </div>
              )}

              {activeTab === 'staff-mechanics' && (
                <StaffMechanicsPage
                  mechanics={mechanics}
                  claims={allClaims}
                  onRefresh={() => setDbVersion(v => v + 1)}
                />
              )}

              {activeTab === 'staff-products' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Database Inventory</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">All Registered Products</h2>
                  </div>
                  <MyProductsPage
                    products={allProducts}
                    onOpenRegister={() => setShowRegisterModal(true)}
                    onRaiseClaim={(prod) => {
                      setSelectedProductForClaim(prod);
                      setShowRaiseClaimModal(true);
                    }}
                    onViewWarranty={(prod) => {
                      setSelectedProductForWarranty(prod);
                      setActiveTab('warranty-status');
                    }}
                  />
                </div>
              )}

              {activeTab === 'staff-customers' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Directory</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">Registered Customer Database</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customers.map(c => (
                      <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-2xl object-cover border" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                          <p className="text-xs text-slate-500 font-mono">{c.id} • {c.phone}</p>
                          <p className="text-xs text-slate-600 mt-1">{c.address}, {c.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'staff-analytics' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Executive Reporting</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">Warranty & Service Analytics</h2>
                  </div>
                  <AnalyticsCharts claims={allClaims} products={allProducts} />
                </div>
              )}
            </>
          )}

          {/* ================= MECHANIC PORTAL ================= */}
          {currentRole === 'mechanic' && (
            <>
              {activeTab === 'mech-dashboard' && (
                <MechanicDashboard
                  mechanic={currentMechanic}
                  claims={allClaims}
                  onRefresh={() => setDbVersion(v => v + 1)}
                />
              )}

              {activeTab === 'mech-today' && (
                <MechanicDashboard
                  mechanic={currentMechanic}
                  claims={allClaims}
                  onRefresh={() => setDbVersion(v => v + 1)}
                />
              )}

              {activeTab === 'mech-jobs' && (
                <MechanicDashboard
                  mechanic={currentMechanic}
                  claims={allClaims}
                  onRefresh={() => setDbVersion(v => v + 1)}
                />
              )}

              {activeTab === 'mech-reports' && (
                <MechanicReportsPage claims={allClaims} />
              )}

              {activeTab === 'mech-profile' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-5">
                    <img src={currentMechanic.avatar} alt={currentMechanic.name} className="w-20 h-20 rounded-2xl object-cover border" />
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{currentMechanic.name}</h3>
                      <p className="text-xs text-indigo-600 font-bold">{currentMechanic.email}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{currentMechanic.phone}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Base:</span>
                      <span className="font-bold text-slate-900">{currentMechanic.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Specializations:</span>
                      <span className="font-bold text-slate-900">{currentMechanic.specialization.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Rating:</span>
                      <span className="font-bold text-amber-600">★ {currentMechanic.rating} (Certified Master Tech)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed Service Visits:</span>
                      <span className="font-bold text-slate-900">{currentMechanic.completedJobs} units</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Product Registration Modal (Bill OCR / Manual) */}
      <RegisterProductModal
        customerId={currentCustomer.id}
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setDbVersion(v => v + 1);
          setActiveTab('my-products');
        }}
      />

      {/* Global Raise Claim Modal */}
      <RaiseClaimModal
        customerId={currentCustomer.id}
        initialProduct={selectedProductForClaim}
        isOpen={showRaiseClaimModal}
        onClose={() => setShowRaiseClaimModal(false)}
        onClaimSubmitted={(newClaim) => {
          setDbVersion(v => v + 1);
          setActiveTab('my-claims');
        }}
      />
    </div>
  );
}

export default App;
