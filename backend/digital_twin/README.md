# Digital Twin Engine - Jatin's Domain

## Owner: Jatin (Digital Twin Architect)
## Branch: `feat/jatin-twin`

---

## Overview

The **Digital Twin Engine** creates a virtual replica of each teacher's grading personality. Using Vector RAG (Retrieval Augmented Generation), it stores and retrieves teacher-specific preferences, pet peeves, and past feedback examples to generate personalized grades and feedback.

---

## Files Under Your Ownership

| File | Purpose | Priority |
|------|---------|----------|
| `personality_loader.py` | Load teacher personas from ChromaDB | HIGH |
| `decision_maker.py` | Synthesize grades with teacher bias | HIGH |
| `__init__.py` | Module exports | LOW |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Digital Twin Engine                          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   ChromaDB    │    │  Teacher      │    │   Few-Shot    │
│   Vector DB   │    │  Style Vector │    │   Examples    │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼
                   ┌───────────────────┐
                   │  TeacherPersona   │
                   │  - grading_bias   │
                   │  - pet_peeves     │
                   │  - style_vector   │
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │  Decision Maker   │
                   │  (Weighted Score) │
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │  FinalEvaluation  │
                   │  + Teacher-Style  │
                   │    Feedback       │
                   └───────────────────┘
```

---

## MASSIVE TODO LIST



### ⚡ AGENTIC ACCELERATION ENABLED
**Timeline Compressed via Antigravity, Jules, & OpenAI O1.**
**Target:** Enterprise Grade | **Speed:** Extreme

### Day 1: The Soul of the Machine
- [ ] **TODO Jatin (Agent: Antigravity)**: **Psychometric Profiling Pipeline**.
  - **Objective**: Don't just act like the teacher; *become* the teacher.
  - **Step 1 (Ingestion)**: Load teacher's past 100 emails and feedback comments.
  - **Step 2 (Analysis)**: Use a library like `scikit-learn` or `textblob` to calculate sentiment polarity.
  - **Step 3 (Trait Mapping)**: Map these sentiments to the Big Five Personality Traits (Openness, Conscientiousness, etc.) using a zero-shot classifier model.
  - **Step 4 (Storage)**: Store this as a vector in `ChromaDB` using the HNSW index for ultra-fast <10ms retrieval.

- [ ] **TODO Jatin (Agent: O1)**: **Bias Mitigation Engine**.
  - **Objective**: Ensure FAIR grading.
  - **Step 1 (Counterfactuals)**: Create a test function `detect_bias(answer)`.
  - **Step 2**: Automatically replace names like "John" with "Priya" or "Keisha" in the student answer.
  - **Step 3**: Grade both versions. If the score differs by > 5%, raise a **CRITICAL BIAS ALERT** and freeze the marking. 
  - **Step 4**: Log this deviation for auditing.

### Day 2: Advanced mimicry
- [ ] **TODO Jatin (Agent: Jules)**: **Pet Peeve Amplifier**.
  - **Objective**: Capture the teacher's specific annoyances.
  - **Step 1 (Extraction)**: Use an LLM to extract "Negative Sentiment Constraints" from the teacher's past grading logs (e.g., "Always forgets citations").
  - **Step 2 (Injection)**: Inject these as System Instructions: "You are Professor X. You HATE passive voice. If found, react aggressively."
  - **Step 3**: When generating feedback, use specific idioms the teacher uses (e.g., "This is sloppy!" vs "Please revise.").

- [ ] **TODO Jatin (Agent: Claude Code)**: **Few-Shot Hyper-Personalization**.
  - **Objective**: Grade based on precedent.
  - **Step 1 (Retrieval)**: When grading a new paper, search `ChromaDB` for the "Nearest Neighbor" past papers.
  - **Step 2**: Find 3 "A" Grade papers and 3 "F" Grade papers effectively "teaching" the model the standard.
  - **Step 3**: Pass these 6 examples into the LLM context window ("Here is what an A looks like...").
  - **Step 4 (Style Transfer)**: Use `LoRA` (Low-Rank Adaptation) adapters if possible to switch between different teacher "Fine-tunes" instantly.

### Day 3: The Decision Matrix
- [ ] **TODO Jatin**: **Chain of Verification (CoV)**.
  - **Objective**: Stop the AI from being confidently wrong.
  - **Step 1**: Initial Grade.
  - **Step 2**: Challenge Step. Ask the model: "List 3 reasons why your grade might be too high."
  - **Step 3**: Verify Step. Check those reasons against the text.
  - **Step 4**: Final Decision. Adjust the score based on the verification. This loop prevents hallucinations.

- [ ] **TODO Jatin**: **Veto Power with Legal Audit**.
  - **Objective**: Explainability is key for lawsuits.
  - **Step 1**: If the Digital Twin overrides the Swarm (e.g., Swarm says 90, Twin says 50), trigger a mandatory log.
  - **Step 2**: Generate a PDF report using `reportlab`.
  - **Step 3**: Content: "I overrode the score because the student violated the specific 'No Wikipedia Sources' pet peeve, which acts as a veto condition."
  - **Step 4**: Save this PDF to `r:/llm-evaluator/audits/`.

### Day 4: Enterprise Scale & Privacy
- [ ] **TODO Jatin**: **Federated Learning Support**.
  - **Objective**: Learn from teacher behavior without stealing their data.
  - **Step 1**: Train the style adapter LOCALLY on the teacher's laptop.
  - **Step 2**: Send *only* the weight updates (gradients) to the central server, not the student emails/essays.
  - **Step 3 (Privacy)**: Add "Differential Privacy" noise (random jitter) to the weights so no individual student data can be reverse-engineered.

- [ ] **TODO Jatin**: **Multi-Tenant Teacher Isolation**.
  - **Objective**: Strict data separation.
  - **Step 1**: Create separate `ChromaDB` collections for `teacher_physics_101` and `teacher_history_202`.
  - **Step 2**: Ensure the API requires a specific `teacher_api_key` to access that collection.
  - **Step 3**: Write a test case that tries to access History data with a Physics key and assert it FAILS with `403 Forbidden`.

### Day 5: Validation & Deployment
- [ ] **TODO Jatin**: **Turing Test for Grades**.
  - **Objective**: Prove it works.
  - **Step 1**: Prepare a dataset of 100 papers. 
  - **Step 2**: Have the real teacher grade 50. Have the AI grade 50.
  - **Step 3**: Mix them up. Ask the teacher to identify which ones they graded.
  - **Scoring**: If they get it right ~50% of the time (random guessing), we have successfully cloned them.

- [ ] **TODO Jatin**: **Feedback Loop Automation**.
  - **Objective**: The model gets smarter every day.
  - **Step 1**: Build a UI button "Correct this Grade".
  - **Step 2**: When clicked, capture the *Teacher's Correction*.
  - **Step 3**: Immediately run `chromadb.upsert()` to add this new data point to the vector store.
  - **Step 4**: The very next grading run will use this new "lesson".



---

## Data Models

### TeacherPersona

```python
@dataclass
class TeacherPersona:
    teacher_id: str
    name: str
    subject: str
    style_vector: list[float]  # 128-dim embedding
    grading_bias: dict  # Agent weights
    pet_peeves: list[str]  # Things teacher hates
    past_feedback_examples: list[str]  # Few-shot examples
    preferred_tone: str  # professional, friendly, strict
    strictness_level: float  # 0.0 - 1.0
```

### FinalEvaluation

```python
@dataclass
class FinalEvaluation:
    final_grade: float  # 0-100
    letter_grade: str  # A-F
    teacher_feedback: str  # Personalized feedback
    agent_votes: list  # Individual agent scores
    consensus_method: str  # weighted_average or veto
    plagiarism_flag: bool
    ai_generated_flag: bool
```

---

## ChromaDB Schema

```python
# Collection: teacher_personas
{
    "id": "teacher_001",
    "embedding": [0.1, 0.2, ...],  # 128-dim style vector
    "metadata": {
        "name": "Dr. Smith",
        "subject": "Physics",
        "strictness": 0.8,
        "pet_peeves": ["passive voice", "missing units"],
        "tone": "professional"
    },
    "document": "Dr. Smith is a strict but fair physics professor..."
}
```

---

## Testing Commands

```bash
# Run digital twin tests
pytest tests/test_digital_twin.py -v

# Run with coverage
pytest tests/test_digital_twin.py -v --cov=backend/digital_twin

# Test ChromaDB integration
pytest tests/test_digital_twin.py -v -m chromadb
```

---

## Dependencies

- `chromadb` - Vector database
- `sentence-transformers` - Text embeddings
- `langchain` - LLM orchestration
- `pydantic` - Data validation

---

## Contact

For questions about the Digital Twin Engine, contact **Jatin** or create an issue with the label `digital-twin`.
