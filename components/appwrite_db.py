import os
from dotenv import load_dotenv
from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.services.storage import Storage
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.id import ID

load_dotenv()
# Initialize Appwrite client
client = Client()
client.set_endpoint(os.getenv("EXPO_PUBLIC_APPWRITE_ENDPOINT"))
client.set_project(os.getenv("EXPO_PUBLIC_APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))


# Initialize database service
tablesDB = TablesDB(client)
storage = Storage(client)

todoDatabase = os.getenv("EXPO_PUBLIC_DB_ID")
todoTable = os.getenv("EXPO_PUBLIC_DB_ASPEN_TABLE_ID")
bucket_Id = os.getenv("APPWRITE_BUCKET_ID")
aspen_file_Id = os.getenv("APPWRITE_ASPEN_FILE_ID")
fresenius_file_Id = os.getenv("APPWRITE_FRESENIUS_FILE_ID")

print(aspen_file_Id)
print(fresenius_file_Id)
