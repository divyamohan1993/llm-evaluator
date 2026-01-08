
### WEEK 3: PATENTABLE TECHNOLOGIES (Priority: EXTENSIVE RESEARCH)
These tasks implement the "Patent-Pending" features documented in FEATURES.md.

#### 3.1 Cognitive Gap Analysis (CGA)
- [ ] **Implement Reverse-Inference Engine** (`backend/cga/inference_engine.py`)
  - Use `text-davinci-003` or similar but modern models to generate "required logical steps" for a Question.
  - Implement heuristic matching to check if Student Answer contains these steps.
- [ ] **Gap Scoring Logic**
  - Define threshold for "suspicious gap" (e.g., > 60% missing steps).

#### 3.2 Ephemeral Adversarial Auditors (EAA)
- [ ] **Adversary Spawning Logic** (`backend/swarm/orchestrator.py`)
  - Trigger condition: `if consensus_confidence > 0.9`.
  - Prompt: "You are a Devil's Advocate. Find one MAJOR flaw in this answer."
- [ ] **Consensus Re-Voting**
  - If Adversary succeeds, trigger a re-vote with the adversary's argument as context.

#### 3.3 Tri-Vector Contextual Alignment (TVCA)
- [ ] **Vector Indexing** (`backend/vectors/`)
  - Create 3 separate indices: `course_material`, `world_knowledge` (Wikipedia subset), `student_submissions`.
- [ ] **Algorithm Implementation**
  - Implement the formula: `Score = Cos(S, C) - alpha * Cos(S, W)`.

#### 3.4 Temporal Biophysical Mimicry
- [ ] **Latency Scheduler** (`backend/digital_twin/latency.py`)
  - Implement `calculate_reading_time(text, complexity)`.
  - Add `await asyncio.sleep(calculated_time)` in the final response loop.
