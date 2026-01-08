# 🧠 SmartEvaluator-Omni

> **A Hybrid-AI Examination System powered by a Consensus Swarm of 4 Distinct AI Models**

[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-Orchestration-orange.svg)](https://langchain.com/)

## 🌟 Overview

**SmartEvaluator-Omni** is a next-generation AI-powered examination grading system that leverages a **Multi-Agent Swarm** architecture to provide fair, unbiased, and comprehensive student answer evaluation.

### Core Features

- **🤖 Consensus Swarm**: 4 specialized AI agents (Gemini + Llama + Mistral/Claude + BERT) work in parallel
- **👤 Digital Twin Engine**: Mimics each teacher's unique grading personality using Vector RAG
- **⚡ Hybrid Infrastructure**: Seamlessly routes between Cloud APIs and Local/Onboard LLM inference
- **📊 Weighted Consensus**: Configurable scoring matrix with veto power for plagiarism detection

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SmartEvaluator-Omni                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │   Swarm Engine  │  │  Digital Twin   │  │ Hybrid Infra Router │  │
│  │   (4 Agents)    │  │   (Persona RAG) │  │  (Cloud ↔ Local)    │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘  │
│           │                    │                      │             │
│  ┌────────▼────────────────────▼──────────────────────▼──────────┐  │
│  │                    FastAPI Async Backend                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  ChromaDB (Teacher Vectors) │ Ollama (Local LLM) │ Cloud APIs      │
└─────────────────────────────────────────────────────────────────────┘
```

## 👥 Team Assignments & Instructions

Each team member has their own branch and dedicated folder. **Read your folder's README for detailed instructions and TODO lists.**

### Technical Team (Programming Required)

| Engineer | Background | Role | Branch | Folder | Instructions |
|----------|------------|------|--------|--------|--------------|
| **Kaustuv** | AI | Swarm Engine | `feat/kaustuv-swarm` | `backend/swarm/` | [📖 Swarm README](backend/swarm/README.md) |
| **Jatin** | Data Science | Digital Twin | `feat/jatin-twin` | `backend/digital_twin/` | [📖 Digital Twin README](backend/digital_twin/README.md) |
| **Anshuman** | Cloud Computing | Infrastructure + Consensus | `feat/anshuman-hybrid` | `backend/infra/` + `config/` | [📖 Infra README](backend/infra/README.md), [📖 Consensus README](config/README.md) |

### Business Team (No Programming Required)

| Team Member | Background | Role | Instructions |
|-------------|------------|------|--------------|
| **Anshul** | BBA | Marketing & Finance | [📖 Marketing Strategy](docs/MARKETING_STRATEGY.md) |

> **Note:** Consensus Logic was originally assigned to Anshul but has been **reassigned to Anshuman** since it requires programming skills. Anshul focuses exclusively on market research, financial projections, and business strategy.

### Getting Started (For Technical Team Members)

1. **Clone the repo and switch to your branch:**
   ```bash
   git clone https://github.com/divyamohan1993/llm-evaluator.git
   cd llm-evaluator
   git checkout feat/<your-name>-<feature>
   ```

2. **Read your folder's README** - it contains:
   - Architecture diagrams
   - Massive TODO list (organized by week)
   - API references
   - Testing commands

3. **Make changes, commit, and push:**
   ```bash
   git add .
   git commit -m "Your descriptive message"
   git push origin feat/<your-branch>
   ```

4. **CI/CD will automatically:**
   - Run all tests (Python 3.10 & 3.11)
   - Merge your changes to `main` if tests pass
   - Sync `main` changes to all other feature branches

### Getting Started (For Anshul - Business Team)

1. **Read your instructions:** See [Marketing Strategy Guide](docs/MARKETING_STRATEGY.md)
2. **Tools you'll use:** Word, Excel, PowerPoint, Google Docs - no coding required!
3. **Deliverables location:** `docs/` folder for all business documents


## 🔄 Auto-Push Monitor

Stop worrying about manual commits. We have included an automated tool that watches your changes and syncs them to Git automatically.

To start the monitor:
1.  Open a terminal in the project root.
2.  Run:
```cmd
.\monitor.bat
```
3.  Keep this window open. It will automatically detect changes, commit them with meaningful messages, and push to your branch.


## 🚀 Quick Start for Others

**The Easiest Way:**
Just run the all-in-one launcher. It handles Git updates, dependencies, and server startup.

```batch
.\run_everything.bat
```

**Manual Way:**
```bash
# Clone the repository
git clone https://github.com/divyamohan1993/llm-evaluator.git
cd llm-evaluator

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: .\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the development server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## 📦 Tech Stack

- **Orchestration**: LangChain / CrewAI (Python)
- **Backend**: FastAPI (Async/Await)
- **Vector DB**: ChromaDB (Local) / Pinecone (Cloud)
- **Local Inference**: Ollama (Llama 3)
- **Cloud Inference**: Google Gemini Pro, Anthropic Claude, OpenAI GPT-4

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
