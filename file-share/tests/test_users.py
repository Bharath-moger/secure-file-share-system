import pytest
from fastapi import status


def test_get_users_unauthorized(client):
    """Test getting users without authentication"""
    response = client.get("/users")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_users_success(client, test_user_data, test_user2_data):
    """Test getting all users with authentication"""
    # Register users
    client.post("/auth/register", json=test_user_data)
    client.post("/auth/register", json=test_user2_data)
    
    # Login to get token
    login_response = client.post("/auth/login", json=test_user_data)
    token = login_response.json()["access_token"]
    
    # Get users
    response = client.get(
        "/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    assert all("id" in user and "username" in user for user in data)

