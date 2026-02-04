from pymongo import MongoClient
from pymongo.database import Database
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()


class MongoDBConnection:
    _client: Optional[MongoClient] = None
    _database: Optional[Database] = None

    @classmethod
    def connect(cls) -> Database:
        """Initialize MongoDB connection and return database instance"""
        if cls._database is None:
            mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
            database_name = os.getenv("DATABASE_NAME", "file_share_db")
            
            cls._client = MongoClient(mongodb_url)
            cls._database = cls._client[database_name]
            
        return cls._database

    @classmethod
    def get_database(cls) -> Database:
        """Get database instance, connect if not already connected"""
        if cls._database is None:
            return cls.connect()
        return cls._database

    @classmethod
    def close(cls):
        """Close MongoDB connection"""
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._database = None


def get_db() -> Database:
    """Dependency function for FastAPI dependency injection"""
    return MongoDBConnection.get_database()

