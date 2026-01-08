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
  - Move beyond weighted averages. Implement **Nash Equilibrium** scoring.
  - If 3 agents say 'A' and 1 fails, heavily penalize the outlier ONLY if confidence is low.
  - **Bayesian Updating**: Update agent reliability scores in real-time based on their agreement with the consensus.

- [ ] **TODO Anshul (Agent: Jules)**: **Dynamic Rubric Generation**.
  - Don't use static weights. Generate a custom rubric vector *per question* based on semantic complexity.

### Day 2: The Veto Engine
- [ ] **TODO Anshul**: **Hierarchical Veto Logic**.
  - "Plagiarism" (Security Agent) > "Fact Error" (Fact Agent) > "Grammar" (Structure Agent).
  - Implement **Override Codes**: Dean of Students can sign a cryptographically secured override key to bypass a veto.

### Day 3: Trust & Verification (Blockchain)
- [ ] **TODO Anshul (Agent: Codex)**: **On-Chain Grade Verification**.
  - Hash every final grade + agent metadata (SHA-256).
  - Publish the Merkle Root of the exam batch to a public ledger (e.g., Polygon/Ethereum).
  - **Zero-Knowledge Proofs**: Prove a student passed without revealing their score.

### Day 4: Adaptive Intelligence
- [ ] **TODO Anshul**: **Calibration Loop**.
  - If the class average is 40% (too hard) or 95% (too easy), automatically suggest a curve adjustment to the professor *before* publishing grades.
  - **A/B Testing**: Serve "Strict Mode" to 50% of anon submissions and "Lenient Mode" to 50% to measure impact (in dev only).

### Day 5: Enterprise Analytics
- [ ] **TODO Anshul**: **Bias Detection Dashboard**.
  - "Are we grading non-native English speakers harder?"
  - Visualize correlation between "Vocabulary Complexity" and "Final Score".
  - **Regulatory Reports**: Auto-generate PDFs for Accreditation Boards (ABET/WASC).


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
