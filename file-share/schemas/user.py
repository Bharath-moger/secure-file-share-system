from pydantic import BaseModel


class UserResponse(BaseModel):
    id: str
    username: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "john_doe"
            }
        }

