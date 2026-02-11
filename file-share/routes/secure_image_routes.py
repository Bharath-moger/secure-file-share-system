import io
from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from controllers.secure_image_controller import SecureImageController
from middleware.auth import get_current_user_id

router = APIRouter(prefix="/images/secure", tags=["Secure Images"])
controller = SecureImageController()


@router.post("/upload")
async def upload_secure_image(
    receiver_id: str = Form(...),
    password: str = Form(...),
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id)
):
    return await controller.upload_secure_image(
        sender_id=current_user_id,
        receiver_id=receiver_id,
        password=password,
        file=file
    )


@router.get("/{image_id}/download")
def download_secure_image(image_id: str):
    path = controller.download_secure_image(image_id)
    return FileResponse(
        path=path,
        filename="encrypted_image.enc",
        media_type="application/octet-stream"
    )


@router.get("/sent")
def get_sent_secure_images(current_user_id: str = Depends(get_current_user_id)):
    """Get all secure images sent by the logged-in user"""
    return controller.get_sent_secure_images(current_user_id)


@router.get("/received")
def get_received_secure_images(current_user_id: str = Depends(get_current_user_id)):
    """Get all secure images received by the logged-in user"""
    return controller.get_received_secure_images(current_user_id)


@router.post("/{image_id}/unlock")
def unlock_secure_image(
    image_id: str,
    password: str = Form(...)
):
    data = controller.unlock_secure_image(image_id, password)
    return StreamingResponse(
        io.BytesIO(data),
        media_type="image/png"
    )
