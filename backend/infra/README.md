# Hybrid Infrastructure - Anshuman's Domain

## Owner: Anshuman (Hybrid Infrastructure Engineer)
## Branch: `feat/anshuman-hybrid`

---

## Overview

The **Hybrid Infrastructure** layer manages routing between Cloud APIs (Gemini, Claude, OpenAI) and Local/Onboard LLM servers (Ollama/Llama 3). It implements circuit breakers, failover logic, and intelligent load balancing to ensure high availability and cost optimization.

---

## Files Under Your Ownership

| File | Purpose | Priority |
|------|---------|----------|
| `router.py` | HybridRouter with Cloud/Local routing | HIGH |
| `__init__.py` | Module exports | LOW |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Hybrid Router                               │
│                     (router.py)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Route Decision   │
                    │  (preferred_model)│
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Cloud APIs   │    │  Local LLM    │    │  Circuit      │
│               │    │  (Ollama)     │    │  Breakers     │
│ ┌───────────┐ │    │               │    │               │
│ │  Gemini   │ │    │ ┌───────────┐ │    │ ┌───────────┐ │
│ └───────────┘ │    │ │  Llama 3  │ │    │ │  Gemini   │ │
│ ┌───────────┐ │    │ └───────────┘ │    │ │  Claude   │ │
│ │  Claude   │ │    │ ┌───────────┐ │    │ │  OpenAI   │ │
│ └───────────┘ │    │ │  Mistral  │ │    │ │  Local    │ │
│ ┌───────────┐ │    │ └───────────┘ │    │ └───────────┘ │
│ │  OpenAI   │ │    │               │    │               │
│ └───────────┘ │    │               │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Failover Chain   │
                    │  Gemini → Claude  │
                    │  → OpenAI → Local │
                    └───────────────────┘
```

---

## MASSIVE TODO LIST


### ⚡ AGENTIC ACCELERATION ENABLED
**Timeline Compressed via Antigravity, Jules, & Amazon Q.**
**Target:** Enterprise Grade | **Speed:** Extreme

### Day 1: The Iron Defense (Zero Trust)
- [ ] **TODO Anshuman (Agent: Antigravity)**: **Implement mTLS everywhere**.
  - No service talks to another without a valid certificate.
  - **Audit**: Rotate API keys every 60 minutes automatically using Vault.
  - **DDoS Protection**: Rate limit by IP *and* by Student ID hash.

- [ ] **TODO Anshuman (Agent: Jules)**: **Circuit Breaker v2.0 (Predictive)**.
  - Don't wait for failure. If latency spikes > 200ms, *proactively* switch to fallback model before the timeout occurs.
  - **Jitter**: Add randomized jitter to retries to prevent Thundering Herd problems.

### Day 2: Multi-Cloud Sovereignty
- [ ] **TODO Anshuman**: **Provider Agnostic Router**.
  - **Active-Active Deployment**: If OpenAI (Azure) goes down, traffic seamlessly flows to Claude (AWS Bedrock) without dropping a single packet.
  - **Sovereign Mode**: For Government exams, force routing ONLY to local Ollama instances (Air-gapped support).

### Day 3: Cost & Observability
- [ ] **TODO Anshuman (Agent: Amazon Q)**: **Real-time Cost Arbitrage**.
  - "Is this question simple?" -> Route to Llama 3 (Free).
  - "Is this complex?" -> Route to GPT-4o ($$$).
  - **Budget Enforcer**: Kill switches if burn rate exceeds $50/hour.

- [ ] **TODO Anshuman**: **Distributed Tracing (OpenTelemetry)**.
  - Visualize the full lifecycle of a grade Request ID across 4 agents and 3 clouds.
  - **Anomaly Detection**: Alert if "Token Usage vs Grade Score" correlation breaks.

### Day 4: Extreme Scale
- [ ] **TODO Anshuman**: **Kubernetes Horizontal Pod Autoscaling (HPA)**.
  - Scale from 1 to 1000 pods based on distinct queue depth, not just CPU.
  - **GPU Time-Slicing**: Share one A100 GPU across 10 concurrent Llama 3 instances for efficiency.

### Day 5: Compliance & Disaster Recovery
- [ ] **TODO Anshuman**: **Chaos Mesh Drills**.
  - Simulate a total region failure (us-east-1 down).
  - **RPO/RTO Goal**: 0 data loss, <5s recovery time.

- [ ] **TODO Anshuman**: **GDPR/FERPA Erasure Token**.
  - API to verify that a student's data is *cryptographically wiped* from all logs and caches upon request.


---

## Configuration

### Environment Variables

```bash
# Cloud APIs
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# Local LLM
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3
OLLAMA_TIMEOUT=120

# Circuit Breaker
CIRCUIT_BREAKER_FAILURE_THRESHOLD=3
CIRCUIT_BREAKER_RECOVERY_TIMEOUT=60
```

### Failover Chain Configuration

```python
FAILOVER_CHAIN = [
    ModelType.GEMINI,    # Primary: Google Gemini
    ModelType.CLAUDE,    # Fallback 1: Anthropic Claude
    ModelType.OPENAI,    # Fallback 2: OpenAI GPT-4
    ModelType.LOCAL,     # Fallback 3: Local Ollama
]
```

---

## API Reference

### HybridRouter Class

```python
class HybridRouter:
    async def route_request(
        prompt: str,
        system_prompt: str,
        preferred_model: str = "gemini",
    ) -> str:
        """
        Route request to appropriate LLM backend.
        
        Args:
            prompt: User prompt
            system_prompt: System instructions
            preferred_model: gemini, claude, openai, or local
            
        Returns:
            LLM response text
        """

    async def health_check() -> dict:
        """Check health of all LLM backends."""

    async def is_local_available() -> bool:
        """Check if local Ollama is running."""
```

---

## Testing Commands

```bash
# Run infrastructure tests
pytest tests/test_infrastructure.py -v

# Run with mocked APIs
pytest tests/test_infrastructure.py -v -m "not integration"

# Test actual API connectivity
pytest tests/test_infrastructure.py -v -m integration
```

---

## Dependencies

- `httpx` - Async HTTP client
- `langchain` - LLM orchestration
- `langchain-google-genai` - Gemini
- `langchain-anthropic` - Claude
- `langchain-openai` - OpenAI
- `ollama` - Local LLM

---

## Contact

For questions about Hybrid Infrastructure, contact **Anshuman** or create an issue with the label `hybrid-infra`.
