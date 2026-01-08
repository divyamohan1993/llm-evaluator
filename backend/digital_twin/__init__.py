"""
Digital Twin Engine - Module Init
=================================

Assigned to: Jatin (Digital Twin Architect)
Branch: feat/jatin-twin
"""

from backend.digital_twin.personality_loader import load_teacher_persona
from backend.digital_twin.decision_maker import synthesize_grade

__all__ = ["load_teacher_persona", "synthesize_grade"]
