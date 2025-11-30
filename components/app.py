
import datetime
import calendar


def run_monthly_invoice_job():
    # Where the logic for fetching monthly steam logs and water usage is taking place
    print("Running monthly invoice job...")


def execute_scheduled_job():
    today = datetime.date.today()
#   Check if today is the 15th of the month
    if today.day == 15:
        print("It's the 15th,run.")
        run_monthly_invoice_job()
# Checks if today is the last day of the month
    last_day_of_month = calendar.monthrange(today.year, today.month)[1]
    if today.day == last_day_of_month:
        print("It's the last day of the month, run.")
        run_monthly_invoice_job()


if __name__ == "__main__":
    execute_scheduled_job()

print("Value of __name__ :", __name__)
