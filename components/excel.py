# Import necessary libraries for date/time and Excel operations
import datetime
from openpyxl import Workbook, load_workbook
import os
from data_fetch import rows, normalize_rows

# Name of the Excel file to save data to
FileName = "steam_data.xlsx"


# Column headers for the Excel spreadsheet
HEADERS = [
    "Date", "Time", "Meter 1", "Bypass", "Meter Blue", "Meter Red", "Steam Flow Meter", "Aspen"
]

# Get current date and time
x = datetime.datetime.now()


# Loads or creates an Excel workbook and creates a new sheet for the current month
def get_workbook():
    if os.path.exists(FileName):
        # If file exists, open it and add a new sheet named after the current month
        wb = load_workbook(FileName)
        ws = wb.create_sheet(title=x.strftime("%B"))

    else:
        # If file doesn't exist, create a new workbook with headers
        wb = Workbook()
        ws = wb.active
        ws.title = x.strftime("%x")
        ws.append(HEADERS)

    return wb, ws


# Adds meter reading rows to the Excel sheet and saves the file
def append_rows(rows):
    wb, ws = get_workbook()

    # Iterate through each row and add it to the worksheet
    for row in rows:
        ws.append(row)
        print(f"Appended row: {row}")
    # Save the updated workbook to disk
    wb.save(FileName)


# Execute: Normalize the fetched data and write to Excel file
append_rows(normalize_rows(rows))
