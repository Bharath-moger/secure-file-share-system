# Secure Image Sharing API

A FastAPI backend for a secure image sharing system with JWT authentication and MongoDB.

## Features

- **Authentication**: User registration and login with JWT tokens
- **User Management**: List all users
- **Image Sharing**: Upload images for specific users
- **Image Management**: List sent/received images and download with authorization

## Tech Stack

- Python 3.8+
- FastAPI
- MongoDB (PyMongo)
- JWT Authentication
- bcrypt for password hashing
- python-multipart for file uploads

## Project Structure

```
file-share/
├── database/
│   ├── __init__.py
│   └── connection.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   └── image.py
├── services/
│   ├── __init__.py
│   ├── user_service.py
│   ├── auth_service.py
│   └── image_service.py
├── controllers/
│   ├── __init__.py
│   ├── auth_controller.py
│   ├── user_controller.py
│   └── image_controller.py
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py
│   ├── user_routes.py
│   └── image_routes.py
├── schemas/
│   ├── __init__.py
│   ├── auth.py
│   ├── user.py
│   └── image.py
├── middleware/
│   ├── __init__.py
│   ├── auth.py
│   └── audit_logging.py
├── utils/
│   ├── __init__.py
│   ├── password.py
│   ├── jwt.py
│   └── file_handler.py
├── main.py
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Set up MongoDB**:
   - Install and run MongoDB locally, or
   - Use MongoDB Atlas (cloud)

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     ```
     MONGODB_URL=mongodb://localhost:27017
     DATABASE_NAME=file_share_db
     SECRET_KEY=your-secret-key-change-this-in-production
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     UPLOAD_DIR=uploads
     MAX_FILE_SIZE_MB=10
     ```

4. **Run the server**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. **Access API documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users` - List all users (requires authentication)

### Images

- `POST /images/upload` - Upload an image for a user (requires authentication)
- `GET /images/sent` - Get images sent by logged-in user (requires authentication)
- `GET /images/received` - Get images received by logged-in user (requires authentication)
- `GET /images/{image_id}/download` - Download an image (only receiver can download)

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Image Requirements

- Allowed formats: JPG, JPEG, PNG
- Maximum size: 10MB

## Testing

Run tests with:
```bash
pytest
```

## Security Features

- JWT Bearer token authentication
- bcrypt password hashing
- Password strength validation
- File type and size validation
- Authorization checks for image downloads
- Audit logging middleware

