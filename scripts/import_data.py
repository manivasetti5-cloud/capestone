import os
import pandas as pd
import psycopg2
import uuid

# PostgreSQL connection
conn = psycopg2.connect(
    dbname="all_india_villages",
    user="postgres",
    password="89191@Mani",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

dataset_folder = "../dataset"

# Insert Country India
india_id = str(uuid.uuid4())
cur.execute("INSERT INTO \"Country\" (id, code, name, \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, NOW(), NOW()) ON CONFLICT (code) DO NOTHING", (india_id, 'IN', 'India'))

cur.execute("SELECT id FROM \"Country\" WHERE code='IN'")
india_id = cur.fetchone()[0]

state_map = {}
district_map = {}
subdistrict_map = {}

for file in os.listdir(dataset_folder):
    if file.endswith(".xls") or file.endswith(".xlsx") or file.endswith(".ods"):
        filepath = os.path.join(dataset_folder, file)
        print(f"Reading {file}...")

        if file.endswith(".ods"):
            df = pd.read_excel(filepath, engine="odf")
        else:
            df = pd.read_excel(filepath)

        df.columns = [str(col).strip() for col in df.columns]

        for _, row in df.iterrows():
            try:
                state_code = str(row['MDDS STC']).strip() if pd.notna(row['MDDS STC']) else ""
                state_name = str(row['STATE NAME']).strip()

                district_code = str(row['MDDS DTC']).strip() if pd.notna(row['MDDS DTC']) else ""
                district_name = str(row['DISTRICT NAME']).strip()

                subdistrict_code = str(row['MDDS Sub_DT']).strip() if pd.notna(row['MDDS Sub_DT']) else ""
                subdistrict_name = str(row['SUB-DISTRICT NAME']).strip()

                village_code = str(row['MDDS PLCN']).strip() if pd.notna(row['MDDS PLCN']) else ""
                village_name = str(row['Area Name']).strip()

                if not state_code or state_code == "0" or not village_code or village_code == "0":
                    continue

                # Insert State
                if state_code not in state_map:
                    s_id = str(uuid.uuid4())
                    cur.execute(
                        "INSERT INTO \"State\" (id, code, name, \"countryId\", \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, %s, NOW(), NOW()) ON CONFLICT (code) DO NOTHING",
                        (s_id, state_code, state_name, india_id)
                    )
                    cur.execute("SELECT id FROM \"State\" WHERE code=%s", (state_code,))
                    state_map[state_code] = cur.fetchone()[0]

                s_id = state_map[state_code]

                # Insert District
                district_key = f"{s_id}_{district_code}"
                if district_key not in district_map:
                    d_id = str(uuid.uuid4())
                    cur.execute(
                        "INSERT INTO \"District\" (id, code, name, \"stateId\", \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, %s, NOW(), NOW()) ON CONFLICT (\"stateId\", code) DO NOTHING",
                        (d_id, district_code, district_name, s_id)
                    )
                    cur.execute("SELECT id FROM \"District\" WHERE \"stateId\"=%s AND code=%s", (s_id, district_code))
                    district_map[district_key] = cur.fetchone()[0]
                
                d_id = district_map[district_key]

                # Insert Subdistrict
                subdistrict_key = f"{d_id}_{subdistrict_code}"
                if subdistrict_key not in subdistrict_map:
                    sd_id = str(uuid.uuid4())
                    cur.execute(
                        "INSERT INTO \"SubDistrict\" (id, code, name, \"districtId\", \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, %s, NOW(), NOW()) ON CONFLICT (\"districtId\", code) DO NOTHING",
                        (sd_id, subdistrict_code, subdistrict_name, d_id)
                    )
                    cur.execute("SELECT id FROM \"SubDistrict\" WHERE \"districtId\"=%s AND code=%s", (d_id, subdistrict_code))
                    subdistrict_map[subdistrict_key] = cur.fetchone()[0]

                sd_id = subdistrict_map[subdistrict_key]

                # Insert Village
                v_id = str(uuid.uuid4())
                cur.execute(
                    "INSERT INTO \"Village\" (id, code, name, \"subDistrictId\", \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, %s, NOW(), NOW()) ON CONFLICT (code) DO NOTHING",
                    (v_id, village_code, village_name, sd_id)
                )

            except Exception as e:
                print(f"Skipping row due to error: {e}")

        conn.commit()

cur.close()
conn.close()

print("All India Geo Data Imported Successfully!")