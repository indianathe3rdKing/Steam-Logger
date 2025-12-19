
from appwrite.query import Query
from appwrite_db import tablesDB, todoDatabase, aspen_file_Id, fresenius_file_Id, todoTableAspen, todoTableFresenius
from datetime import datetime, date


# Fetches meter readings from database at 06:00
def fetch_new_data(table_Id):

    response = tablesDB.list_rows(
        database_id=todoDatabase,
        table_id=table_Id,
        queries=[Query.equal("time", "06:00")]
    )
    return response["rows"]


# Load data on module import with error handling
try:
    rows_aspen = fetch_new_data(todoTableAspen)
    rows_fresenius = fetch_new_data(todoTableFresenius)
except Exception as e:
    print(f"Warning: Failed to fetch data on import: {e}")
    rows = []


# Converts raw database rows into formatted list structure for Excel
def normalize_rows(rows):
    normalized = []
    for item in rows:
        raw_date = item.get("date")
        # Handle different date formats (datetime object or ISO string)
        if isinstance(raw_date, (datetime, date)):
            formatted_date = raw_date.strftime("%x")
        elif isinstance(raw_date, str):
            formatted_date = datetime.fromisoformat(
                raw_date.replace("Z", "")).strftime("%x")
        else:
            formatted_date = ""
        # Append formatted row with extracted meter readings
        normalized.append([
            formatted_date,
            item.get("time"),
            item.get("meter_1"),
            item.get("bypass"),
            item.get("meter_blue"),
            item.get("meter_red"),
            item.get("steam_flow_meter"),
            item.get("aspen"),

        ])
    return normalized


if __name__ == "__main__":
    print("Data fetch module loaded. Rows fetched:", len(rows))
