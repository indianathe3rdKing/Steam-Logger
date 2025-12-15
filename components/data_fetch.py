
from appwrite.query import Query
from appwrite_db import tablesDB, todoDatabase, todoTable
from datetime import datetime, date


def fetch_new_data():

    response = tablesDB.list_rows(
        database_id=todoDatabase,
        table_id=todoTable,
        queries=[Query.equal("time", "06:00")]
    )
    return response["rows"]


rows = fetch_new_data()


def normalize_rows(rows):
    normalized = []

    for item in rows:
        raw_date = item.get("date")
        if isinstance(raw_date, (datetime, date)):
            formatted_date = raw_date.strftime("%x")
        elif isinstance(raw_date, str):
            formatted_date = datetime.fromisoformat(
                raw_date.replace("Z", "")).strftime("%x")
        else:
            formatted_date = ""
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
