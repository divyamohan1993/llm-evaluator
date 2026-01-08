# Swarm Engine - Kaustuv's Domain

## Owner: Kaustuv (AI Swarm Engineer)
## Branch: `feat/kaustuv-swarm`

---

## Overview

The **Swarm Engine** is the core AI orchestration layer that manages the 4-Agent Consensus Swarm. Your responsibility is to ensure all 4 AI agents (Gemini, Llama3, Claude, BERT) work together seamlessly in parallel to evaluate student answers.

---

## Files Under Your Ownership

| File | Purpose | Priority |
|------|---------|----------|
| `orchestrator.py` | Main SwarmCouncil class, parallel dispatch | HIGH |
| `agents.py` | Individual agent implementations | HIGH |
| `__init__.py` | Module exports | LOW |
| `DEVNOTES.md` | Your development notes | - |

---

## Architecture Diagram

```
                    ┌─────────────────────────────────────┐
                    │         SwarmCouncil                │
                    │   (orchestrator.py)                 │
                    └─────────────┬───────────────────────┘
                                  │
                    ┌─────────────┴───────────────┐
                    │     asyncio.gather()         │
                    │   (Parallel Dispatch)        │
                    └─────────────┬───────────────┘
                                  │
        ┌─────────────┬───────────┼───────────┬─────────────┐
        ▼             ▼           ▼           ▼             ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Agent 1  │  │ Agent 2  │  │ Agent 3  │  │ Agent 4  │
  │ Gemini   │  │ Llama 3  │  │ Claude   │  │ BERT     │
  │ (Facts)  │  │ (Grammar)│  │ (Bluff)  │  │ (Plagiarism)│
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
        │             │           │           │
        └─────────────┴───────────┴───────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ CouncilVotes  │
                  │   (Result)    │
                  └───────────────┘
```

---

## MASSIVE TODO LIST


### ⚡ AGENTIC ACCELERATION ENABLED
**Timeline Compressed via Antigravity, Jules, & Claude Code.**
**Target:** Enterprise Grade | **Speed:** Extreme

### Day 1: The Core & The Guardrails
- [ ] **TODO Kaustuv (Agent: Antigravity)**: Implement `asyncio` Swarm with **Adversarial Defense**.
  - Timeout handling (strict 500ms SLA).
  - **Prompt Injection Firewall**: Sanitize student inputs before they hit the Swarm.
  - **Circuit Breaker**: Auto-divert to fallback models on hallucination detection.

- [ ] **TODO Kaustuv (Agent: Claude Code)**: Deploy FactChecker w/ **Live Web Verification**.
  - Connect Gemini to live Google Search for real-time fact validation (not just static knowledge).
  - **Citation Verification**: strict check against provided academic sources.

### Day 2: Advanced Cognitive Architectures
- [ ] **TODO Kaustuv (Agent: Jules)**: StructureAgent with **Psychometric Analysis**.
  - Don't just check grammar; analyze logical flow and cognitive coherence.
  - **Vocabulary Fingerprinting**: Detect authorship style changes (anti-ghostwriting).

- [ ] **TODO Kaustuv (Agent: Codex)**: CriticalAgent with **Logical Fallacy Detection**.
  - Identify ad hominem, straw man, and circular reasoning in student arguments.
  - **Bluff Detection v2.0**: Cross-reference claims against multiple knowledge bases to detect subtle fabrications.

### Day 3: Security & Forensics
- [ ] **TODO Kaustuv (Agent: Antigravity)**: SecurityAgent with **Stylometric Forensics**.
  - **Review**: `backend/swarm/security_agent.py`
  - Implement **Burstiness & Perplexity** analysis at a forensic level.
  - **Ghostwriter Detection**: Compare submission against student's baseline writing style history.

- [ ] **TODO Kaustuv**: **Immutable Audit Logging**.
  - Every agent vote must be cryptographically signed.
  - Store logs in a tamper-evident format for grade disputes.

### Day 4: High-Scale Industrialization
- [ ] **TODO Kaustuv**: Response Parsing with **Self-Healing Schema**.
  - If JSON is malformed, use a micro-LLM to repair it on the fly.
  - Normalize scores to standard deviation curves automatically.

- [ ] **TODO Kaustuv**: **Global Caching Layer**.
  - Semantic Caching (Redis/Valkey) for identical argument structures, not just identical text.
  - **Pre-computation**: Predict likely student answers for common questions and pre-warm the cache.

### Day 5: Chaos Engineering & Stress Testing
- [ ] **TODO Kaustuv**: **Chaos Monkey Integration**.
  - Randomly kill 2 out of 4 agents during live grading to test consensus resilience.
  - **Load Test**: Simulate 100,000 concurrent exams using `locust`.

- [ ] **TODO Kaustuv**: **Latency Optimization**.
  - Implement Request Batching (Group 50 answers -> 1 API call).
  - **Streaming Consensus**: Show realtime grading confidence intervals as the student types (optional).


---

## API Reference

### SwarmCouncil Class

```python
class SwarmCouncil:
    async def gather_council_votes(
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> CouncilVotes:
        """
        Gather votes from all 4 agents in parallel.
        
        Args:
            student_answer: The student's answer text
            pdf_context: Optional reference PDF content
            
        Returns:
            CouncilVotes with all agent evaluations
        """
```

### Agent Interface

```python
class BaseAgent(ABC):
    @abstractmethod
    async def evaluate(
        student_answer: str,
        pdf_context: Optional[str] = None,
    ) -> AgentVote:
        """Evaluate and return a vote."""
```

---

## Testing Commands

```bash
# Run swarm tests only
pytest tests/test_swarm.py -v

# Run with coverage
pytest tests/test_swarm.py -v --cov=backend/swarm

# Run integration tests (requires API keys)
pytest tests/test_swarm.py -v -m integration
```

---

## Dependencies

- `asyncio` - Parallel execution
- `httpx` - Async HTTP client
- `langchain` - LLM orchestration
- `langchain-google-genai` - Gemini integration
- `langchain-anthropic` - Claude integration
- `ollama` - Local Llama 3

---

## Contact

For questions about the Swarm Engine, contact **Kaustuv** or create an issue with the label `swarm-engine`.
