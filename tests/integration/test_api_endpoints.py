"""Integration tests for FastAPI endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock

from backend.main import app
from backend.swarm.orchestrator import MockSwarmCouncil
from backend.infra.router import HybridRouter


@pytest.fixture
async def client():
    app.state.swarm_council = MockSwarmCouncil()
    router = HybridRouter()
    router._local_available = False
    app.state.hybrid_router = router
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestRootEndpoint:
    @pytest.mark.asyncio
    async def test_root_returns_api_info(self, client):
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "SmartEvaluator-Omni"


class TestHealthEndpoint:
    @pytest.mark.asyncio
    async def test_health_returns_200(self, client):
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestEvaluateEndpoint:
    @pytest.mark.asyncio
    async def test_evaluate_returns_grade(self, client):
        response = await client.post("/api/evaluate", json={
            "student_answer": "Photosynthesis converts light energy into chemical energy.",
            "teacher_id": "teacher_001",
            "grading_mode": "balanced",
        })
        assert response.status_code == 200
        data = response.json()
        assert "final_grade" in data
        assert "letter_grade" in data
        assert 0 <= data["final_grade"] <= 100

    @pytest.mark.asyncio
    async def test_evaluate_missing_required_fields(self, client):
        response = await client.post("/api/evaluate", json={})
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_evaluate_with_pdf_context(self, client):
        response = await client.post("/api/evaluate", json={
            "student_answer": "Test answer",
            "teacher_id": "teacher_001",
            "pdf_context": "Reference material about photosynthesis.",
        })
        assert response.status_code == 200


class TestBatchEndpoint:
    @pytest.mark.asyncio
    async def test_batch_returns_processing_status(self, client):
        response = await client.post("/api/evaluate/batch", json=[
            {"student_answer": "Answer 1", "teacher_id": "t1"},
            {"student_answer": "Answer 2", "teacher_id": "t2"},
        ])
        assert response.status_code == 200


class TestTeacherPersonaEndpoint:
    @pytest.mark.asyncio
    async def test_get_teacher_persona(self, client):
        response = await client.get("/api/teachers/teacher_001/persona")
        assert response.status_code == 200
