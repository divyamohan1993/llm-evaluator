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
  - Don't just act like the teacher; *become* the teacher.
  - Implement **Big Five Personality Analysis** on teacher's past emails/feedback to derive the 'Openness' and 'Conscientiousness' scalars.
  - **Vector Storage**: Use optimized HNSW in ChromaDB for <10ms retrieval.

- [ ] **TODO Jatin (Agent: O1)**: **Bias Mitigation Engine**.
  - **Critical Enterprise Requirement**: Automatically detect if a teacher's persona is unbiased.
  - Implement counter-factual testing: Grade the same answer with swapped gender pronouns to ensure score stability.

### Day 2: Advanced mimicry
- [ ] **TODO Jatin (Agent: Jules)**: **Pet Peeve Amplifier**.
  - Extract negative sentiments from past feedback with 99% precision.
  - If teacher hates "passive voice", the system must not just deduct points but WRITE a comment using the teacher's specific angry idiom.

- [ ] **TODO Jatin (Agent: Claude Code)**: **Few-Shot Hyper-Personalization**.
  - Retrieve top-3 papers where the teacher gave an 'A' and top-3 where they gave an 'F'.
  - Use these as dynamic anchors for the current grading session.
  - **Style Transfer**: Use LoRA filters to enforce the exact tone (Sarcastic, Nurturing, Dry).

### Day 3: The Decision Matrix
- [ ] **TODO Jatin**: **Chain of Verification (CoV)**.
  - Before finalizing a grade, the Digital Twin must "debate" itself.
  - "I want to give this a B+, but did I miss the lack of citations?" -> **Self-Correction Loop**.

- [ ] **TODO Jatin**: **Veto Power with Legal Audit**.
  - If the Digital Twin overrides the Swarm (e.g., "This answer is correct but sloppy"), log the *exact* reasoning for potential grade appeals.
  - **Explainability API**: Generate a "Why did I grade this way?" PDF for every student.

### Day 4: Enterprise Scale & Privacy
- [ ] **TODO Jatin**: **Federated Learning Support**.
  - Allow models to update on teacher behavior without sending raw student data to the cloud.
  - Implement Differential Privacy noise injection.

- [ ] **TODO Jatin**: **Multi-Tenant Teacher Isolation**.
  - Strict logical separation of vector collections. A Physics teacher's bias must NEVER bleed into a History teacher's clone.

### Day 5: Validation & Deployment
- [ ] **TODO Jatin**: **Turing Test for Grades**.
  - Show 50 real teacher grades and 50 AI grades to the teacher.
  - Acceptance Criteria: Teacher cannot distinguish >60% of them.

- [ ] **TODO Jatin**: **Feedback Loop Automation**.
  - If a teacher edits an AI grade, immediately re-embed that diff and update the vector store. Real-time learning.


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
