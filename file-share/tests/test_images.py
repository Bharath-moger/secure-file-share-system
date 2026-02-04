import pytest
from fastapi import status
import io


def get_auth_token(client, user_data):
    """Helper to get auth token"""
    client.post("/auth/register", json=user_data)
    login_response = client.post("/auth/login", json=user_data)
    return login_response.json()["access_token"]


def test_upload_image_success(client, test_user_data, test_user2_data):
    """Test successful image upload"""
    # Register and get tokens
    token1 = get_auth_token(client, test_user_data)
    token2 = get_auth_token(client, test_user2_data)
    
    # Get user2 ID
    users_response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token1}"}
    )
    users = users_response.json()
    receiver_id = next(u["id"] for u in users if u["username"] == test_user2_data["username"])
    
    # Upload image
    image_content = b"fake image content"
    files = {"file": ("test.jpg", io.BytesIO(image_content), "image/jpeg")}
    data = {"receiver_id": receiver_id}
    
    response = client.post(
        "/images/upload",
        headers={"Authorization": f"Bearer {token1}"},
        files=files,
        data=data
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["receiver_id"] == receiver_id
    assert data["status"] == "PENDING"


def test_upload_image_invalid_type(client, test_user_data, test_user2_data):
    """Test uploading invalid file type"""
    token1 = get_auth_token(client, test_user_data)
    token2 = get_auth_token(client, test_user2_data)
    
    users_response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token1}"}
    )
    users = users_response.json()
    receiver_id = next(u["id"] for u in users if u["username"] == test_user2_data["username"])
    
    # Try to upload non-image file
    files = {"file": ("test.txt", io.BytesIO(b"text content"), "text/plain")}
    data = {"receiver_id": receiver_id}
    
    response = client.post(
        "/images/upload",
        headers={"Authorization": f"Bearer {token1}"},
        files=files,
        data=data
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_get_sent_images(client, test_user_data, test_user2_data):
    """Test getting images sent by user"""
    token1 = get_auth_token(client, test_user_data)
    token2 = get_auth_token(client, test_user2_data)
    
    users_response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token1}"}
    )
    users = users_response.json()
    receiver_id = next(u["id"] for u in users if u["username"] == test_user2_data["username"])
    
    # Upload image
    files = {"file": ("test.jpg", io.BytesIO(b"fake image"), "image/jpeg")}
    data = {"receiver_id": receiver_id}
    client.post(
        "/images/upload",
        headers={"Authorization": f"Bearer {token1}"},
        files=files,
        data=data
    )
    
    # Get sent images
    response = client.get(
        "/images/sent",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == status.HTTP_200_OK
    images = response.json()
    assert isinstance(images, list)
    assert len(images) >= 1


def test_get_received_images(client, test_user_data, test_user2_data):
    """Test getting images received by user"""
    token1 = get_auth_token(client, test_user_data)
    token2 = get_auth_token(client, test_user2_data)
    
    users_response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token1}"}
    )
    users = users_response.json()
    receiver_id = next(u["id"] for u in users if u["username"] == test_user2_data["username"])
    
    # Upload image
    files = {"file": ("test.jpg", io.BytesIO(b"fake image"), "image/jpeg")}
    data = {"receiver_id": receiver_id}
    upload_response = client.post(
        "/images/upload",
        headers={"Authorization": f"Bearer {token1}"},
        files=files,
        data=data
    )
    
    # Get received images
    response = client.get(
        "/images/received",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == status.HTTP_200_OK
    images = response.json()
    assert isinstance(images, list)
    assert len(images) >= 1


def test_download_image_success(client, test_user_data, test_user2_data):
    """Test successful image download by receiver"""
    token1 = get_auth_token(client, test_user_data)
    token2 = get_auth_token(client, test_user2_data)
    
    users_response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token1}"}
    )
    users = users_response.json()
    receiver_id = next(u["id"] for u in users if u["username"] == test_user2_data["username"])
    
    # Upload image
    files = {"file": ("test.jpg", io.BytesIO(b"fake image content"), "image/jpeg")}
    data = {"receiver_id": receiver_id}
    upload_response = client.post(
        "/images/upload",
        headers={"Authorization": f"Bearer {token1}"},
        files=files,
        data=data
    )
    image_id = upload_response.json()["id"]
    
    # Download image as receiver
    response = client.get(
        f"/images/{image_id}/download",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == status.HTTP_200_OK


def test_download_image_unauthorized(client, test_user_data, test_user2_data):
    """Test downloading image by non-receiver"""
    token1 = get_auth_token(client, test_user_data)
    token2 = get_auth_token(client, test_user2_data)
    
    users_response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token1}"}
    )
    users = users_response.json()
    receiver_id = next(u["id"] for u in users if u["username"] == test_user2_data["username"])
    
    # Upload image
    files = {"file": ("test.jpg", io.BytesIO(b"fake image"), "image/jpeg")}
    data = {"receiver_id": receiver_id}
    upload_response = client.post(
        "/images/upload",
        headers={"Authorization": f"Bearer {token1}"},
        files=files,
        data=data
    )
    image_id = upload_response.json()["id"]
    
    # Try to download as sender (should fail)
    response = client.get(
        f"/images/{image_id}/download",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

