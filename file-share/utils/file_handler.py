import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from typing import Tuple

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def get_max_file_size_bytes() -> int:
    """Get max file size in bytes from environment variable"""
    max_size_mb = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    return max_size_mb * 1024 * 1024


def get_upload_dir() -> Path:
    """Get upload directory path, create if doesn't exist"""
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def validate_image_file(file: UploadFile) -> Tuple[bool, str]:
    """
    Validate image file
    Returns: (is_valid, error_message)
    """
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False, f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
    
    return True, ""


async def save_uploaded_file(file: UploadFile, sender_id: str, receiver_id: str) -> Tuple[str, str]:
    """
    Save uploaded file to disk
    Returns: (file_path, original_filename)
    """
    # Validate file
    is_valid, error_msg = validate_image_file(file)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
    
    # Read file content
    content = await file.read()
    
    # Check file size
    max_size_bytes = get_max_file_size_bytes()
    max_size_mb = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    if len(content) > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {max_size_mb}MB"
        )
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    
    # Create directory structure: uploads/sender_id/receiver_id/
    upload_dir = get_upload_dir()
    file_dir = upload_dir / sender_id / receiver_id
    file_dir.mkdir(parents=True, exist_ok=True)
    
    # Save file
    file_path = file_dir / unique_filename
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return relative path from uploads directory
    relative_path = str(file_path.relative_to(upload_dir))
    return relative_path, file.filename


def get_file_path(relative_path: str) -> Path:
    """Get absolute file path from relative path"""
    upload_dir = get_upload_dir()
    return upload_dir / relative_path


def file_exists(relative_path: str) -> bool:
    """Check if file exists"""
    file_path = get_file_path(relative_path)
    return file_path.exists()

