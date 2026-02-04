from typing import List
from services.user_service import UserService
from schemas.user import UserResponse


class UserController:
    def __init__(self):
        self.user_service = UserService()

    def get_all_users(self) -> List[UserResponse]:
        """Get all users"""
        users = self.user_service.get_all_users()
        return [UserResponse(id=user["id"], username=user["username"]) for user in users]

