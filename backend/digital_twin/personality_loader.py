"""
Teacher Personality Loader
==========================

Loads teacher personas from ChromaDB for Digital Twin grading.
Uses Vector RAG to retrieve past feedback examples.

Assigned to: Jatin (Digital Twin Architect)
Branch: feat/jatin-twin
"""

import os
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class TeacherPersona:
    """Teacher's Digital Twin persona."""
    teacher_id: str
    name: str
    subject: str
    style_vector: list[float] = field(default_factory=list)
    grading_bias: dict = field(default_factory=dict)
    pet_peeves: list[str] = field(default_factory=list)
    past_feedback_examples: list[str] = field(default_factory=list)
    preferred_tone: str = "professional"
    strictness_level: float = 0.7


async def load_teacher_persona(teacher_id: str) -> TeacherPersona:
    """
    Load a teacher's Digital Twin persona from ChromaDB.
    
    # TODO Jatin: Retrieve the teacher's 'Pet Peeves' (e.g., 'hates passive voice') 
    # and inject them into the system prompt.
    # TODO Jatin: Implement vector similarity search for style matching.
    # TODO Jatin: Cache frequently accessed personas for performance.
    
    Args:
        teacher_id: Unique identifier for the teacher
        
    Returns:
        TeacherPersona with style vectors and preferences
    """
    # TODO Jatin: Replace with actual ChromaDB retrieval
    
    # Default persona for development
    persona = TeacherPersona(
        teacher_id=teacher_id,
        name=f"Teacher {teacher_id}",
        subject="General",
        style_vector=[0.5] * 128,
        grading_bias={
            "fact_weight": 0.35,
            "structure_weight": 0.25,
            "critical_weight": 0.25,
            "security_weight": 0.15,
        },
        pet_peeves=[
            "Hates passive voice",
            "Dislikes vague statements",
            "Expects proper citations",
        ],
        past_feedback_examples=[
            "Good analysis, but needs more specific examples.",
            "Clear structure. Work on supporting your claims with evidence.",
            "Excellent understanding of core concepts.",
        ],
        preferred_tone="constructive",
        strictness_level=0.7,
    )
    
    return persona


async def get_teacher_style_vector(teacher_id: str) -> list[float]:
    """
    Retrieve the teacher's style vector from ChromaDB.
    
    # TODO Jatin: Implement actual vector retrieval from ChromaDB.
    """
    return [0.5] * 128


async def get_past_feedback_examples(teacher_id: str, n: int = 5) -> list[str]:
    """
    Retrieve N examples of past feedback for few-shot prompting.
    
    # TODO Jatin: Implement semantic search for relevant past feedback.
    """
    return [
        "Good effort, but the argument lacks depth.",
        "Excellent use of examples to support your thesis.",
        "The structure is clear, but grammar needs improvement.",
        "Shows strong understanding of the material.",
        "Please cite your sources properly next time.",
    ][:n]
