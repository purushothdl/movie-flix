import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv  

load_dotenv()

MONGO_DB_URL = os.getenv('MONGO_DB_URL')

client = AsyncIOMotorClient(MONGO_DB_URL)
db = client.FrontEndTesting

metrics_collection = db.metrics
