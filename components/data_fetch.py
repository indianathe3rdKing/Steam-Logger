
from appwrite.query import Query
from appwrite_db import tablesDB, todoDatabase, todoTableAspen, todoTableFresenius
from datetime import datetime, date


# Fetches meter readings from database at 06:00
def fetch_new_data(table_Id):

    response = tablesDB.list_rows(
        database_id=todoDatabase,
        table_id=table_Id,
        queries=[Query.equal("time", "06:00"), Query.order_desc("date")],
    )
    return response["rows"]


# Load data on module import with error handling

rows_aspen = fetch_new_data(todoTableAspen)
rows_fresenius = fetch_new_data(todoTableFresenius)


# Converts raw database rows into formatted list structure for Excel


def normalize_rows_aspen(rows):
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
        # Append formatted row with extracted Aspen meter readings
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


def normalize_rows_fresenius(rows):
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
        # Append formatted row with extracted Fresenius meter readings
        normalized.append([
            formatted_date,
            item.get("time"),
            item.get("meter_fk"),
            item.get("make_up"),
            item.get("meter_sh"),
            item.get("hfo"),
            item.get("steam_flow_meter_1"),
            item.get("steam_flow_meter_2"),
        ])
    return normalized


normalized_rows_aspen = normalize_rows_aspen(rows_aspen)
normalized_rows_fresenius = normalize_rows_fresenius(rows_fresenius)
if __name__ == "__main__":
    print("Normalized Aspen Rows:", normalized_rows_aspen)
    print("Normalized Fresenius Rows:", normalized_rows_fresenius)
