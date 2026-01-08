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

### Phase 1: Consensus Matrix Enhancement (Week 1-2)

- [ ] **TODO Anshul**: Define the threshold for 'Veto'
  - If Security Agent flags plagiarism (score < 30), score = 0
  - If Security Agent flags AI-generated (score < 40), flag for review
  - Document veto rules clearly in config
  - Test veto edge cases

- [ ] **TODO Anshul**: Add more grading modes
  - `essay_mode`: Higher weight on structure and critical thinking
  - `technical_mode`: Higher weight on facts and accuracy
  - `research_mode`: Additional weight on citations
  - `creative_mode`: Lower penalty for unconventional answers

- [ ] **TODO Anshul**: Implement adaptive weighting
  - Adjust weights based on question type
  - Support per-question weight overrides
  - Learn optimal weights from teacher feedback
  - A/B testing for weight configurations

- [ ] **TODO Anshul**: Add weight validation
  - Ensure weights sum to 1.0
  - Validate all required agents are present
  - Schema validation on load
  - Helpful error messages

### Phase 2: Veto Rules Engine (Week 3-4)

- [ ] **TODO Anshul**: Implement veto rules engine
  - Create `veto_rules.py` module
  - Support multiple veto conditions
  - Allow priority ordering of rules
  - Support partial vetoes (score reduction)

- [ ] **TODO Anshul**: Add configurable veto actions
  - `zero_score`: Set final score to 0
  - `flag_review`: Mark for human review
  - `reduce_score`: Apply percentage reduction
  - `notify_instructor`: Send alert

- [ ] **TODO Anshul**: Implement veto override
  - Allow teachers to override veto decisions
  - Log override reasons
  - Track override frequency
  - Improve rules based on overrides

- [ ] **TODO Anshul**: Add veto explanation generation
  - Generate human-readable veto reason
  - Include evidence from agents
  - Suggest remediation steps
  - Support multiple languages

### Phase 3: Scoring Algorithms (Week 5-6)

- [ ] **TODO Anshul**: Implement alternative consensus methods
  - Weighted average (current)
  - Median voting
  - Majority voting
  - Ranked choice voting
  - Minimum of all agents

- [ ] **TODO Anshul**: Add confidence-weighted scoring
  - Weight votes by agent confidence
  - Penalize low-confidence high scores
  - Normalize confidence across agents
  - Track confidence calibration

- [ ] **TODO Anshul**: Implement score normalization
  - Normalize to 0-100 scale
  - Handle outlier scores
  - Apply grade curve if configured
  - Support different grading scales (A-F, 1-10, Pass/Fail)

- [ ] **TODO Anshul**: Add bonus/penalty system
  - Unanimous agreement bonus (+5 points)
  - High disagreement penalty (-3 points)
  - Early submission bonus
  - Late submission penalty

### Phase 4: Grade Calibration (Week 7-8)

- [ ] **TODO Anshul**: Implement grade distribution analysis
  - Track grade distribution per class
  - Detect grade inflation/deflation
  - Alert on abnormal distributions
  - Suggest calibration adjustments

- [ ] **TODO Anshul**: Add historical comparison
  - Compare current grades to historical
  - Detect significant changes
  - Provide trend analysis
  - Generate reports

- [ ] **TODO Anshul**: Implement cross-validation
  - Compare AI grades to human grades
  - Measure correlation coefficient
  - Identify systematic biases
  - Improve consensus weights

### Phase 5: Configuration Management (Week 9-10)

- [ ] **TODO Anshul**: Create configuration API
  - CRUD operations for configurations
  - Version control for configs
  - Rollback capability
  - Configuration comparison

- [ ] **TODO Anshul**: Add configuration templates
  - Pre-built templates for common scenarios
  - Subject-specific templates
  - Import/export functionality
  - Template marketplace

- [ ] **TODO Anshul**: Implement A/B testing
  - Test different weight configurations
  - Measure impact on grades
  - Statistical significance testing
  - Auto-promote winning configs

### Phase 6: Analytics & Reporting (Week 11-12)

- [ ] **TODO Anshul**: Build consensus analytics
  - Agent agreement rate
  - Veto frequency
  - Weight effectiveness
  - Mode usage statistics

- [ ] **TODO Anshul**: Create visualization dashboard
  - Real-time consensus flow
  - Agent contribution charts
  - Grade distribution histograms
  - Trend analysis graphs

- [ ] **TODO Anshul**: Generate compliance reports
  - Grading consistency metrics
  - Bias detection reports
  - Audit trail
  - Regulatory compliance

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
