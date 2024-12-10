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
import numpy as np
from datetime import datetime, timedelta

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
    
# generate a number from normal distribution with specified mean and std
def generate_discrete_normal(mean, std_dev, low=1, high=100):
    number = np.random.normal(mean, std_dev)
    rounded_number = round(number)
    clipped_number = max(low, min(high, rounded_number))
    return clipped_number

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
num_host = 4
num_applier = num_application
num_spon = 20
num_volunteers = 100
num_rooms = 15
num_customer = 10000
num_transaction = 20000
num_ticket = 20
num_staff = 50

operation_year = 5
today = datetime.today().date() - timedelta(days=50)
operation_start_date = (today.replace(year=today.year - operation_year) 
                        if today.month != 2 or today.day != 29 else today - timedelta(days=365))

# Predefined exhibition names
num_exhibitions = 5
# exhibition_names = [
#     "Ancient Artifacts",
#     "Modern Marvels",
#     "Impressionist Paintings",
#     "Sculptures of the World",
#     "Renaissance Revival"
# ]
exhibition_names = [fake.sentence(random.choice(range(2, 5))) for _ in range(num_exhibitions)]

num_building = 3
building_names = generate_sequential_letters(num_building)
building_names = ["building" + n for n in building_names]

iden_dict = {
    "C": "Child",
    "S": "Student",
    "A": "Audlt",
    "O": "Oldly",
    "D": "Disabled"
}

ticket_types = [
    "m", # main
    "s", # special
    "b", # by building
    "y", # year ticket
]

ticket_identity = [
    "C",
    "S",
    "A",
    "O",
    "D"
]

ticket_prices_by_type = {
    "m": 150,
    "s": 100,
    "b": 100,
    "y": 1000
}

ticket_discount_by_identity = {
    "C": 40,
    "S": 30,
    "A": 0,
    "O": 40,
    "D": -1
}

application_states = [
    "P",
    "C",
    "A",
    "D"
]

vol_works = [
    "Audience Informatic Services", 
    "Audience Guidance", 
    "Administration Support"
]

payment_methods = [
    "cash",
    "credit card",
    "digital",
    "online",
    "nfc/qrcode"
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
    "time_span": [],
    "requirement": [fake.sentence() for i in range(num_application)]
}
application_data["time_span"] = [
    (exhibitions_df.loc[exhibitions_df["exh_id"] == i, "end_date"].iloc[0] -
     exhibitions_df.loc[exhibitions_df["exh_id"] == i, "start_date"].iloc[0]).days
    for i in application_data["exh_id"]
]
application_df = pd.DataFrame(application_data)

# In[3 buildings]:
building_data = {
    "b_id": ["b"+str(i) for i in range(1, num_building + 1)],
    "bname": building_names,
    "address": [str(fake.address()) for i in range(num_building)]
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
    "rname": [fake.text(max_nb_chars=10) for _ in range(num_rooms)],
    "usage": r_usage,
    "floor": [random.randint(1, num_floors) for _ in range(num_rooms)],
    "area": [int(round(random.uniform(500.0, 2000.0), 0)) for _ in range(num_rooms)],
    "height": [int(round(random.uniform(30.0, 50.0), 0)) for _ in range(num_rooms)],
    "b_id": [random.choice(building_data["b_id"]) for _ in range(num_rooms)],
    "rent_cost": [int(round(random.uniform(10000, 30000), 0)) for _ in range(num_rooms)]
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

mean_spon = 10
std_dev_spon = 20  # Standard deviation

# Randomly assign sponsors to exhibitions
for exh_id in exhibitions_df["exh_id"]:
    # Randomly choose at least one unique sponsor for this exhibition
    num_sponsors = random.randint(1, len(spon_data["spon_name"]))  # Random number of sponsors
    chosen_sponsors = random.sample(spon_data["spon_name"], num_sponsors)
    
    # Assign random amounts for each sponsor-exhibition pair
    for spon_name in chosen_sponsors:
        spon_exh_data["spon_name"].append(spon_name)
        spon_exh_data["exh_id"].append(exh_id)
        spon_exh_data["amount"].append(generate_discrete_normal(mean_spon, std_dev_spon, low=1, high=100) * 1000)
        
spon_exh_df = pd.DataFrame(spon_exh_data)

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

# Randomly assign sponsors to exhibitions
for exh_id in exhibitions_df["exh_id"]:
    # Randomly choose at least one unique sponsor for this exhibition
    num_volunteer_work = random.randint(2, 15)
    chosen_v = random.sample(volunteer_data["v_id"], num_volunteer_work)
    
    # Assign random amounts for each sponsor-exhibition pair
    for vid in chosen_v:
        volunteer_work_data["v_id"].append(vid)
        volunteer_work_data["exh_id"].append(exh_id)
        volunteer_work_data["start_time"].append(exhibitions_df.loc[exhibitions_df["exh_id"] == exh_id, "start_date"].iloc[0])
        volunteer_work_data["end_time"].append(exhibitions_df.loc[exhibitions_df["exh_id"] == exh_id, "end_date"].iloc[0])
        volunteer_work_data["duty"].append(random.choice(vol_works))
        
volunteer_work_df = pd.DataFrame(volunteer_work_data)

# In[23 staff]:
staff_data = {
    "s_id": ["s"+str(i) for i in range(1, num_staff + 1)],
    "s_name": [fake.name_nonbinary() for _ in range(num_staff)],
    "position": ["pos"+random.choice(["A", "B", "C", "D", "E"]) for _ in range(num_staff)],
    "contract_start_date": [fake.date_between(start_date="-5y", end_date="-1y") for _ in range(num_staff)]
}
staff_df = pd.DataFrame(staff_data)

# In[24 staff_work]:
staff_work_data = {
    "s_id": [],
    "exh_id": [],
    "duty": []
}
staff_work_df = pd.DataFrame(staff_work_data)

# In[18 customer identity]:
identity_data = {
    "iden_name": iden_dict.keys(),
    "info": iden_dict.values()
}
identity_df = pd.DataFrame(identity_data)

# In[19 customer]:
customer_data = {
    "c_id": ["c"+str(i) for i in range(1, num_customer + 1)],
    "cname": [fake.name() for _ in range(num_customer)],
    "cbdate": [fake.date_of_birth(minimum_age=0, maximum_age=80) for _ in range(num_customer)],
    "iden_name": ["" for _ in range(num_customer)] # temp
}
customer_df = pd.DataFrame(customer_data)

# In[21 ticket]:
ticket_data = {
    "t_id": [], # "t"+str(i) for i in range(1, num_ticket + 1)
    "t_name": [],
    "price": [],
    "sale_start_date": [],
    "sale_end_date": [],
    "valid_time_span": [],
    "iden_name": []
}

for i in ticket_types:
    start_year = 1 if i == "m" else random.choice([1, 2])
    for j in ticket_identity:
        for k in range(start_year, operation_year+1):
            ticket_data["t_id"].append("t_"+i+j+str(k))
            ticket_data["t_name"].append(i+j)
            if j == "D":
                ticket_data["price"].append(0)
            elif k==start_year:
                ticket_data["price"].append(ticket_prices_by_type[i] - ticket_discount_by_identity[j])
            else:
                ticket_data["price"].append(ticket_data["price"][-1]+random.choice([0, 10]))
            ticket_data["sale_start_date"].append(operation_start_date.replace(year = operation_start_date.year + k))
            ticket_data["sale_end_date"].append(ticket_data["sale_start_date"][-1].replace(year = ticket_data["sale_start_date"][-1].year+1).replace(day = ticket_data["sale_start_date"][-1].day-1))
            if i=="y":
                ticket_data["valid_time_span"].append(365)
            else:
                ticket_data["valid_time_span"].append(1)
            ticket_data["iden_name"].append(j)

ticket_df = pd.DataFrame(ticket_data)

# In[20 transaction]:
transaction_data = {
    "tran_id": ["tr"+str(i) for i in range(1, num_transaction + 1)],
    # "t_id": [], # we must need this
    # "amount": [generate_discrete_normal(1.5, 3) for _ in range(num_transaction)],
    "c_phone": [fake.phone_number() for _ in range(num_transaction)],
    "date": [fake.date_between(start_date='-'+str(operation_year)+'y', end_date='today') for _ in range(num_transaction)],
    "payment_method": [random.choice(payment_methods) for _ in range(num_transaction)]
}
# for i in range(num_transaction):
#     ava_tickets = ticket_df["t_id"][ticket_df["sale_start_date"] < transaction_data["date"][transaction_data["tran_id"] == "tr"+str(i)] & ticket_df["sale_end_date"] > transaction_data["date"][transaction_data["tran_id"] == "tr"+str(i)] & transaction_data["tran_id"] == "tr"+str(i)]
#     transaction_data["t_id"].append(random.choice(ava_tickets))
transaction_df = pd.DataFrame(transaction_data)

# In[22 ticket_ava]:
tic_ava_data = {
    "t_id": [],
    "r_id": []
}
tic_ava_df = pd.DataFrame(tic_ava_data)

# In[output to .xlsx]:
# Save to Excel
import os
script_dir = os.path.dirname(os.path.abspath(__file__))# Get the directory of the current script
output_path = os.path.join(script_dir, 'data.xlsx')# Output path in the same folder as the script
with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
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
    staff_df.to_excel(writer, index=False, sheet_name="Staff")
    staff_work_df.to_excel(writer, index=False, sheet_name="Staff_Work")
    identity_df.to_excel(writer, index=False, sheet_name="Identity")
    customer_df.to_excel(writer, index=False, sheet_name="Customer")
    transaction_df.to_excel(writer, index=False, sheet_name="Transaction")
    ticket_df.to_excel(writer, index=False, sheet_name="Ticket")
    tic_ava_df.to_excel(writer, index=False, sheet_name="Ticket_Avalable")

print("Data successfully written to Database_Tables.xlsx")

# In[output to .csv]:
import pandas as pd
import os

# Path to the Excel file
input_path = os.path.join(script_dir, 'data.xlsx')  # Path to the Excel file

# Output directory for CSV files
output_dir = os.path.join(script_dir, 'csv_exports')
os.makedirs(output_dir, exist_ok=True)  # Create directory if it doesn't exist

# Read the Excel file
excel_data = pd.ExcelFile(input_path)  # Load the Excel file

# Iterate through all sheets and save each as a CSV
for sheet_name in excel_data.sheet_names:
    df = pd.read_excel(input_path, sheet_name=sheet_name, skiprows=1)  # Read each sheet
    output_csv_path = os.path.join(output_dir, f"{sheet_name}.csv")  # Output path
    df.to_csv(output_csv_path, index=False)  # Write to CSV
    print(f"Saved {sheet_name} to {output_csv_path}")

print("All sheets successfully converted to CSV files.")

