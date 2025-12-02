
from multiprocessing import process
from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.id import ID
from appwrite.query import Query

# Initialize Appwrite client
client = Client()
client.set_endpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
client.set_project(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
client.set_key(process.env.APPWRITE_API_KEY)

# Initialize database service
tablesDB = TablesDB(client)

todoDatabase = None
todoTable = None


def perpare_database():
    global todoDatabase
    global todoTable


def fetch_new_data():

    response = tablesDB.list_rows(
        database_id=todoDatabase["$id"],
        table_id=todoTable["$id"],
        queries=[Query.equal("time", "06:00")]
    )
    print(response)
