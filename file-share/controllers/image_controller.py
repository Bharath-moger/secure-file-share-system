import os
import uuid
from typing import List
from fastapi import UploadFile, HTTPException, status
from services.image_service import ImageService
from services.user_service import UserService
from utils.file_handler import save_uploaded_file, get_file_path
from schemas.image import ImageResponse
from pathlib import Path
from utils.steganography import extract_metadata


class ImageController:
    def __init__(self):
        self.image_service = ImageService()
        self.user_service = UserService()

    async def upload_image(
        self,
        receiver_id: str,
        file: UploadFile,
        sender_id: str
    ) -> ImageResponse:
        """Handle image upload"""
        # Verify receiver exists
        receiver = self.user_service.get_user_by_id(receiver_id)
        if not receiver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receiver not found"
            )
        
        # Save file to disk
        try:
            image_path, original_filename = await save_uploaded_file(
                file, sender_id, receiver_id
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Create image record
        try:
            image = self.image_service.create_image(
                sender_id=sender_id,
                receiver_id=receiver_id,
                image_path=image_path,
                original_filename=original_filename
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        return ImageResponse(
            id=image.id,
            sender_id=image.sender_id,
            receiver_id=image.receiver_id,
            original_filename=image.original_filename,
            status=image.status,
            created_at=image.created_at
        )

    def get_sent_images(self, user_id: str) -> List[ImageResponse]:
        """Get images sent by user"""
        images = self.image_service.get_images_sent_by_user(user_id)
        return [
            ImageResponse(
                id=img.id,
                sender_id=img.sender_id,
                receiver_id=img.receiver_id,
                original_filename=img.original_filename,
                status=img.status,
                created_at=img.created_at
            )
            for img in images
        ]

    def get_received_images(self, user_id: str) -> List[ImageResponse]:
        """Get images received by user"""
        images = self.image_service.get_images_received_by_user(user_id)
        return [
            ImageResponse(
                id=img.id,
                sender_id=img.sender_id,
                receiver_id=img.receiver_id,
                original_filename=img.original_filename,
                status=img.status,
                created_at=img.created_at
            )
            for img in images
        ]

    def download_image(self, image_id: str, user_id: str) -> tuple[Path, str]:
        """Handle image download"""
        # Get image
        image = self.image_service.get_image_by_id(image_id)
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Verify user is the receiver
        if image.receiver_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to download this image"
            )
        
        # Get file path
        file_path = get_file_path(image.image_path)
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image file not found on disk"
            )
        
        # Mark as downloaded if still pending
        if image.status.value == "PENDING":
            try:
                self.image_service.mark_as_downloaded(image_id)
            except ValueError:
                pass  # Already downloaded or not found
        
        return file_path, image.original_filename

    async def verify_image(self, file: UploadFile) -> dict:
        """
        Verify steganography metadata inside an uploaded image
        """

        # -------------------------
        # 1️⃣ Save image temporarily
        # -------------------------
        temp_filename = f"verify_{uuid.uuid4().hex}_{file.filename}"
        temp_path = os.path.join("uploads", "verify", temp_filename)

        os.makedirs(os.path.dirname(temp_path), exist_ok=True)

        with open(temp_path, "wb") as f:
            f.write(await file.read())

        try:
            # -------------------------
            # 2️⃣ Extract metadata
            # -------------------------
            metadata = extract_metadata(temp_path)

            if not metadata:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No valid hidden metadata found in image"
                )

            image_id = metadata.get("image_id")
            sender_id = metadata.get("sender_id")
            receiver_id = metadata.get("receiver_id")

            # -------------------------
            # 3️⃣ Validate against DB
            # -------------------------
            image = self.image_service.get_image_by_id(image_id)
            if not image:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Image record not found"
                )

            if image.sender_id != sender_id or image.receiver_id != receiver_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Image metadata mismatch (possible tampering)"
                )

            sender = self.user_service.get_user_by_id(sender_id)
            receiver = self.user_service.get_user_by_id(receiver_id)

            if not sender or not receiver:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Sender or receiver not found"
                )

            # -------------------------
            # 4️⃣ Verified response
            # -------------------------
            return {
                "valid": True,
                "image": {
                    "id": image.id,
                    "original_filename": image.original_filename,
                    "status": image.status,
                    "created_at": image.created_at
                },
                "sender": {
                    "id": sender.id,
                    "username": sender.username
                },
                "receiver": {
                    "id": receiver.id,
                    "username": receiver.username
                }
            }

        finally:
            # -------------------------
            # 5️⃣ Cleanup temp file
            # -------------------------
            if os.path.exists(temp_path):
                os.remove(temp_path)