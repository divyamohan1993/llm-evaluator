"""Shared test fixtures for SmartEvaluator-Omni test suite."""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

# Only import what exists
try:
    from backend.swarm.orchestrator import MockSwarmCouncil
except ImportError:
    MockSwarmCouncil = None

try:
    from backend.digital_twin.personality_loader import TeacherPersona
except ImportError:
    TeacherPersona = None

try:
    from backend.infra.router import HybridRouter
except ImportError:
    HybridRouter = None


@pytest.fixture
def mock_swarm():
    if MockSwarmCouncil:
        return MockSwarmCouncil()
    return MagicMock()


@pytest.fixture
def sample_persona():
    if TeacherPersona:
        return TeacherPersona(
            teacher_id="test_001",
            name="Dr. Test",
            subject="Computer Science",
        )
    return MagicMock()


@pytest.fixture
def mock_router():
    if HybridRouter:
        router = HybridRouter()
        router._local_available = False
        return router
    return MagicMock()
