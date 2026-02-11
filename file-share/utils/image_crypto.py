from cryptography.fernet import Fernet


def generate_image_key() -> bytes:
    """
    Generate a random AES key
    """
    return Fernet.generate_key()


def encrypt_image_bytes(image_bytes: bytes, key: bytes) -> bytes:
    """
    Encrypt raw image bytes
    """
    f = Fernet(key)
    return f.encrypt(image_bytes)


def decrypt_image_bytes(encrypted_bytes: bytes, key: bytes) -> bytes:
    """
    Decrypt raw image bytes
    """
    f = Fernet(key)
    return f.decrypt(encrypted_bytes)

