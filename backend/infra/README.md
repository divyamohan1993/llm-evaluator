# Hybrid Infrastructure - Anshuman's Domain

## Owner: Anshuman (Hybrid Infrastructure Engineer + Consensus Logic)
## Branch: `feat/anshuman-hybrid`

> **Team Structure**: Kaustuv (AI) | Jatin (Data Science) | Anshuman (Cloud + Consensus) | Anshul (Marketing & Finance - see `docs/MARKETING_STRATEGY.md`)
>
> **Note:** Anshuman also owns the **Consensus Configuration** module (`config/README.md`) which was reassigned from Anshul (BBA student).

---

## Overview

The **Hybrid Infrastructure** layer manages routing between Cloud APIs (Gemini, Claude, OpenAI) and Local/Onboard LLM servers (Ollama/Llama 3). It implements circuit breakers, failover logic, and intelligent load balancing to ensure high availability and cost optimization.

---

## Files Under Your Ownership

| File | Purpose | Priority |
|------|---------|----------|
| `router.py` | HybridRouter with Cloud/Local routing | HIGH |
| `__init__.py` | Module exports | LOW |
| **Also:** `config/consensus_matrix.json` | Consensus weights (from config module) | HIGH |
| **Also:** `config/scoring/` | Game theory, veto logic | HIGH |

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
**Target:** Production Ready | **Speed:** Extreme

### 🔬 PATENTABLE FEATURE IMPLEMENTATION (NEW PRIORITY)
**Goal**: Build the "method" behind our IP claims.
- [ ] **Feature #3: Tri-Vector Contextual Alignment (TVCA)** (`backend/infra/vectors.py`):
  - **Task**: Setup 3 distinct Vector Indices (ChromaDB Collections):
    1. `syllabus_index` (Lecture notes/PDFs)
    2. `world_index` (Wikipedia subset/Google cache)
    3. `student_index` (The answer itself)
  - **Action**: Expose an API for `calculate_alignment_vectors(answer_id)` that returns cosine similarity scores for all 3.
- [ ] **Support for Ephemeral Adversaries**:
    - **Task**: Create a lightweight Docker container profile (or Kubernetes Job) that can spin up in <500ms for the "Adversary Agent".
    - **Resource Mgmt**: Ensure these containers are `kill`ed immediately after the vote to save costs.
- [ ] **Sandboxed Logic Execution (for NSLV)**:
    - **Task**: Create a secure, isolated Python environment (Bubblewrap or gVisor) where the "Logic Verifier" can run generated code to prove student answers without security risks.



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

### BONUS: Week 2 - Features

#### 6.1 Multi-Region Deployment
- [ ] **Global Load Balancing**:
  - Deploy to US, EU, Asia regions
  - Route users to nearest datacenter
  - Cross-region failover

#### 6.2 Edge Computing
- [ ] **Cloudflare Workers**:
  - Run lightweight inference at edge
  - Cache frequent responses
  - Reduce latency to <100ms

#### 6.3 GPU Cluster Management
- [ ] **NVIDIA Triton**:
  - Deploy models on GPU cluster
  - Dynamic batching for efficiency
  - Model versioning and A/B testing

#### 6.4 Cost Dashboard
- [ ] **Real-Time Cost Tracking**:
  - Per-request cost breakdown
  - Daily/weekly/monthly reports
  - Budget alerts and auto-throttling

#### 6.5 API Gateway
- [ ] **Kong/AWS API Gateway**:
  - Rate limiting per API key
  - Request transformation
  - API analytics and monitoring

#### 6.6 Secrets Management
- [ ] **HashiCorp Vault**:
  - Dynamic API key rotation
  - Audit logging for secret access
  - Emergency key revocation

#### 6.7 Blue-Green Deployments
- [ ] **Zero-Downtime Updates**:
  - Deploy new version alongside old
  - Gradual traffic shift
  - Instant rollback capability

#### 6.8 Service Mesh
- [ ] **Istio/Linkerd**:
  - Automatic mTLS between services
  - Traffic splitting for canary releases
  - Observability and tracing

#### 6.9 Database Scaling
- [ ] **Read Replicas**:
  - PostgreSQL read replicas for analytics
  - Redis cluster for caching
  - Connection pooling with PgBouncer



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
