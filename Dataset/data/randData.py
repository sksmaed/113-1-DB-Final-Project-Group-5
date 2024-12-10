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
from datetime import datetime, timedelta, date

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
num_application = 200
num_spon_exh = 30
num_host = 4
num_applier = 1000
num_spon = 20
num_volunteers = 100
num_rooms = 35
num_customer = 10000
num_transaction = 20000
num_ticket = 20
num_staff = 50

operation_year = 10
today = datetime.today().date() - timedelta(days=50)
operation_start_date = (today.replace(year=today.year - operation_year) 
                        if today.month != 2 or today.day != 29 else today - timedelta(days=365))

# Predefined exhibition names
num_exhibitions = 400
exhibition_names = [fake.sentence(random.choice(range(2, 5)))[:-1] for _ in range(num_exhibitions)]

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
    # "b", # by building
    "y" # year ticket
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
    # "b": 100,
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
    "credit_card",
    "linepay",
    "bank_transfer"
]

exhibition_time_span = [
    30,
    60,
    90
]

usage_types = ["O", "S"]

# In[6 host]:
host_data = {
    "host_name": [fake.company() for _ in range(num_host)]
}
host_df = pd.DataFrame(host_data)

# In[2 applier]:
applier_data = {
    "applier_id": ["aplr"+str(i) for i in range(1, num_applier + 1)],
    "applier_name": [fake.name() for _ in range(num_applier)],
    "host_name": [random.choice(host_df["host_name"]) for _ in range(num_applier)]
}
applier_df = pd.DataFrame(applier_data)

# In[4 exhibition]:
exhibitions_data = {
    "exh_id": ["ex"+str(i) for i in range(1, num_exhibitions + 1)],
    "exhName": exhibition_names,
    "start_date": [fake.date_between(start_date='-10y', end_date='today') for _ in range(num_exhibitions)],
    "end_date": [],# fake.date_between(start_date='today', end_date='+90d') for _ in range(num_exhibitions)
}
# exhibitions_data["start_date"] = [datetime.strptime(date, '%Y-%m-%d') for date in exhibitions_data["start_date"]]
start_dates = exhibitions_data["start_date"].copy()
exhibitions_data["end_date"] = [
    start_date + timedelta(days=random.choice(exhibition_time_span))
    for start_date in start_dates
]
exhibitions_df = pd.DataFrame(exhibitions_data)

# In[1 application]:
application_data = {
    "app_id": ["aplc"+str(i) for i in range(1, num_application + 1)],
    "applier_id": [random.choice(applier_data["applier_id"]) for i in range(1, num_application + 1)],
    "state": [random.choice(application_states) for _ in range(num_application)],
    "exh_id": [random.choice(exhibitions_data["exh_id"]) for i in range(1, num_application + 1)],
    "time_span": [],
    "requirement": [fake.sentence() for _ in range(num_application)]
}
application_data["time_span"] = [
    (exhibitions_df.loc[exhibitions_df["exh_id"] == i, "end_date"].iloc[0] -
     exhibitions_df.loc[exhibitions_df["exh_id"] == i, "start_date"].iloc[0]).days
    for i in application_data["exh_id"]
]
# for k in application_data.keys():
#     print(len(application_data[k]))
application_df = pd.DataFrame(application_data)

# In[3 buildings]:
building_data = {
    "b_id": ["b"+str(i) for i in range(1, num_building + 1)],
    "bname": building_names,
    "address": [str(fake.address()) for i in range(num_building)]
}
building_df = pd.DataFrame(building_data)

# In[10 room]:
# # Ensure each usage type is chosen at least once
# r_usage = usage_types.copy()
# if num_rooms > len(usage_types):
#     additional_events = random.choices(usage_types, k=num_rooms - len(usage_types))
#     r_usage.extend(additional_events)
# random.shuffle(r_usage)
split_index = int(num_rooms * (1/3))
r_usage_A = [usage_types[0]] * split_index
r_usage_B = [usage_types[1]] * (num_rooms - split_index)
r_usage = r_usage_A + r_usage_B

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
# Initialize the `exh_room_data`
exh_room_data = {
    "exh_id": exhibitions_data["exh_id"].copy(),
    "room_id": [""] * len(exhibitions_data["exh_id"])  # Placeholder for room assignments
}

# Convert to DataFrame
exh_room_df = pd.DataFrame(exh_room_data)

# # Iterate over exhibitions
# for index, row in exhibitions_df.iterrows():
#     current_exh_id = row["exh_id"]
#     current_start = row["start_date"]
#     current_end = row["end_date"]
    
#     # Find overlapping exhibitions in `exh_room_df`
#     overlapping_exhibitions = exh_room_df.merge(
#         exhibitions_df,
#         on="exh_id"
#     ).loc[
#         (exhibitions_df["start_date"] <= current_end) &
#         (exhibitions_df["end_date"] >= current_start)
#     ]
    
#     # Extract `room_id` of overlapping exhibitions
#     unavailable_rooms = overlapping_exhibitions["room_id"].dropna().unique()
    
#     # Find available rooms
#     available_rooms = [room for room in room_df[room_df["usage"] == "S"]["r_id"].tolist() if room not in unavailable_rooms]
    
#     # Assign a random available room if possible
#     if available_rooms:
#         selected_room = random.choice(available_rooms)
#     else:
#         selected_room = None  # No available rooms; handle appropriately
    
#     # Update the `room_id` in `exh_room_df`
#     exh_room_df.at[index, "room_id"] = selected_room

# In[11 room_state]:
room_state_data = {
    "r_id": [],
    "state_name": [],
    "start_date": [], 
    "end_date": []
}
# 1. Initialize the room state DataFrame
start_day = date.today() - timedelta(days=365 * operation_year)
start_period = date(start_day.year, start_day.month, start_day.day)
end_day = date.today() + timedelta(days=365)
end_period = date(end_day.year, start_day.month, start_day.day)  # 1 year in the future

# Create a list of dates between start_period and end_period
date_range = pd.date_range(start=start_period, end=end_period, freq='D')
# Initialize room states to "I" for all rooms over the period
for room_id in room_df[room_df["usage"] == "S"]["r_id"].tolist():
    for d in date_range:
        room_state_data["r_id"].append(room_id)
        room_state_data["state_name"].append("I")
        room_state_data["start_date"].append(d)
        room_state_data["end_date"].append(d)
        
room_state_df = pd.DataFrame(room_state_data)

# In[exhibition room and room state assignment]
# 2. Assign rooms to exhibitions and add "L", "E", "A" states
for index, row in exhibitions_df.iterrows():
    current_exh_id = row["exh_id"]
    current_start = row["start_date"]
    current_end = row["end_date"]
    # Convert current_start and current_end to datetime.datetime
    current_start = datetime.combine(current_start, datetime.min.time())
    current_end = datetime.combine(current_end, datetime.min.time())
    
    # Find rooms available for the period including 3 days before and 1 day after the exhibition
    room_availability = room_state_df[
        (room_state_df["state_name"] == "I") & 
        (room_state_df["start_date"] >= (current_start - timedelta(days=3))) &
        (room_state_df["end_date"] <= (current_end + timedelta(days=1)))
    ]

    if not room_availability.empty:
        selected_room_id = random.choice(room_availability["r_id"].unique())
        exh_room_df.at[index, "room_id"] = selected_room_id
        
        # Mark states for the selected room
        for index, row in room_state_df[room_state_df["r_id"] == selected_room_id].iterrows():
            if row["start_date"] >= (current_start - timedelta(days=3)) and row["end_date"] <= (current_end + timedelta(days=1)):
                if row["start_date"] < current_start:
                    room_state_df.at[index, "state_name"] = "L"  # Layout before exhibition
                elif row["start_date"] >= current_start and row["end_date"] <= current_end:
                    room_state_df.at[index, "state_name"] = "E"  # Exhibition period
                elif row["end_date"] > current_end:
                    room_state_df.at[index, "state_name"] = "A"  # After exhibition cleanup

        # # Update remaining periods to "I" or "C"
        # before_exhibition_end = room_state_df[
        #     (room_state_df["r_id"] == selected_room_id) & 
        #     (room_state_df["end_date"] < current_start)
        # ]
        # after_exhibition_start = room_state_df[
        #     (room_state_df["r_id"] == selected_room_id) & 
        #     (room_state_df["start_date"] > current_end)
        # ]

        # # Set states to "I" (idle)
        # for index in before_exhibition_end.index:
        #     room_state_df.at[index, "state_name"] = "I"

        # for index in after_exhibition_start.index:
        #     room_state_df.at[index, "state_name"] = "I"

# 3. Mark some of the "I" states to "C" (construction)
i_state_indices = room_state_df[room_state_df["state_name"] == "I"].index
random_indices = random.sample(list(i_state_indices), int(len(i_state_indices) * 0.1))  # Convert 10% of "I" states to "C"
room_state_df.loc[random_indices, "state_name"] = "C"

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

# Randomly assign sponsors to exhibitions
for exh_id in exhibitions_df["exh_id"]:
    # Randomly choose at least one unique sponsor for this exhibition
    num_staff_work = random.randint(0, 4)
    chosen_s = random.sample(staff_data["s_id"], num_staff_work)
    
    # Assign random amounts for each sponsor-exhibition pair
    for sid in chosen_s:
        staff_work_data["s_id"].append(sid)
        staff_work_data["exh_id"].append(exh_id)
        staff_work_data["duty"].append(random.choice(vol_works))
        
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
            start_date = ticket_data["sale_start_date"][-1]
            ticket_data["sale_end_date"].append(start_date.replace(year = start_date.year+1).replace(day = start_date.day-1))
            if i=="y":
                ticket_data["valid_time_span"].append(365)
            else:
                ticket_data["valid_time_span"].append(1)
            ticket_data["iden_name"].append(j)

ticket_df = pd.DataFrame(ticket_data)

# In[20 transaction]:
transaction_data = {
    "tran_id": ["tr"+str(i) for i in range(1, num_transaction + 1)],
    "c_phone": [random.randint(10**9, 10**10 - 1) for _ in range(num_transaction)],
    "date": [fake.date_between(start_date='-'+str(operation_year-1)+'y', end_date='today') for _ in range(num_transaction)],
    "payment_method": [random.choice(payment_methods) for _ in range(num_transaction)],
    "t_id": [], # we must need this
    "amount": [generate_discrete_normal(1.5, 3) for _ in range(num_transaction)]
}
# Match transactions with available tickets
for i in range(num_transaction):
    tran_date = transaction_data["date"][i]  # Get the transaction date
    # Filter tickets available for this transaction date
    ava_tickets = ticket_df[
        (ticket_df["sale_start_date"] <= tran_date) &
        (ticket_df["sale_end_date"] >= tran_date)
    ]["t_id"].tolist()  # Convert to list for random.choice
    
    if ava_tickets:  # Check if there are available tickets
        transaction_data["t_id"].append(random.choice(ava_tickets))
    else:
        transaction_data["t_id"].append(None)  # Or handle as needed

# Create DataFrame
transaction_df = pd.DataFrame(transaction_data)

# In[22 ticket_ava]:
tic_ava_data = {
    "t_id": [],
    "r_id": []
}
for t in ticket_df["t_id"].tolist():
    match t[2]:
        case "m":
            for r in room_df["r_id"]:
                tic_ava_data["t_id"].append(t)
                tic_ava_data["r_id"].append(r)
        case "s":
            for r in room_df[room_df["usage"] == "S"]["r_id"].tolist():
                tic_ava_data["t_id"].append(t)
                tic_ava_data["r_id"].append(r)
        case "y":
            for r in room_df["r_id"]:
                tic_ava_data["t_id"].append(t)
                tic_ava_data["r_id"].append(r)
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

