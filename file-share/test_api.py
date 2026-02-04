"""
Complete API Testing Script
Run this script to test all endpoints with example payloads
"""
import requests
import json
import os
from pathlib import Path

BASE_URL = "http://localhost:8000"

# Test data
test_users = [
    {"username": "testuser1", "password": "TestPass123!"},
    {"username": "testuser2", "password": "TestPass123!"}
]

tokens = {}
user_ids = {}
image_id = None


def print_response(title, response):
    """Pretty print response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print()


def test_register():
    """Test user registration"""
    print("\n🔵 TESTING: User Registration")
    
    for i, user in enumerate(test_users, 1):
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user
        )
        print_response(f"Register User {i}", response)
        
        if response.status_code == 201:
            data = response.json()
            user_ids[f"user{i}"] = data["id"]
            print(f"✅ User {i} registered with ID: {data['id']}")


def test_login():
    """Test user login"""
    print("\n🔵 TESTING: User Login")
    
    for i, user in enumerate(test_users, 1):
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=user
        )
        print_response(f"Login User {i}", response)
        
        if response.status_code == 200:
            data = response.json()
            tokens[f"user{i}"] = data["access_token"]
            print(f"✅ User {i} logged in, token saved")


def test_list_users():
    """Test listing all users"""
    print("\n🔵 TESTING: List All Users")
    
    if not tokens.get("user1"):
        print("❌ No token available. Run login first.")
        return
    
    response = requests.get(
        f"{BASE_URL}/users",
        headers={"Authorization": f"Bearer {tokens['user1']}"}
    )
    print_response("List All Users", response)
    
    if response.status_code == 200:
        print("✅ Users listed successfully")


def test_upload_image():
    """Test image upload"""
    print("\n🔵 TESTING: Upload Image")
    
    if not tokens.get("user1") or not user_ids.get("user2"):
        print("❌ Missing token or user ID. Run register and login first.")
        return
    
    # Create a dummy image file for testing
    test_image_path = Path("test_image.jpg")
    if not test_image_path.exists():
        # Create a minimal valid JPEG file
        with open(test_image_path, "wb") as f:
            # Minimal JPEG header
            f.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb')
        print(f"📝 Created test image: {test_image_path}")
    
    with open(test_image_path, "rb") as f:
        files = {"file": ("test.jpg", f, "image/jpeg")}
        data = {"receiver_id": user_ids["user2"]}
        headers = {"Authorization": f"Bearer {tokens['user1']}"}
        
        response = requests.post(
            f"{BASE_URL}/images/upload",
            headers=headers,
            files=files,
            data=data
        )
    
    print_response("Upload Image", response)
    
    if response.status_code == 201:
        global image_id
        data = response.json()
        image_id = data["id"]
        print(f"✅ Image uploaded with ID: {image_id}")


def test_get_sent_images():
    """Test getting sent images"""
    print("\n🔵 TESTING: Get Sent Images")
    
    if not tokens.get("user1"):
        print("❌ No token available. Run login first.")
        return
    
    response = requests.get(
        f"{BASE_URL}/images/sent",
        headers={"Authorization": f"Bearer {tokens['user1']}"}
    )
    print_response("Get Sent Images", response)
    
    if response.status_code == 200:
        print("✅ Sent images retrieved successfully")


def test_get_received_images():
    """Test getting received images"""
    print("\n🔵 TESTING: Get Received Images")
    
    if not tokens.get("user2"):
        print("❌ No token available. Run login first.")
        return
    
    response = requests.get(
        f"{BASE_URL}/images/received",
        headers={"Authorization": f"Bearer {tokens['user2']}"}
    )
    print_response("Get Received Images", response)
    
    if response.status_code == 200:
        print("✅ Received images retrieved successfully")


def test_download_image():
    """Test downloading image"""
    print("\n🔵 TESTING: Download Image")
    
    if not tokens.get("user2") or not image_id:
        print("❌ Missing token or image ID. Run upload first.")
        return
    
    response = requests.get(
        f"{BASE_URL}/images/{image_id}/download",
        headers={"Authorization": f"Bearer {tokens['user2']}"}
    )
    
    print(f"\n{'='*60}")
    print("Download Image")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    print(f"Content-Length: {len(response.content)} bytes")
    
    if response.status_code == 200:
        # Save downloaded image
        download_path = Path("downloaded_image.jpg")
        with open(download_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Image downloaded and saved to: {download_path}")
    else:
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response: {response.text}")
    print()


def test_health_check():
    """Test health check endpoints"""
    print("\n🔵 TESTING: Health Check Endpoints")
    
    # Root endpoint
    response = requests.get(f"{BASE_URL}/")
    print_response("Root Endpoint", response)
    
    # Health check
    response = requests.get(f"{BASE_URL}/health")
    print_response("Health Check", response)


def test_error_cases():
    """Test error cases"""
    print("\n🔵 TESTING: Error Cases")
    
    # Weak password
    print("\n--- Testing Weak Password ---")
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={"username": "weakuser", "password": "weak"}
    )
    print_response("Register with Weak Password", response)
    
    # Invalid login
    print("\n--- Testing Invalid Login ---")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"username": "nonexistent", "password": "WrongPass123!"}
    )
    print_response("Login with Invalid Credentials", response)
    
    # Unauthorized access
    print("\n--- Testing Unauthorized Access ---")
    response = requests.get(f"{BASE_URL}/users")
    print_response("Access Users without Token", response)


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 SECURE IMAGE SHARING API - COMPLETE TEST SUITE")
    print("="*60)
    
    try:
        # Test health check first
        test_health_check()
        
        # Authentication tests
        test_register()
        test_login()
        
        # User management tests
        test_list_users()
        
        # Image sharing tests
        test_upload_image()
        test_get_sent_images()
        test_get_received_images()
        test_download_image()
        
        # Error case tests
        test_error_cases()
        
        print("\n" + "="*60)
        print("✅ ALL TESTS COMPLETED")
        print("="*60)
        print("\n📋 Summary:")
        print(f"   - Tokens: {len(tokens)}")
        print(f"   - User IDs: {len(user_ids)}")
        print(f"   - Image ID: {image_id if image_id else 'None'}")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the API.")
        print("   Make sure the server is running:")
        print("   uvicorn main:app --reload")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")


if __name__ == "__main__":
    main()
