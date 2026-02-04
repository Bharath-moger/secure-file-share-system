from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class ImageStatus(str, Enum):
    PENDING = "PENDING"
    DOWNLOADED = "DOWNLOADED"


class Image(BaseModel):
    sender_id: str
    receiver_id: str
    image_path: str
    original_filename: str
    status: ImageStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "sender_id": "507f1f77bcf86cd799439011",
                "receiver_id": "507f191e810c19729de860ea",
                "image_path": "uploads/image_123.jpg",
                "original_filename": "photo.jpg",
                "status": "PENDING",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }


class ImageInDB(Image):
    id: Optional[str] = None
    
    @property
    def _id(self) -> Optional[str]:
        """Property to access id as _id for backward compatibility"""
        return self.id
    
    class Config:
        populate_by_name = True

