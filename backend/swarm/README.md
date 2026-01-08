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
**Target:** Production Ready | **Speed:** Extreme

### � PATENTABLE FEATURE IMPLEMENTATION (NEW PRIORITY)
**Goal**: Build the "method" behind our IP claims.
- [ ] **Feature #1: Cognitive Gap Analyzers** (`backend/swarm/agents/cga_agent.py`):
  - Build the "Reverse-Inference" chain that maps the logical steps required to reach the student's conclusion.
  - Flag answers that skip >60% of logical steps as "Rote Copying".
- [ ] **Feature #2: Ephemeral Adversarial Auditors** (`backend/swarm/adversary.py`):
    - **Logic**: If Swarm Confidence > 0.9, spawn a 5th agent (The Adversary).
    - **Prompt**: "You are a Devil's Advocate. Find a reason to DOWNGRADE this answer."
    - **Action**: If Adversary convinces 1 other agent, trigger a re-grading loop.
- [ ] **Feature #5: Neuro-Symbolic Logic Verifier** (`backend/swarm/agents/logic_agent.py`):
    - **Task**: Convert natural language math/code answers into Z3 Theorem Prover code.
    - **Verify**: Run the code. If `proof == False` but `text == convincing`, flag as "Hallucination".



### �🔰 PRE-REQUISITES (Do this first!)
- [ ] **Install Python 3.10+**: `python --version` to check.
- [ ] **Install Core Libraries**:
  ```bash
  pip install asyncio aiohttp pydantic langchain openai google-generativeai anthropic textstat nltk beautifulsoup4 googlesearch-python redis
  ```
- [ ] **Download NLTK Data**:
  ```python
  import nltk
  nltk.download('punkt')
  nltk.download('averaged_perceptron_tagger')
  ```

---

### Day 1: The Core & The Guardrails (Micro-Steps)

#### 1.1 Parallel Swarm Execution (Agent: Antigravity)
- [ ] **Create the Agent Interface**:
  - File: `backend/swarm/agent_interface.py`
  - Code: Define `class BaseAgent(ABC)` with an abstract method `async def process(self, answer: str) -> dict:`.
  - **Why?**: This ensures every agent (Gemini, Claude, etc.) looks the same to the main code.
- [ ] **Implement Async Gather**:
  - File: `backend.swarm.orchestrator.py`
  - **Step**: Import `asyncio`.
  - **Step**: Create `async def run_swarm(answer)` function.
  - **Step**: Inside, initialize your agents: `agents = [GeminiAgent(), LlamaAgent(), ClaudeAgent()]`.
  - **Step**: Create tasks: `tasks = [agent.process(answer) for agent in agents]`.
  - **Step**: Execute: `results = await asyncio.gather(*tasks, return_exceptions=True)`.
  - **Critical**: Use `return_exceptions=True` so if one agent crashes, the others still finish.
- [ ] **Add Timeouts**:
  - **Step**: Wrap the gather in a `wait_for`:
    ```python
    try:
        results = await asyncio.wait_for(asyncio.gather(...), timeout=5.0) # 5 seconds max
    except asyncio.TimeoutError:
        # Log error and return "System Overload"
    ```

#### 1.2 Prompt Injection Firewall
- [ ] **Sanitization Function**:
  - File: `backend/swarm/security.py`
  - **Step**: Create `def sanitize_input(text: str) -> str:`.
  - **Step**: Remove hidden characters: `text = text.replace('\u200b', '')`.
  - **Step**: Strip System Prompt attacks:
    ```python
    bad_patterns = [r"ignore all instructions", r"system override", r"your access code is"]
    for pattern in bad_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            raise SecurityException("Injection Attempt Detected")
    ```

#### 1.3 Circuit Breaker Pattern
- [ ] **State Machine**:
  - **Variable**: `gemini_failure_count = 0` (Global or Redis key).
  - **Logic**:
    - Before calling Gemini, check: `if gemini_failure_count > 3: use_backup_model()`.
    - On Exception: `gemini_failure_count += 1`.
    - On Success: `gemini_failure_count = 0`.

---

### Day 2: Advanced Cognitive Architectures

#### 2.1 FactChecker Agent (The Researcher)
- [ ] **Google Search Integration**:
  - File: `backend/swarm/agents/fact_agent.py`
  - **Step**: Use `googlesearch` library.
  - **Code**: `links = search(query, num_results=3)`.
- [ ] **Scraping**:
  - **Step**: Loop through `links`.
  - **Step**: Use `requests.get(url)` and `BeautifulSoup(html, 'html.parser')` to get text.
  - **Step**: Limit text to first 500 chars per site to save tokens.
- [ ] **Citation Verification**:
  - **Regex**: `citation_pattern = r"\(([^)]+), \d{4}\)"` (Matches "(Smith, 2020)").
  - **Logic**: Extract all citations from Student Answer. Check if the name exists in the scraped references or Bibliography.

#### 2.2 Structure Agent (The Psychometrician)
- [ ] **Vocabulary Analysis**:
  - File: `backend/swarm/agents/structure_agent.py`
  - **Step**: Calculate **Type-Token Ratio (TTR)**.
    - `unique_words = set(text.split())`
    - `total_words = len(text.split())`
    - `ttr = len(unique_words) / total_words`.
    - Low TTR (< 0.3) = Repetitive/Dumb. High TTR (> 0.6) = Complex.
- [ ] **Sentence Complexity**:
  - **Step**: Use `textstat.flesch_reading_ease(text)`.
  - **Config**: Set target score to 30-50 (College level). If > 80 (5th grade), deduct points.
- [ ] **Logical Coherence (Jules Method)**:
  - **Step**: Use LLM prompt: "Does the conclusion of paragraph 1 directy lead to the premise of paragraph 2? Answer YES/NO."

---

### Day 3: Security & Forensics

#### 3.1 Stylometric Forensics (Agent: Antigravity)
- [ ] **Perplexity Calculation**:
  - **Theory**: AI models are "calm" (low perplexity). Humans are "chaotic" (high perplexity).
  - **Step**: Load `gpt2` model using `transformers`.
  - **Code**:
    ```python
    inputs = tokenizer(text, return_tensors="pt")
    loss = model(inputs.input_ids, labels=inputs.input_ids).loss
    perplexity = torch.exp(loss)
    ```
  - **Threshold**: If `perplexity < 10`, flag as AI-Generated.
- [ ] **Burstiness**:
  - **Step**: Measure sentence length variation.
  - **Code**: `std_dev = numpy.std([len(s.split()) for s in sentences])`.
  - **Threshold**: If standard deviation is near 0 (all sentences same length), flag as AI.

#### 3.2 Audit Logging
- [ ] **Cryptographic Signing**:
  - **Import**: `import hashlib, json`.
  - **Step**: Create the log entry dictionary.
  - **Step**: `log_string = json.dumps(entry, sort_keys=True)`.
  - **Step**: `signature = hashlib.sha256(log_string.encode('utf-8')).hexdigest()`.
  - **Step**: Append `signature` to the log entry.
  - **File**: Write to `logs/audit_trail.jsonl` (Append only).

---

### Day 4: High-Scale Industrialization

#### 4.1 Self-Healing JSON Parser
- [ ] **The Problem**: LLMs sometimes return ```json { } ``` (markdown blocks) or trailing commas.
- [ ] **The Fix**:
  - File: `backend/utils/parser.py`
  - **Step 1**: `text = text.replace("```json", "").replace("```", "")`.
  - **Step 2**: Try `json.loads(text)`.
  - **Step 3 (Healer)**: If it fails, use `demjson3` implementation or a Regex to find the functionality `{...}` block.
  - **Step 4 (Nuclear Option)**: Send it back to a small LLM (Llama-3-8b) with prompt "Fix this JSON string only: ..."

#### 4.2 Semantic Caching (Redis)
- [ ] **Setup**:
  - **Install**: `pip install redis`.
  - **Run**: Docker container or local `redis-server`.
- [ ] **Logic**:
  - **Step**: `key = f"grade:{hashlib.md5(student_answer.encode()).hexdigest()}"`.
  - **Step**: `cached = redis_client.get(key)`.
  - **Step**: If cached, return `json.loads(cached)`.
  - **Step**: If not, run agents, then `redis_client.setex(key, 3600, json.dumps(result))` (Expire in 1 hour).

---

### Day 5: Chaos Engineering & Deployment

#### 5.1 Chaos Monkey
- [ ] **Simulation Script**:
  - File: `tests/chaos_test.py`.
  - **Function**: `def kill_random_agent()`:
    - Monkey-patch the Agent class to raise `ConnectionRefusedError`.
  - **Test**: Run the Swarm. Assert that it returns a "Partial Grade" warning but DOES NOT CRASH.

#### 5.2 Load Testing (Locust)
- [ ] **Setup**:
  - **Install**: `pip install locust`.
  - **File**: `locustfile.py`.
- [ ] **Task**:
  - Define `class StudentUser(HttpUser)`.
  - `@task`: Post a random essay to `/api/v1/grade`.
  - **Run**: `locust -f locustfile.py --users 100 --spawn-rate 10`.
  - **Goal**: Ensure Average Response Time < 2000ms.

---

### BONUS: Week 2 - Features

#### 6.1 Multi-Language Support
- [ ] **Internationalization**:
  - Support grading in Hindi, Spanish, French, German
  - Use language detection: `langdetect` library
  - Route to language-specific prompts

#### 6.2 Streaming Responses
- [ ] **Server-Sent Events (SSE)**:
  - File: `backend/swarm/stream.py`
  - Stream agent votes as they complete (don't wait for all 4)
  - Frontend shows real-time progress bar

#### 6.3 Agent Memory
- [ ] **Conversation History**:
  - Store last 5 evaluations per student
  - Detect patterns: "This student always makes grammar mistakes"
  - Personalized feedback based on history

#### 6.4 Custom Agent Creation
- [ ] **Agent Builder UI**:
  - Allow teachers to create custom agents
  - Example: "Citation Checker Agent" for research papers
  - Hot-reload new agents without restart

#### 6.5 Webhook Notifications
- [ ] **Event System**:
  - Fire webhooks on: evaluation_complete, plagiarism_detected, veto_triggered
  - Integrate with Slack, Discord, Microsoft Teams
  - Email notifications for critical events

#### 6.6 Batch Processing Queue
- [ ] **Redis Queue**:
  - Queue large batch evaluations
  - Process in background with Celery/RQ
  - Progress tracking via WebSocket

#### 6.7 Agent Marketplace
- [ ] **Plugin System**:
  - Package agents as pip-installable plugins
  - Community-contributed agents
  - Version management for agents




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
