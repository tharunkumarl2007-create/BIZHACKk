export type UserRole = 'customer' | 'staff' | 'mechanic';

export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  avatar?: string;
  joinedDate: string;
}

export interface ExtractedBillData {
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  seller: string;
  purchaseAmount: string;
  warrantyPeriodMonths: number;
  confidenceScore: number;
}

export interface Product {
  id: string;
  customerId: string;
  name: string;
  category: 'Home Appliances' | 'Kitchen Appliances' | 'Consumer Electronics' | 'Air Conditioners' | 'Smart Gadgets';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string; // ISO YYYY-MM-DD
  warrantyMonths: number;
  warrantyExpiryDate: string; // ISO YYYY-MM-DD
  purchaseAmount: number;
  seller: string;
  billUrl?: string;
  billFileName?: string;
  imageUrl?: string;
  status: WarrantyStatus;
  claimCount: number;
}

export type ClaimStatus = 'Raised' | 'In Progress' | 'Resolved' | 'Rejected';

export type ClaimStage = 
  | 'claim_raised'
  | 'staff_reviewing'
  | 'mechanic_assigned'
  | 'visit_scheduled'
  | 'service_completed'
  | 'claim_resolved';

export interface ServiceReport {
  id: string;
  claimId: string;
  mechanicId: string;
  mechanicName: string;
  problemReported: string;
  diagnosis: string;
  actionTaken: string;
  partsReplaced: string[];
  additionalRemarks: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  serviceDate: string;
  customerConfirmed: boolean;
  completedAt: string;
}

export interface Claim {
  id: string; // e.g. CLM-2026-1048
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productName: string;
  productCategory: string;
  productBrand: string;
  serialNumber: string;
  issueCategory: string;
  description: string;
  isWarrantyActive: boolean;
  preferredDate: string;
  preferredTime: string;
  contactNumber: string;
  status: ClaimStatus;
  stage: ClaimStage;
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  assignedMechanicPhone?: string;
  visitDate?: string;
  visitTime?: string;
  staffRemarks?: string;
  createdAt: string;
  updatedAt: string;
  isRepeatIssue?: boolean;
  repeatIssueCount?: number;
  serviceReport?: ServiceReport;
  photos?: string[];
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  specialization: string[];
  location: string;
  distanceKm: number;
  availableToday: boolean;
  currentJobs: number;
  rating: number;
  completedJobs: number;
}

export interface NotificationItem {
  id: string;
  role: UserRole | 'all';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  claimId?: string;
}
