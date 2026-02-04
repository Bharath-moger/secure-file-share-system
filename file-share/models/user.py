from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class User(BaseModel):
    username: str
    password_hash: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "password_hash": "$2b$12$...",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }


class UserInDB(User):
    id: Optional[str] = None
    
    @property
    def _id(self) -> Optional[str]:
        """Property to access id as _id for backward compatibility"""
        return self.id
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "john_doe",
                "password_hash": "$2b$12$...",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }

