"""
Decision Maker - Grade Synthesis
=================================

Synthesizes final grades using swarm votes and teacher persona bias.

Assigned to: Jatin (Digital Twin Architect)
Branch: feat/jatin-twin
"""

from dataclasses import dataclass
from typing import Optional
import json
import os

from backend.digital_twin.personality_loader import TeacherPersona


@dataclass
class FinalEvaluation:
    """Final evaluation result."""
    final_grade: float
    letter_grade: str
    teacher_feedback: str
    agent_votes: list
    consensus_method: str
    plagiarism_flag: bool
    ai_generated_flag: bool


def _score_to_letter(score: float) -> str:
    """Convert numeric score to letter grade."""
    if score >= 90: return "A"
    if score >= 80: return "B"
    if score >= 70: return "C"
    if score >= 60: return "D"
    return "F"


async def synthesize_grade(
    council_votes,
    teacher_persona: TeacherPersona,
    grading_mode: Optional[str] = "balanced",
) -> FinalEvaluation:
    """
    Synthesize the final grade from swarm votes with teacher bias.
    
    # TODO Jatin: Apply teacher personality weights to agent scores.
    # TODO Jatin: Generate feedback in the teacher's unique voice.
    # TODO Jatin: Handle veto scenarios (plagiarism detected).
    
    Args:
        council_votes: Votes from all 4 swarm agents
        teacher_persona: Teacher's Digital Twin persona
        grading_mode: strict, balanced, or creative
        
    Returns:
        FinalEvaluation with grade and personalized feedback
    """
    votes = council_votes.to_list()
    bias = teacher_persona.grading_bias
    
    # Check for plagiarism veto
    security_vote = votes[3]
    if security_vote.score < 30:
        return FinalEvaluation(
            final_grade=0.0,
            letter_grade="F",
            teacher_feedback="Academic integrity violation detected.",
            agent_votes=[_vote_to_dict(v) for v in votes],
            consensus_method="veto",
            plagiarism_flag=True,
            ai_generated_flag=True,
        )
    
    # Weighted average with teacher bias
    weights = [
        bias.get("fact_weight", 0.25),
        bias.get("structure_weight", 0.25),
        bias.get("critical_weight", 0.25),
        bias.get("security_weight", 0.25),
    ]
    
    weighted_sum = sum(v.score * w for v, w in zip(votes, weights))
    final_grade = min(100.0, max(0.0, weighted_sum))
    
    # Generate teacher-style feedback
    feedback = await _generate_teacher_feedback(votes, teacher_persona, final_grade)
    
    return FinalEvaluation(
        final_grade=round(final_grade, 1),
        letter_grade=_score_to_letter(final_grade),
        teacher_feedback=feedback,
        agent_votes=[_vote_to_dict(v) for v in votes],
        consensus_method="weighted_average",
        plagiarism_flag=security_vote.score < 50,
        ai_generated_flag=security_vote.score < 70,
    )


def _vote_to_dict(vote) -> dict:
    """Convert vote to dictionary."""
    return {
        "agent_name": vote.agent_name,
        "agent_role": vote.agent_role,
        "score": vote.score,
        "confidence": vote.confidence,
        "feedback": vote.feedback,
    }


async def _generate_teacher_feedback(
    votes: list,
    persona: TeacherPersona,
    grade: float,
) -> str:
    """
    Generate feedback in the teacher's unique voice.
    
    # TODO Jatin: Use LLM to generate personalized feedback.
    # TODO Jatin: Apply pet peeves and style preferences.
    """
    feedbacks = [v.feedback for v in votes if v.feedback]
    combined = " ".join(feedbacks[:3])
    
    if grade >= 80:
        prefix = "Excellent work! "
    elif grade >= 60:
        prefix = "Good effort. "
    else:
        prefix = "This needs significant improvement. "
    
    return f"{prefix}{combined[:300]}"
