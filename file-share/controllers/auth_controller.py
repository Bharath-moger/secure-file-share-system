from fastapi import HTTPException, status
from services.user_service import UserService
from services.auth_service import AuthService
from schemas.auth import RegisterRequest, LoginRequest, LoginResponse
from schemas.user import UserResponse


class AuthController:
    def __init__(self):
        self.user_service = UserService()
        self.auth_service = AuthService()

    def register(self, request: RegisterRequest) -> UserResponse:
        """Handle user registration"""
        try:
            # Validate password strength
            from utils.password import validate_password_strength
            if not validate_password_strength(request.password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
                )
            
            # Create user
            user = self.user_service.create_user(request.username, request.password)
            
            return UserResponse(id=user.id, username=user.username)
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    def login(self, request: LoginRequest) -> LoginResponse:
        """Handle user login"""
        user = self.user_service.verify_user_credentials(
            request.username,
            request.password
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Generate JWT token
        access_token = self.auth_service.create_token_for_user(user.id)
        
        return LoginResponse(access_token=access_token, token_type="bearer")

