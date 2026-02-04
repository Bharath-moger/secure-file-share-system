from typing import Optional, List
from datetime import datetime
from pymongo.database import Database
from database.connection import get_db
from models.user import User, UserInDB
from utils.password import hash_password, verify_password
from bson import ObjectId


class UserService:
    def __init__(self, db: Optional[Database] = None):
        self.db = db or get_db()
        self.collection = self.db.users

    def create_user(self, username: str, password: str) -> UserInDB:
        """Create a new user"""
        # Check if username already exists
        if self.collection.find_one({"username": username}):
            raise ValueError("Username already exists")
        
        # Validate password length for bcrypt (72 bytes max)
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            raise ValueError("Password is too long. Maximum 72 bytes allowed.")
        
        # Hash password
        try:
            password_hash = hash_password(password)
        except Exception as e:
            raise ValueError(f"Failed to hash password: {str(e)}")
        
        # Create user document
        now = datetime.utcnow()
        user_data = {
            "username": username,
            "password_hash": password_hash,
            "created_at": now,
            "updated_at": now
        }
        
        # Insert into database
        result = self.collection.insert_one(user_data)
        
        # Return user with ID
        user_id = str(result.inserted_id)
        user_data["id"] = user_id
        return UserInDB(**user_data)

    def get_user_by_username(self, username: str) -> Optional[UserInDB]:
        """Get user by username"""
        user = self.collection.find_one({"username": username})
        if user:
            user["id"] = str(user["_id"])
            # Remove _id from dict to avoid conflicts
            user.pop("_id", None)
            return UserInDB(**user)
        return None

    def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["id"] = str(user["_id"])
                # Remove _id from dict to avoid conflicts
                user.pop("_id", None)
                return UserInDB(**user)
            return None
        except Exception:
            return None

    def verify_user_credentials(self, username: str, password: str) -> Optional[UserInDB]:
        """Verify user credentials and return user if valid"""
        user = self.get_user_by_username(username)
        if user and verify_password(password, user.password_hash):
            return user
        return None

    def get_all_users(self) -> List[dict]:
        """Get all users (id and username only)"""
        users = self.collection.find({}, {"username": 1})
        return [
            {"id": str(user["_id"]), "username": user["username"]}
            for user in users
        ]

