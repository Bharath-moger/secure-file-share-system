# How to Run the Secure Image Sharing API

## ✅ Requirements Checklist

The API is **COMPLETE** and fulfills all requirements:

### ✅ Core Features Implemented:
- [x] User registration with strong password validation
- [x] User login with JWT Bearer token
- [x] Password hashing with bcrypt
- [x] JWT authentication middleware for protected endpoints
- [x] List all users endpoint
- [x] Image upload (jpg, jpeg, png only, max 10MB)
- [x] Images stored on disk (not in MongoDB)
- [x] Image metadata stored in MongoDB
- [x] List sent images endpoint
- [x] List received images endpoint
- [x] Image download with receiver authorization
- [x] Status tracking (PENDING/DOWNLOADED)

### ✅ Architecture Requirements:
- [x] Clean layered architecture (routes/controllers/services/database/models/middleware/utils)
- [x] No business logic in routes
- [x] No database code in controllers
- [x] Dependency injection
- [x] Centralized MongoDB connection
- [x] Environment variables via .env
- [x] Audit logging middleware
- [x] Proper error handling (HTTPException)
- [x] Pydantic schemas for validation
- [x] Comprehensive test suite

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # Linux/Mac
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URL` in `.env`

### Step 3: Configure Environment

The `.env` file is already created. Update it if needed:
- `MONGODB_URL`: Your MongoDB connection string
- `SECRET_KEY`: Change to a strong random key for production
- Other settings are already configured

### Step 4: Run the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or use the host/port from `.env`:
```bash
uvicorn main:app --reload
```

### Step 5: Access the API

- **API Base URL**: http://localhost:8000
- **Interactive Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🧪 Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py
```

## 📝 API Usage Examples

### 1. Register a User

```bash
POST http://localhost:8000/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

### 2. Login

```bash
POST http://localhost:8000/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}

# Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. List All Users (Requires Auth)

```bash
GET http://localhost:8000/users
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 4. Upload Image (Requires Auth)

```bash
POST http://localhost:8000/images/upload
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

receiver_id: <user_id>
file: <image_file>
```

### 5. Get Sent Images

```bash
GET http://localhost:8000/images/sent
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 6. Get Received Images

```bash
GET http://localhost:8000/images/received
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 7. Download Image (Only Receiver)

```bash
GET http://localhost:8000/images/{image_id}/download
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 🔒 Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

## 📁 Project Structure

```
file-share/
├── database/          # MongoDB connection
├── models/           # Data models
├── services/         # Business logic
├── controllers/      # Request handling
├── routes/           # API endpoints
├── schemas/          # Pydantic validation schemas
├── middleware/       # Auth & logging middleware
├── utils/            # Helper functions
├── tests/            # Test suite
├── main.py           # FastAPI app entry point
└── requirements.txt  # Dependencies
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env`
- Verify MongoDB is accessible on the specified port

### Port Already in Use
- Change `PORT` in `.env` or use:
  ```bash
  uvicorn main:app --reload --port 8001
  ```

### Import Errors
- Ensure you're in the project root directory
- Verify all dependencies are installed: `pip install -r requirements.txt`

### File Upload Errors
- Check `UPLOAD_DIR` exists and is writable
- Verify file size is under 10MB
- Ensure file type is jpg, jpeg, or png

## 📊 Testing Status

All test files are created and ready:
- `tests/test_auth.py` - Authentication tests
- `tests/test_users.py` - User management tests
- `tests/test_images.py` - Image sharing tests

Run `pytest` to execute all tests.

## 🎯 Next Steps

1. Start MongoDB
2. Install dependencies: `pip install -r requirements.txt`
3. Run server: `uvicorn main:app --reload`
4. Visit http://localhost:8000/docs to explore the API
5. Test endpoints using Swagger UI or Postman
