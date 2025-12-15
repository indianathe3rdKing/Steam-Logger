from openpyxl import Workbook, load_workbook
import os

FileName = "steam_data.xlsx"

HEADERS = [
    "Date", "Time", "Meter 1", "Bypass", "Meter Blue", "Meter Red", "Steam Flow Meter", "Aspen"
]


def get_workbook():
    if os.path.exists(FileName):
        wb = load_workbook(FileName)
        ws = wb.active
    else:
        wb = Workbook()
        ws = wb.active
        ws.append(HEADERS)

    return wb, ws
