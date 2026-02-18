"""Performance assertions for response latency."""
import pytest
import time
from httpx import AsyncClient, ASGITransport
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


@pytest.mark.performance
class TestLatencyTargets:
    @pytest.mark.asyncio
    async def test_evaluate_under_2_seconds(self, client):
        start = time.monotonic()
        response = await client.post("/api/evaluate", json={
            "student_answer": "Test answer",
            "teacher_id": "teacher_001",
        })
        elapsed = time.monotonic() - start
        assert response.status_code == 200
        assert elapsed < 2.0, f"Evaluation took {elapsed:.2f}s, expected < 2s"

    @pytest.mark.asyncio
    async def test_health_under_500ms(self, client):
        start = time.monotonic()
        response = await client.get("/health")
        elapsed = time.monotonic() - start
        assert response.status_code == 200
        assert elapsed < 0.5
