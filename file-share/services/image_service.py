from typing import List, Optional
from datetime import datetime
from pymongo.database import Database
from database.connection import get_db
from models.image import ImageInDB, ImageStatus
from bson import ObjectId
from fastapi import HTTPException
from utils.file_handler import file_exists, get_file_path

# ✅ NEW IMPORT
from utils.steganography import embed_metadata


class ImageService:
    def __init__(self, db: Optional[Database] = None):
        self.db = db or get_db()
        self.collection = self.db.images

    def create_image(
        self,
        sender_id: str,
        receiver_id: str,
        image_path: str,
        original_filename: str
    ) -> ImageInDB:
        """
        Create a new image record and embed steganography metadata
        """

        # -------------------------
        # 1️⃣ Verify users exist
        # -------------------------
        from services.user_service import UserService
        user_service = UserService()

        if not user_service.get_user_by_id(sender_id):
            raise ValueError("Sender not found")

        if not user_service.get_user_by_id(receiver_id):
            raise ValueError("Receiver not found")

        # -------------------------
        # 2️⃣ Insert DB record FIRST
        # -------------------------
        now = datetime.utcnow()
        image_data = {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "image_path": image_path,
            "original_filename": original_filename,
            "status": ImageStatus.PENDING.value,
            "created_at": now,
            "updated_at": now
        }

        result = self.collection.insert_one(image_data)
        image_id = str(result.inserted_id)

        # -------------------------
        # 3️⃣ Embed steganography metadata
        # -------------------------
        try:
            # Resolve actual file path
            file_path = get_file_path(image_path)

            if not file_path.exists():
                raise ValueError("Image file not found for steganography")

            # Overwrite same image with hidden metadata
            embed_metadata(
                input_image_path=str(file_path),
                output_image_path=str(file_path),
                image_id=image_id,
                sender_id=sender_id,
                receiver_id=receiver_id
            )

        except Exception as e:
            # ❗ Rollback DB entry if steganography fails
            self.collection.delete_one({"_id": ObjectId(image_id)})
            raise ValueError(f"Failed to embed steganography data: {str(e)}")

        # -------------------------
        # 4️⃣ Return response
        # -------------------------
        image_data["id"] = image_id
        return ImageInDB(**image_data)

    # ---------- NO CHANGES BELOW ----------

    def get_images_sent_by_user(self, user_id: str) -> List[ImageInDB]:
        images = self.collection.find({"sender_id": user_id}).sort("created_at", -1)
        result = []
        for image in images:
            image["id"] = str(image["_id"])
            image.pop("_id", None)
            result.append(ImageInDB(**image))
        return result

    def get_images_received_by_user(self, user_id: str) -> List[ImageInDB]:
        images = self.collection.find({"receiver_id": user_id}).sort("created_at", -1)
        result = []
        for image in images:
            image["id"] = str(image["_id"])
            image.pop("_id", None)
            result.append(ImageInDB(**image))
        return result

    def get_image_by_id(self, image_id: str) -> Optional[ImageInDB]:
        try:
            image = self.collection.find_one({"_id": ObjectId(image_id)})
            if image:
                image["id"] = str(image["_id"])
                image.pop("_id", None)
                return ImageInDB(**image)
            return None
        except Exception:
            return None

    def mark_as_downloaded(self, image_id: str) -> ImageInDB:
        now = datetime.utcnow()
        result = self.collection.update_one(
            {"_id": ObjectId(image_id)},
            {"$set": {"status": ImageStatus.DOWNLOADED.value, "updated_at": now}}
        )

        if result.modified_count == 0:
            raise ValueError("Image not found or already downloaded")

        return self.get_image_by_id(image_id)

    def verify_receiver(self, image_id: str, user_id: str) -> bool:
        image = self.get_image_by_id(image_id)
        if not image:
            return False
        return image.receiver_id == user_id
