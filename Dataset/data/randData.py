# -*- coding: utf-8 -*-
"""
Created on Sat Dec  7 19:45:23 2024

@author: user
"""

import pandas as pd
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# Predefined exhibition names
exhibition_names = [
    "Ancient Artifacts",
    "Modern Marvels",
    "Impressionist Paintings",
    "Sculptures of the World",
    "Renaissance Revival"
]

# Number of records for each table
num_users = 100
num_products = 50
num_orders = 200
num_exhibitions = len(exhibition_names)

# Generate Exhibitions table
exhibitions_data = {
    "exh_id": [i for i in range(1, num_exhibitions + 1)],
    "exhName": exhibition_names,
    "start_date": [fake.date_between(start_date='-2y', end_date='today') for _ in range(num_exhibitions)],
    "end_date": [fake.date_between(start_date='today', end_date='+2y') for _ in range(num_exhibitions)],
}
exhibitions_df = pd.DataFrame(exhibitions_data)

# Generate Events table
num_events = 20
events_data = {
    "EventID": [i for i in range(1, num_events + 1)],
    "ExhibitionName": [random.choice(exhibition_names) for _ in range(num_events)],
    "EventDate": [fake.date_this_year() for _ in range(num_events)],
    "Description": [fake.sentence() for _ in range(num_events)],
}
events_df = pd.DataFrame(events_data)

# Generate Users table
users_data = {
    "UserID": [i for i in range(1, num_users + 1)],
    "Name": [fake.name() for _ in range(num_users)],
    "Email": [fake.email() for _ in range(num_users)],
    "RegistrationDate": [fake.date_this_decade() for _ in range(num_users)],
}
users_df = pd.DataFrame(users_data)

# Generate Products table
products_data = {
    "ProductID": [i for i in range(1, num_products + 1)],
    "ProductName": [fake.word().capitalize() for _ in range(num_products)],
    "Price": [round(random.uniform(10.0, 500.0), 2) for _ in range(num_products)],
    "Stock": [random.randint(1, 100) for _ in range(num_products)],
}
products_df = pd.DataFrame(products_data)

# Generate Orders table
orders_data = {
    "OrderID": [i for i in range(1, num_orders + 1)],
    "UserID": [random.choice(users_data["UserID"]) for _ in range(num_orders)],
    "ProductID": [random.choice(products_data["ProductID"]) for _ in range(num_orders)],
    "OrderDate": [fake.date_this_year() for _ in range(num_orders)],
    "Quantity": [random.randint(1, 5) for _ in range(num_orders)],
}
orders_df = pd.DataFrame(orders_data)

# Save to Excel
import os
script_dir = os.path.dirname(os.path.abspath(__file__))# Get the directory of the current script
output_path = os.path.join(script_dir, 'data.xlsx')# Output path in the same folder as the script
try:
    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
        users_df.to_excel(writer, index=False, sheet_name="Users")
        products_df.to_excel(writer, index=False, sheet_name="Products")
        orders_df.to_excel(writer, index=False, sheet_name="Orders")
        exhibitions_df.to_excel(writer, index=False, sheet_name="Exhibitions")
        events_df.to_excel(writer, index=False, sheet_name="Events")
except:
    raise Exception("Check if you have a file with the same name in current folder.")

print("Data successfully written to Database_Tables.xlsx")
