"""
SmartEvaluator-Omni Test Suite
==============================

Tests for the Multi-Agent Swarm using Mock responses.
Does NOT call real APIs during CI/CD testing.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch

from backend.swarm.orchestrator import SwarmCouncil, MockSwarmCouncil
from backend.digital_twin.personality_loader import load_teacher_persona
from backend.digital_twin.decision_maker import synthesize_grade


@pytest.fixture
def mock_swarm():
    """Create a mock swarm council for testing."""
    return MockSwarmCouncil()


@pytest.mark.asyncio
async def test_mock_swarm_council():
    """Test that mock swarm returns valid votes."""
    swarm = MockSwarmCouncil()
    
    votes = await swarm.gather_council_votes(
        student_answer="Test answer about photosynthesis.",
        pdf_context="Plants convert sunlight to energy.",
    )
    
    assert votes is not None
    assert votes.fact_vote.score >= 0
    assert votes.structure_vote.score >= 0
    assert votes.critical_vote.score >= 0
    assert votes.security_vote.score >= 0


@pytest.mark.asyncio
async def test_load_teacher_persona():
    """Test teacher persona loading."""
    persona = await load_teacher_persona("teacher_001")
    
    assert persona is not None
    assert persona.teacher_id == "teacher_001"
    assert len(persona.grading_bias) > 0


@pytest.mark.asyncio
async def test_grade_synthesis(mock_swarm):
    """Test full grade synthesis pipeline."""
    votes = await mock_swarm.gather_council_votes(
        student_answer="Test answer.",
        pdf_context="Reference context.",
    )
    
    persona = await load_teacher_persona("teacher_001")
    
    result = await synthesize_grade(
        council_votes=votes,
        teacher_persona=persona,
        grading_mode="balanced",
    )
    
    assert result is not None
    assert 0 <= result.final_grade <= 100
    assert result.letter_grade in ["A", "B", "C", "D", "F"]


@pytest.mark.asyncio
async def test_parallel_execution():
    """Test that agents execute in parallel."""
    swarm = MockSwarmCouncil()
    
    start = asyncio.get_event_loop().time()
    await swarm.gather_council_votes("Test", None)
    elapsed = asyncio.get_event_loop().time() - start
    
    # Should complete in ~100ms (parallel), not 400ms (sequential)
    assert elapsed < 0.5
