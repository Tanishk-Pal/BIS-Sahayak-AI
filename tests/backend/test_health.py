# Verifies the Phase 1 health-check endpoint exists and responds.
# If backend/app/main.py doesn't yet expose GET /api/health (or /health),
# update the path below to match the real route once confirmed.

def test_health_check_returns_200(client):
    response = client.get("/api/health")
    assert response.status_code == 200


def test_health_check_reports_ok_status(client):
    response = client.get("/api/health")
    body = response.json()
    assert body.get("status") in ("ok", "healthy", "up")
