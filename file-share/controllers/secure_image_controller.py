import io
from fastapi import UploadFile, HTTPException, status
from services.secure_image_service import SecureImageService
from utils.key_crypto import decrypt_image_key
from utils.image_crypto import decrypt_image_bytes


class SecureImageController:
    def __init__(self):
        self.service = SecureImageService()

    async def upload_secure_image(
        self,
        sender_id: str,
        receiver_id: str,
        password: str,
        file: UploadFile
    ):
        image_bytes = await file.read()

        image = self.service.create_secure_image(
            sender_id=sender_id,
            receiver_id=receiver_id,
            image_bytes=image_bytes,
            receiver_password=password
        )

        return {
            "id": image["id"],
            "receiver_id": image["receiver_id"],
            "status": image["status"],
            "created_at": image["created_at"]
        }

    def download_secure_image(self, image_id: str) -> str:
        image = self.service.get_secure_image(image_id)
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Secure image not found"
            )
        return image["encrypted_image_path"]

    def unlock_secure_image(self, image_id: str, password: str) -> bytes:
        image = self.service.get_secure_image(image_id)
        if not image:
            raise HTTPException(404, "Secure image not found")

        with open(image["encrypted_image_path"], "rb") as f:
            encrypted_bytes = f.read()

        # Decrypt AES key
        image_key = decrypt_image_key(
            encrypted_key=image["encrypted_key"],
            salt_b64=image["salt"],
            password=password
        )

        # Decrypt image
        return decrypt_image_bytes(encrypted_bytes, image_key)

    def get_sent_secure_images(self, user_id: str) -> list[dict]:
        """Get secure images sent by user"""
        return self.service.get_secure_images_sent_by_user(user_id)

    def get_received_secure_images(self, user_id: str) -> list[dict]:
        """Get secure images received by user"""
        return self.service.get_secure_images_received_by_user(user_id)
