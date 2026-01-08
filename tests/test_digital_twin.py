"""
Digital Twin Tests
==================

Tests for the Teacher Persona and Decision Maker components.
"""

import pytest

from backend.digital_twin.personality_loader import (
    TeacherPersona,
    load_teacher_persona,
    get_teacher_style_vector,
    get_past_feedback_examples,
)
from backend.digital_twin.decision_maker import (
    FinalEvaluation,
    synthesize_grade,
    _score_to_letter,
)
from backend.swarm.orchestrator import MockSwarmCouncil


class TestTeacherPersona:
    """Tests for TeacherPersona dataclass."""
    
    def test_persona_creation(self):
        """Test creating a teacher persona."""
        persona = TeacherPersona(
            teacher_id="test_001",
            name="Dr. Test",
            subject="Mathematics",
        )
        
        assert persona.teacher_id == "test_001"
        assert persona.name == "Dr. Test"
        assert persona.subject == "Mathematics"
        assert persona.strictness_level == 0.7  # Default
    
    def test_persona_defaults(self):
        """Test persona has correct defaults."""
        persona = TeacherPersona(
            teacher_id="test",
            name="Test",
            subject="Test",
        )
        
        assert persona.preferred_tone == "professional"
        assert isinstance(persona.pet_peeves, list)
        assert isinstance(persona.grading_bias, dict)


class TestPersonaLoader:
    """Tests for personality loader functions."""
    
    @pytest.mark.asyncio
    async def test_load_teacher_persona_returns_persona(self):
        """Test loading returns a valid persona."""
        persona = await load_teacher_persona("teacher_123")
        
        assert isinstance(persona, TeacherPersona)
        assert persona.teacher_id == "teacher_123"
    
    @pytest.mark.asyncio
    async def test_load_teacher_persona_has_bias(self):
        """Test loaded persona has grading bias."""
        persona = await load_teacher_persona("teacher_456")
        
        assert "fact_weight" in persona.grading_bias
        assert "structure_weight" in persona.grading_bias
    
    @pytest.mark.asyncio
    async def test_get_style_vector(self):
        """Test style vector retrieval."""
        vector = await get_teacher_style_vector("teacher_001")
        
        assert isinstance(vector, list)
        assert len(vector) == 128
    
    @pytest.mark.asyncio
    async def test_get_past_feedback(self):
        """Test past feedback retrieval."""
        feedback = await get_past_feedback_examples("teacher_001", n=3)
        
        assert isinstance(feedback, list)
        assert len(feedback) == 3


class TestScoreConversion:
    """Tests for score to letter grade conversion."""
    
    def test_score_to_letter_a(self):
        """Test A grade threshold."""
        assert _score_to_letter(90) == "A"
        assert _score_to_letter(95) == "A"
        assert _score_to_letter(100) == "A"
    
    def test_score_to_letter_b(self):
        """Test B grade threshold."""
        assert _score_to_letter(80) == "B"
        assert _score_to_letter(85) == "B"
        assert _score_to_letter(89) == "B"
    
    def test_score_to_letter_c(self):
        """Test C grade threshold."""
        assert _score_to_letter(70) == "C"
        assert _score_to_letter(75) == "C"
        assert _score_to_letter(79) == "C"
    
    def test_score_to_letter_d(self):
        """Test D grade threshold."""
        assert _score_to_letter(60) == "D"
        assert _score_to_letter(65) == "D"
        assert _score_to_letter(69) == "D"
    
    def test_score_to_letter_f(self):
        """Test F grade threshold."""
        assert _score_to_letter(0) == "F"
        assert _score_to_letter(50) == "F"
        assert _score_to_letter(59) == "F"


class TestGradeSynthesis:
    """Tests for grade synthesis."""
    
    @pytest.mark.asyncio
    async def test_synthesize_grade_returns_evaluation(self):
        """Test synthesize_grade returns proper structure."""
        swarm = MockSwarmCouncil()
        votes = await swarm.gather_council_votes("Test answer", None)
        persona = await load_teacher_persona("teacher_001")
        
        result = await synthesize_grade(votes, persona, "balanced")
        
        assert isinstance(result, FinalEvaluation)
        assert 0 <= result.final_grade <= 100
        assert result.letter_grade in ["A", "B", "C", "D", "F"]
    
    @pytest.mark.asyncio
    async def test_synthesize_grade_has_feedback(self):
        """Test result includes teacher feedback."""
        swarm = MockSwarmCouncil()
        votes = await swarm.gather_council_votes("Test answer", None)
        persona = await load_teacher_persona("teacher_001")
        
        result = await synthesize_grade(votes, persona, "balanced")
        
        assert result.teacher_feedback is not None
        assert len(result.teacher_feedback) > 0
    
    @pytest.mark.asyncio
    async def test_synthesize_grade_has_agent_votes(self):
        """Test result includes all agent votes."""
        swarm = MockSwarmCouncil()
        votes = await swarm.gather_council_votes("Test answer", None)
        persona = await load_teacher_persona("teacher_001")
        
        result = await synthesize_grade(votes, persona, "balanced")
        
        assert len(result.agent_votes) == 4
