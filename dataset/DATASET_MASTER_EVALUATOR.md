# WARRANTY+ (PS73) – Official Dataset Master Documentation

> **Problem Statement:** PS73 – Smart Warranty & Service Claim Tracker  
> **Database Name:** `warranty_tracker`  
> **Total Tables:** 6  
> **Total Records (Rows):** 38  
> **Total Attributes (Columns):** 76  

---

## 📑 Dataset Files in `/dataset` Directory

You can open and view all dataset files directly in Microsoft Excel, Google Sheets, or any CSV viewer:

1. [customers.csv](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/dataset/customers.csv) — **5 Rows, 10 Columns**
2. [products.csv](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/dataset/products.csv) — **8 Rows, 16 Columns**
3. [claims.csv](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/dataset/claims.csv) — **10 Rows, 18 Columns**
4. [mechanics.csv](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/dataset/mechanics.csv) — **5 Rows, 12 Columns**
5. [service_reports.csv](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/dataset/service_reports.csv) — **4 Rows, 13 Columns**

---

## 1. `customers` Table (5 Rows × 10 Columns)

| id | name | email | phone | address | city | pincode | joined_date |
|---|---|---|---|---|---|---|---|
| CUST-001 | Priya Sharma | priya.sharma@example.com | +91 98201 44552 | Flat 402, Green Glen Heights, Bellandur | Bengaluru | 560103 | 2025-04-10 |
| CUST-002 | Rahul Verma | rahul.verma@example.com | +91 98450 11234 | B-12, Palm Meadows, Whitefield | Bengaluru | 560066 | 2025-08-15 |
| CUST-003 | Ananya Iyer | ananya.iyer@example.com | +91 97112 88990 | House 88, 4th Main, Indiranagar | Bengaluru | 560038 | 2026-01-20 |
| CUST-004 | Vikram Patel | vikram.patel@example.com | +91 99001 77332 | Penthouse 14, Silver Oak, Koramangala | Bengaluru | 560034 | 2025-11-05 |
| CUST-005 | Neha Singh | neha.singh@example.com | +91 96500 22119 | Villa 7, Prestige Oasis, Yelahanka | Bengaluru | 560064 | 2026-03-12 |

---

## 2. `products` Table (8 Rows × 16 Columns)

| id | customer_id | name | category | brand | serial_number | purchase_date | warranty_months | warranty_expiry_date | purchase_amount | seller | status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PROD-001 | CUST-001 | LG Washing Machine 8kg Front Load | Home Appliances | LG | LGWM12345 | 2026-06-12 | 24 | 2028-06-12 | 38990.00 | Reliance Digital Bellandur | active |
| PROD-002 | CUST-001 | Samsung Double Door Refrigerator 324L | Kitchen Appliances | Samsung | SM-REF-99238 | 2025-10-15 | 24 | 2027-10-15 | 34500.00 | Croma Retail Koramangala | active |
| PROD-003 | CUST-001 | Sony Bravia 55 inch 4K Ultra HD TV | Consumer Electronics | Sony | SNY-TV-55421 | 2024-03-10 | 12 | 2025-03-10 | 59990.00 | Vijay Sales Bangalore | expired |
| PROD-004 | CUST-002 | Daikin 1.5 Ton 5 Star Inverter AC | Air Conditioners | Daikin | DKN-AC-88120 | 2026-02-05 | 36 | 2029-02-05 | 44200.00 | Girias Electronics Whitefield | active |
| PROD-005 | CUST-003 | HP Spectre x360 14" OLED Laptop | Consumer Electronics | HP | HP-SP-77621 | 2025-11-20 | 12 | 2026-11-20 | 119990.00 | HP World Indiranagar | active |
| PROD-006 | CUST-004 | Philips Digital Air Fryer HD9252 | Kitchen Appliances | Philips | PH-AF-33901 | 2024-05-18 | 24 | 2026-05-18 | 8990.00 | Amazon India Retail | expired |
| PROD-007 | CUST-005 | Whirlpool 29L Convection Microwave | Kitchen Appliances | Whirlpool | WHP-MW-44119 | 2026-01-10 | 24 | 2028-01-10 | 14200.00 | Reliance Digital Yelahanka | active |
| PROD-008 | CUST-002 | Dyson V12 Detect Slim Cordless Vacuum | Home Appliances | Dyson | DYS-VAC-66120 | 2026-04-14 | 24 | 2028-04-14 | 49900.00 | Dyson Official Store Bangalore | active |

---

## 3. `claims` Table (10 Rows × 18 Columns)

| id | customer_id | product_name | issue_category | is_warranty_active | status | assigned_mechanic | visit_date | is_repeat_issue | repeat_count |
|---|---|---|---|---|---|---|---|---|---|
| CLM-2026-1048 | CUST-001 | Samsung Refrigerator 324L | Cooling Failure | TRUE | In Progress | Arun Kumar | 2026-09-25 | TRUE | 3 |
| CLM-2026-1042 | CUST-001 | Samsung Refrigerator 324L | Compressor Noise | TRUE | Resolved | Arun Kumar | 2026-08-15 | TRUE | 2 |
| CLM-2026-1035 | CUST-001 | Samsung Refrigerator 324L | Cooling Failure | TRUE | Resolved | Arun Kumar | 2026-07-29 | TRUE | 1 |
| CLM-2026-1050 | CUST-001 | Sony Bravia 55 inch 4K TV | Display Flickering | FALSE (Expired) | Raised | None | None | FALSE | 1 |
| CLM-2026-1049 | CUST-002 | Daikin 1.5 Ton Inverter AC | Water Leakage | TRUE | In Progress | Arun Kumar | 2026-09-23 | FALSE | 1 |
| CLM-2026-1045 | CUST-004 | Philips Digital Air Fryer | Power Failure | FALSE (Expired) | Rejected | None | None | FALSE | 1 |
| CLM-2026-1040 | CUST-005 | Whirlpool 29L Microwave | Turntable Jammed | TRUE | Resolved | Pooja Verma | 2026-09-16 | FALSE | 1 |
| CLM-2026-1051 | CUST-003 | HP Spectre x360 Laptop | Battery / Charging | TRUE | Raised | None | None | FALSE | 1 |
| CLM-2026-1046 | CUST-002 | Dyson V12 Slim Vacuum | Motor Pulsing | TRUE | In Progress | Rajesh Sharma | 2026-09-18 | FALSE | 1 |
| CLM-2026-1031 | CUST-001 | LG Washing Machine 8kg | Drain Filter Warning | TRUE | Resolved | Rajesh Sharma | 2026-07-06 | FALSE | 1 |

---

## 4. `mechanics` Table (5 Rows × 12 Columns)

| id | name | phone | specializations | location | distance_km | available_today | current_jobs | rating | completed_jobs |
|---|---|---|---|---|---|---|---|---|---|
| MECH-001 | Arun Kumar | +91 98440 22331 | AC; Kitchen Appliances; Refrigerators | Bellandur / Sarjapur | 2.4 | TRUE | 2 | 4.9 | 142 |
| MECH-002 | Rajesh Sharma | +91 98860 33442 | Home Appliances; Washing Machines; Dryers | HSR Layout / Koramangala | 4.1 | TRUE | 1 | 4.8 | 98 |
| MECH-003 | Vikram Rao | +91 99720 55663 | Consumer Electronics; TVs; Smart Displays | Indiranagar / Domlur | 6.8 | TRUE | 3 | 4.7 | 120 |
| MECH-004 | Suresh Nair | +91 97410 77884 | Air Conditioners; HVAC; Ventilation | Whitefield / ITPL | 8.5 | FALSE | 4 | 4.6 | 84 |
| MECH-005 | Pooja Verma | +91 96320 99005 | Kitchen Appliances; Microwaves; Chimneys | Yelahanka / Hebbal | 12.0 | TRUE | 1 | 4.9 | 110 |

---

## 5. `service_reports` Table (4 Rows × 13 Columns)

| id | claim_id | mechanic_name | problem_reported | diagnosis | action_taken | parts_replaced | service_date | customer_confirmed |
|---|---|---|---|---|---|---|---|---|
| REP-2026-081 | CLM-2026-1042 | Arun Kumar | Loud rattling noise | Loose condenser mounting brackets vibrating | Tightened brackets & added silicone dampers | Mounting Damper Bushing x2 | 2026-08-15 | TRUE |
| REP-2026-054 | CLM-2026-1035 | Arun Kumar | Cooling failure | Thermostat sensor calibration drifted | Recalibrated thermostat & replaced thermal fuse | Thermal Fuse 72C | 2026-07-29 | TRUE |
| REP-2026-092 | CLM-2026-1040 | Pooja Verma | Turntable glass not rotating | Drive coupler plastic gear stripped | Replaced synchronous motor & drive coupling | Synch Motor 21V; Roller Coupler | 2026-09-16 | TRUE |
| REP-2026-022 | CLM-2026-1031 | Rajesh Sharma | OE error during rinse cycle | Coin & lint blocked drain pump impeller | Removed debris, flushed drain hose, tested | Filter O-ring Gasket | 2026-07-06 | TRUE |
