# Skeleton test for backend/app/api/routes/chat.py.
# Marked skip until the route's real request/response schema is confirmed -
# unskip and adjust the payload/assertions once chat.py is finalized.
import pytest


@pytest.mark.skip(reason="Confirm chat.py request/response schema before enabling")
def test_chat_endpoint_accepts_message(client):
    response = client.post(
        "/api/chat",
        json={"message": "What does the ISI mark mean?", "userType": "consumer"}
    )
    assert response.status_code == 200
    body = response.json()
    assert "reply" in body
