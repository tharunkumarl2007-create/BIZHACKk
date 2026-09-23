-- =========================================================================
-- WARRANTY+ Database Schema (MySQL 8.0+)
-- Database: warranty_tracker
-- Problem Statement: PS73 – Smart Warranty & Service Claim Tracker
-- =========================================================================

CREATE DATABASE IF NOT EXISTS warranty_tracker;
USE warranty_tracker;

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    avatar_url TEXT,
    joined_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    purchase_date DATE NOT NULL,
    warranty_months INT NOT NULL,
    warranty_expiry_date DATE NOT NULL,
    purchase_amount DECIMAL(10, 2),
    seller VARCHAR(200),
    bill_filename VARCHAR(255),
    image_url TEXT,
    status ENUM('active', 'expiring_soon', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 3. Mechanics Table
CREATE TABLE IF NOT EXISTS mechanics (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    avatar_url TEXT,
    specialization JSON NOT NULL, -- e.g. ["Kitchen Appliances", "Refrigerators"]
    location VARCHAR(200) NOT NULL,
    distance_km DECIMAL(4, 1) DEFAULT 0.0,
    available_today BOOLEAN DEFAULT TRUE,
    current_jobs INT DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    completed_jobs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Claims Table
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(50) PRIMARY KEY, -- e.g. CLM-2026-1048
    customer_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    issue_category VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    is_warranty_active BOOLEAN NOT NULL,
    preferred_date DATE,
    preferred_time VARCHAR(50),
    contact_number VARCHAR(30),
    status ENUM('Raised', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Raised',
    stage ENUM('claim_raised', 'staff_reviewing', 'mechanic_assigned', 'visit_scheduled', 'service_completed', 'claim_resolved') DEFAULT 'claim_raised',
    assigned_mechanic_id VARCHAR(50),
    visit_date DATE,
    visit_time VARCHAR(50),
    staff_remarks TEXT,
    is_repeat_issue BOOLEAN DEFAULT FALSE,
    repeat_issue_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (assigned_mechanic_id) REFERENCES mechanics(id)
);

-- 5. Service Reports Table (Mechanic digital sign-off)
CREATE TABLE IF NOT EXISTS service_reports (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) NOT NULL UNIQUE,
    mechanic_id VARCHAR(50) NOT NULL,
    problem_reported TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    parts_replaced JSON,
    additional_remarks TEXT,
    before_photo_url TEXT,
    after_photo_url TEXT,
    service_date DATE NOT NULL,
    customer_confirmed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    target_role ENUM('customer', 'staff', 'mechanic', 'all') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'alert') DEFAULT 'info',
    claim_id VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
