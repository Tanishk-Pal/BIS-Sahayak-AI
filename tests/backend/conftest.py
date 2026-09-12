import pytest
from fastapi.testclient import TestClient

# Adjust this import once backend/app/main.py's FastAPI instance is confirmed.
# Expected: `app = FastAPI()` defined in backend/app/main.py
from app.main import app


@pytest.fixture()
def client():
    """A TestClient wrapping the FastAPI app for synchronous request testing."""
    return TestClient(app)
