#!/bin/bash

# SmartEvaluator-Omni: One-Click Production Launcher (Linux/Mac)
# ==============================================================

set -e

echo "==============================================================================="
echo "  SmartEvaluator-Omni: One-Click Production Launcher"
echo "  Version: 1.0.0"
echo "==============================================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Python
echo "[1/6] Checking Python Installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR] Python3 not found! Please install Python 3.10+${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "   - Found: $PYTHON_VERSION"

# 2. GIT SYNC
echo "[2/6] Syncing with Git Main..."
git pull origin main 2>/dev/null || echo -e "${YELLOW}[WARN] Git pull failed. Continuing with local version...${NC}"

# 3. VIRTUAL ENV CHECK
echo "[3/6] Setting Up Virtual Environment..."
if [ ! -d "venv" ]; then
    echo "   - Creating new virtual environment..."
    python3 -m venv venv
else
    echo "   - Virtual environment already exists."
fi

# 4. ACTIVATE & INSTALL DEPS
echo "[4/6] Installing Dependencies..."
source venv/bin/activate
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to install dependencies!${NC}"
    exit 1
fi

# 5. ENVIRONMENT SETUP
echo "[5/6] Checking Configuration..."
if [ ! -f ".env" ]; then
    echo "   - Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "==============================================================================="
    echo -e "${YELLOW}  [IMPORTANT] A new .env file has been created!${NC}"
    echo "  Please edit .env and add your API keys:"
    echo "    - GEMINI_API_KEY"
    echo "    - ANTHROPIC_API_KEY (optional)"
    echo "    - OPENAI_API_KEY (optional)"
    echo "==============================================================================="
    echo ""
    echo "You can edit with: nano .env"
fi

# 6. RUN TESTS (Quick check)
echo "[6/6] Running Quick Health Check..."
python -c "from backend.main import app; print('   - Backend imports OK')" 2>/dev/null || {
    echo -e "${YELLOW}[WARN] Backend import check failed. Installing dependencies...${NC}"
    pip install -r requirements.txt
}

# LAUNCH
echo ""
echo "==============================================================================="
echo ""
echo -e "${GREEN}  [SUCCESS] SmartEvaluator-Omni is starting!${NC}"
echo ""
echo "  Endpoints:"
echo "    - API Docs:     http://localhost:8000/docs"
echo "    - ReDoc:        http://localhost:8000/redoc"
echo "    - Health:       http://localhost:8000/health"
echo "    - Evaluate:     POST http://localhost:8000/api/evaluate"
echo ""
echo "  Press Ctrl+C to stop the server."
echo ""
echo "==============================================================================="
echo ""

# Start with auto-reload for development
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
