from fastapi import APIRouter
from controllers.auth_controller import AuthController
from schemas.auth import RegisterRequest, LoginRequest, LoginResponse
from schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
controller = AuthController()


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(request: RegisterRequest):
    """Register a new user"""
    return controller.register(request)


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login and get JWT access token"""
    return controller.login(request)

