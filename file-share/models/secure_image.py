from enum import Enum
from pydantic import BaseModel
from datetime import datetime


class SecureImageStatus(str, Enum):
    LOCKED = "LOCKED"
    UNLOCKED = "UNLOCKED"


class SecureImageInDB(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    encrypted_image_path: str
    encrypted_key: str
    status: SecureImageStatus
    created_at: datetime
