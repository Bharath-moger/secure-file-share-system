# Secure Image Sharing - React Frontend

A clean, simple React frontend for the FastAPI secure image sharing system with steganography verification.

## Features

- ✅ JWT Authentication (Register/Login)
- ✅ Image Upload to specific users
- ✅ View Sent Images
- ✅ View Received Images
- ✅ Download Images (preserves steganography)
- ✅ Verify Image Steganography

## Tech Stack

- **React** (Vite)
- **React Router** - Navigation and protected routes
- **Axios** - HTTP client with JWT interceptor
- **Context API** - Authentication state management
- **CSS** - Simple, clean styling

## Project Structure

```
src/
 ├─ api/
 │   ├─ axios.js          # Axios instance with JWT interceptor
 │   ├─ auth.js           # Auth API endpoints
 │   ├─ users.js          # Users API endpoints
 │   └─ images.js         # Images API endpoints
 ├─ context/
 │   └─ AuthContext.jsx   # Authentication context provider
 ├─ components/
 │   ├─ Navbar.jsx        # Navigation bar
 │   └─ ProtectedRoute.jsx # Route protection component
 ├─ pages/
 │   ├─ Register.jsx      # User registration
 │   ├─ Login.jsx         # User login
 │   ├─ Home.jsx          # Upload images
 │   ├─ SentImages.jsx    # View sent images
 │   ├─ ReceivedImages.jsx # View received images
 │   └─ VerifyImage.jsx   # Verify steganography
 ├─ App.jsx               # Main app with routing
 └─ main.jsx              # Entry point
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Backend Configuration

The frontend is configured to connect to the FastAPI backend at:
- **Base URL:** `http://127.0.0.1:8000`

To change this, update `API_BASE_URL` in `src/api/axios.js`.

## Usage

### Authentication

1. **Register:** Create a new account at `/register`
2. **Login:** Authenticate at `/login`
   - JWT token is automatically stored in localStorage
   - Token is included in all API requests via Axios interceptor

### Image Operations

1. **Upload Image:**
   - Go to Home page (`/`)
   - Select a receiver from dropdown
   - Choose an image file
   - Click "Upload Image"

2. **View Sent Images:**
   - Navigate to `/sent`
   - See all images you've sent
   - View status (PENDING/DOWNLOADED) and receiver info

3. **View Received Images:**
   - Navigate to `/received`
   - See all images you've received
   - Click "Download" to download an image

4. **Verify Image:**
   - Navigate to `/verify`
   - Upload a downloaded image file
   - View sender, receiver, and image details if valid

## Important Notes

⚠️ **Steganography Preservation:**
- Images must be downloaded using the "Download" button
- Opening or editing images breaks steganography
- Renaming files is safe and does NOT break steganography

## API Integration

All API calls are made through centralized API modules:
- `src/api/auth.js` - Authentication endpoints
- `src/api/users.js` - User management
- `src/api/images.js` - Image operations

The Axios instance automatically:
- Adds JWT token to all requests
- Handles 401 errors (redirects to login)
- Manages base URL configuration

## Protected Routes

All routes except `/register` and `/login` are protected. Unauthenticated users are automatically redirected to login.

## Error Handling

- API errors are displayed to users with clear messages
- Network errors are handled gracefully
- 401 errors trigger automatic logout and redirect
