import pytest
from fastapi.testclient import TestClient
from main import app
from database.connection import MongoDBConnection
import os
from dotenv import load_dotenv

load_dotenv()


@pytest.fixture(scope="module")
def test_db():
    """Create a test database"""
    # Use test database
    os.environ["DATABASE_NAME"] = "test_file_share_db"
    db = MongoDBConnection.connect()
    yield db
    # Cleanup: drop test database
    MongoDBConnection._client.drop_database("test_file_share_db")
    MongoDBConnection.close()


@pytest.fixture(scope="module")
def client(test_db):
    """Create test client"""
    return TestClient(app)


@pytest.fixture
def test_user_data():
    """Test user data"""
    return {
        "username": "testuser",
        "password": "TestPass123!"
    }


@pytest.fixture
def test_user2_data():
    """Test user 2 data"""
    return {
        "username": "testuser2",
        "password": "TestPass123!"
    }

