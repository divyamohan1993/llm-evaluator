# SmartEvaluator-Omni: Master TODO Tracker
# ==========================================

This document tracks all pending tasks across the project.
Each team member should complete their section before the system is production-ready.

---

## Project Status Overview

| Component | Owner | Background | Status | Progress |
|-----------|-------|------------|--------|----------|
| Swarm Engine | **Kaustuv** | AI | 🟡 In Progress | 30% |
| Digital Twin | **Jatin** | Data Science | 🟡 In Progress | 25% |
| Hybrid Infrastructure | **Anshuman** | Cloud Computing | 🟡 In Progress | 35% |
| Consensus Logic | **Anshuman** | Cloud Computing | 🟡 In Progress | 40% |
| **Marketing & Finance** | **Anshul** | BBA | 🟡 In Progress | 10% |
| Integration Tests | All (Technical) | - | 🔴 Not Started | 0% |
| Documentation | All | - | 🟡 In Progress | 50% |

> **Team Structure Note:**
> - **Anshul (BBA)** - Handles ONLY Marketing & Financial tasks. See `docs/MARKETING_STRATEGY.md`
> - **Kaustuv (AI)** - All Swarm Engine AI/ML code
> - **Jatin (Data Science)** - Digital Twin data science code
> - **Anshuman (Cloud Computing)** - Infrastructure + Consensus Logic (technical)

---

## Integration TODOs (All Team Members)

These tasks require coordination between multiple team members.

### Critical Path (Must Complete First)

- [ ] **INTEGRATION-001**: Connect Swarm → Digital Twin
  - Owner: Kaustuv + Jatin
  - `SwarmCouncil.gather_council_votes()` -> `synthesize_grade()`
  - Ensure CouncilVotes dataclass is compatible
  
- [ ] **INTEGRATION-002**: Connect Infrastructure → Swarm
  - Owner: Anshuman + Kaustuv
  - All agents must use `HybridRouter.route_request()`
  - Implement proper error handling chain

- [ ] **INTEGRATION-003**: Connect Consensus → Digital Twin
  - Owner: **Anshuman** + Jatin
  - Load consensus weights based on teacher persona
  - Apply grading_mode from teacher preferences

- [ ] **INTEGRATION-004**: End-to-End API Flow
  - Owner: All
  - Test complete flow: `/api/evaluate` -> Swarm -> Digital Twin -> Response
  - Verify latency is under 10 seconds

### Database & Storage

- [ ] **STORAGE-001**: Set up ChromaDB for production
  - Owner: Jatin
  - Create persistent storage directory
  - Add backup/restore scripts

- [ ] **STORAGE-002**: Create teacher seeding script
  - Owner: Jatin
  - Add 5 sample teacher personas
  - Create admin API for adding teachers

- [ ] **STORAGE-003**: Add evaluation history storage
  - Owner: **Anshuman** *(reassigned from Anshul)*
  - Store all evaluations for audit
  - Create query API for history

### API Enhancements

- [ ] **API-001**: Implement batch evaluation
  - Owner: Kaustuv
  - Current: Placeholder at `/api/evaluate/batch`
  - Add progress tracking, background processing

- [ ] **API-002**: Add WebSocket for real-time updates
  - Owner: Anshuman
  - Stream agent votes as they complete
  - Show progress to frontend

- [ ] **API-003**: Add authentication
  - Owner: Anshuman
  - JWT token-based auth
  - Teacher/Admin roles

- [ ] **API-004**: Rate limiting
  - Owner: Anshuman
  - Per-user rate limits
  - Token bucket algorithm

### Frontend (Future)

- [ ] **FRONTEND-001**: Create evaluation dashboard
  - Owner: TBD
  - React/Vue frontend
  - Real-time grade display

- [ ] **FRONTEND-002**: Teacher profile management UI
  - Owner: TBD + Jatin
  - Add/edit teacher personas
  - Upload feedback examples

- [ ] **FRONTEND-003**: Analytics dashboard
  - Owner: TBD + **Jatin** *(Anshul provides business requirements)*
  - Grade distribution charts
  - Agent performance metrics

---

## Testing TODOs

### Unit Tests

- [ ] **TEST-001**: Increase swarm test coverage to 80%
  - Owner: Kaustuv
  - File: `tests/test_swarm.py`

- [ ] **TEST-002**: Add ChromaDB integration tests
  - Owner: Jatin
  - Requires: ChromaDB running locally

- [ ] **TEST-003**: Add router failover tests
  - Owner: Anshuman
  - Test all failover scenarios

- [ ] **TEST-004**: Add consensus calculation tests
  - Owner: **Anshuman** *(reassigned from Anshul)*
  - Test all grading modes

### Integration Tests

- [ ] **ITEST-001**: Full evaluation flow test
  - Owner: All
  - Test with real APIs (marked as slow)

- [ ] **ITEST-002**: Load testing
  - Owner: Anshuman
  - 100 concurrent evaluations
  - Measure p95 latency

### E2E Tests

- [ ] **E2E-001**: Browser-based E2E tests
  - Owner: TBD
  - Playwright/Cypress tests

---

## Documentation TODOs

- [ ] **DOCS-001**: API documentation
  - Owner: All
  - OpenAPI schema is auto-generated
  - Add examples to each endpoint

- [ ] **DOCS-002**: Deployment guide
  - Owner: Anshuman
  - Docker setup
  - Cloud deployment (AWS/GCP)

- [ ] **DOCS-003**: Architecture deep-dive
  - Owner: All
  - Detailed system diagrams
  - Data flow explanations

- [ ] **DOCS-004**: Contributing guide
  - Owner: All
  - Code style, PR process
  - Testing requirements

---

## DevOps TODOs

- [ ] **DEVOPS-001**: Docker containerization
  - Owner: Anshuman
  - Create Dockerfile
  - docker-compose for local dev

- [ ] **DEVOPS-002**: Production deployment script
  - Owner: Anshuman
  - One-click deploy to cloud
  - Environment configuration

- [ ] **DEVOPS-003**: Monitoring setup
  - Owner: Anshuman
  - Prometheus metrics
  - Grafana dashboard

- [ ] **DEVOPS-004**: Logging infrastructure
  - Owner: All
  - Structured logging
  - Log aggregation

---

## Performance TODOs

- [ ] **PERF-001**: Optimize parallel agent execution
  - Owner: Kaustuv
  - Target: <5s total latency

- [ ] **PERF-002**: Cache frequently used data
  - Owner: Jatin
  - Teacher personas
  - Recent evaluations

- [ ] **PERF-003**: Connection pooling
  - Owner: Anshuman
  - Reuse HTTP connections
  - Pool LLM clients

---

## Security TODOs

- [ ] **SEC-001**: API key rotation system
  - Owner: Anshuman
  - Secure key storage
  - Automatic rotation

- [ ] **SEC-002**: Input sanitization
  - Owner: All
  - Prevent prompt injection
  - Validate all inputs

- [ ] **SEC-003**: Audit logging
  - Owner: **Anshuman** *(reassigned from Anshul)*
  - Log all evaluations
  - Track who accessed what

---

## How to Complete a TODO

1. Find a task in your section above
2. Create a feature branch from your assigned branch
3. Implement the feature
4. Add/update tests
5. Push to trigger CI/CD
6. Mark the task as complete with `[x]` and add your name

Example:
```markdown
- [x] **TASK-001**: Implement feature X (Completed by @kaustuv on 2026-01-10)
```

---

## Quick Links

### Technical Team
- [Swarm README](backend/swarm/README.md) - **Kaustuv's TODOs** (AI)
- [Digital Twin README](backend/digital_twin/README.md) - **Jatin's TODOs** (Data Science)
- [Infrastructure README](backend/infra/README.md) - **Anshuman's TODOs** (Cloud Computing)
- [Consensus README](config/README.md) - **Anshuman's TODOs** (Reassigned from Anshul)

### Business Team
- [Marketing Strategy](docs/MARKETING_STRATEGY.md) - **Anshul's TODOs** (BBA - Marketing & Finance ONLY)
