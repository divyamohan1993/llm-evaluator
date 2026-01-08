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

| Engineer | Role | Branch | Folder | Instructions |
|----------|------|--------|--------|--------------|
| **Kaustuv** | AI Swarm Engineer | `feat/kaustuv-swarm` | `backend/swarm/` | [📖 Swarm README](backend/swarm/README.md) |
| **Jatin** | Digital Twin Architect | `feat/jatin-twin` | `backend/digital_twin/` | [📖 Digital Twin README](backend/digital_twin/README.md) |
| **Anshuman** | Hybrid Infrastructure | `feat/anshuman-hybrid` | `backend/infra/` | [📖 Infra README](backend/infra/README.md) |
| **Anshul** | Consensus Logic | `feat/anshul-logic` | `config/` | [📖 Consensus README](config/README.md) |

### Getting Started (For Team Members)

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


## 🔄 Auto-Push Monitor

Stop worrying about manual commits. We have included an automated tool that watches your changes and syncs them to Git automatically.

To start the monitor:
1.  Open a terminal in the project root.
2.  Run:
```cmd
.\monitor.bat
```
3.  Keep this window open. It will automatically detect changes, commit them with meaningful messages, and push to your branch.

## 🚀 Quick Start for others

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
