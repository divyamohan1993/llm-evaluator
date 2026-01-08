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
**Target:** Production Ready | **Speed:** Extreme

### 🔬 PATENTABLE FEATURE IMPLEMENTATION (NEW PRIORITY)
**Goal**: Build the "method" behind our IP claims.
- [ ] **Feature #3: TVCA Scoring Formula** (`config/math/alignment.py`):
  - **Task**: Implement the Alignment Formula:
    `Score = Cos(Student, Syllabus) - (0.5 * Cos(Student, World))`
  - **Config**: Define the `0.5` penalty weight in `consensus_matrix.json`.
- [ ] **Feature #1: Cognitive Gap Thresholds**:
    - **Task**: Define `MAX_ALLOWED_GAP = 0.4` (40% missing steps).
    - **Action**: If `gap > MAX`, trigger `flag_for_review`.
- [ ] **Feature #2: Adversary Trigger Logic**:
    - **Task**: Define `ADVERSARY_TRIGGER_CONFIDENCE = 0.92`.
    - **Action**: If `agent_agreement > 0.92`, return `status: "spawn_adversary"` instead of `final_grade`.



### 🔰 PRE-REQUISITES (Do this first!)
- [ ] **Install Python Libs**:
  ```bash
  pip install numpy scipy web3 eth-account reportlab pandas weasyprint statsmodels
  ```
- [ ] **Install Blockchain Tools**:
  - `ganache-cli` (for local Ethereum blockchain).
  - Metamask Chrome Extension (for testing).

---

### Day 1: Advanced Mathematics (Micro-Steps)

#### 1.1 Nash Equilibrium Scorer (Agent: Antigravity)
- [ ] **Matrix Implementation**:
  - File: `config/scoring/game_theory.py`.
  - **Step**: Create a Payoff Matrix.
    ```python
    import numpy as np
    # Rows = Agent A decisions, Cols = Agent B decisions
    payoff_matrix = np.array([[5, 0], [0, 5]]) # Coordination Game
    ```
  - **Step**: If Agent A and B agree, both get +5 "Confidence Points".
  - **Step**: If they disagree, both get 0.
- [ ] **Bayesian Updater**:
  - **Step**: Store `agent_trust_scores = {"gemini": 0.9, "claude": 0.9}`.
  - **Step**: After every exam, if `human_override` exists:
    `new_trust = old_trust * 0.9` (Penalize the AI).

#### 1.2 Dynamic Rubric Generator
- [ ] **Intention Classifier**:
  - **Step**: Use a zero-shot classifier (like Bart-Large-MNLI).
  - **Code**:
    ```python
    labels = ["creative", "factual", "analytical"]
    result = classifier(student_answer, labels)
    mode = result['labels'][0]
    ```
- [ ] **Weight Swapping**:
  - **Logic**:
    ```python
    if mode == "creative":
        weights = {"fact": 0.1, "style": 0.9}
    elif mode == "factual":
        weights = {"fact": 0.9, "style": 0.1}
    ```

---

### Day 2: The Veto Engine

#### 2.1 Hierarchical Logic
- [ ] **Priority Queue**:
  - File: `config/veto.py`.
  - **Step**: Define constants. `PRIORITY_SECURITY = 0`, `PRIORITY_FACT = 1`.
  - **Step**: `vetoes = []`.
  - **Step**: `if plagiarism: vetoes.append((PRIORITY_SECURITY, "Plagiarism Detected"))`.
  - **Step**: `vetoes.sort(key=lambda x: x[0])`.
  - **Step**: Return `vetoes[0]` (The most critical issue).

#### 2.2 Override Keys (The "Dean's Key")
- [ ] **JWT Implementation**:
  - **Step**: `import jwt`.
  - **Step**: `secret = "university_super_secret_key"`.
  - **Step**: To generate a key:
    ```python
    token = jwt.encode({"role": "dean", "override": True}, secret, algorithm="HS256")
    ```
  - **Step**: To check a key:
    ```python
    decoded = jwt.decode(token, secret, algorithms=["HS256"])
    if decoded['override']: bypass_veto()
    ```

---

### Day 3: Trust & Verification (Blockchain)

#### 3.1 On-Chain Verification
- [ ] **Hashing**:
  - **Step**: `data = f"{student_id}:{grade}:{timestamp}"`.
  - **Step**: `data_hash = getattr(hashlib, 'sha256')(data.encode()).hexdigest()`.
- [ ] **Smart Contract**:
  - File: `contracts/GradeNotary.sol`.
  - **Code**:
    ```solidity
    mapping(bytes32 => bool) public validVarifiedGrades;
    function publishGrade(bytes32 _hash) public onlyOwner {
        validVarifiedGrades[_hash] = true;
    }
    ```
- [ ] **Web3.py Interaction**:
  - **Step**: Connect to Ganache: `w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))`.
  - **Step**: Call contract: `contract.functions.publishGrade(data_hash).transact()`.

---

### Day 4: Adaptive Intelligence

#### 4.1 Calibration Loop
- [ ] **Statistical Analysis**:
  - **Library**: `scipy.stats`.
  - **Step**: `z_scores = stats.zscore(all_class_grades)`.
  - **Step**: Identify outliers (> 3 std dev).
- [ ] **Auto-Curving**:
  - **Logic**: If `mean < 60`:
  - **Code**: `curved_grades = [min(100, g + (75 - mean)) for g in raw_grades]`.
  - **Why?**: Shifts the distribution center to 75%.

#### 4.2 A/B Testing Infrastructure
- [ ] **Experiment Router**:
  - **Step**: `if hash(student_id) % 2 == 0: use_strict_model() else: use_lenient_model()`.
  - **Step**: Log: `logger.info(f"Student {sid} assigned to Group A")`.

---

### Day 5: Analytics

#### 5.1 Bias Dashboard
- [ ] **Correlation Engine**:
  - **Library**: `pandas`.
  - **Step**: Load DataFrame: `df = pd.read_csv("grades.csv")`.
  - **Step**: `corr = df['english_proficiency'].corr(df['grammar_score'])`.
  - **Alert**: `if corr > 0.5: send_slack_alert("POSSIBLE BIAS DETECTED")`.

#### 5.2 Regulatory Reports
- [ ] **PDF Generation**:
  - **Library**: `WeasyPrint`.
  - **Step**: Design HTML template: `<h1>Annual Accreditation Report</h1>...`.
  - **Step**: `HTML(string=rendered_html).write_pdf("report.pdf")`.

---

### BONUS: Week 2 - Features

#### 6.1 Machine Learning Weights
- [ ] **Learn Optimal Weights**:
  - Collect teacher corrections
  - Train regression model on corrections
  - Auto-optimize agent weights per teacher

#### 6.2 Explainable AI
- [ ] **SHAP Values**:
  - Show which agent contributed most to grade
  - Visual breakdown of score components
  - "Your fact score pulled down the grade by 15 points"

#### 6.3 Appeals System
- [ ] **Grade Appeals Workflow**:
  - Students submit appeal with justification
  - Re-evaluate with different random seed
  - Human review queue for disputed grades

#### 6.4 Anomaly Detection
- [ ] **Statistical Outliers**:
  - Flag unusually high/low grades for review
  - Detect grading drift over time
  - Alert on sudden accuracy drops

#### 6.5 Multi-Rubric Support
- [ ] **Custom Rubrics**:
  - Teacher-defined rubric criteria
  - Map agent outputs to rubric points
  - Generate rubric-aligned feedback

#### 6.6 Grade Prediction
- [ ] **Student Performance Forecasting**:
  - Predict final grade from early assignments
  - Early warning system for at-risk students
  - Intervention recommendations

#### 6.7 Consensus Visualization
- [ ] **Interactive Charts**:
  - Spider/radar chart of agent scores
  - Historical trend lines
  - Comparison with class average

#### 6.8 Regulatory Compliance
- [ ] **FERPA/GDPR Compliance**:
  - Data retention policies
  - Right to explanation
  - Audit trail for all grade changes

#### 6.9 Grade Simulation
- [ ] **What-If Analysis**:
  - "What if I improve my structure score by 10?"
  - Preview grade impact before submission
  - Suggest improvements for target grade



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
