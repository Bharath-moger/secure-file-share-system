import os
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from database.connection import get_db
from utils.image_crypto import generate_image_key, encrypt_image_bytes
from utils.key_crypto import encrypt_image_key
from models.secure_image import SecureImageStatus


class SecureImageService:
    def __init__(self, db: Database | None = None):
        self.db = db or get_db()
        self.collection = self.db.secure_images

    def create_secure_image(
        self,
        sender_id: str,
        receiver_id: str,
        image_bytes: bytes,
        receiver_password: str,
        upload_dir: str = "uploads/secure"
    ) -> dict:
        os.makedirs(upload_dir, exist_ok=True)

        # 1️⃣ Generate AES image key
        image_key = generate_image_key()

        # 2️⃣ Encrypt image
        encrypted_image = encrypt_image_bytes(image_bytes, image_key)

        image_id = str(ObjectId())
        encrypted_path = os.path.join(upload_dir, f"{image_id}.enc")

        with open(encrypted_path, "wb") as f:
            f.write(encrypted_image)

        # 3️⃣ Encrypt AES key using receiver password
        key_payload = encrypt_image_key(image_key, receiver_password)

        doc = {
            "_id": ObjectId(image_id),
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "encrypted_image_path": encrypted_path,
            "encrypted_key": key_payload["encrypted_key"],
            "salt": key_payload["salt"],
            "status": SecureImageStatus.LOCKED.value,
            "created_at": datetime.utcnow()
        }

        self.collection.insert_one(doc)

        doc["id"] = image_id
        return doc

    def get_secure_image(self, image_id: str) -> dict | None:
        image = self.collection.find_one({"_id": ObjectId(image_id)})
        if not image:
            return None
        image["id"] = str(image["_id"])
        image.pop("_id")
        return image

    def get_secure_images_sent_by_user(self, user_id: str) -> list[dict]:
        """Get secure images sent by user"""
        images = self.collection.find({"sender_id": user_id}).sort("created_at", -1)
        result = []
        for img in images:
            img["id"] = str(img["_id"])
            img.pop("_id")
            result.append(img)
        return result

    def get_secure_images_received_by_user(self, user_id: str) -> list[dict]:
        """Get secure images received by user"""
        images = self.collection.find({"receiver_id": user_id}).sort("created_at", -1)
        result = []
        for img in images:
            img["id"] = str(img["_id"])
            img.pop("_id")
            result.append(img)
        return result
