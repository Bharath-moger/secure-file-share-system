import re
import bcrypt
from fastapi import HTTPException, status


def validate_password_strength(password: str) -> bool:
    """
    Validate password strength:
    - Minimum 8 characters
    - Maximum 72 bytes (bcrypt limit)
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 8:
        return False
    
    # Check byte length for bcrypt (72 bytes max)
    try:
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            return False
    except Exception:
        return False
    
    if not re.search(r'[A-Z]', password):
        return False
    
    if not re.search(r'[a-z]', password):
        return False
    
    if not re.search(r'\d', password):
        return False
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    
    return True


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    # Ensure password is a string
    if not isinstance(password, str):
        password = str(password)
    
    # Encode password to bytes for bcrypt
    password_bytes = password.encode('utf-8')
    
    # Bcrypt has a 72-byte limit - truncate if necessary (shouldn't happen with normal passwords)
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    try:
        # Generate salt and hash password
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        # Return as string (decode from bytes)
        return hashed.decode('utf-8')
    except Exception as e:
        raise ValueError(f"Password hashing failed: {str(e)}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    try:
        # Encode both to bytes
        password_bytes = plain_password.encode('utf-8')
        # Truncate if necessary (shouldn't happen with normal passwords)
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        
        hashed_bytes = hashed_password.encode('utf-8')
        
        # Verify password
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

