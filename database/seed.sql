-- =========================================================================
-- WARRANTY+ Database Seed Data (MySQL 8.0+)
-- Database: warranty_tracker
-- Problem Statement: PS73 – Smart Warranty & Service Claim Tracker
-- =========================================================================

USE warranty_tracker;

-- 1. Insert Customers
INSERT INTO customers (id, name, email, phone, address, city, pincode, avatar_url, joined_date) VALUES
('CUST-001', 'Priya Sharma', 'priya.sharma@example.com', '+91 98201 44552', 'Flat 402, Green Glen Heights, Bellandur', 'Bengaluru', '560103', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2025-04-10'),
('CUST-002', 'Rahul Verma', 'rahul.verma@example.com', '+91 98450 11234', 'B-12, Palm Meadows, Whitefield', 'Bengaluru', '560066', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2025-08-15'),
('CUST-003', 'Ananya Iyer', 'ananya.iyer@example.com', '+91 97112 88990', 'House 88, 4th Main, Indiranagar', 'Bengaluru', '560038', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-01-20'),
('CUST-004', 'Vikram Patel', 'vikram.patel@example.com', '+91 99001 77332', 'Penthouse 14, Silver Oak, Koramangala', 'Bengaluru', '560034', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2025-11-05'),
('CUST-005', 'Neha Singh', 'neha.singh@example.com', '+91 96500 22119', 'Villa 7, Prestige Oasis, Yelahanka', 'Bengaluru', '560064', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-03-12')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Mechanics
INSERT INTO mechanics (id, name, phone, email, avatar_url, specialization, location, distance_km, available_today, current_jobs, rating, completed_jobs) VALUES
('MECH-001', 'Arun Kumar', '+91 98440 22331', 'arun.kumar@servicepro.in', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '["Air Conditioners", "Kitchen Appliances", "Refrigerators"]', 'Bellandur / Sarjapur Road', 2.4, TRUE, 2, 4.9, 142),
('MECH-002', 'Rajesh Sharma', '+91 98860 33442', 'rajesh.sharma@servicepro.in', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '["Home Appliances", "Washing Machines", "Dryers"]', 'HSR Layout / Koramangala', 4.1, TRUE, 1, 4.8, 98),
('MECH-003', 'Vikram Rao', '+91 99720 55663', 'vikram.rao@servicepro.in', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '["Consumer Electronics", "Televisions", "Smart Displays"]', 'Indiranagar / Domlur', 6.8, TRUE, 3, 4.7, 120),
('MECH-004', 'Suresh Nair', '+91 97410 77884', 'suresh.nair@servicepro.in', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '["Air Conditioners", "HVAC Units", "Ventilation"]', 'Whitefield / ITPL', 8.5, FALSE, 4, 4.6, 84),
('MECH-005', 'Pooja Verma', '+91 96320 99005', 'pooja.verma@servicepro.in', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', '["Kitchen Appliances", "Microwaves", "Chimneys"]', 'Yelahanka / Hebbal', 12.0, TRUE, 1, 4.9, 110)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Products
INSERT INTO products (id, customer_id, name, category, brand, model, serial_number, purchase_date, warranty_months, warranty_expiry_date, purchase_amount, seller, bill_filename, status) VALUES
('PROD-001', 'CUST-001', 'LG Washing Machine 8kg Front Load', 'Home Appliances', 'LG', 'FHM1208ZDL', 'LGWM12345', '2026-06-12', 24, '2028-06-12', 38990.00, 'Reliance Digital Bellandur', 'LG_Bill_Inv_2026.pdf', 'active'),
('PROD-002', 'CUST-001', 'Samsung Double Door Refrigerator 324L', 'Kitchen Appliances', 'Samsung', 'RT34T4513S8', 'SM-REF-99238', '2025-10-15', 24, '2027-10-15', 34500.00, 'Croma Retail Koramangala', 'Samsung_Fridge_Bill.png', 'active'),
('PROD-003', 'CUST-001', 'Sony Bravia 55 inch 4K Ultra HD TV', 'Consumer Electronics', 'Sony', 'KD-55X74K', 'SNY-TV-55421', '2024-03-10', 12, '2025-03-10', 59990.00, 'Vijay Sales Bangalore', 'Sony_TV_Invoice.jpg', 'expired'),
('PROD-004', 'CUST-002', 'Daikin 1.5 Ton 5 Star Inverter AC', 'Air Conditioners', 'Daikin', 'FTKM50U', 'DKN-AC-88120', '2026-02-05', 36, '2029-02-05', 44200.00, 'Girias Electronics Whitefield', 'Daikin_AC_TaxInvoice.pdf', 'active'),
('PROD-005', 'CUST-003', 'HP Spectre x360 14" OLED Laptop', 'Consumer Electronics', 'HP', '14-ef0003TU', 'HP-SP-77621', '2025-11-20', 12, '2026-11-20', 119990.00, 'HP World Indiranagar', 'HP_Spectre_Invoice.pdf', 'active'),
('PROD-006', 'CUST-004', 'Philips Digital Air Fryer HD9252', 'Kitchen Appliances', 'Philips', 'HD9252/90', 'PH-AF-33901', '2024-05-18', 24, '2026-05-18', 8990.00, 'Amazon India Retail', 'Amazon_Philips_Invoice.pdf', 'expired'),
('PROD-007', 'CUST-005', 'Whirlpool 29L Convection Microwave', 'Kitchen Appliances', 'Whirlpool', 'MAGICOOK-PRO', 'WHP-MW-44119', '2026-01-10', 24, '2028-01-10', 14200.00, 'Reliance Digital Yelahanka', 'Whirlpool_Microwave.pdf', 'active'),
('PROD-008', 'CUST-002', 'Dyson V12 Detect Slim Cordless Vacuum', 'Home Appliances', 'Dyson', 'SV20', 'DYS-VAC-66120', '2026-04-14', 24, '2028-04-14', 49900.00, 'Dyson Official Store Bangalore', 'Dyson_Official_Bill.pdf', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Claims
INSERT INTO claims (id, customer_id, product_id, issue_category, description, is_warranty_active, preferred_date, preferred_time, contact_number, status, stage, assigned_mechanic_id, visit_date, visit_time, staff_remarks, is_repeat_issue, repeat_issue_count) VALUES
('CLM-2026-1048', 'CUST-001', 'PROD-002', 'Cooling Failure', 'Refrigerator upper freezer compartment is freezing solid, but lower cooling chamber is completely warm (18°C). Food is spoiling.', TRUE, '2026-09-25', '10:00 AM - 12:00 PM', '+91 98201 44552', 'In Progress', 'mechanic_assigned', 'MECH-001', '2026-09-25', '10:30 AM', 'Priority case: Customer reported 3rd issue on this refrigerator. Recommended compressor coil check.', TRUE, 3),
('CLM-2026-1042', 'CUST-001', 'PROD-002', 'Compressor Noise', 'Loud rattling noise from back of refrigerator intermittently every 30 minutes.', TRUE, '2026-08-14', '02:00 PM - 04:00 PM', '+91 98201 44552', 'Resolved', 'claim_resolved', 'MECH-001', '2026-08-15', '03:15 PM', 'Vibration dampener adjusted.', TRUE, 2),
('CLM-2026-1035', 'CUST-001', 'PROD-002', 'Cooling Failure', 'Initial cooling loss issue after power surge.', TRUE, '2026-07-28', '11:00 AM - 01:00 PM', '+91 98201 44552', 'Resolved', 'claim_resolved', 'MECH-001', '2026-07-29', '11:30 AM', 'First cooling claim on this unit.', TRUE, 1),
('CLM-2026-1050', 'CUST-001', 'PROD-003', 'Display Flickering', 'Vertical lines appearing across the right side of the screen. Audio works but picture flickers constantly.', FALSE, '2026-09-24', '04:00 PM - 06:00 PM', '+91 98201 44552', 'Raised', 'staff_reviewing', NULL, NULL, NULL, 'Product warranty expired on 10 Mar 2025. Standard service estimation required.', FALSE, 1),
('CLM-2026-1049', 'CUST-002', 'PROD-004', 'Water Leakage', 'Indoor unit is dripping water down the bedroom wall when run on Dry or Cool mode for more than 20 minutes.', TRUE, '2026-09-23', '09:00 AM - 11:00 AM', '+91 98450 11234', 'In Progress', 'visit_scheduled', 'MECH-001', '2026-09-23', '09:30 AM', 'Condensation drain pipe blockage suspected. Assigned Arun Kumar.', FALSE, 1),
('CLM-2026-1045', 'CUST-004', 'PROD-006', 'Power Failure', 'Device does not turn on. Display is completely blank even after changing socket.', FALSE, '2026-09-20', '03:00 PM - 05:00 PM', '+91 99001 77332', 'Rejected', 'claim_resolved', NULL, NULL, NULL, 'Product out of warranty (expired 18 May 2026) and customer declined paid repair estimate of ₹2,400.', FALSE, 1),
('CLM-2026-1040', 'CUST-005', 'PROD-007', 'Turntable Motor Jammed', 'Microwave heats normally but glass turntable does not rotate, causing uneven cooking.', TRUE, '2026-09-15', '11:00 AM - 01:00 PM', '+91 96500 22119', 'Resolved', 'claim_resolved', 'MECH-005', '2026-09-16', '11:45 AM', 'Covered under manufacturer warranty.', FALSE, 1),
('CLM-2026-1051', 'CUST-003', 'PROD-005', 'Battery / Charging', 'Battery charges only up to 45% and drops rapidly. Power adapter heats up excessively.', TRUE, '2026-09-26', '01:00 PM - 03:00 PM', '+91 97112 88990', 'Raised', 'claim_raised', NULL, NULL, NULL, 'Awaiting initial staff review. Warranty active until 20 Nov 2026.', FALSE, 1),
('CLM-2026-1046', 'CUST-002', 'PROD-008', 'Motor Pulsing', 'Laser fluffy head motor pulses on and off when vacuuming rugs.', TRUE, '2026-09-17', '10:00 AM - 12:00 PM', '+91 98450 11234', 'In Progress', 'service_completed', 'MECH-002', '2026-09-18', '10:30 AM', 'Mechanic visited and cleared airway sensor. Awaiting final closure.', FALSE, 1),
('CLM-2026-1031', 'CUST-001', 'PROD-001', 'Drain Filter Warning', 'OE error code displaying on LED panel during rinse cycle.', TRUE, '2026-07-05', '02:00 PM - 04:00 PM', '+91 98201 44552', 'Resolved', 'claim_resolved', 'MECH-002', '2026-07-06', '02:30 PM', 'Routine drain pump debris removal.', FALSE, 1)
ON DUPLICATE KEY UPDATE issue_category=VALUES(issue_category);

-- 5. Insert Service Reports
INSERT INTO service_reports (id, claim_id, mechanic_id, problem_reported, diagnosis, action_taken, parts_replaced, additional_remarks, service_date, customer_confirmed) VALUES
('REP-2026-081', 'CLM-2026-1042', 'MECH-001', 'Loud rattling noise', 'Loose condenser mounting brackets vibrating against cabinet', 'Tightened brackets and added silicone vibration dampers', '["Mounting Damper Bushing x2"]', 'Advised customer to monitor temperatures closely.', '2026-08-15', TRUE),
('REP-2026-054', 'CLM-2026-1035', 'MECH-001', 'Cooling failure', 'Thermostat sensor calibration drifted after voltage fluctuation', 'Recalibrated digital thermostat and replaced thermal fuse', '["Thermal Fuse 72C"]', 'Unit cooled normally at 3°C.', '2026-07-29', TRUE),
('REP-2026-092', 'CLM-2026-1040', 'MECH-005', 'Turntable glass not rotating', 'Drive coupler plastic gear stripped from roller ring', 'Replaced turntable synchronous motor and drive coupling', '["Synch Motor 21V", "Roller Coupler"]', 'Tested 360 degree rotation with 2kg test load. Passed.', '2026-09-16', TRUE),
('REP-2026-022', 'CLM-2026-1031', 'MECH-002', 'OE error during rinse cycle', 'Coin and coin lint blocked drain pump impeller', 'Removed debris, flushed drain hose, ran calibration test', '["Filter O-ring Gasket"]', 'Demonstrated monthly filter cleaning procedure to customer.', '2026-07-06', TRUE)
ON DUPLICATE KEY UPDATE diagnosis=VALUES(diagnosis);
