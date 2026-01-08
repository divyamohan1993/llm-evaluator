@echo off
SETLOCAL EnableDelayedExpansion

TITLE SmartEvaluator-Omni Launcher

echo ===============================================================================
echo   SmartEvaluator-Omni: One-Click Production Launcher
echo   Version: 1.0.0
echo ===============================================================================
echo.

:: Check Python
echo [1/6] Checking Python Installation...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found! Please install Python 3.10+ from python.org
    pause
    exit /b 1
)

:: GIT SYNC
echo [2/6] Syncing with Git Main...
git pull origin main 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Git pull failed. Continuing with local version...
)

:: VIRTUAL ENV CHECK
echo [3/6] Setting Up Virtual Environment...
if not exist venv (
    echo    - Creating new virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
) else (
    echo    - Virtual environment already exists.
)

:: ACTIVATE & INSTALL DEPS
echo [4/6] Installing Dependencies...
call venv\Scripts\activate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)

python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies. Check requirements.txt
    pause
    exit /b 1
)

:: ENVIRONMENT SETUP
echo [5/6] Checking Configuration...
if not exist .env (
    echo    - Creating .env from template...
    copy .env.example .env >nul
    echo.
    echo ===============================================================================
    echo   [IMPORTANT] A new .env file has been created!
    echo   Please edit .env and add your API keys:
    echo     - GEMINI_API_KEY
    echo     - ANTHROPIC_API_KEY (optional)
    echo     - OPENAI_API_KEY (optional)
    echo ===============================================================================
    echo.
    echo Press any key to open .env in notepad for editing...
    pause >nul
    notepad .env
)

:: RUN TESTS (Optional quick check)
echo [6/6] Running Quick Health Check...
python -c "from backend.main import app; print('   - Backend imports OK')" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend import failed! Check for missing dependencies.
    echo Running: pip install -r requirements.txt
    pip install -r requirements.txt
)

:: LAUNCH
echo.
echo ===============================================================================
echo.
echo   [SUCCESS] SmartEvaluator-Omni is starting!
echo.
echo   Endpoints:
echo     - API Docs:     http://localhost:8000/docs
echo     - ReDoc:        http://localhost:8000/redoc
echo     - Health:       http://localhost:8000/health
echo     - Evaluate:     POST http://localhost:8000/api/evaluate
echo.
echo   Press Ctrl+C to stop the server.
echo.
echo ===============================================================================
echo.

:: Start with auto-reload for development
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

ENDLOCAL
