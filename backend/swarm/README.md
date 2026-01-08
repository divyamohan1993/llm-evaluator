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

### Phase 1: Core Orchestration (Week 1-2)

- [ ] **TODO Kaustuv**: Implement proper `asyncio.gather()` with timeout handling
  - Current implementation lacks timeout for slow agents
  - Add `asyncio.wait_for()` with configurable timeout (default: 30s)
  - Handle `asyncio.TimeoutError` gracefully
  
- [ ] **TODO Kaustuv**: Add retry logic with exponential backoff
  - Implement `@retry` decorator for agent calls
  - Configure max_retries=3, base_delay=1s, max_delay=30s
  - Log all retry attempts

- [ ] **TODO Kaustuv**: Implement circuit breaker pattern
  - Integrate with `backend/infra/router.py` circuit breakers
  - Track failure rates per agent
  - Auto-disable failing agents after threshold

### Phase 2: Agent Implementations (Week 3-4)

- [ ] **TODO Kaustuv**: Complete FactCheckerAgent (Gemini)
  - Implement actual Google Gemini API integration
  - Add PDF chunking for long documents (max 32k tokens)
  - Implement semantic similarity scoring for partial fact matches
  - Add citation extraction and verification

- [ ] **TODO Kaustuv**: Complete StructureAgent (Llama 3)
  - Integrate with Ollama API for local inference
  - Implement grammar scoring rubric (0-100 scale)
  - Add paragraph structure analysis
  - Implement vocabulary complexity scoring

- [ ] **TODO Kaustuv**: Complete CriticalAgent (Claude)
  - Implement Claude 3.5 API integration
  - Add bluff detection heuristics
  - Implement hallucination detection patterns
  - Add confidence calibration

- [ ] **TODO Kaustuv**: Complete SecurityAgent (BERT)
  - Implement BERT-based AI detection model
  - Add perplexity and burstiness metrics
  - Integrate plagiarism database lookups
  - Implement text fingerprinting

### Phase 3: Response Parsing (Week 5)

- [ ] **TODO Kaustuv**: Implement robust JSON parsing
  - Add regex fallback for malformed JSON
  - Implement schema validation with Pydantic
  - Handle partial responses gracefully
  - Add response normalization (0-100 scale)

- [ ] **TODO Kaustuv**: Implement response caching
  - Add LRU cache for identical prompts
  - Implement cache invalidation strategy
  - Add cache hit/miss metrics

### Phase 4: Monitoring & Logging (Week 6)

- [ ] **TODO Kaustuv**: Add comprehensive logging
  - Log all agent requests and responses
  - Add latency tracking per agent
  - Implement structured logging (JSON format)
  - Add request correlation IDs

- [ ] **TODO Kaustuv**: Add Prometheus metrics
  - Agent success/failure rates
  - Response latency histograms
  - Token usage tracking
  - Queue depth monitoring

### Phase 5: Testing (Week 7-8)

- [ ] **TODO Kaustuv**: Expand MockSwarmCouncil
  - Add configurable mock responses for different test scenarios
  - Implement failure injection for testing
  - Add latency simulation
  - Create test fixtures for common scenarios

- [ ] **TODO Kaustuv**: Add integration tests
  - Test actual API calls (marked as slow tests)
  - Test parallel execution timing
  - Test circuit breaker behavior
  - Test failover scenarios

### Phase 6: Performance Optimization (Week 9-10)

- [ ] **TODO Kaustuv**: Optimize parallel execution
  - Benchmark current implementation
  - Identify bottlenecks
  - Implement connection pooling
  - Add request batching for efficiency

- [ ] **TODO Kaustuv**: Implement streaming responses
  - Add SSE support for real-time updates
  - Implement partial result streaming
  - Add progress callbacks

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
