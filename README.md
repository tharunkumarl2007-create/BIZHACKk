# WARRANTY+ (PS73 – Smart Warranty & Service Claim Tracker)

> **Subtitle:** Smart Warranty & Home Service Management  
> **Target Problem:** PS73 – Warranty & Service Claim Tracker  
> **Stack:** React 18, TypeScript, TailwindCSS, Lucide Icons, Vite, MySQL Schema & Python Connector.

---

## ⚡ Quick Start (Running the Application)

The application is already built and running live:
- **Local URL:** [http://localhost:5173/](http://localhost:5173/)

To run or restart manually at any time:
```powershell
npm run dev
```

---

## 🎯 What to Do with Your Dataset & MySQL (`warranty_tracker`)

You provided this code snippet:
```python
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="YOUR_PASSWORD",
    database="warranty_tracker"
)

cursor = db.cursor()
```

### Here is how the system handles it:

1. **In-Browser Interactive Database (Default for instant demos)**:
   - Located in [`src/services/db.ts`](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/src/services/db.ts) and [`src/data/mockData.ts`](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/src/data/mockData.ts).
   - Pre-loaded with **5+ customers**, **8+ products**, **10+ claims**, and **5+ mechanics**.
   - Persists all interactions (`Product Registration`, `Bill OCR`, `Claim Creation`, `Mechanic Assignment`, and `Digital Service Sign-off`) to `localStorage`.
   - **Evaluators and hackathon judges can test all 3 roles immediately without needing MySQL installed on their laptops!**

2. **Official MySQL Database Schema**:
   - File: [`database/schema.sql`](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/database/schema.sql)
   - Creates the `warranty_tracker` database with 6 relational tables:
     - `customers`: Customer profiles, addresses, contact details.
     - `products`: Product serials, purchase dates, warranty duration, calculated expiry, and status (`active`, `expiring_soon`, `expired`).
     - `mechanics`: Technician skill specializations, GPS distance, active workload count, and ratings.
     - `claims`: Service tickets with status (`Raised`, `In Progress`, `Resolved`, `Rejected`), 6-stage lifecycle, and repeat defect flags.
     - `service_reports`: Digital technician sign-offs, replaced parts list, diagnosis, and customer confirmations.
     - `notifications`: Multi-role notification alerts.

3. **Database Seed Data**:
   - File: [`database/seed.sql`](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/database/seed.sql)
   - Contains SQL `INSERT` statements with the exact realistic dataset used in the frontend prototype.

4. **Python MySQL Connector Script**:
   - File: [`backend/db_connector.py`](file:///c:/Users/AMD/OneDrive/Desktop/BIZHACK/backend/db_connector.py)
   - Uses your exact `mysql.connector.connect(...)` configuration to:
     - Run automatic warranty status calculation (`Expiry Date = Purchase Date + Warranty Months`).
     - Query all claims joined with customer and mechanic info.
     - Perform rule-based **Repeat Issue Detection** (`count >= 2 claims` for the same appliance in 60 days).

---

## 👥 Three Actors & Key Features

### 1. Customer Persona (e.g., Priya Sharma)
- **Dashboard & KPIs**: Registered Products, Active Warranties, Open Claims, Resolved Claims.
- **My Products**: Product cards with visual remaining-warranty progress bar (`UNDER WARRANTY` vs `WARRANTY EXPIRED`).
- **Product Registration**:
  - **Option A (Bill OCR Auto-Scan)**: Drag & drop bill (JPG, PNG, PDF) or test with 1-click sample receipts. Simulated OCR extraction identifies Product, Serial Number, Purchase Date, Seller, Amount, and Warranty Months. Automatically calculates `Warranty Expiry Date = Purchase Date + Warranty Period`.
  - **Option B (Manual Entry)**: Fast form with instant validation.
- **Detailed Warranty Check**: Visual 3-point timeline (Purchased → Today → Expiration).
- **Raise Service Claim**: Selecting a product automatically detects warranty state. Free coverage for active warranty; displays clear advisory for expired items: *"⚠ This product is not covered under standard warranty. Service may be chargeable."*
- **6-Step Interactive Claim Tracking**:
  `Claim Raised` → `Staff Reviewing` → `Mechanic Assigned` → `Home Visit Scheduled` → `Service Completed` → `Claim Resolved`.
- **Claim History Table**: Filterable by Status, Product, Date, and Warranty with Claim ID search.

### 2. Staff / Admin Persona
- **KPI Metrics**: Total Claims, New, In Progress, Resolved, and Expired Warranty Claims.
- **Smart Analytics Charts**: Claims by Status, Claims by Category, Warranty vs Expired, and Monthly Volume.
- **Repeat Issue Detection**: Automatically flags products with recurring complaints (e.g., *Samsung Refrigerator – 3 claims in last 60 days: Cooling Failure, Compressor Noise*).
- **Claims Management Table**: Displays tickets with prominent `⚠ EXPIRED WARRANTY` flags.
- **Smart Mechanic Assignment**:
  - Recommends best technician (e.g. *Arun Kumar*) based on location distance, specialization, availability, and active workload.

### 3. Service Mechanic Persona (e.g., Arun Kumar)
- **Technician Dashboard**: Assigned Jobs, Today's Home Visits, Completed, and Pending.
- **Visit Execution**: Start Service and doorstep diagnosis.
- **Digital Service Report**: Form with diagnosis, actions taken, parts replaced chips, before/after photo attachment, customer confirmation toggle.
- **Resolution**: Submitting the report automatically transitions the claim to **`RESOLVED`** and notifies the customer.

---

## ⏱ 30-Second Evaluator Demo Walkthrough

1. Open [http://localhost:5173/](http://localhost:5173/).
2. Click **Customer** in top navigation or login.
3. Click **Register Product** → click **Sample 1 (LG Washing Machine)** → see simulated OCR scan → verify calculated expiry date → Click **Register Product**.
4. Click **Raise Claim** → select **Samsung Refrigerator** → observe active warranty badge → submit claim. Notice unique ID `CLM-2026-XXXX`.
5. Switch role to **Staff / Admin** via top pill.
6. See the **Repeat Issue Alert** for the Samsung Refrigerator (3 claims).
7. In the table, click **Assign Mechanic** on the new claim → see **Recommended Match: Arun Kumar** → click **Confirm Mechanic Assignment**.
8. Switch role to **Service Mechanic** via top pill.
9. Under **Today's Service Visits**, click **Complete Service** → review report form → click **Submit Service Report & Resolve Claim**.
10. Switch back to **Customer** → see the claim status is now **`Resolved`** and the 6-stage timeline is at 100% with the digital service report attached.
