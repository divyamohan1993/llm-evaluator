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

### 🔰 PRE-REQUISITES (Do this first!)
- [ ] **Install Tools**: Docker Desktop, Kubernetes (Minikube usually), Helm, Vault.
- [ ] **Install Python Libs**:
  ```bash
  pip install opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation-fastapi chaos-mesh prometheus_client boto3
  ```

---

### Day 1: The Iron Defense (Zero Trust) (Micro-Steps)

#### 1.1 mTLS Implementation (Agent: Antigravity)
- [ ] **Certificate Authority (CA)**:
  - **Action**: Run `openssl req -x509 -newkey rsa:4096 -keyout ca-key.pem -out ca-cert.pem -days 365`.
  - **Why?**: You are now your own Verisign.
- [ ] **Client Certs**:
  - **Action**: Create a distinct cert for your Backend Service: `backend-cert.pem`.
  - **Action**: Create a distinct cert for your Database Service: `db-cert.pem`.
- [ ] **Nginx Config**:
  - File: `nginx/conf.d/mtls.conf`.
  - **Code**:
    ```nginx
    server {
        listen 443 ssl;
        ssl_client_certificate /etc/nginx/certs/ca-cert.pem;
        ssl_verify_client on; # REJECT anyone without a cert
    }
    ```

#### 1.2 Predictive Circuit Breaker
- [ ] **Latency Tracker**:
  - File: `backend/infra/circuit.py`.
  - **Step**: Using `deque` from collections, store last 10 response times. `history.append(time_taken)`.
  - **Step**: `avg_latency = sum(history) / len(history)`.
- [ ] **Pre-emptive Strike**:
  - **Code**:
    ```python
    if avg_latency > 0.5: # 500ms
        print("Warning! Latency spiking. Switching to Failover Model...")
        current_model = "claude-haiku" # Smaller, faster model
    ```

---

### Day 2: Multi-Cloud Sovereignty

#### 2.1 Provider Agnostic Router
- [ ] **Adapter Pattern**:
  - File: `backend/infra/llm_router.py`.
  - **Step**: Define `class LLMProvider(Protocol): def chat(self, msg): ...`
  - **Step**: Implement `OpenAIAdapter`, `ClaudeAdapter`, `OllamaAdapter`.
- [ ] **Failover Logic**:
  - **Code**:
    ```python
    providers = [OpenAIAdapter(), ClaudeAdapter()]
    for p in providers:
        try:
            return await p.chat(prompt)
        except Exception:
            continue # Try next provider
    raise SystemError("All Clouds Down")
    ```
- [ ] **Sovereign Mode**:
  - **Video**: Watch "How to Airgap Ollama".
  - **Config**: In `.env`, set `AIRGAP_MODE=True`.
  - **Code**: `if config.AIRGAP_MODE and provider.is_cloud: raise SecurityError()`.

---

### Day 3: Cost & Observability

#### 3.1 Cost Arbitrage (Agent: Amazon Q)
- [ ] **Complexity Estimator**:
  - **Logic**: Simple heuristic.
  - **Code**:
    ```python
    def route(prompt):
        if len(prompt) < 100: return "llama3:8b" # Free
        if "analyze" in prompt: return "gpt-4o" # Smart but $
        return "gpt-3.5-turbo" # Mid
    ```
- [ ] **Budget Kill Switch**:
  - **Step**: Redis Key `daily_spend`.
  - **Step**: Middleware increment: `redis.incrbyfloat("daily_spend", 0.03)`.
  - **Step**: Check: `if redis.get("daily_spend") > 50.0: raise BudgetExceeded()`.

#### 3.2 Distributed Tracing
- [ ] **OpenTelemetry Setup**:
  - **Step**: `docker run -d --name jaeger -p 16686:16686 jaegertracing/all-in-one`.
  - **Step**: Python:
    ```python
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    FastAPIInstrumentor.instrument_app(app)
    ```
  - **Verify**: Go to `http://localhost:16686`. You should see colorful bars for every request.

---

### Day 4: Extreme Scale

#### 4.1 Kubernetes HPA
- [ ] **Minikube Setup**:
  - **Step**: `minikube start --driver=docker`.
- [ ] **Metric Server**:
  - **Step**: `minikube addons enable metrics-server`.
- [ ] **HPA Definition**:
  - File: `k8s/hpa.yaml`.
  - **Code**:
    ```yaml
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: backend-scaler
    spec:
      minReplicas: 1
      maxReplicas: 10
      metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 50
    ```
  - **Deploy**: `kubectl apply -f k8s/hpa.yaml`.

---

### Day 5: Compliance & Disaster Recovery

#### 5.1 Chaos Mesh
- [ ] **Installation**:
  - **Step**: `curl -sSL https://mirrors.chaos-mesh.org/v2.6.2/install.sh | bash`.
- [ ] **Experiment**:
  - File: `chaos/pod-kill.yaml`.
  - **Code**:
    ```yaml
    kind: PodChaos
    spec:
      action: pod-kill
      selector:
        namespaces: ["default"]
        labelSelectors:
          "app": "backend"
      scheduler: "@every 1m"
    ```
  - **Result**: Watch your pods die every minute. Ensure your HPA brings them back.

#### 5.2 GDPR Erasure
- [ ] **Crypto-Shredding**:
  - **Concept**: Instead of finding data in backups, we encrypt every student's data with a unique key.
  - **Step**: `student_key = KMS.generate_key(student_id)`.
  - **Step**: `encrypted_data = aes_encrypt(data, student_key)`.
  - **Erasure**: To "delete" the data, we just delete the `student_key`. The data is now unintelligible garbage forever.



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
