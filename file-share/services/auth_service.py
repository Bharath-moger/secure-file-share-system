from utils.jwt import create_access_token
from datetime import timedelta


class AuthService:
    def create_token_for_user(self, user_id: str) -> str:
        """Create JWT token for user"""
        return create_access_token(data={"sub": user_id})

