# Consensus Configuration - Anshul's Domain

## Owner: Anshul (Consensus Logic Engineer)
## Branch: `feat/anshul-logic`

---

## Overview

The **Consensus Configuration** defines the mathematical weighting logic that determines how 4 AI agents' votes are combined into a final grade. This includes weighted averages, veto power rules, grading modes, and thresholds for plagiarism detection.

---

## Files Under Your Ownership

| File | Purpose | Priority |
|------|---------|----------|
| `consensus_matrix.json` | Weight configurations | HIGH |
| Future: `consensus_engine.py` | Runtime consensus logic | HIGH |
| Future: `veto_rules.py` | Veto power implementation | HIGH |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Agent Votes (Input)                          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│   │ Fact: 85│ │Grammar:78│ │Critical:92│ │Security:100│          │
│   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘               │
└────────┼──────────┼──────────┼──────────┼───────────────────────┘
         │          │          │          │
         ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Consensus Matrix                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  GRADING MODE: "balanced"                                │   │
│   │  ┌──────────────────────────────────────────────────┐   │   │
│   │  │ fact_agent: 0.30 × 85 = 25.5                     │   │   │
│   │  │ structure_agent: 0.25 × 78 = 19.5                │   │   │
│   │  │ critical_agent: 0.25 × 92 = 23.0                 │   │   │
│   │  │ security_agent: 0.20 × 100 = 20.0                │   │   │
│   │  └──────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Veto Check                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ IF security_agent < 30 THEN final_score = 0             │   │
│   │ IF security_agent < 40 THEN flag_for_review             │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Final Grade: 88.0 (B+)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## MASSIVE TODO LIST



### ⚡ AGENTIC ACCELERATION ENABLED
**Timeline Compressed via Antigravity, Jules, & OpenAI Codex.**
**Target:** Enterprise Grade | **Speed:** Extreme

### Day 1: Advanced Mathematics
- [ ] **TODO Anshul (Agent: Antigravity)**: **Game Theoretic Consensus**.
  - **Objective**: Use math to find the "Truth" when agents disagree.
  - **Step 1**: Use `NumPy` to create a matrix of Agent Votes vs Confidence Scores.
  - **Step 2 (Nash Equilibrium)**: If 3 agents agree on 85% and one says 20%, calculate the "Cost of Deviation". If the outlier has low confidence, discard it.
  - **Step 3 (Bayesian Update)**: Keep a running "Trust Score" for each agent. If Agent C (Structure) is consistently overruled by the Human Teacher, lower its weight for next time `(weight * 0.9)`.

- [ ] **TODO Anshul (Agent: Jules)**: **Dynamic Rubric Generation**.
  - **Objective**: Don't use the same ruler to measure a snake and a building.
  - **Step 1**: When a question comes in, run a "Classifier Agent". Is this Math, History, or Creative Writing?
  - **Step 2**: If Creative Writing, generate a Weight Vector: `{ "fact": 0.1, "creativity": 0.8 }`.
  - **Step 3**: If History, generate: `{ "fact": 0.8, "creativity": 0.1 }`.
  - **Step 4**: Apply this dynamic vector to the final score calculation instead of static config values.

### Day 2: The Veto Engine
- [ ] **TODO Anshul**: **Hierarchical Veto Logic**.
  - **Objective**: Some rules are absolute.
  - **Step 1**: Define a Priority Queue of rules.
  - **Step 2**: If `SecurityAgent` returns `plagiarism_detected=True`, this is Priority 0 (Highest). Immediately set `final_score = 0`.
  - **Step 3**: If `FactAgent` returns `wrong_date`, this is Priority 2. Deduct 5 points.
  - **Step 4 (Override Keys)**: Create a cryptographic key generator. The Dean can sign a `JWT` (JSON Web Token) that, when passed in the header, disables the Veto engine for a specific student appeal.

### Day 3: Trust & Verification (Blockchain)
- [ ] **TODO Anshul (Agent: Codex)**: **On-Chain Grade Verification**.
  - **Objective**: Make grades un-hackable.
  - **Step 1**: Calculate `SHA-256` hash of `Student ID + Grade + Timestamp`.
  - **Step 2**: Use `Web3.py` to connect to a public testnet (like Polygon Mumbai or Sepolia).
  - **Step 3**: Publish this hash to a Smart Contract function `publishGradeHash(bytes32 _hash)`.
  - **Step 4**: Give the student a transaction receipt. "Here is proof your grade was 92 on Jan 8th. No one can change it in the DB later."
  - **Step 5 (Privacy)**: Use "Zero-Knowledge Proofs" (Circom/SnarkJS) so a student can prove "I got > 70%" to an employer without revealing they got exactly 71%.

### Day 4: Adaptive Intelligence
- [ ] **TODO Anshul**: **Calibration Loop**.
  - **Objective**: Fairness across different exam difficulties.
  - **Step 1**: Calculate the Class Mean and Standard Deviation using `scipy.stats`.
  - **Step 2**: If Mean < 40% (Exam was too hard), finding the Z-Score.
  - **Step 3**: Automatically apply a "Square Root Curve" `(NewScore = Sqrt(OldScore) * 10)` or a Linear Shift to bring Mean to 75%.
  - **Step 4**: Present this "Suggested Curve" to the professor for one-click approval.

### Day 5: Enterprise Analytics
- [ ] **TODO Anshul**: **Bias Detection Dashboard**.
  - **Objective**: Prove we aren't racist/sexist.
  - **Step 1**: Ingest student metadata (anonymized).
  - **Step 2**: Run a Correlation Analysis (`pandas.corr()`) between "Non-Native English Speaker Status" and "Grammar Score".
  - **Step 3**: If the correlation is strong (> 0.5), alert the administration: "The Grammar Agent is punishing ESL students too harshly."
  - **Step 4**: Generate a PDF Compliance Report using `weasyprint` for the University Accreditation Board.



---

## Configuration Schema

### consensus_matrix.json

```json
{
  "grading_modes": {
    "strict_mode": {
      "fact_agent": 0.50,
      "structure_agent": 0.10,
      "critical_agent": 0.25,
      "security_agent": 0.15
    },
    "balanced_mode": {
      "fact_agent": 0.30,
      "structure_agent": 0.25,
      "critical_agent": 0.25,
      "security_agent": 0.20
    }
  },
  "veto_rules": {
    "plagiarism_veto": {
      "enabled": true,
      "agent": "security_agent",
      "threshold": 0.30,
      "action": "zero_score"
    }
  },
  "thresholds": {
    "passing_grade": 60.0,
    "excellent_grade": 90.0
  }
}
```

---

## Grading Modes Reference

| Mode | Fact | Structure | Critical | Security | Use Case |
|------|------|-----------|----------|----------|----------|
| `strict_mode` | 50% | 10% | 25% | 15% | Exams, factual tests |
| `balanced_mode` | 30% | 25% | 25% | 20% | General assignments |
| `creative_mode` | 20% | 20% | 40% | 20% | Essays, creative work |
| `lenient_mode` | 25% | 40% | 20% | 15% | Participation grades |

---

## Veto Rules Reference

| Rule | Agent | Threshold | Action | Description |
|------|-------|-----------|--------|-------------|
| `plagiarism_veto` | Security | < 30% | Zero Score | Automatic 0 for plagiarism |
| `ai_generated_veto` | Security | < 40% | Flag Review | Manual review required |
| `bluff_veto` | Critical | < 25% | Reduce 50% | Cut score in half |

---

## Testing Commands

```bash
# Run consensus tests
pytest tests/test_consensus.py -v

# Validate configuration
python -c "import json; json.load(open('config/consensus_matrix.json'))"

# Test weight calculations
pytest tests/test_consensus.py -v -k "test_weights"
```

---

## Dependencies

- `json` - Configuration parsing
- `pydantic` - Schema validation
- `numpy` - Mathematical calculations (future)

---

## Contact

For questions about Consensus Logic, contact **Anshul** or create an issue with the label `consensus-logic`.
