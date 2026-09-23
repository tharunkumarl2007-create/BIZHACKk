import { Customer, Product, Claim, Mechanic, NotificationItem, ServiceReport, UserRole } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_CLAIMS, INITIAL_MECHANICS, INITIAL_NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEYS = {
  CUSTOMERS: 'warranty_plus_customers_v1',
  PRODUCTS: 'warranty_plus_products_v1',
  CLAIMS: 'warranty_plus_claims_v1',
  MECHANICS: 'warranty_plus_mechanics_v1',
  NOTIFICATIONS: 'warranty_plus_notifications_v1',
  CURRENT_USER: 'warranty_plus_current_user_v1',
  CURRENT_ROLE: 'warranty_plus_current_role_v1'
};

type Listener = () => void;

class DatabaseService {
  private listeners: Listener[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MECHANICS)) {
      localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(INITIAL_MECHANICS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Reset to initial demo data ---
  public resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
    localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(INITIAL_MECHANICS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    this.notify();
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : INITIAL_CUSTOMERS;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find(c => c.id === id);
  }

  // --- Products ---
  public getProducts(customerId?: string): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    if (customerId) {
      return products.filter(p => p.customerId === customerId);
    }
    return products;
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  public addProduct(productData: Omit<Product, 'id' | 'claimCount' | 'status'>): Product {
    const products = this.getProducts();
    
    // Calculate expiry and status
    const purchaseDate = new Date(productData.purchaseDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + Number(productData.warrantyMonths));
    const expiryDateStr = expiryDate.toISOString().split('T')[0];

    const today = new Date();
    const isExpired = today > expiryDate;
    const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: Product['status'] = 'active';
    if (isExpired) {
      status = 'expired';
    } else if (daysRemaining <= 30) {
      status = 'expiring_soon';
    }

    const newProduct: Product = {
      ...productData,
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      warrantyExpiryDate: expiryDateStr,
      status,
      claimCount: 0
    };

    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    this.addNotification({
      role: 'customer',
      title: 'Product Registered',
      message: `${newProduct.name} successfully registered. Warranty valid until ${newProduct.warrantyExpiryDate}.`,
      type: 'success'
    });

    this.notify();
    return newProduct;
  }

  // --- Claims ---
  public getClaims(customerId?: string): Claim[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    const claims: Claim[] = raw ? JSON.parse(raw) : INITIAL_CLAIMS;
    if (customerId) {
      return claims.filter(c => c.customerId === customerId);
    }
    return claims;
  }

  public getClaimById(id: string): Claim | undefined {
    return this.getClaims().find(c => c.id === id);
  }

  public createClaim(claimData: {
    customerId: string;
    productId: string;
    issueCategory: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    contactNumber: string;
    photos?: string[];
  }): Claim {
    const claims = this.getClaims();
    const product = this.getProductById(claimData.productId);
    const customer = this.getCustomerById(claimData.customerId);

    if (!product || !customer) {
      throw new Error('Product or Customer not found');
    }

    // Check repeat issues on this product
    const existingClaimsForProduct = claims.filter(c => c.productId === claimData.productId);
    const repeatCount = existingClaimsForProduct.length + 1;
    const isRepeat = repeatCount >= 2;

    // Check warranty
    const today = new Date();
    const expiryDate = new Date(product.warrantyExpiryDate);
    const isWarrantyActive = today <= expiryDate;

    // Generate Claim ID: CLM-2026-1000 + count
    const claimSeq = 1052 + claims.length;
    const newClaimId = `CLM-2026-${claimSeq}`;

    const newClaim: Claim = {
      id: newClaimId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: `${customer.address}, ${customer.city}`,
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      productBrand: product.brand,
      serialNumber: product.serialNumber,
      issueCategory: claimData.issueCategory,
      description: claimData.description,
      isWarrantyActive,
      preferredDate: claimData.preferredDate,
      preferredTime: claimData.preferredTime,
      contactNumber: claimData.contactNumber,
      status: 'Raised',
      stage: 'claim_raised',
      staffRemarks: isWarrantyActive ? 'Standard warranty claim filed' : '⚠ Out of warranty - requires quotation review',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRepeatIssue: isRepeat,
      repeatIssueCount: repeatCount,
      photos: claimData.photos || []
    };

    claims.unshift(newClaim);
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Update product claimCount
    const products = this.getProducts().map(p => {
      if (p.id === product.id) {
        return { ...p, claimCount: p.claimCount + 1 };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Send notifications
    this.addNotification({
      role: 'customer',
      title: 'Claim Raised Successfully',
      message: `Claim ${newClaimId} for ${product.name} has been submitted. Our staff will review it shortly.`,
      type: 'success',
      claimId: newClaimId
    });

    this.addNotification({
      role: 'staff',
      title: isRepeat ? '⚠ Repeat Issue Claim Raised' : 'New Service Claim',
      message: `${customer.name} raised ${newClaimId} for ${product.name}.${isRepeat ? ' (Repeat issue detected!)' : ''}`,
      type: isRepeat ? 'alert' : 'info',
      claimId: newClaimId
    });

    this.notify();
    return newClaim;
  }

  public updateClaimStatus(claimId: string, status: Claim['status'], stage?: Claim['stage'], remarks?: string) {
    const claims = this.getClaims();
    const index = claims.findIndex(c => c.id === claimId);
    if (index === -1) return;

    const claim = claims[index];
    claim.status = status;
    if (stage) claim.stage = stage;
    if (remarks) claim.staffRemarks = remarks;
    claim.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    claims[index] = claim;
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    this.addNotification({
      role: 'customer',
      title: `Claim Status: ${status}`,
      message: `Your claim ${claimId} status is now ${status}.`,
      type: status === 'Rejected' ? 'warning' : 'info',
      claimId
    });

    this.notify();
  }

  public assignMechanicToClaim(claimId: string, mechanicId: string, visitDate: string, visitTime: string) {
    const claims = this.getClaims();
    const mechanics = this.getMechanics();
    
    const claimIndex = claims.findIndex(c => c.id === claimId);
    const mechIndex = mechanics.findIndex(m => m.id === mechanicId);
    if (claimIndex === -1 || mechIndex === -1) return;

    const mechanic = mechanics[mechIndex];
    const claim = claims[claimIndex];

    claim.assignedMechanicId = mechanic.id;
    claim.assignedMechanicName = mechanic.name;
    claim.assignedMechanicPhone = mechanic.phone;
    claim.visitDate = visitDate;
    claim.visitTime = visitTime;
    claim.status = 'In Progress';
    claim.stage = 'mechanic_assigned';
    claim.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Increase mechanic workload
    mechanic.currentJobs += 1;
    mechanics[mechIndex] = mechanic;

    claims[claimIndex] = claim;

    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(mechanics));

    // Notifications
    this.addNotification({
      role: 'customer',
      title: 'Mechanic Assigned',
      message: `${mechanic.name} has been assigned to visit on ${visitDate} at ${visitTime}.`,
      type: 'info',
      claimId
    });

    this.addNotification({
      role: 'mechanic',
      title: 'New Visit Assigned',
      message: `You have a visit scheduled for ${claim.productName} at ${claim.customerAddress} on ${visitDate} (${visitTime}).`,
      type: 'info',
      claimId
    });

    this.notify();
  }

  // --- Mechanics ---
  public getMechanics(): Mechanic[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MECHANICS);
    return raw ? JSON.parse(raw) : INITIAL_MECHANICS;
  }

  public getMechanicById(id: string): Mechanic | undefined {
    return this.getMechanics().find(m => m.id === id);
  }

  // Smart Recommendation Algorithm
  public recommendMechanic(productCategory: string, customerCityOrArea: string): Mechanic {
    const mechanics = this.getMechanics();

    // Score mechanics: specialization match (40%), distance (30%), workload (20%), rating (10%)
    const scored = mechanics.map(m => {
      let score = 0;
      const isSpecMatch = m.specialization.some(s => 
        productCategory.toLowerCase().includes(s.toLowerCase()) || 
        s.toLowerCase().includes(productCategory.toLowerCase())
      );
      if (isSpecMatch) score += 40;

      // Distance score (max 30 pts for 0km, 0 pts for >= 15km)
      const distScore = Math.max(0, 30 - (m.distanceKm * 2));
      score += distScore;

      // Workload score (max 20 pts for 0 jobs, lower if busy)
      const workloadScore = Math.max(0, 20 - (m.currentJobs * 5));
      score += workloadScore;

      // Rating score (10 pts for 5.0)
      score += (m.rating / 5) * 10;

      if (!m.availableToday) score -= 25;

      return { mechanic: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.mechanic || mechanics[0];
  }

  // --- Service Report (Mechanic Completes Service) ---
  public submitServiceReport(claimId: string, reportData: Omit<ServiceReport, 'id' | 'claimId' | 'completedAt'>) {
    const claims = this.getClaims();
    const mechanics = this.getMechanics();
    const index = claims.findIndex(c => c.id === claimId);
    if (index === -1) return;

    const claim = claims[index];
    const report: ServiceReport = {
      ...reportData,
      id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      claimId,
      completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    claim.serviceReport = report;
    claim.status = 'Resolved';
    claim.stage = 'claim_resolved';
    claim.updatedAt = report.completedAt;

    // Update mechanic jobs
    if (claim.assignedMechanicId) {
      const mechIndex = mechanics.findIndex(m => m.id === claim.assignedMechanicId);
      if (mechIndex !== -1) {
        mechanics[mechIndex].currentJobs = Math.max(0, mechanics[mechIndex].currentJobs - 1);
        mechanics[mechIndex].completedJobs += 1;
        localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(mechanics));
      }
    }

    claims[index] = claim;
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Notifications
    this.addNotification({
      role: 'customer',
      title: 'Service Completed & Claim Resolved',
      message: `Service for ${claim.productName} has been completed by ${reportData.mechanicName}. Digital service report is now available.`,
      type: 'success',
      claimId
    });

    this.addNotification({
      role: 'staff',
      title: 'Claim Resolved',
      message: `Claim ${claimId} resolved by ${reportData.mechanicName}.`,
      type: 'success',
      claimId
    });

    this.notify();
  }

  // --- Notifications ---
  public getNotifications(role?: UserRole): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (role) {
      return notifs.filter(n => n.role === role || n.role === 'all');
    }
    return notifs;
  }

  public markNotificationAsRead(id: string) {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    this.notify();
  }

  public markAllNotificationsAsRead(role: UserRole) {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => (n.role === role || n.role === 'all') ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    this.notify();
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      read: false
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notify();
  }

  // --- Repeated Issue Analysis ---
  public getRepeatedIssueProducts(): { product: Product; claims: Claim[] }[] {
    const products = this.getProducts();
    const claims = this.getClaims();

    const results: { product: Product; claims: Claim[] }[] = [];
    products.forEach(p => {
      const prodClaims = claims.filter(c => c.productId === p.id);
      if (prodClaims.length >= 2) {
        results.push({
          product: p,
          claims: prodClaims
        });
      }
    });

    return results;
  }
}

export const db = new DatabaseService();
