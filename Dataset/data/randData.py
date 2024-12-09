# -*- coding: utf-8 -*-
"""
Created on Sat Dec  7 19:45:23 2024

@author: user
"""
# In[import]:
import pandas as pd
from faker import Faker
import random
import string

# In[initialization & declaration]:
# Initialize Faker
fake = Faker()

# name generator
def generate_sequential_letters(amount):
    if amount <= 26:
        # Generate single letters
        return list(string.ascii_uppercase[:amount])
    else:
        # Generate letters starting from "A" to "ZZ" (or more)
        letters = []
        for first in string.ascii_uppercase:
            for second in string.ascii_uppercase:
                letters.append(first + second)
                if len(letters) >= amount:
                    return letters
        return letters  # This handles cases if amount is beyond "ZZ"

# All Table Names
tables = ["application", "applier", "building", "exhibition", 
          "exhibition_room", "host", "host_exhibition", 
          "number_attendee", "roles", "room", "room_state", 
          "sponser", "sponser_exh", "user_roles", "users", 
          "volunteer", "volunteer_work"]
          # "room", "ticket", "customer", "identity", "collection", "rent_collection"]

# Number of records for each table
num_floors = 3
num_application = 5
num_spon_exh = 30
num_users = 1000
num_host = 4
num_applier = num_application
num_spon = 20
num_volunteers = 100

# num_users = 100
# num_products = 50
# num_orders = 200

# Predefined exhibition names
exhibition_names = [
    "Ancient Artifacts",
    "Modern Marvels",
    "Impressionist Paintings",
    "Sculptures of the World",
    "Renaissance Revival"
]
num_exhibitions = len(exhibition_names)

num_rooms = 15
room_names = [fake.text(max_nb_chars=10) for _ in range(num_rooms)]


num_building = 3
building_names = generate_sequential_letters(num_building)
building_names = ["building" + n for n in building_names]

application_states = [
    "P",
    "C",
    "A",
    "D"
]

time_spans = [
    30, 
    60,
    180
]

usage_types = ["O", "S"]

# In[2 applier]:
applier_data = {
    "applier_id": ["aplr"+str(i) for i in range(1, num_applier + 1)],
    "applier_name": [fake.name() for _ in range(num_applier)],
    "requirement": [fake.sentence() for i in range(num_application)]
}
applier_df = pd.DataFrame(applier_data)

# In[4 exhibition]:
exhibitions_data = {
    "exh_id": ["ex"+str(i) for i in range(1, num_exhibitions + 1)],
    "exhName": exhibition_names,
    "start_date": [fake.date_between(start_date='-90d', end_date='today') for _ in range(num_exhibitions)],
    "end_date": [fake.date_between(start_date='today', end_date='+90d') for _ in range(num_exhibitions)],
}
exhibitions_df = pd.DataFrame(exhibitions_data)

# In[1 application]:
application_data = {
    "app_id": ["aplc"+str(i) for i in range(1, num_application + 1)],
    "applier_id": [random.choice(applier_data["applier_id"]) for i in range(1, num_applier + 1)],
    "state": [random.choice(application_states) for _ in range(num_application)],
    "exh_id": [random.choice(exhibitions_data["exh_id"]) for i in range(1, num_exhibitions + 1)],
    "time_span": [random.choice(time_spans) for _ in range(num_application)],
    "requirement": [fake.sentence() for i in range(num_application)]
}
application_df = pd.DataFrame(application_data)

# In[3 buildings]:
building_data = {
    "b_id": ["b"+str(i) for i in range(1, num_building + 1)],
    "bname": building_names,
    "address": [fake.address() for i in range(num_building)]
}
building_df = pd.DataFrame(building_data)

# In[10 room]:
# Ensure each usage type is chosen at least once
r_usage = usage_types.copy()
if num_rooms > len(usage_types):
    additional_events = random.choices(usage_types, k=num_rooms - len(usage_types))
    r_usage.extend(additional_events)
random.shuffle(r_usage)

room_data = {
    "r_id": ["r"+str(i) for i in range(1, num_rooms + 1)],
    "rname": room_names,
    "usage": r_usage,
    "floor": [random.randint(1, num_floors) for _ in range(num_rooms)],
    "area": [round(random.uniform(500.0, 2000.0), 2) for _ in range(num_rooms)],
    "height": [round(random.uniform(30.0, 50.0), 2) for _ in range(num_rooms)],
    "b_id": [random.choice(building_data["b_id"]) for _ in range(num_rooms)],
    "rent_cost": [round(random.uniform(10000, 30000), 2) for _ in range(num_rooms)]
}
room_df = pd.DataFrame(room_data)

# In[5 exh_room]:
exh_room_data = {
    "exh_id": ["ex"+str(i) for i in range(1, num_exhibitions + 1)],
    "room_id": [random.choice(room_data["r_id"]) for _ in range(num_exhibitions)]
}
exh_room_df = pd.DataFrame(exh_room_data)

# In[6 host]:
host_data = {
    "host_name": [fake.name() for _ in range(num_host)]
}
host_df = pd.DataFrame(host_data)

# In[7 host_exhibition]:
host_exh_data = {
    "host_name": [random.choice(host_data["host_name"]) for _ in range(num_exhibitions)],
    "exh_id": ["ex"+str(i) for i in range(1, num_exhibitions + 1)]
}
host_exh_df = pd.DataFrame(host_exh_data)

# In[8 number_attendee]:
# num_attendee_data = {
#     "exh_id": [],
#     "date": [],
#     "number": []
# }
# num_attendee_df = pd.DataFrame(num_attendee_data)

# In[11 room_state]:
room_state_data = {
    "r_id": [],
    "state_name": [],
    "start_date": [], 
    "end_date": []
}
room_state_df = pd.DataFrame(room_state_data)

# In[12 sponser]:
spon_data = {
    "spon_name": [fake.name() for _ in range(num_spon)]
}
spon_df = pd.DataFrame(spon_data)

# In[13 sponser_exh]:
spon_exh_data = {
    "spon_name": [],
    "exh_id": [],
    "amount": []
}

# Randomly assign sponsors to exhibitions
for exh_id in exhibitions_df["exh_id"]:
    # Randomly choose at least one unique sponsor for this exhibition
    num_sponsors = random.randint(1, len(spon_data["spon_name"]))  # Random number of sponsors
    chosen_sponsors = random.sample(spon_data["spon_name"], num_sponsors)
    
    # Assign random amounts for each sponsor-exhibition pair
    for spon_name in chosen_sponsors:
        spon_exh_data["spon_name"].append(spon_name)
        spon_exh_data["exh_id"].append(exh_id)
        spon_exh_data["amount"].append(random.randint(1, 100) * 1000)
        
spon_exh_df = pd.DataFrame(spon_exh_data)

# In[15 users]:
# users_data = {
#     "id": [i for i in range(1, num_users + 1)],
#     "username": [fake.name() for _ in range(num_users)],
#     "phone": [fake.msisdn() for _ in range(num_users)],
#     "password": [fake.password() for _ in range(num_users)],
#     "createdAt": [fake.date_between(start_date='-10y', end_date='today') for _ in range(num_users)],
#     "updatedAt": []
# }
# users_data["updatedAt"] = [created_date + pd.Timedelta(days=2 * 365) for created_date in users_data["createdAt"]]
# users_df = pd.DataFrame(users_data)

# In[16 volunteer]:
volunteer_data = {
    "v_id": ["vol"+str(i) for i in range(1, num_volunteers + 1)],
    "v_name": [fake.name() for _ in range(num_volunteers)]
}
volunteer_df = pd.DataFrame(volunteer_data)

# In[17 volunteer_work]:
volunteer_work_data = {
    "v_id": [],
    "exh_id": [],
    "start_time": [],
    "end_time": [],
    "duty": []
}
volunteer_work_df = pd.DataFrame(volunteer_work_data)

# In[example]:
# # Generate Users table
# users_data = {
#     "UserID": [i for i in range(1, num_users + 1)],
#     "Name": [fake.name() for _ in range(num_users)],
#     "Email": [fake.email() for _ in range(num_users)],
#     "RegistrationDate": [fake.date_this_decade() for _ in range(num_users)],
# }
# users_df = pd.DataFrame(users_data)

# # Generate Products table
# products_data = {
#     "ProductID": [i for i in range(1, num_products + 1)],
#     "ProductName": [fake.word().capitalize() for _ in range(num_products)],
#     "Price": [round(random.uniform(10.0, 500.0), 2) for _ in range(num_products)],
#     "Stock": [random.randint(1, 100) for _ in range(num_products)],
# }
# products_df = pd.DataFrame(products_data)

# # Generate Orders table
# orders_data = {
#     "OrderID": [i for i in range(1, num_orders + 1)],
#     "UserID": [random.choice(users_data["UserID"]) for _ in range(num_orders)],
#     "ProductID": [random.choice(products_data["ProductID"]) for _ in range(num_orders)],
#     "OrderDate": [fake.date_this_year() for _ in range(num_orders)],
#     "Quantity": [random.randint(1, 5) for _ in range(num_orders)],
# }
# orders_df = pd.DataFrame(orders_data)

# In[output]:
# Save to Excel
import os
script_dir = os.path.dirname(os.path.abspath(__file__))# Get the directory of the current script
output_path = os.path.join(script_dir, 'data.xlsx')# Output path in the same folder as the script
with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
    # users_df.to_excel(writer, index=False, sheet_name="User")
    exhibitions_df.to_excel(writer, index=False, sheet_name="Exhibition")
    exh_room_df.to_excel(writer, index=False, sheet_name="Exh_Room")
    room_df.to_excel(writer, index=False, sheet_name="Room")
    volunteer_work_df.to_excel(writer, index=False, sheet_name="Volunteer_Work")
    volunteer_df.to_excel(writer, index=False, sheet_name="Volunteer")
    spon_df.to_excel(writer, index=False, sheet_name="Sponser")
    room_state_df.to_excel(writer, index=False, sheet_name="Room_State")
    spon_exh_df.to_excel(writer, index=False, sheet_name="Sponser_Exhibition")
    # num_attendee_df.to_excel(writer, index=False, sheet_name="NumberOfAttendee")
    host_exh_df.to_excel(writer, index=False, sheet_name="Host_Exhibition")
    building_df.to_excel(writer, index=False, sheet_name="Building")
    applier_df.to_excel(writer, index=False, sheet_name="Applier")
    application_df.to_excel(writer, index=False, sheet_name="Application")
    host_df.to_excel(writer, index=False, sheet_name="Host")

print("Data successfully written to Database_Tables.xlsx")
