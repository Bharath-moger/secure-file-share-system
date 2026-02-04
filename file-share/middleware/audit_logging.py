import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime
import time

logger = logging.getLogger("audit")
logger.setLevel(logging.INFO)

# Create file handler if needed
handler = logging.FileHandler("audit.log")
handler.setLevel(logging.INFO)
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
handler.setFormatter(formatter)
logger.addHandler(handler)


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all API requests for audit purposes"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Extract user info if available
        user_id = "anonymous"
        if hasattr(request.state, "user_id"):
            user_id = request.state.user_id
        
        # Log request
        logger.info(
            f"Request - Method: {request.method}, "
            f"Path: {request.url.path}, "
            f"User: {user_id}, "
            f"IP: {request.client.host if request.client else 'unknown'}"
        )
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            f"Response - Method: {request.method}, "
            f"Path: {request.url.path}, "
            f"Status: {response.status_code}, "
            f"Process Time: {process_time:.4f}s"
        )
        
        return response

