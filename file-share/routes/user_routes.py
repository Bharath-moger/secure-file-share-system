from fastapi import APIRouter, Depends
from typing import List
from controllers.user_controller import UserController
from schemas.user import UserResponse
from middleware.auth import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])
controller = UserController()


@router.get("", response_model=List[UserResponse])
async def get_all_users(current_user_id: str = Depends(get_current_user_id)):
    """Get all users (requires authentication)"""
    return controller.get_all_users()

