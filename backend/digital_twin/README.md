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

### Phase 1: ChromaDB Integration (Week 1-2)

- [ ] **TODO Jatin**: Set up ChromaDB collection for teacher personas
  - Create `teacher_personas` collection
  - Define embedding model (sentence-transformers)
  - Implement persistence to disk
  - Add connection pooling

- [ ] **TODO Jatin**: Implement teacher persona ingestion
  - Create admin API to add new teachers
  - Parse teacher profile documents
  - Extract personality traits automatically
  - Generate style vectors from feedback history

- [ ] **TODO Jatin**: Implement vector similarity search
  - Query similar teachers for new teacher onboarding
  - Find past feedback for similar answers
  - Implement semantic search for pet peeves

### Phase 2: Personality Loader (Week 3-4)

- [ ] **TODO Jatin**: Retrieve the teacher's 'Pet Peeves'
  - Parse pet peeves from teacher profiles
  - Examples: "hates passive voice", "loves citations"
  - Inject pet peeves into system prompt
  - Weight violations in scoring

- [ ] **TODO Jatin**: Implement Few-Shot prompting
  - Retrieve 5 most relevant past feedback examples
  - Use semantic similarity to match answer types
  - Format examples for LLM consumption
  - Track which examples improve accuracy

- [ ] **TODO Jatin**: Build teacher style vector
  - Encode grading preferences as 128-dim vector
  - Store in ChromaDB for retrieval
  - Implement style interpolation for new teachers
  - Add style drift detection

- [ ] **TODO Jatin**: Implement caching layer
  - Cache persona lookups (TTL: 1 hour)
  - Invalidate on teacher profile update
  - Add cache warming on startup

### Phase 3: Decision Maker (Week 5-6)

- [ ] **TODO Jatin**: Apply teacher personality weights
  - Map teacher preferences to agent weights
  - Example: "fact-focused" = fact_agent: 0.5
  - Implement dynamic weight adjustment
  - Log weight distributions for analysis

- [ ] **TODO Jatin**: Implement veto handling
  - Check security agent for plagiarism flag
  - Override final score to 0 if flagged
  - Generate appropriate feedback message
  - Log veto events for review

- [ ] **TODO Jatin**: Generate teacher-style feedback
  - Use LLM to rewrite feedback in teacher's voice
  - Apply tone preferences (harsh, encouraging, neutral)
  - Inject pet peeves into feedback
  - Personalize with teacher's common phrases

- [ ] **TODO Jatin**: Implement grade calibration
  - Adjust scores based on teacher's historical average
  - Detect and correct grade inflation/deflation
  - Maintain consistent grading standards

### Phase 4: Admin Dashboard (Week 7-8)

- [ ] **TODO Jatin**: Create teacher profile management API
  - CRUD operations for teacher profiles
  - Bulk import from CSV/Excel
  - Profile validation and sanitization
  - Version history for profiles

- [ ] **TODO Jatin**: Build feedback learning loop
  - Collect teacher corrections to AI grades
  - Use corrections to refine personality model
  - Implement active learning strategy
  - Track improvement metrics

- [ ] **TODO Jatin**: Add teacher analytics
  - Grading distribution charts
  - Pet peeve trigger frequency
  - Style consistency score
  - Student satisfaction correlation

### Phase 5: Advanced Features (Week 9-10)

- [ ] **TODO Jatin**: Implement multi-teacher consensus
  - Support courses with multiple TAs
  - Blend multiple teacher personas
  - Handle conflicting preferences
  - Generate unified feedback

- [ ] **TODO Jatin**: Add subject-specific adaptations
  - Different rubrics for STEM vs Humanities
  - Subject-specific vocabulary requirements
  - Citation style enforcement (APA, MLA, Chicago)

- [ ] **TODO Jatin**: Implement personality transfer
  - Allow teachers to "fork" other teacher's styles
  - Suggest personality improvements
  - A/B test different personality settings

### Phase 6: Testing & Validation (Week 11-12)

- [ ] **TODO Jatin**: Create teacher persona test fixtures
  - 10 diverse teacher personas for testing
  - Cover different subjects and styles
  - Include edge cases (very strict, very lenient)

- [ ] **TODO Jatin**: Add personality accuracy tests
  - Compare generated feedback to actual teacher feedback
  - Measure style similarity score
  - Track regression in personality matching

- [ ] **TODO Jatin**: Implement human evaluation pipeline
  - Collect teacher ratings of generated feedback
  - Build annotation interface
  - Calculate inter-rater reliability

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
