#!/usr/bin/env python
from appwrite.query import Query
from openpyxl import Workbook
from datetime import datetime, date
import sys
print("1. Starting script...", flush=True)

print("2. Importing datetime...", flush=True)

print("3. Importing openpyxl...", flush=True)

print("4. About to import appwrite_db...", flush=True)
sys.stdout.flush()

try:
    from appwrite_db import tablesDB, todoDatabase, todoTable
    print("5. Successfully imported appwrite_db", flush=True)
except Exception as e:
    print(f"5. Error importing appwrite_db: {e}", flush=True)
    sys.exit(1)

print("6. About to import from appwrite.query...", flush=True)

print("7. About to define fetch_new_data...", flush=True)


def fetch_new_data():
    print("8. Inside fetch_new_data, about to call tablesDB.list_rows...", flush=True)
    response = tablesDB.list_rows(
        database_id=todoDatabase,
        table_id=todoTable,
        queries=[Query.equal("time", "06:00")]
    )
    print("9. Got response from tablesDB.list_rows", flush=True)
    return response["rows"]


print("10. About to call fetch_new_data()...", flush=True)
sys.stdout.flush()

try:
    rows = fetch_new_data()
    print(f"11. Success! Got {len(rows)} rows", flush=True)
except Exception as e:
    print(f"11. Error calling fetch_new_data: {e}", flush=True)
    rows = []

print("Done!", flush=True)
