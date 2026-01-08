"""
API Endpoint Tests
==================

Tests for FastAPI endpoints using TestClient.
"""

import pytest
from unittest.mock import patch, AsyncMock


class TestAPIStructure:
    """Tests for API structure and configuration."""
    
    def test_app_import(self):
        """Test FastAPI app can be imported."""
        from backend.main import app
        assert app is not None
        assert app.title == "SmartEvaluator-Omni"
    
    def test_app_version(self):
        """Test app has correct version."""
        from backend.main import app
        assert app.version == "1.0.0"


class TestRequestModels:
    """Tests for Pydantic request models."""
    
    def test_evaluation_request_model(self):
        """Test EvaluationRequest model."""
        from backend.main import EvaluationRequest
        
        request = EvaluationRequest(
            student_answer="Test answer",
            teacher_id="teacher_001",
        )
        
        assert request.student_answer == "Test answer"
        assert request.teacher_id == "teacher_001"
        assert request.grading_mode == "balanced"  # Default
    
    def test_evaluation_request_with_context(self):
        """Test EvaluationRequest with PDF context."""
        from backend.main import EvaluationRequest
        
        request = EvaluationRequest(
            student_answer="Test answer",
            teacher_id="teacher_001",
            pdf_context="Some PDF content",
            grading_mode="strict",
        )
        
        assert request.pdf_context == "Some PDF content"
        assert request.grading_mode == "strict"


class TestResponseModels:
    """Tests for Pydantic response models."""
    
    def test_agent_vote_model(self):
        """Test AgentVote model."""
        from backend.main import AgentVote
        
        vote = AgentVote(
            agent_name="TestAgent",
            agent_role="Testing",
            score=85.0,
            confidence=0.9,
            feedback="Good job!",
        )
        
        assert vote.agent_name == "TestAgent"
        assert vote.score == 85.0
    
    def test_health_response_model(self):
        """Test HealthResponse model."""
        from backend.main import HealthResponse
        
        response = HealthResponse(
            status="healthy",
            version="1.0.0",
            swarm_status={"test": "ok"},
            local_llm_available=True,
        )
        
        assert response.status == "healthy"
        assert response.local_llm_available is True
    
    def test_evaluation_response_model(self):
        """Test EvaluationResponse model."""
        from backend.main import EvaluationResponse, AgentVote
        
        response = EvaluationResponse(
            final_grade=85.5,
            letter_grade="B",
            teacher_feedback="Good work!",
            agent_votes=[
                AgentVote(
                    agent_name="Test",
                    agent_role="Testing",
                    score=85,
                    confidence=0.9,
                    feedback="OK",
                )
            ],
            consensus_method="weighted_average",
            plagiarism_flag=False,
            ai_generated_flag=False,
        )
        
        assert response.final_grade == 85.5
        assert response.letter_grade == "B"
        assert len(response.agent_votes) == 1
