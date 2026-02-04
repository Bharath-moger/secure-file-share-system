from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ImageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    original_filename: str
    status: str
    created_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "sender_id": "507f1f77bcf86cd799439011",
                "receiver_id": "507f191e810c19729de860ea",
                "original_filename": "photo.jpg",
                "status": "PENDING",
                "created_at": "2024-01-01T00:00:00"
            }
        }

