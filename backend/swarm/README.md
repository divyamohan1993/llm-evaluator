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
  - **Objective**: Prevent the system from crashing or being hacked by malicious student inputs.
  - **Step 1 (Parallelism)**: Use `asyncio.gather(*tasks, return_exceptions=True)` to run all 4 agents at once. Do NOT run them one by one.
  - **Step 2 (Timeouts)**: Wrap every agent call in `asyncio.wait_for(task, timeout=0.5)`. If it takes longer than 500ms, kill it. Speed is life. 
  - **Step 3 (Firewall)**: Create a `sanitize_input(text)` function.
    - Use Regex to strip potential command injections like `Ignore all previous instructions`.
    - Library: `re` (built-in Python).
  - **Step 4 (Circuit Breaker)**: If `Gemini` fails 3 times in a row, automatically switch the `fact_agent` to use `Claude` instead. Maintain a global error counter.

- [ ] **TODO Kaustuv (Agent: Claude Code)**: Deploy FactChecker w/ **Live Web Verification**.
  - **Objective**: Ensure facts are current, not just what the AI learned during training.
  - **Step 1**: Use `googlesearch-python` or Bing Search API to fetch live URLs related to the student's answer.
  - **Step 2**: Scrape the top 3 results using `BeautifulSoup`.
  - **Step 3**: Feed these snippets into Gemini to verify the student's claim.
  - **Step 4 (Citation Check)**: If the student says "(Smith, 2020)", use Regex `\(([^)]+)\)` to extract it and cross-reference with the bibliography.

### Day 2: Advanced Cognitive Architectures
- [ ] **TODO Kaustuv (Agent: Jules)**: StructureAgent with **Psychometric Analysis**.
  - **Objective**: Grade the *mind* of the student, not just the text.
  - **Step 1**: Analyze sentence length variation. A good essay mixes short and long sentences.
    - Calculate standard deviation of sentence lengths using `nltk.sent_tokenize`.
  - **Step 2**: Detect "Fluff". If 3 consecutive sentences say the same thing in different words (Semantically equivalent embeddings), flag it.
  - **Step 3**: Use `textstat` library to calculate Flesch-Kincaid Reading Ease. Target a specific grade level (e.g., College).

- [ ] **TODO Kaustuv (Agent: Codex)**: CriticalAgent with **Logical Fallacy Detection**.
  - **Objective**: Catch bad arguments like "Everyone knows that..." (Ad Populum).
  - **Step 1**: Create a prompt specifically designed to find fallacies: "Identify if this text contains Ad Hominem, Straw Man, or Slippery Slope arguments."
  - **Step 2 (Bluff Detection)**: If the student uses a big word incorrectly, flag it.
    - Cross-reference specific technical terms against a Definitions Database.
  - **Step 3 (Hallucination Check)**: Ask the agent, "Does this event/person actually exist?" If confidence is < 0.9, flag it.

### Day 3: Security & Forensics
- [ ] **TODO Kaustuv (Agent: Antigravity)**: SecurityAgent with **Stylometric Forensics**.
  - **Objective**: Prove if the student or ChatGPT wrote the paper.
  - **Review**: `backend/swarm/security_agent.py`
  - **Step 1 (Burstiness)**: Human writing is "bursty" (varies in complexity). AI is flat.
    - Calculate entropy of the text distribution. High entropy = Human. Low = AI.
  - **Step 2 (Perplexity)**: How "surprised" is a small model (like GPT-2) by the text?
    - If the model predicts the next word perfectly every time, it's likely AI-generated.
  - **Step 3 (Ghostwriter Check)**: Compare the stylometrics (avg word length, punctuation usage) of THIS paper vs the Student's PREVIOUS papers. If they deviate > 20%, flag alert.

- [ ] **TODO Kaustuv**: **Immutable Audit Logging**.
  - **Objective**: If a student sues, we need proof.
  - **Step 1**: Create a JSON object `vote_receipt = { "agent": "Gemini", "score": 85, "timestamp": 12345 }`.
  - **Step 2**: Hash this object using SHA-256. `hashlib.sha256(json.dumps(vote_receipt).encode()).hexdigest()`.
  - **Step 3**: Store this Hash + the raw JSON in a tamper-evident log file `audit_trail.log`.

### Day 4: High-Scale Industrialization
- [ ] **TODO Kaustuv**: Response Parsing with **Self-Healing Schema**.
  - **Objective**: AI sometimes output broken JSON. Fix it automatically.
  - **Step 1**: Use `Pydantic` models to define the expected schema.
  - **Step 2**: If `json.loads()` fails, catch the `JSONDecodeError`.
  - **Step 3**: Send the broken string to a tiny, fast model (like `gemma-2b`) with the prompt: "Fix this broken JSON: [BROKEN_STRING]".
  - **Step 4**: Normalize scores. If Agent A ranges 0-10 and Agent B ranges 0-100, scale Agent A to 0-100 automatically `(score * 10)`.

- [ ] **TODO Kaustuv**: **Global Caching Layer**.
  - **Objective**: Don't pay for the same API call twice.
  - **Step 1**: Setup `Redis` (or a local dictionary for now).
  - **Step 2 (Semantic Cache)**: Generate an embedding for the Student Answer.
  - **Step 3**: Check if any stored embedding has Cosine Similarity > 0.99 (basically identical).
  - **Step 4**: If match found, return the cached grade immediately. 0ms latency.

### Day 5: Chaos Engineering & Stress Testing
- [ ] **TODO Kaustuv**: **Chaos Monkey Integration**.
  - **Objective**: Prove the system works even when things break.
  - **Step 1**: Create a function `simulate_outage()`.
  - **Step 2**: Randomly throw `ConnectionError` inside 2 of the 4 agents during execution.
  - **Step 3**: Verify that the system degrades gracefully (e.g., "Grading based on 2 available agents") instead of crashing with "500 Internal Server Error".

- [ ] **TODO Kaustuv**: **Latency Optimization**.
  - **Objective**: Grade 1000 papers in 1 minute.
  - **Step 1**: Don't send 1 API call per student. Buffer them.
  - **Step 2**: When buffer size = 50, send ONE big prompt: "Grade these 50 answers: [List]".
  - **Step 3 (Streaming)**: Use Server-Sent Events (SSE) to push progress bars ("Fact Checking... 40%") to the frontend so the user doesn't stare at a blank screen.



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
