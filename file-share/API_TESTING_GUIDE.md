# API Testing Guide - Complete Endpoint Documentation

This guide provides complete testing examples for all endpoints with payloads, headers, and expected responses.

## Base URL
```
http://localhost:8000
```

---

## 1. Authentication Endpoints

### 1.1 Register User

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Payload:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**cURL:**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_doe"
}
```

**Error Response (400 Bad Request) - Weak Password:**
```json
{
  "detail": "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
}
```

**Error Response (400 Bad Request) - Duplicate Username:**
```json
{
  "detail": "Username already exists"
}
```

---

### 1.2 Login

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Payload:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**cURL:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJleHAiOjE3MDUzODQwMDB9.xxxxx",
  "token_type": "bearer"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Incorrect username or password"
}
```

---

## 2. User Management Endpoints

### 2.1 List All Users

**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:8000/users" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe"
  },
  {
    "id": "507f191e810c19729de860ea",
    "username": "jane_smith"
  }
]
```

**Error Response (403 Forbidden) - No Token:**
```json
{
  "detail": "Not authenticated"
}
```

**Error Response (401 Unauthorized) - Invalid Token:**
```json
{
  "detail": "Invalid authentication credentials"
}
```

---

## 3. Image Sharing Endpoints

### 3.1 Upload Image

**Endpoint:** `POST /images/upload`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
```
receiver_id: 507f191e810c19729de860ea
file: [select image file: .jpg, .jpeg, or .png]
```

**cURL:**
```bash
curl -X POST "http://localhost:8000/images/upload" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "receiver_id=507f191e810c19729de860ea" \
  -F "file=@/path/to/image.jpg"
```

**Python Requests Example:**
```python
import requests

url = "http://localhost:8000/images/upload"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
files = {
    "file": ("image.jpg", open("image.jpg", "rb"), "image/jpeg")
}
data = {
    "receiver_id": "507f191e810c19729de860ea"
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())
```

**Expected Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "sender_id": "507f1f77bcf86cd799439011",
  "receiver_id": "507f191e810c19729de860ea",
  "original_filename": "image.jpg",
  "status": "PENDING",
  "created_at": "2024-01-27T10:30:00"
}
```

**Error Response (400 Bad Request) - Invalid File Type:**
```json
{
  "detail": "Invalid file type. Allowed types: .jpg, .jpeg, .png"
}
```

**Error Response (400 Bad Request) - File Too Large:**
```json
{
  "detail": "File size exceeds maximum allowed size of 10MB"
}
```

**Error Response (404 Not Found) - Receiver Not Found:**
```json
{
  "detail": "Receiver not found"
}
```

---

### 3.2 Get Sent Images

**Endpoint:** `GET /images/sent`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:8000/images/sent" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "sender_id": "507f1f77bcf86cd799439011",
    "receiver_id": "507f191e810c19729de860ea",
    "original_filename": "image.jpg",
    "status": "PENDING",
    "created_at": "2024-01-27T10:30:00"
  },
  {
    "id": "507f1f77bcf86cd799439013",
    "sender_id": "507f1f77bcf86cd799439011",
    "receiver_id": "507f191e810c19729de860ea",
    "original_filename": "photo.png",
    "status": "DOWNLOADED",
    "created_at": "2024-01-27T09:15:00"
  }
]
```

**Empty Response (200 OK):**
```json
[]
```

---

### 3.3 Get Received Images

**Endpoint:** `GET /images/received`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:8000/images/received" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "sender_id": "507f1f77bcf86cd799439011",
    "receiver_id": "507f191e810c19729de860ea",
    "original_filename": "image.jpg",
    "status": "PENDING",
    "created_at": "2024-01-27T10:30:00"
  }
]
```

---

### 3.4 Download Image

**Endpoint:** `GET /images/{image_id}/download`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:8000/images/507f1f77bcf86cd799439012/download" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -o downloaded_image.jpg
```

**Python Requests Example:**
```python
import requests

url = "http://localhost:8000/images/507f1f77bcf86cd799439012/download"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    with open("downloaded_image.jpg", "wb") as f:
        f.write(response.content)
    print("Image downloaded successfully")
```

**Expected Response (200 OK):**
- Binary file content (image file)
- Content-Type: `application/octet-stream`
- Content-Disposition header with original filename

**Error Response (403 Forbidden) - Not Receiver:**
```json
{
  "detail": "You are not authorized to download this image"
}
```

**Error Response (404 Not Found) - Image Not Found:**
```json
{
  "detail": "Image not found"
}
```

**Error Response (404 Not Found) - File Not Found:**
```json
{
  "detail": "Image file not found on disk"
}
```

---

## 4. Health Check Endpoints

### 4.1 Root Endpoint

**Endpoint:** `GET /`

**Headers:** None required

**cURL:**
```bash
curl -X GET "http://localhost:8000/"
```

**Expected Response (200 OK):**
```json
{
  "message": "Secure Image Sharing API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

### 4.2 Health Check

**Endpoint:** `GET /health`

**Headers:** None required

**cURL:**
```bash
curl -X GET "http://localhost:8000/health"
```

**Expected Response (200 OK):**
```json
{
  "status": "healthy"
}
```

---

## Complete Testing Workflow

### Step-by-Step Testing Scenario

#### 1. Register Two Users

**User 1:**
```bash
POST /auth/register
{
  "username": "alice",
  "password": "AlicePass123!"
}
```
Save `id` from response (e.g., `user1_id`)

**User 2:**
```bash
POST /auth/register
{
  "username": "bob",
  "password": "BobPass123!"
}
```
Save `id` from response (e.g., `user2_id`)

#### 2. Login Both Users

**Alice Login:**
```bash
POST /auth/login
{
  "username": "alice",
  "password": "AlicePass123!"
}
```
Save `access_token` as `alice_token`

**Bob Login:**
```bash
POST /auth/login
{
  "username": "bob",
  "password": "BobPass123!"
}
```
Save `access_token` as `bob_token`

#### 3. List All Users (as Alice)
```bash
GET /users
Authorization: Bearer {alice_token}
```

#### 4. Upload Image (Alice sends to Bob)
```bash
POST /images/upload
Authorization: Bearer {alice_token}
Form Data:
  receiver_id: {user2_id}
  file: [select image file]
```
Save `id` from response as `image_id`

#### 5. Check Sent Images (as Alice)
```bash
GET /images/sent
Authorization: Bearer {alice_token}
```

#### 6. Check Received Images (as Bob)
```bash
GET /images/received
Authorization: Bearer {bob_token}
```

#### 7. Download Image (Bob downloads)
```bash
GET /images/{image_id}/download
Authorization: Bearer {bob_token}
```

#### 8. Verify Status Changed (Check received images again)
```bash
GET /images/received
Authorization: Bearer {bob_token}
```
Status should now be `DOWNLOADED`

---

## Postman Collection JSON

Save this as `FileShareAPI.postman_collection.json`:

```json
{
  "info": {
    "name": "Secure Image Sharing API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "access_token",
      "value": ""
    },
    {
      "key": "user1_id",
      "value": ""
    },
    {
      "key": "user2_id",
      "value": ""
    },
    {
      "key": "image_id",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"alice\",\n  \"password\": \"AlicePass123!\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"alice\",\n  \"password\": \"AlicePass123!\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('access_token', jsonData.access_token);",
                  "}"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "List All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users",
              "host": ["{{base_url}}"],
              "path": ["users"]
            }
          }
        }
      ]
    },
    {
      "name": "Images",
      "item": [
        {
          "name": "Upload Image",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "receiver_id",
                  "value": "{{user2_id}}",
                  "type": "text"
                },
                {
                  "key": "file",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/images/upload",
              "host": ["{{base_url}}"],
              "path": ["images", "upload"]
            }
          }
        },
        {
          "name": "Get Sent Images",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/images/sent",
              "host": ["{{base_url}}"],
              "path": ["images", "sent"]
            }
          }
        },
        {
          "name": "Get Received Images",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/images/received",
              "host": ["{{base_url}}"],
              "path": ["images", "received"]
            }
          }
        },
        {
          "name": "Download Image",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/images/{{image_id}}/download",
              "host": ["{{base_url}}"],
              "path": ["images", "{{image_id}}", "download"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Testing Checklist

- [ ] Register user with valid credentials
- [ ] Register user with weak password (should fail)
- [ ] Register duplicate username (should fail)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] List users without token (should fail)
- [ ] List users with valid token
- [ ] Upload image with valid file
- [ ] Upload image with invalid file type (should fail)
- [ ] Upload image with file too large (should fail)
- [ ] Get sent images
- [ ] Get received images
- [ ] Download image as receiver (should succeed)
- [ ] Download image as non-receiver (should fail)
- [ ] Verify status changes to DOWNLOADED after download

---

## Postman Testing Guide for File Downloads

### How to Test Download Endpoint in Postman

#### Step 1: Set Up the Request
1. **Method:** Select `GET`
2. **URL:** `http://localhost:8000/images/{image_id}/download`
   - Replace `{image_id}` with your actual image ID (e.g., `697829f19b2a0ebd9e8f4d30`)
   - **Important:** Use single slash `/images/` not double slash `//images/`
   - Example: `http://localhost:8000/images/697829f19b2a0ebd9e8f4d30/download`

#### Step 2: Add Authorization Header
1. Go to **Headers** tab
2. Add header:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE`
   - Replace `YOUR_TOKEN_HERE` with the **receiver's** access token (the user who received the image)

#### Step 3: Send and Download
**Option A: Download to File (Recommended)**
1. Click the **"Send"** button
2. After the request completes, look at the bottom of the response panel
3. Click **"Save Response"** → **"Save to a file"**
4. Choose where to save the file (default location is usually your Downloads folder)
5. The file will be saved with its original filename

**Option B: Use Send and Download Button**
1. Click the dropdown arrow next to **"Send"** button
2. Select **"Send and Download"**
3. Choose the save location when prompted
4. The file will download automatically

#### Step 4: Verify the Download
- **Status Code:** Should be `200 OK`
- **Response Headers:** 
  - `Content-Type: application/octet-stream`
  - `Content-Disposition: attachment; filename="original_filename.jpg"`
- **Response Body:** Will show binary data (this is normal for file downloads)

### Where Files Are Downloaded

**In Postman:**
- When you use "Save to a file" or "Send and Download", Postman will prompt you to choose a location
- Default location is usually your **Downloads folder** (`C:\Users\YourUsername\Downloads` on Windows)
- You can choose any location on your computer

**In Browser:**
- If you test the endpoint in a browser, files download to your browser's default Downloads folder
- Usually: `C:\Users\YourUsername\Downloads` on Windows

### Troubleshooting

**Issue: Getting 403 Forbidden**
- Make sure you're using the **receiver's token**, not the sender's token
- Only the receiver can download the image

**Issue: Getting 404 Not Found**
- Verify the image ID is correct
- Make sure the image exists in the database
- Check that the file still exists on the server

**Issue: File not downloading**
- Make sure you're using "Send and Download" or "Save to a file"
- Regular "Send" will show the binary data but won't save it as a file
- Check Postman settings for download location

**Issue: Double slash in URL**
- Remove the extra slash: Use `/images/` not `//images/`
- Correct: `http://localhost:8000/images/...`
- Wrong: `http://localhost:8000//images/...`

---

## Notes

1. **Password Requirements:** All passwords must have:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **Image Requirements:**
   - Allowed formats: `.jpg`, `.jpeg`, `.png`
   - Maximum size: 10MB

3. **Authentication:**
   - All endpoints except `/auth/register`, `/auth/login`, `/`, and `/health` require Bearer token
   - Token expires after 30 minutes (configurable in `.env`)

4. **Image Status:**
   - `PENDING`: Image uploaded but not downloaded yet
   - `DOWNLOADED`: Image has been downloaded by receiver
