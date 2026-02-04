import pytest
from fastapi import status


def test_register_success(client, test_user_data):
    """Test successful user registration"""
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["username"] == test_user_data["username"]


def test_register_duplicate_username(client, test_user_data):
    """Test registration with duplicate username"""
    # Register first time
    client.post("/auth/register", json=test_user_data)
    
    # Try to register again with same username
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_register_weak_password(client):
    """Test registration with weak password"""
    weak_passwords = [
        "short",  # Too short
        "nouppercase123!",  # No uppercase
        "NOLOWERCASE123!",  # No lowercase
        "NoNumbers!",  # No numbers
        "NoSpecial123"  # No special char
    ]
    
    for password in weak_passwords:
        response = client.post("/auth/register", json={
            "username": f"user_{password[:5]}",
            "password": password
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_login_success(client, test_user_data):
    """Test successful login"""
    # Register user first
    client.post("/auth/register", json=test_user_data)
    
    # Login
    response = client.post("/auth/login", json=test_user_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client, test_user_data):
    """Test login with invalid credentials"""
    # Register user
    client.post("/auth/register", json=test_user_data)
    
    # Try login with wrong password
    response = client.post("/auth/login", json={
        "username": test_user_data["username"],
        "password": "WrongPassword123!"
    })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_nonexistent_user(client):
    """Test login with non-existent user"""
    response = client.post("/auth/login", json={
        "username": "nonexistent",
        "password": "SomePass123!"
    })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

