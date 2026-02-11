import base64
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
import os


def derive_key_from_password(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100_000,
        backend=default_backend()
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))


def encrypt_image_key(image_key: bytes, password: str) -> dict:
    salt = os.urandom(16)
    derived_key = derive_key_from_password(password, salt)
    f = Fernet(derived_key)

    encrypted_key = f.encrypt(image_key)

    return {
        "encrypted_key": encrypted_key.decode(),
        "salt": base64.b64encode(salt).decode()
    }


def decrypt_image_key(encrypted_key: str, salt_b64: str, password: str) -> bytes:
    salt = base64.b64decode(salt_b64)
    derived_key = derive_key_from_password(password, salt)
    f = Fernet(derived_key)

    return f.decrypt(encrypted_key.encode())
