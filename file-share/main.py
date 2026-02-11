from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, user_routes, image_routes, secure_image_routes
from middleware.audit_logging import AuditLoggingMiddleware
from database.connection import MongoDBConnection


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    MongoDBConnection.connect()
    print("Database connected")
    yield
    # Shutdown
    MongoDBConnection.close()
    print("Database connection closed")


# Initialize FastAPI app
app = FastAPI(
    title="Secure Image Sharing API",
    description="A secure image sharing system with JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add audit logging middleware
app.add_middleware(AuditLoggingMiddleware)

# Include routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(image_routes.router)
app.include_router(secure_image_routes.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Secure Image Sharing API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

