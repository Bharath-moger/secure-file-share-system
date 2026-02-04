# utils/steganography.py

import json
import base64
import hmac
import hashlib
from datetime import datetime
from typing import Optional, Dict

from stegano import lsb
from config.settings import settings  # adjust import if needed


# -------------------------
# Internal helpers
# -------------------------

def _generate_signature(payload: Dict) -> str:
    """
    Generate HMAC signature for payload
    """
    secret = settings.STEGO_SECRET_KEY
    message = json.dumps(payload, sort_keys=True).encode()

    return hmac.new(
        secret.encode(),
        message,
        hashlib.sha256
    ).hexdigest()


def _encode_payload(payload: Dict) -> str:
    """
    Encode payload to base64 string
    """
    json_data = json.dumps(payload)
    return base64.b64encode(json_data.encode()).decode()


def _decode_payload(encoded: str) -> Dict:
    """
    Decode base64 string to dict
    """
    decoded = base64.b64decode(encoded).decode()
    return json.loads(decoded)


# -------------------------
# Public API
# -------------------------

def embed_metadata(
    input_image_path: str,
    output_image_path: str,
    image_id: str,
    sender_id: str,
    receiver_id: str
) -> None:
    """
    Embed signed metadata inside an image
    """

    payload = {
        "image_id": image_id,
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "issued_at": datetime.utcnow().isoformat()
    }

    # Generate signature
    signature = _generate_signature(payload)
    payload["signature"] = signature

    # Encode payload
    encoded_payload = _encode_payload(payload)

    # Hide data inside image
    stego_image = lsb.hide(input_image_path, encoded_payload)

    # Save stego-image
    stego_image.save(output_image_path)


def extract_metadata(image_path: str) -> Optional[Dict]:
    """
    Extract and verify metadata from an image
    Returns payload dict if valid, otherwise None
    """

    try:
        hidden_data = lsb.reveal(image_path)
        if not hidden_data:
            return None

        payload = _decode_payload(hidden_data)

        signature = payload.pop("signature", None)
        if not signature:
            return None

        expected_signature = _generate_signature(payload)

        if not hmac.compare_digest(signature, expected_signature):
            return None

        return payload

    except Exception:
        # Any error means invalid or corrupted image
        return None
