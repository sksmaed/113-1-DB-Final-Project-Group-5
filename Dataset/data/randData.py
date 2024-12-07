# -*- coding: utf-8 -*-
"""
Created on Sat Dec  7 19:45:23 2024

@author: user
"""
# In[import]:
import pandas as pd
from faker import Faker
import random

# In[initialization & declaration]:
# Initialize Faker
fake = Faker()

# All Table Names
tables = ["application", "applier", "building", "exhibition", 
          "exhibition_room", "host", "host_exhibition", 
          "number_attendee", "roles", "room", "room_state", 
          "sponser", "sponser_exh", "user_roles", "users", 
          "volunteer", "volunteer_work"]
          # "room", "ticket", "customer", "identity", "collection", "rent_collection"]

# Number of records for each table
num_exhibitions = 5
num_floors = 3
num_rooms = 4

num_users = 100
num_products = 50
num_orders = 200

# Predefined exhibition names
exhibition_names = [
    "Ancient Artifacts",
    "Modern Marvels",
    "Impressionist Paintings",
    "Sculptures of the World",
    "Renaissance Revival"
]

room_names = [
    "Apple",
    "Banana",
    "Chestnut",
    "Durian"
]

usage_types = ["O", "S"]

# In[application]:
application_data = {
    "app_id": [],
    "applier_id": [],
    "state": [],
    "exh_id": [],
    "time_span": [],
    "requirement": []
}
application_df = pd.DataFrame(application_data)

# In[applier]:
applier_data = {
    "applier_id": [],
    "applier_name": [],
    "requirement": []
}
applier_df = pd.DataFrame(applier_data)

# In[buildings]:
building_data = {
    "b_id": [],
    "bname": [],
    "address": []
}
building_df = pd.DataFrame(building_data)

# In[exhibition]:
exhibitions_data = {
    "exh_id": [i for i in range(1, num_exhibitions + 1)],
    "exhName": exhibition_names,
    "start_date": [fake.date_between(start_date='-2y', end_date='today') for _ in range(num_exhibitions)],
    "end_date": [fake.date_between(start_date='today', end_date='+2y') for _ in range(num_exhibitions)],
}
exhibitions_df = pd.DataFrame(exhibitions_data)

# In[exh_room]:
exh_room_data = {
    "exh_id": [i for i in range(1, num_exhibitions + 1)],
    "room_id": [random.choice(room_names) for _ in range(num_exhibitions)]
}
exh_room_df = pd.DataFrame(exh_room_data)

# In[host]:
host_data = {
    "host_name": []
}
host_df = pd.DataFrame(host_data)

# In[host_exhibition]:
host_exh_data = {
    "host_name": [],
    "exh_id": []
}
host_exh_df = pd.DataFrame(host_exh_data)

# In[number_attendee]:
num_attendee_data = {
    "exh_id": [],
    "date": [],
    "number": []
}
num_attendee_df = pd.DataFrame(num_attendee_data)

# In[roles]:
roles_data = {
    "id": [],
    "name": [],
    "createdAt": [], 
    "updatedAt": []
}
roles_df = pd.DataFrame(roles_data)

# In[room]:
# Ensure each usage type is chosen at least once
r_usage = usage_types.copy()
if num_rooms > len(usage_types):
    additional_events = random.choices(usage_types, k=num_rooms - len(usage_types))
    r_usage.extend(additional_events)
random.shuffle(r_usage)

room_data = {
    "r_id": [i for i in range(1, num_rooms + 1)],
    "rname": room_names,
    "usage": r_usage,
    "floor": [random.randint(1, num_floors) for _ in range(num_rooms)],
    "area": [round(random.uniform(500.0, 2000.0), 2) for _ in range(num_rooms)],
    "height": [round(random.uniform(30.0, 50.0), 2) for _ in range(num_rooms)],
    "b_id": [random.randint(1, 3) for _ in range(num_rooms)],
    "rent_cost": [round(random.uniform(10000, 30000), 2) for _ in range(num_rooms)]
}
room_df = pd.DataFrame(room_data)

# In[room_state]:
room_state_data = {
    "r_id": [],
    "state_name": [],
    "start_date": [], 
    "end_date": []
}
room_state_df = pd.DataFrame(room_state_data)

# In[sponser]:
spon_data = {
    "spon_name": []
}
spon_df = pd.DataFrame(spon_data)

# In[sponser_exh]:
spon_data = {
    "spon_name": [],
    "exh_id": [],
    "amount": []
}
spon_df = pd.DataFrame(spon_data)

# In[user_roles]:
user_roles_data = {
    "createdAt": [],
    "uodatedAt": [],
    "roleID": [],
    "userID": []
}
user_roles_df = pd.DataFrame(user_roles_data)

# In[user_roles]:
user_roles_data = {
    "createdAt": [],
    "uodatedAt": [],
    "roleID": [],
    "userID": []
}
user_roles_df = pd.DataFrame(user_roles_data)

# In[example]:
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

# In[output]:
# Save to Excel
import os
script_dir = os.path.dirname(os.path.abspath(__file__))# Get the directory of the current script
output_path = os.path.join(script_dir, 'data.xlsx')# Output path in the same folder as the script
with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
    users_df.to_excel(writer, index=False, sheet_name="Users")
    products_df.to_excel(writer, index=False, sheet_name="Products")
    orders_df.to_excel(writer, index=False, sheet_name="Orders")
    exhibitions_df.to_excel(writer, index=False, sheet_name="Exhibitions")
    exh_room_df.to_excel(writer, index=False, sheet_name="Exh_Room")
    room_df.to_excel(writer, index=False, sheet_name="Rooms")

print("Data successfully written to Database_Tables.xlsx")
