"""
Swarm Council Orchestrator
==========================

Main orchestration engine for the 4-Agent Consensus Swarm.
Uses asyncio.gather for parallel LLM inference to minimize latency.

Assigned to: Kaustuv (AI Swarm Engineer)
Branch: feat/kaustuv-swarm
"""

import asyncio
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

from backend.swarm.agents import (
    FactCheckerAgent,
    StructureAgent,
    CriticalAgent,
    SecurityAgent,
)
from backend.infra.router import HybridRouter


# =============================================================================
# Data Models
# =============================================================================

@dataclass
class AgentVote:
    """Represents a single agent's evaluation vote."""
    agent_name: str
    agent_role: str
    score: float  # 0-100
    confidence: float  # 0-1
    feedback: str
    reasoning: str
    timestamp: datetime = field(default_factory=datetime.utcnow)
    latency_ms: float = 0.0


@dataclass
class CouncilVotes:
    """Collection of all agent votes from a council session."""
    fact_vote: AgentVote
    structure_vote: AgentVote
    critical_vote: AgentVote
    security_vote: AgentVote
    total_latency_ms: float = 0.0
    
    def to_list(self) -> list[AgentVote]:
        """Convert to list of votes."""
        return [
            self.fact_vote,
            self.structure_vote,
            self.critical_vote,
            self.security_vote,
        ]
    
    def to_dict(self) -> dict:
        """Convert to dictionary format for API response."""
        return {
            "votes": [
                {
                    "agent_name": vote.agent_name,
                    "agent_role": vote.agent_role,
                    "score": vote.score,
                    "confidence": vote.confidence,
                    "feedback": vote.feedback,
                }
                for vote in self.to_list()
            ],
            "total_latency_ms": self.total_latency_ms,
        }


# =============================================================================
# Swarm Council
# =============================================================================

class SwarmCouncil:
    """
    The Swarm Council orchestrates 4 specialized AI agents to evaluate student answers.
    
    Each agent has a specific role:
    - Agent 1 (Gemini): Fact-checking against PDF context
    - Agent 2 (Local Llama 3): Structure and grammar analysis
    - Agent 3 (Claude/Mistral): Critical thinking & bluff detection
    - Agent 4 (BERT): AI-generation and plagiarism detection
    
    # TODO Kaustuv: Use asyncio.gather to run these 4 LLM calls in parallel to reduce latency.
    """
    
    def __init__(self):
        """Initialize the Swarm Council with all 4 agents."""
        self.hybrid_router = HybridRouter()
        
        # Initialize agents
        # TODO Kaustuv: Consider using dependency injection for better testability
        self.fact_agent = FactCheckerAgent(router=self.hybrid_router)
        self.structure_agent = StructureAgent(router=self.hybrid_router)
        self.critical_agent = CriticalAgent(router=self.hybrid_router)
        self.security_agent = SecurityAgent(router=self.hybrid_router)
        
        self._initialized = False
    
    async def initialize(self) -> None:
        """
        Initialize all agents and verify connectivity.
        
        # TODO Kaustuv: Add retry logic for agent initialization failures.
        """
        await self.hybrid_router.health_check()
        self._initialized = True
    
    async def gather_council_votes(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> CouncilVotes:
        """
        Gather evaluation votes from all 4 agents in parallel.
        
        This is the main entry point for the swarm evaluation process.
        Uses asyncio.gather to dispatch all 4 LLM calls simultaneously,
        significantly reducing total latency compared to sequential execution.
        
        Args:
            student_answer: The student's answer text to evaluate
            pdf_context: Optional reference PDF content for fact-checking
            
        Returns:
            CouncilVotes containing all 4 agent evaluations
            
        # TODO Kaustuv: Use asyncio.gather to run these 4 LLM calls in parallel to reduce latency.
        # TODO Kaustuv: Implement timeout handling for slow/unresponsive agents.
        # TODO Kaustuv: Add circuit breaker pattern for failing agents.
        """
        start_time = asyncio.get_event_loop().time()
        
        # =====================================================================
        # PARALLEL ASYNC DISPATCH - All 4 agents execute simultaneously
        # =====================================================================
        # TODO Kaustuv: Use asyncio.gather to run these 4 LLM calls in parallel to reduce latency.
        
        results = await asyncio.gather(
            # Agent 1 (Fact - Gemini): "Is this factually strictly true based on PDF?"
            self.fact_agent.evaluate(
                student_answer=student_answer,
                pdf_context=pdf_context,
            ),
            
            # Agent 2 (Structure - Local Llama 3): "Is the answer well-structured and grammatically sound?"
            self.structure_agent.evaluate(
                student_answer=student_answer,
            ),
            
            # Agent 3 (Critical - Claude/Mistral): "Is the student bluffing or hallucinating?"
            self.critical_agent.evaluate(
                student_answer=student_answer,
                pdf_context=pdf_context,
            ),
            
            # Agent 4 (Security - BERT): "Is this text AI-generated or Plagiarized?"
            self.security_agent.evaluate(
                student_answer=student_answer,
            ),
            
            return_exceptions=True,  # Don't fail if one agent errors
        )
        
        end_time = asyncio.get_event_loop().time()
        total_latency = (end_time - start_time) * 1000  # Convert to ms
        
        # Process results with error handling
        # TODO Kaustuv: Implement fallback logic for failed agent calls
        fact_vote, structure_vote, critical_vote, security_vote = self._process_results(results)
        
        return CouncilVotes(
            fact_vote=fact_vote,
            structure_vote=structure_vote,
            critical_vote=critical_vote,
            security_vote=security_vote,
            total_latency_ms=total_latency,
        )
    
    def _process_results(self, results: list) -> tuple[AgentVote, AgentVote, AgentVote, AgentVote]:
        """
        Process agent results and handle any exceptions.
        
        # TODO Kaustuv: Add more sophisticated error handling and fallback logic.
        """
        processed = []
        agent_names = ["FactChecker", "StructureAnalyzer", "CriticalDetector", "SecurityGuard"]
        agent_roles = ["Fact Verification", "Structure Analysis", "Bluff Detection", "Plagiarism Detection"]
        
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                # Create failure vote for errored agent
                processed.append(AgentVote(
                    agent_name=agent_names[i],
                    agent_role=agent_roles[i],
                    score=0.0,
                    confidence=0.0,
                    feedback=f"Agent failed to respond: {str(result)}",
                    reasoning="Error during evaluation",
                ))
            else:
                processed.append(result)
        
        return tuple(processed)
    
    async def get_agent_status(self) -> dict:
        """
        Get the current status of all swarm agents.
        
        Returns a dictionary with each agent's availability and health.
        
        # TODO Kaustuv: Add detailed metrics (avg latency, success rate, etc.)
        """
        local_available = await self.hybrid_router.is_local_available()
        
        return {
            "agents": {
                "fact_checker": {
                    "name": "Gemini Pro",
                    "type": "cloud",
                    "status": "available",  # TODO: Add actual health check
                    "role": "Fact Verification",
                },
                "structure_analyzer": {
                    "name": "Llama 3",
                    "type": "local" if local_available else "cloud_fallback",
                    "status": "available" if local_available else "fallback",
                    "role": "Structure & Grammar Analysis",
                },
                "critical_detector": {
                    "name": "Claude 3.5 / Mistral",
                    "type": "cloud",
                    "status": "available",
                    "role": "Bluff & Hallucination Detection",
                },
                "security_guard": {
                    "name": "BERT",
                    "type": "local",
                    "status": "available",
                    "role": "AI/Plagiarism Detection",
                },
            },
            "swarm_ready": True,
            "parallel_execution": True,
        }


# =============================================================================
# Mock Swarm Council (for CI/CD Testing)
# =============================================================================

class MockSwarmCouncil(SwarmCouncil):
    """
    Mock Swarm Council for CI/CD testing.
    
    Does NOT call real APIs - returns predefined mock responses.
    Use this during CI tests to save money and avoid API rate limits.
    
    # TODO Kaustuv: Add configurable mock responses for different test scenarios.
    """
    
    async def gather_council_votes(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> CouncilVotes:
        """Return mock votes without calling real APIs."""
        
        # Simulate some latency
        await asyncio.sleep(0.1)
        
        return CouncilVotes(
            fact_vote=AgentVote(
                agent_name="MockFactChecker",
                agent_role="Fact Verification",
                score=85.0,
                confidence=0.9,
                feedback="[MOCK] Facts appear accurate based on context.",
                reasoning="Mock response for testing",
            ),
            structure_vote=AgentVote(
                agent_name="MockStructureAnalyzer",
                agent_role="Structure Analysis",
                score=78.0,
                confidence=0.85,
                feedback="[MOCK] Answer is well-structured with minor issues.",
                reasoning="Mock response for testing",
            ),
            critical_vote=AgentVote(
                agent_name="MockCriticalDetector",
                agent_role="Bluff Detection",
                score=92.0,
                confidence=0.95,
                feedback="[MOCK] No signs of bluffing or hallucination detected.",
                reasoning="Mock response for testing",
            ),
            security_vote=AgentVote(
                agent_name="MockSecurityGuard",
                agent_role="Plagiarism Detection",
                score=100.0,
                confidence=0.99,
                feedback="[MOCK] Content appears original and human-written.",
                reasoning="Mock response for testing",
            ),
            total_latency_ms=100.0,
        )
