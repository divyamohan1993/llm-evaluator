"""
Swarm Agents
============

Individual AI agents for the Consensus Swarm.
Each agent has a specialized role in evaluating student answers.

Assigned to: Kaustuv (AI Swarm Engineer)
Branch: feat/kaustuv-swarm
"""

import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from backend.infra.router import HybridRouter


# =============================================================================
# Base Agent
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


class BaseAgent(ABC):
    """
    Abstract base class for all swarm agents.
    
    Each agent specializes in evaluating a specific aspect of student answers.
    
    # TODO Kaustuv: Add retry logic and exponential backoff for API failures.
    """
    
    def __init__(self, router: HybridRouter):
        self.router = router
        self.name: str = "BaseAgent"
        self.role: str = "Base Evaluation"
        self.model_preference: str = "cloud"  # cloud, local, or hybrid
    
    @abstractmethod
    async def evaluate(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> AgentVote:
        """Evaluate the student answer and return a vote."""
        pass
    
    def _build_system_prompt(self) -> str:
        """Build the system prompt for the agent."""
        return f"""You are an expert {self.role} agent in an AI-powered examination grading system.

Your task is to evaluate student answers based on your specialty area.
Be fair, objective, and provide constructive feedback.

Respond in the following JSON format:
{{
    "score": <0-100>,
    "confidence": <0.0-1.0>,
    "feedback": "<constructive feedback for the student>",
    "reasoning": "<your internal reasoning process>"
}}"""


# =============================================================================
# Agent 1: Fact Checker (Gemini)
# =============================================================================

class FactCheckerAgent(BaseAgent):
    """
    Agent 1: Fact Verification using Google Gemini.
    
    Question: "Is this factually strictly true based on PDF?"
    
    Uses the reference PDF context to verify the factual accuracy
    of the student's answer.
    
    # TODO Kaustuv: Implement semantic similarity matching for partial fact verification.
    """
    
    def __init__(self, router: HybridRouter):
        super().__init__(router)
        self.name = "FactChecker"
        self.role = "Fact Verification"
        self.model_preference = "gemini"
    
    async def evaluate(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> AgentVote:
        """
        Evaluate the factual accuracy of the student's answer.
        
        # TODO Kaustuv: Add chunk-based fact verification for long PDF contexts.
        """
        start_time = asyncio.get_event_loop().time()
        
        prompt = self._build_evaluation_prompt(student_answer, pdf_context)
        
        try:
            # Route to Gemini for fact checking
            response = await self.router.route_request(
                prompt=prompt,
                system_prompt=self._build_system_prompt(),
                preferred_model="gemini",
            )
            
            end_time = asyncio.get_event_loop().time()
            latency = (end_time - start_time) * 1000
            
            # Parse response
            # TODO Kaustuv: Add proper JSON parsing with error handling
            result = self._parse_response(response)
            
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=result.get("score", 0.0),
                confidence=result.get("confidence", 0.0),
                feedback=result.get("feedback", "Unable to evaluate"),
                reasoning=result.get("reasoning", ""),
                latency_ms=latency,
            )
            
        except Exception as e:
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=0.0,
                confidence=0.0,
                feedback=f"Evaluation failed: {str(e)}",
                reasoning="Error during fact checking",
            )
    
    def _build_evaluation_prompt(
        self,
        student_answer: str,
        pdf_context: Optional[str],
    ) -> str:
        """Build the evaluation prompt for fact checking."""
        context_section = ""
        if pdf_context:
            context_section = f"""
REFERENCE MATERIAL (PDF Context):
{pdf_context}
---"""
        
        return f"""You are a strict fact-checker. Evaluate whether the student's answer is factually correct.

{context_section}

STUDENT'S ANSWER:
{student_answer}

TASK: Is this answer factually strictly true based on the reference material?

Evaluate:
1. Are all stated facts accurate?
2. Are there any factual errors or misstatements?
3. Is the information complete or are key facts missing?
4. Are any facts taken out of context?

Provide your evaluation in JSON format with score (0-100), confidence (0-1), feedback, and reasoning."""
    
    def _parse_response(self, response: str) -> dict:
        """Parse the LLM response into a structured result."""
        # TODO Kaustuv: Implement proper JSON parsing with regex fallback
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "confidence": 0.5,
                "feedback": response[:500],
                "reasoning": "Could not parse structured response",
            }


# =============================================================================
# Agent 2: Structure Analyzer (Local Llama 3)
# =============================================================================

class StructureAgent(BaseAgent):
    """
    Agent 2: Structure & Grammar Analysis using Local Llama 3.
    
    Question: "Is the answer well-structured and grammatically sound?"
    
    Runs on local Ollama for privacy and cost efficiency.
    Falls back to cloud if local is unavailable.
    
    # TODO Kaustuv: Add grammar-specific rules for different subjects.
    """
    
    def __init__(self, router: HybridRouter):
        super().__init__(router)
        self.name = "StructureAnalyzer"
        self.role = "Structure & Grammar Analysis"
        self.model_preference = "local"
    
    async def evaluate(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> AgentVote:
        """
        Evaluate the structure and grammar of the student's answer.
        
        # TODO Kaustuv: Integrate with grammar-checking libraries for detailed feedback.
        """
        start_time = asyncio.get_event_loop().time()
        
        prompt = self._build_evaluation_prompt(student_answer)
        
        try:
            # Route to local Llama 3 (with cloud fallback)
            response = await self.router.route_request(
                prompt=prompt,
                system_prompt=self._build_system_prompt(),
                preferred_model="local",
            )
            
            end_time = asyncio.get_event_loop().time()
            latency = (end_time - start_time) * 1000
            
            result = self._parse_response(response)
            
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=result.get("score", 0.0),
                confidence=result.get("confidence", 0.0),
                feedback=result.get("feedback", "Unable to evaluate"),
                reasoning=result.get("reasoning", ""),
                latency_ms=latency,
            )
            
        except Exception as e:
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=0.0,
                confidence=0.0,
                feedback=f"Evaluation failed: {str(e)}",
                reasoning="Error during structure analysis",
            )
    
    def _build_evaluation_prompt(self, student_answer: str) -> str:
        """Build the evaluation prompt for structure analysis."""
        return f"""You are an expert in academic writing and grammar.
Evaluate the structure and grammar of this student's answer.

STUDENT'S ANSWER:
{student_answer}

TASK: Is this answer well-structured and grammatically sound?

Evaluate:
1. Is the answer logically organized with clear flow?
2. Are paragraphs well-formed with topic sentences?
3. Is the grammar correct (subject-verb agreement, tense consistency)?
4. Is the spelling and punctuation accurate?
5. Is the vocabulary appropriate for the academic context?

Provide your evaluation in JSON format with score (0-100), confidence (0-1), feedback, and reasoning."""
    
    def _parse_response(self, response: str) -> dict:
        """Parse the LLM response."""
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "confidence": 0.5,
                "feedback": response[:500],
                "reasoning": "Could not parse structured response",
            }


# =============================================================================
# Agent 3: Critical Detector (Claude/Mistral)
# =============================================================================

class CriticalAgent(BaseAgent):
    """
    Agent 3: Bluff & Hallucination Detection using Claude/Mistral.
    
    Question: "Is the student bluffing or hallucinating?"
    
    Detects when students are making things up, using filler content,
    or providing vague non-answers.
    
    # TODO Kaustuv: Train a custom model for domain-specific bluff detection.
    """
    
    def __init__(self, router: HybridRouter):
        super().__init__(router)
        self.name = "CriticalDetector"
        self.role = "Bluff & Hallucination Detection"
        self.model_preference = "claude"
    
    async def evaluate(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> AgentVote:
        """
        Evaluate whether the student is bluffing or hallucinating.
        
        # TODO Kaustuv: Add detection for common bluffing patterns.
        """
        start_time = asyncio.get_event_loop().time()
        
        prompt = self._build_evaluation_prompt(student_answer, pdf_context)
        
        try:
            # Route to Claude or Mistral
            response = await self.router.route_request(
                prompt=prompt,
                system_prompt=self._build_system_prompt(),
                preferred_model="claude",
            )
            
            end_time = asyncio.get_event_loop().time()
            latency = (end_time - start_time) * 1000
            
            result = self._parse_response(response)
            
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=result.get("score", 0.0),
                confidence=result.get("confidence", 0.0),
                feedback=result.get("feedback", "Unable to evaluate"),
                reasoning=result.get("reasoning", ""),
                latency_ms=latency,
            )
            
        except Exception as e:
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=0.0,
                confidence=0.0,
                feedback=f"Evaluation failed: {str(e)}",
                reasoning="Error during bluff detection",
            )
    
    def _build_evaluation_prompt(
        self,
        student_answer: str,
        pdf_context: Optional[str],
    ) -> str:
        """Build the evaluation prompt for bluff detection."""
        context_section = ""
        if pdf_context:
            context_section = f"""
REFERENCE MATERIAL:
{pdf_context}
---"""
        
        return f"""You are an expert at detecting academic dishonesty and bluffing in student answers.

{context_section}

STUDENT'S ANSWER:
{student_answer}

TASK: Is the student bluffing or hallucinating in their answer?

Look for these red flags:
1. Vague, generic statements without specific details
2. Circular reasoning or tautologies
3. Made-up facts, statistics, or citations
4. Contradiction with the reference material
5. Overly confident claims without evidence
6. Filler content that doesn't address the question
7. "Hallucinated" information not present in any source

Score should be HIGH (80-100) if the answer is genuine and substantive.
Score should be LOW (0-40) if significant bluffing is detected.

Provide your evaluation in JSON format with score (0-100), confidence (0-1), feedback, and reasoning."""
    
    def _parse_response(self, response: str) -> dict:
        """Parse the LLM response."""
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "confidence": 0.5,
                "feedback": response[:500],
                "reasoning": "Could not parse structured response",
            }


# =============================================================================
# Agent 4: Security Guard (BERT)
# =============================================================================

class SecurityAgent(BaseAgent):
    """
    Agent 4: AI-Generation & Plagiarism Detection using BERT.
    
    Question: "Is this text AI-generated or Plagiarized?"
    
    Uses BERT embeddings and statistical analysis to detect:
    - AI-generated content (ChatGPT, Claude, etc.)
    - Plagiarized content (similarity to known sources)
    
    # TODO Kaustuv: Integrate with external plagiarism databases.
    """
    
    def __init__(self, router: HybridRouter):
        super().__init__(router)
        self.name = "SecurityGuard"
        self.role = "AI/Plagiarism Detection"
        self.model_preference = "bert"
    
    async def evaluate(
        self,
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> AgentVote:
        """
        Evaluate whether the answer is AI-generated or plagiarized.
        
        # TODO Kaustuv: Implement BERT-based detection with confidence scoring.
        # TODO Kaustuv: Add database of known AI-generated patterns.
        """
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Perform AI detection
            ai_score = await self._detect_ai_generated(student_answer)
            
            # Perform plagiarism check
            plagiarism_score = await self._check_plagiarism(student_answer)
            
            end_time = asyncio.get_event_loop().time()
            latency = (end_time - start_time) * 1000
            
            # Combined security score (100 = safe, 0 = flagged)
            combined_score = 100.0 - max(ai_score, plagiarism_score)
            
            feedback = self._generate_feedback(ai_score, plagiarism_score)
            
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=combined_score,
                confidence=0.85,  # TODO: Calculate actual confidence
                feedback=feedback,
                reasoning=f"AI detection: {ai_score}%, Plagiarism: {plagiarism_score}%",
                latency_ms=latency,
            )
            
        except Exception as e:
            return AgentVote(
                agent_name=self.name,
                agent_role=self.role,
                score=0.0,
                confidence=0.0,
                feedback=f"Security check failed: {str(e)}",
                reasoning="Error during security analysis",
            )
    
    async def _detect_ai_generated(self, text: str) -> float:
        """
        Detect AI-generated content using statistical analysis.
        
        Returns a score from 0-100 indicating likelihood of AI generation.
        
        # TODO Kaustuv: Implement actual BERT-based AI detection.
        # TODO Kaustuv: Use perplexity and burstiness metrics.
        """
        # Placeholder implementation
        # TODO: Implement actual BERT-based detection
        
        # Simple heuristics for now
        suspicious_patterns = [
            "as a large language model",
            "i cannot provide",
            "it's worth noting",
            "in conclusion,",
            "furthermore,",
        ]
        
        text_lower = text.lower()
        pattern_count = sum(1 for p in suspicious_patterns if p in text_lower)
        
        # Basic scoring (placeholder)
        base_score = pattern_count * 15.0
        return min(base_score, 100.0)
    
    async def _check_plagiarism(self, text: str) -> float:
        """
        Check for plagiarized content.
        
        Returns a score from 0-100 indicating likelihood of plagiarism.
        
        # TODO Kaustuv: Integrate with plagiarism databases.
        # TODO Kaustuv: Use semantic similarity with known sources.
        """
        # Placeholder implementation
        # TODO: Implement actual plagiarism detection
        
        return 0.0  # Default to no plagiarism detected
    
    def _generate_feedback(self, ai_score: float, plagiarism_score: float) -> str:
        """Generate human-readable feedback based on detection scores."""
        messages = []
        
        if ai_score > 70:
            messages.append("⚠️ High likelihood of AI-generated content detected.")
        elif ai_score > 40:
            messages.append("⚡ Some patterns consistent with AI assistance detected.")
        else:
            messages.append("✅ Content appears to be human-written.")
        
        if plagiarism_score > 70:
            messages.append("🚨 High similarity to known sources detected.")
        elif plagiarism_score > 40:
            messages.append("⚠️ Moderate similarity to existing content.")
        else:
            messages.append("✅ No significant plagiarism detected.")
        
        return " ".join(messages)
