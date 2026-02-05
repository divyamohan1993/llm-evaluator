# Consensus Configuration

**Created by:** Divya Mohan (Software Architect)

> **Open for Contributors:** This module is open for Cloud/DevOps contributors.

## Overview

The **Consensus Configuration** defines the mathematical weighting logic that determines how 4 AI agents' votes are combined into a final grade.

## Files

| File | Purpose |
|------|---------|
| `consensus_matrix.json` | Weight configurations |

## Grading Modes

| Mode | Fact | Structure | Critical | Security |
|------|------|-----------|----------|----------|
| `strict_mode` | 50% | 10% | 25% | 15% |
| `balanced_mode` | 30% | 25% | 25% | 20% |
| `creative_mode` | 20% | 20% | 40% | 20% |
| `lenient_mode` | 25% | 40% | 20% | 15% |

## Veto Rules

| Rule | Agent | Threshold | Action |
|------|-------|-----------|--------|
| `plagiarism_veto` | Security | < 30% | Zero Score |
| `ai_generated_veto` | Security | < 40% | Flag Review |
| `bluff_veto` | Critical | < 25% | Reduce 50% |

## Contact

For questions, create an issue with the label `consensus-logic`.

---

**Created & Designed by:** Divya Mohan (Software Architect)
