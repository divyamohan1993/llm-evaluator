# 🧠 SmartEvaluator-Omni

> **A Hybrid-AI Examination System powered by a Consensus Swarm of 4 Distinct AI Models**

[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-Orchestration-orange.svg)](https://langchain.com/)

## 🌟 Overview

**SmartEvaluator-Omni** is a next-generation AI-powered examination grading system that leverages a **Multi-Agent Swarm** architecture to provide fair, unbiased, and comprehensive student answer evaluation.

**Created by:** Divya Mohan (Software Architect)

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

## 👥 Open for Contributors

This project is **open source** and welcomes contributions! Each module has its own README with detailed instructions.

### Technical Modules (Programming Required)

| Role | Module | Folder | Instructions |
|------|--------|--------|--------------|
| AI/ML Contributor | Swarm Engine | `backend/swarm/` | [📖 Swarm README](backend/swarm/README.md) |
| Data Science Contributor | Digital Twin | `backend/digital_twin/` | [📖 Digital Twin README](backend/digital_twin/README.md) |
| Cloud/DevOps Contributor | Infrastructure + Consensus | `backend/infra/` + `config/` | [📖 Infra README](backend/infra/README.md), [📖 Consensus README](config/README.md) |

### Business Modules (No Programming Required)

| Role | Focus Area | Instructions |
|------|------------|--------------|
| Business/Marketing Contributor | Marketing & Finance | [📖 Marketing Strategy](docs/MARKETING_STRATEGY.md) |

### Getting Started (For Contributors)

1. **Fork and clone the repo:**
   ```bash
   git clone https://github.com/divyamohan1993/llm-evaluator.git
   cd llm-evaluator
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feat/<your-feature>
   ```

3. **Read your module's README** - it contains:
   - Architecture diagrams
   - TODO list (organized by priority)
   - API references
   - Testing commands

4. **Make changes, commit, and push:**
   ```bash
   git add .
   git commit -m "Your descriptive message"
   git push origin feat/<your-feature>
   ```

5. **Create a Pull Request** for review

### Getting Started (For Business Contributors)

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


## 🚀 Quick Start

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

## 👨‍💻 Project Credits

- **Created & Designed by:** Divya Mohan
- **Architecture:** Divya Mohan
- **Technical Specifications:** Divya Mohan
- **Workflow Orchestration:** Divya Mohan

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
