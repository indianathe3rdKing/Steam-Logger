import datetime
from openpyxl import Workbook, load_workbook
import os
from data_fetch import rows, normalize_rows
FileName = "steam_data.xlsx"


HEADERS = [
    "Date", "Time", "Meter 1", "Bypass", "Meter Blue", "Meter Red", "Steam Flow Meter", "Aspen"
]

x = datetime.datetime.now()


def get_workbook():
    if os.path.exists(FileName):
        wb = load_workbook(FileName)
        ws = wb.create_sheet(title=x.strftime("%B"))

    else:
        wb = Workbook()
        ws = wb.active
        ws.append(HEADERS)

    return wb, ws


def append_rows(rows):
    wb, ws = get_workbook()

    for row in rows:
        ws.append(row)
        print(f"Appended row: {row}")
    wb.save(FileName)


append_rows(normalize_rows(rows))
