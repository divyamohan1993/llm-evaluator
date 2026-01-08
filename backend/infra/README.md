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

### Phase 1: Circuit Breaker Implementation (Week 1-2)

- [ ] **TODO Anshuman**: Implement full circuit breaker pattern
  - States: CLOSED (normal), OPEN (failing), HALF_OPEN (testing)
  - Track failure count per service
  - Configure threshold: 3 failures = OPEN
  - Implement recovery timeout: 60 seconds

- [ ] **TODO Anshuman**: Add circuit breaker state machine
  ```python
  class CircuitState(Enum):
      CLOSED = "closed"      # Normal operation
      OPEN = "open"          # Blocking requests
      HALF_OPEN = "half_open"  # Testing recovery
  ```

- [ ] **TODO Anshuman**: Implement automatic failover
  - If Gemini fails → fallback to Claude
  - If Claude fails → fallback to GPT-4o
  - If all cloud fails → fallback to Local Ollama
  - Log all failover events

- [ ] **TODO Anshuman**: Add circuit breaker metrics
  - Track state transitions
  - Measure time in each state
  - Alert on prolonged OPEN state
  - Dashboard for circuit health

### Phase 2: Cloud API Integration (Week 3-4)

- [ ] **TODO Anshuman**: Implement Google Gemini client
  - Use `langchain-google-genai` for integration
  - Handle rate limiting (60 RPM)
  - Implement token counting
  - Add retry with exponential backoff

- [ ] **TODO Anshuman**: Implement Anthropic Claude client
  - Use `langchain-anthropic` for integration
  - Support Claude 3.5 Sonnet model
  - Handle 429 rate limit errors
  - Implement message batching

- [ ] **TODO Anshuman**: Implement OpenAI client
  - Use `langchain-openai` for integration
  - Support GPT-4o model
  - Handle API errors gracefully
  - Add usage tracking

- [ ] **TODO Anshuman**: Implement unified error handling
  - Map provider-specific errors to common types
  - Handle network timeouts consistently
  - Add detailed error logging
  - Implement error recovery strategies

### Phase 3: Local LLM Integration (Week 5-6)

- [ ] **TODO Anshuman**: Enhance Ollama integration
  - Health check endpoint polling
  - Model availability detection
  - Warm-up on startup
  - Handle model switching

- [ ] **TODO Anshuman**: Add local model management
  - Auto-pull models if missing
  - Track model versions
  - Implement model caching
  - Support multiple local models

- [ ] **TODO Anshuman**: Implement local/cloud cost optimization
  - Route cheap queries to local
  - Route complex queries to cloud
  - Track cost per query
  - Budget alerts

- [ ] **TODO Anshuman**: Add local inference optimization
  - GPU detection and utilization
  - Batch processing for efficiency
  - Memory management
  - Response streaming

### Phase 4: Load Balancing (Week 7-8)

- [ ] **TODO Anshuman**: Implement intelligent routing
  - Latency-based routing (fastest wins)
  - Cost-based routing (cheapest for simple queries)
  - Quality-based routing (best model for task)
  - Round-robin for load distribution

- [ ] **TODO Anshuman**: Add request queuing
  - Queue requests when rate limited
  - Priority queuing (urgent requests first)
  - Queue size limits
  - Timeout handling

- [ ] **TODO Anshuman**: Implement connection pooling
  - Reuse HTTP connections
  - Configure pool sizes per provider
  - Handle connection recycling
  - Monitor pool health

- [ ] **TODO Anshuman**: Add traffic shaping
  - Rate limiting per provider
  - Burst handling
  - Throttling under load
  - Graceful degradation

### Phase 5: Health Monitoring (Week 9-10)

- [ ] **TODO Anshuman**: Implement comprehensive health checks
  - Periodic ping to all providers
  - Latency measurement
  - Error rate tracking
  - Availability scoring

- [ ] **TODO Anshuman**: Add provider status dashboard
  - Real-time status page
  - Historical uptime charts
  - Alert integration (Slack, email)
  - Incident timeline

- [ ] **TODO Anshuman**: Implement anomaly detection
  - Detect unusual latency spikes
  - Alert on error rate increases
  - Track token usage anomalies
  - Auto-trigger failover on anomalies

### Phase 6: Security & Compliance (Week 11-12)

- [ ] **TODO Anshuman**: Implement API key rotation
  - Support multiple keys per provider
  - Automatic rotation schedule
  - Key usage tracking
  - Revocation handling

- [ ] **TODO Anshuman**: Add request/response logging
  - Secure logging (no sensitive data)
  - Audit trail
  - Compliance reporting
  - Data retention policies

- [ ] **TODO Anshuman**: Implement data residency controls
  - Route to specific regions
  - Comply with GDPR for EU users
  - Data localization options
  - Privacy-preserving modes

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
