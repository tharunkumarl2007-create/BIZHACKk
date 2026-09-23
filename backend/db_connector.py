"""
WARRANTY+ (PS73) - MySQL Database Connector & Operations
Uses mysql.connector as requested.

To run:
1. Ensure MySQL Server is running locally.
2. Run database/schema.sql to create database and tables.
3. Update password below and execute: python backend/db_connector.py
"""

import json
from datetime import datetime, date

try:
    import mysql.connector
    from mysql.connector import Error
except ImportError:
    print("mysql-connector-python not installed. Run: pip install mysql-connector-python")
    mysql.connector = None


def get_db_connection(host="localhost", user="root", password="YOUR_PASSWORD", database="warranty_tracker"):
    """
    Establish connection to MySQL warranty_tracker database
    """
    if not mysql.connector:
        raise RuntimeError("mysql-connector is not installed.")
        
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        if connection.is_connected():
            print(f"✓ Successfully connected to MySQL database: {database}")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None


def calculate_warranty_status(purchase_date: date, warranty_months: int):
    """
    Core Requirement: Calculate whether a product is still under warranty
    Warranty Expiry Date = Purchase Date + Warranty Period (in months)
    """
    # Rough approximation for month addition or dateutil relativedelta
    year = purchase_date.year + (purchase_date.month + warranty_months - 1) // 12
    month = (purchase_date.month + warranty_months - 1) % 12 + 1
    day = min(purchase_date.day, 28) # handle leap years/month bounds
    expiry_date = date(year, month, day)

    today = date.today()
    is_active = today <= expiry_date
    return {
        "expiry_date": expiry_date,
        "is_active": is_active,
        "status": "active" if is_active else "expired"
    }


def query_all_claims(connection):
    """
    Fetch claims along with customer name and warranty status flag
    """
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT 
        c.id AS claim_id,
        cust.name AS customer_name,
        p.name AS product_name,
        c.issue_category,
        c.is_warranty_active,
        c.status,
        c.stage,
        m.name AS assigned_mechanic,
        c.visit_date,
        c.is_repeat_issue,
        c.repeat_issue_count
    FROM claims c
    JOIN customers cust ON c.customer_id = cust.id
    JOIN products p ON c.product_id = p.id
    LEFT JOIN mechanics m ON c.assigned_mechanic_id = m.id
    ORDER BY c.created_at DESC;
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    return rows


def check_repeat_issues(connection, product_id):
    """
    Rule-based Repeat Issue Detection:
    Count how many claims exist for this specific product ID.
    If >= 2, returns flag and claim history.
    """
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT id, issue_category, description, status, created_at
    FROM claims
    WHERE product_id = %s
    ORDER BY created_at DESC;
    """
    cursor.execute(query, (product_id,))
    claims = cursor.fetchall()
    cursor.close()

    count = len(claims)
    is_repeated = count >= 2
    return {
        "product_id": product_id,
        "claim_count": count,
        "is_repeated": is_repeated,
        "recent_claims": claims
    }


if __name__ == "__main__":
    print("=" * 60)
    print("WARRANTY+ MySQL Backend Service (PS73)")
    print("=" * 60)
    print("Sample calculation demo:")
    test_purchase = date(2026, 6, 12)
    warranty_info = calculate_warranty_status(test_purchase, 24)
    print(f"Purchased: {test_purchase}")
    print(f"Warranty: 24 Months")
    print(f"Expiry Date: {warranty_info['expiry_date']}")
    print(f"Status: {warranty_info['status'].upper()}")
    print("=" * 60)
