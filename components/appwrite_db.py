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
bucket_Id = "69439f20003aac2fe7b9"
file_Id = "69439f5f002fda9dc5a5"  # Use the actual file ID, not the filename
