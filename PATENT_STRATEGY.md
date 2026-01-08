# Patent Strategy: SmartEvaluator-Omni

## Overview
This document outlines the claim structure for the 5 unique features added to the SmartEvaluator-Omni system. These features rely on specific "Methods" and "Systems" that are high-value targets for patent protection in the EdTech/AI space.

---

## 1. Cognitive Gap Analysis (CGA)
**Draft Claim Title**: *Method and System for Detecting Academic Dishonesty via Reverse-Inference of Cognitive Intermediate Steps.*

**Technical Novelty**:
- Unlike probabilistic detectors (calculating perplexity), this system uses a **Reverse-Inference Engine**.
- It creates a directed acyclic graph (DAG) of the logical steps required to move from the Question (Q) to the Answer (A).
- It measures the "Edit Distance" or "Logical Leaps" in the student's submission against this generated DAG.
- **Key Metric**: The "Cognitive Continuity Score".

**Backend Implementation**:
- `backend/cga/inference_engine.py`: Generates the "Ideal Logical Path".
- `backend/cga/gap_detector.py`: Compares student path vs. ideal path.

---

## 2. Ephemeral Adversarial Auditors (EAA)
**Draft Claim Title**: *System for Enhancing Multi-Agent Consensus Accuracy via Ephemeral Adversarial Instantiation.*

**Technical Novelty**:
- Most swarm systems aim for convergence. This system **intentionally disrupts convergence** to test robustness.
- The use of *ephemeral* (temporary, stateless) agents that are strictly "Devils Advocates".
- The recursive voting mechanism where the consensus is only valid if it survives the adversarial attack.

**Backend Implementation**:
- `backend/swarm/adversary.py`: The "Breaker" agent class.
- `backend/swarm/orchestrator.py`: Logic to trigger adversary only when confidence > 0.9.

---

## 3. Tri-Vector Contextual Alignment (TVCA)
**Draft Claim Title**: *Method for Evaluating Domain-Specific Knowledge Adherence using Tri-Partite Vector Space Alignment.*

**Technical Novelty**:
- Quantifies "Syllabus Adherence" mathematically.
- Uses 3 separate vector indices (Course Material, World Knowledge, Student Input).
- Calculates the angle $\theta$ between Student Vector and Course Vector relative to World Vector.
- $\text{Score} = \cos(\vec{S}, \vec{C}) - \alpha \cdot \cos(\vec{S}, \vec{W})$

**Backend Implementation**:
- `backend/vectors/triangulation.py`: Calculates cosine similarity ratios.
- `backend/vectors/indexes.py`: Manages the 3 separate ChromaDB collections.

---

## 4. Temporal Biophysical Mimicry
**Draft Claim Title**: *Method for Simulating Human Cognitive Latency in Automated Text Generation Systems.*

**Technical Novelty**:
- Maps "Text Complexity" (Flesch-Kincaid) to "Time Consumption" (milliseconds).
- Injects "Micro-Pauses" during the generation stream to mimic human typing/thinking.
- Not just random delays, but *content-aware* delays.

**Backend Implementation**:
- `backend/digital_twin/latency_scheduler.py`: Calculates `wait_time = f(complexity, length)`.

---

## 5. Neuro-Symbolic Logic Verifier (NSLV)
**Draft Claim Title**: *Hybrid Neuro-Symbolic System for Deterministic Validation of Natural Language Assertions.*

**Technical Novelty**:
- The "Transpiler" pipeline: Natural Language -> Intermediate Representation (IR) -> Symbolic Logic -> Execution -> Boolean Result.
- Decouples "Understanding" (Neural) from "Verifying" (Symbolic).

**Backend Implementation**:
- `backend/logic/transpiler.py`: Uses fine-tuned models to convert text to Z3/Python.
- `backend/logic/executor.py`: Sandboxed execution environment.

---

## Action Plan for Patent Filing
1. **Prior Art Search**: Verify "Adversarial Consensus in Education" (Done - clean).
2. **Provisional Filing**: File these 5 methods as a single "Omni-Assessment Architecture" patent.
3. **Implementation**: Build the "Proof of Concept" backends for the features above.
