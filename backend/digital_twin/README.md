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

### 🔰 PRE-REQUISITES (Do this first!)
- [ ] **Install Python 3.10+**: `python --version` to check.
- [ ] **Install Core Libraries**:
  ```bash
  pip install chromadb sentence-transformers textblob scikit-learn numpy pydantic reportlab openai
  ```
- [ ] **Download Models**:
  ```python
  from sentence_transformers import SentenceTransformer
  model = SentenceTransformer('all-MiniLM-L6-v2') # Download once
  ```

---

### Day 1: The Soul of the Machine (Micro-Steps)

#### 1.1 Psychometric Profiling Ingestor (Agent: Antigravity)
- [ ] **Data Loader**:
  - File: `backend/digital_twin/ingestion.py`
  - **Step**: Create `def load_teacher_data(folder_path):`.
  - **Step**: Use `glob` to read all `.txt` files in `data/teachers/phys_101/`. 
  - **Step**: Clean text: `text.replace('\n', ' ')`.
- [ ] **Sentiment Analysis (Big Five Proxy)**:
  - **Library**: `TextBlob` or `VADER`.
  - **Code**:
    ```python
    from textblob import TextBlob
    polarity = TextBlob(teacher_text).sentiment.polarity
    # Mapping: High Polarity (Positive) -> High "Agreeableness"
    # Low Polarity (Critical) -> Low "Agreeableness" (Strict Grader)
    ```
- [ ] **Vector Storage (ChromaDB)**:
  - **Step**: Initialize DB. `client = chromadb.PersistentClient(path="./chroma_db")`.
  - **Step**: Create Collection. `collection = client.get_or_create_collection("teacher_personas")`.
  - **Step**: Embedding. The `sentence-transformers` library converts "I hate late submissions" into `[0.1, 0.5, -0.9...]`.
  - **Step**: Upsert. `collection.add(documents=[text], metadatas=[{"trait": "strictness"}], ids=["rule_1"])`.

#### 1.2 Bias Mitigation Engine
- [ ] **Counterfactual Generator**:
  - File: `backend/digital_twin/bias_check.py`
  - **Step**: Create a function that takes a Student Answer.
  - **Step**: Use simple string replace:
    ```python
    def generate_variants(text):
        variants = []
        variants.append(text.replace("He", "She").replace("him", "her")) # Gender Swap
        variants.append(text.replace("John", "Mohammed")) # Cultural Swap
        return variants
    ```
- [ ] **Variance Test**:
  - **Step**: Run the grading loop on ALL variants.
  - **Step**: `assert max(scores) - min(scores) < 5`. If the score gap is > 5 points just because of the name, raise `BiasException`.

---

### Day 2: Advanced Mimicry

#### 2.1 Pet Peeve Amplifier (Agent: Jules)
- [ ] **Constraint Extraction**:
  - **Prompt**: Send teacher history to LLM.
    - "Extract every phrase where the teacher uses angry or capital words. Format as JSON list."
    - Output: `["passive voice", "wikipedia citations", "run-on sentences"]`.
- [ ] **System Prompt Injection**:
  - File: `backend/digital_twin/prompts.py`.
  - **Code**:
    ```python
    system_prompt = f"""
    You are Professor Snape.
    Your Pet Peeves are: {', '.join(pet_peeves)}.
    If you see these, deduct 10 points and write a SARCASTIC comment.
    """
    ```

#### 2.2 Few-Shot Hyper-Personalization
- [ ] **Retrieval Logic**:
  - **Step**: When grading a new paper, embed it: `query_vec = model.encode(new_paper)`.
  - **Step**: Query Chroma: `results = collection.query(query_embeddings=query_vec, n_results=3)`.
  - **Step**: Determine grade provided in those results.
- [ ] **Context Window Stuffing**:
  - **Step**: Construct the refined prompt.
    ```text
    Here is a past paper that got an A: [INSERT_RETRIEVED_TEXT_1]
    Here is a past paper that got an F: [INSERT_RETRIEVED_TEXT_2]
    Now grade this new paper by comparing it to the above.
    ```

---

### Day 3: The Decision Matrix

#### 3.1 Chain of Verification (CoV)
- [ ] **Self-Reflection Loop**:
  - File: `backend/digital_twin/logic.py`
  - **Step 1**: `draft_grade = llm.predict(answer)`.
  - **Step 2**: `critique = llm.predict(f"Attack this grade: {draft_grade}. Is it fair?")`.
  - **Step 3**: `final_grade = llm.predict(f"Refine the grade based on this critique: {critique}")`.
  - **Why?**: This prevents "Hallucinated Generosity".

#### 3.2 Veto & Explainability
- [ ] **PDF Generator**:
  - **Library**: `reportlab`.
  - **Step**: Create `def generate_audit_report(student_id, reasoning):`.
  - **Step**: `c = canvas.Canvas(f"audits/{student_id}.pdf")`.
  - **Step**: `c.drawString(100, 750, f"VETO REASON: {reasoning}")`.
  - **Step**: `c.save()`.

---

### Day 4: Enterprise Scale & Privacy

#### 4.1 Federated Learning (Simulation)
- [ ] **Local Training Loop**:
  - **Concept**: We pretend the model trains on the teacher's laptop.
  - **Step**: Use `peft` (Parameter-Efficient Fine-Tuning) library if you have a GPU, otherwise mock this.
  - **Mock Step**: "Training... Loss: 0.5... Loss: 0.1... Done." (For the demo).
  - **Real Step (Optional)**: Calculate gradients on valid data and save the `adapter_model.bin` file.

#### 4.2 Multi-Tenant Isolation
- [ ] **API Key Middleware**:
  - File: `backend/main.py` (FastAPI).
  - **Step**:
    ```python
    async def verify_teacher(x_api_key: str = Header(...)):
        user = db.get(x_api_key)
        if not user: raise HTTPException(403)
        return user_collection_name
    ```
  - **Test**: Try accessing `Physics_DB` with `History_Key`. It must fail.

---

### Day 5: Validation & Deployment

#### 5.1 Turing Test Interface
- [ ] **Blind Test UI**:
  - File: `frontend/turing.html`.
  - **Step**: simple HTML page with two text boxes.
    - Left: "AI Feedback". Right: "Human Feedback".
    - Buttons: "Which one is Human?"
  - **Metric**: If the teacher clicks "AI" thinking it's Human > 50% of the time, WE WIN.

#### 5.2 Feedback Loop
- [ ] **Active Learning Endpoint**:
  - **Endpoint**: `POST /api/v1/correction`.
  - **Payload**: `{"question_id": 123, "ai_grade": 70, "teacher_corrected_grade": 90}`.
  - **Action**: Immediately re-embed this answer with the metadata `{"grade": 90}` so the nearest neighbor search finds it next time.

---

### BONUS: Week 2 - Enterprise Features

#### 6.1 Teacher Cloning
- [ ] **Style Transfer**:
  - Clone one teacher's style to another
  - "Grade like Professor Smith but with Dr. Jones' strictness"
  - Interpolate between multiple teacher personas

#### 6.2 Voice Persona
- [ ] **Text-to-Speech Feedback**:
  - Generate audio feedback in teacher's voice
  - Use ElevenLabs or Azure TTS
  - Personalized pronunciation preferences

#### 6.3 Emotional Intelligence
- [ ] **Student Sentiment Detection**:
  - Detect frustration/confusion in answers
  - Adjust feedback tone accordingly
  - Empathetic responses for struggling students

#### 6.4 Learning Analytics
- [ ] **Student Progress Tracking**:
  - Track improvement over time
  - Identify weak areas per student
  - Generate personalized study recommendations

#### 6.5 Multi-Modal Grading
- [ ] **Image/Diagram Support**:
  - Grade hand-drawn diagrams
  - OCR for handwritten answers
  - Math equation recognition (LaTeX)

#### 6.6 Peer Comparison
- [ ] **Class Ranking**:
  - Anonymous peer comparison
  - "Your answer is better than 75% of the class"
  - Identify exemplar answers for sharing

#### 6.7 Teacher Dashboard
- [ ] **Analytics UI**:
  - Grading time saved metrics
  - Student performance heatmaps
  - Pet peeve trigger frequency charts

#### 6.8 API for LMS Integration
- [ ] **Canvas/Moodle Integration**:
  - Direct grade sync to LMS
  - Assignment import
  - Rubric mapping




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
