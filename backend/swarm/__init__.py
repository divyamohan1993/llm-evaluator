"""
Swarm Engine Module
===================

Orchestrates the 4-Agent Consensus Swarm for answer evaluation.

Agents:
    - Gemini (Fact Checker): Validates factual accuracy against PDF context
    - Llama 3 (Structure Analyzer): Evaluates grammar and structure
    - Claude/Mistral (Critical Detector): Identifies bluffing and hallucination
    - BERT (Security Guard): Detects AI-generated and plagiarized content

Assigned to: Kaustuv (AI Swarm Engineer)
Branch: feat/kaustuv-swarm
"""

from backend.swarm.orchestrator import SwarmCouncil
from backend.swarm.agents import (
    FactCheckerAgent,
    StructureAgent,
    CriticalAgent,
    SecurityAgent,
)

__all__ = [
    "SwarmCouncil",
    "FactCheckerAgent",
    "StructureAgent",
    "CriticalAgent",
    "SecurityAgent",
]
