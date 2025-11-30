
from multiprocessing import process

from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.id import ID

# Initialize Appwrite client
client = Client()
client.set_endpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
client.set_project(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
client.set_key(process.env.APPWRITE_API_KEY)

# Initialize database service
tables_db = TablesDB(client)
