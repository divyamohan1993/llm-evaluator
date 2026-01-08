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
  - **Objective**: "Zero Trust" means "Trust no one, not even inside our own network."
  - **Step 1**: Use `OpenSSL` to generate a root Certificate Authority (CA).
  - **Step 2**: Issue client certificates for the `Backend`, `Ollama`, and `Redis` containers.
  - **Step 3**: Configure `Nginx` (or Traefik) to REJECT any connection that does not present a valid client certificate signed by our CA.
  - **Step 4 (Audit)**: Integrate `HashiCorp Vault`. Write a script that automatically revokes and re-issues these keys every 60 minutes.

- [ ] **TODO Anshuman (Agent: Jules)**: **Circuit Breaker v2.0 (Predictive)**.
  - **Objective**: Don't just react to failure; predict it.
  - **Step 1**: Track the "Moving Average" of latency for the last 10 requests.
  - **Step 2**: If average latency climbs from 200ms -> 400ms -> 600ms, do NOT wait for a timeout. 
  - **Step 3**: Immediately trip the breaker and switch to the Failover model (e.g., from Gemini to Claude). 
  - **Step 4 (Jitter)**: When retrying, wait `random.uniform(0.5, 1.5)` seconds. This prevents "Thundering Herd" (everyone retrying at the exact same millisecond).

### Day 2: Multi-Cloud Sovereignty
- [ ] **TODO Anshuman**: **Provider Agnostic Router**.
  - **Objective**: We must never go down, even if AWS goes down.
  - **Step 1**: Create an abstraction layer `LLMInterface`.
  - **Step 2**: Implement adapters for `AzureOpenAI`, `AWSBedrock`, and `GoogleVertex`.
  - **Step 3**: If `azure_client.chat()` raises a 500 error, the router must instantly call `aws_client.chat()` with the exact same prompt.
  - **Step 4 (Sovereign Mode)**: Add a config flag `GOVERNMENT_MODE=True`. If set, the router MUST physically block all calls to public clouds and only route to `http://localhost:11434` (Ollama).

### Day 3: Cost & Observability
- [ ] **TODO Anshuman (Agent: Amazon Q)**: **Real-time Cost Arbitrage**.
  - **Objective**: Save money automatically.
  - **Step 1**: Define a complexity score function `estimate_complexity(prompt)`.
  - **Step 2**: If length < 50 chars ("What is 2+2?"), route to `Llama-3-8b` (Free).
  - **Step 3**: If length > 2000 chars (Essay grading), route to `GPT-4o` (Powerful).
  - **Step 4 (Budget Enforcer)**: Store `current_spend` in Redis. If `current_spend > $50`, switch ALL traffic to Llama-3 automatically.

- [ ] **TODO Anshuman**: **Distributed Tracing (OpenTelemetry)**.
  - **Objective**: See where the time is going.
  - **Step 1**: Install `opentelemetry-distro` and `opentelemetry-exporter-otlp`.
  - **Step 2**: Instrument the FastAPI app: `FastAPIInstrumentor.instrument_app(app)`.
  - **Step 3**: Visualize the waterfall chart in `Jaeger` or `Grafana`.
  - **Step 4**: Set an alert: If "Token Usage" is high but "Grade Score" is 0 (failed response), trigger PagerDuty.

### Day 4: Extreme Scale
- [ ] **TODO Anshuman**: **Kubernetes Horizontal Pod Autoscaling (HPA)**.
  - **Objective**: Handle 100,000 students clicking "Submit" at once.
  - **Step 1**: Don't scale on CPU. CPU is a bad metric for async apps.
  - **Step 2**: Scale on `custom_metric_queue_depth`.
  - **Step 3**: Install KEDA (Kubernetes Event-driven Autoscaling).
  - **Step 4**: Definition: `If queue_length > 100, spawn 10 new pods`.
  - **Step 5 (GPU Slicing)**: Use **NVIDIA MIG (Multi-Instance GPU)** to split one A100 card into 7 smaller instances so we can run 7 copies of Llama-3 on one physical card.

### Day 5: Compliance & Disaster Recovery
- [ ] **TODO Anshuman**: **Chaos Mesh Drills**.
  - **Objective**: Practice for the apocalypse.
  - **Step 1**: Install `Chaos Mesh` on the cluster.
  - **Step 2**: Scenario 1: "Network Partition". Cut the connection between the Backend and ChromaDB. Does the app show a nice error or crash?
  - **Step 3**: Scenario 2: "Pod Kill". Kill the Redis leader. Does the app switch to the replica?
  - **Goal**: RPO (Recovery Point Objective) = 0 data loss. RTO (Recovery Time Objective) < 5 seconds.

- [ ] **TODO Anshuman**: **GDPR/FERPA Erasure Token**.
  - **Objective**: The "Right to be Forgotten".
  - **Step 1**: When a student requests deletion, issue a `crypto_shred` command.
  - **Step 2**: This command must locate their logs in: S3 (backups), Postgres (records), and Redis (cache).
  - **Step 3**: Overwrite the data with `0x00` (zeros) before deleting, to ensure no magnetic residue remains (metaphorically speaking for cloud/SSDs).
  - **Step 4**: Return a cryptographically signed "Certificate of Deletion".



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
