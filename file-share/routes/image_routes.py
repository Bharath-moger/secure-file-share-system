from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse
from typing import List
from controllers.image_controller import ImageController
from schemas.image import ImageResponse
from middleware.auth import get_current_user_id

router = APIRouter(prefix="/images", tags=["Images"])
controller = ImageController()


@router.post("/upload", response_model=ImageResponse, status_code=201)
async def upload_image(
    receiver_id: str = Form(...),
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id)
):
    """Upload an image for another user"""
    return await controller.upload_image(receiver_id, file, current_user_id)


@router.get("/sent", response_model=List[ImageResponse])
async def get_sent_images(current_user_id: str = Depends(get_current_user_id)):
    """Get all images sent by the logged-in user"""
    return controller.get_sent_images(current_user_id)


@router.get("/received", response_model=List[ImageResponse])
async def get_received_images(current_user_id: str = Depends(get_current_user_id)):
    """Get all images received by the logged-in user"""
    return controller.get_received_images(current_user_id)


@router.get("/{image_id}/download")
async def download_image(
    image_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Download an image (only receiver can download)"""
    file_path, filename = controller.download_image(image_id, current_user_id)
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

@router.post("/verify")
async def verify_image(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Verify sender & receiver details embedded in an image
    """
    return await controller.verify_image(file)
