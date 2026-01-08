@echo off
SETLOCAL EnableDelayedExpansion

TITLE SmartEvaluator-Omni Launcher

echo ===============================================================================
echo   SmartEvaluator-Omni: Single-Command Launcher
echo ===============================================================================

:: 1. GIT SYNC
echo [1/5] Syncing with Git Main...
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Git pull failed. You might have merge conflicts or no internet. Continuing anyway...
)

:: 2. VIRTUAL ENV CHECK
echo [2/5] Checking Virtual Environment...
if not exist venv (
    echo    - Creating new virtual environment 'venv'...
    python -m venv venv
) else (
    echo    - 'venv' already exists.
)

:: 3. ACTIVATE & INSTALL DEPS
echo [3/5] Installing Dependencies...
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies. Exiting.
    pause
    exit /b %ERRORLEVEL%
)

:: 4. ENVIRONMENT SETUP
echo [4/5] Checking Configuration...
if not exist .env (
    echo    - .env not found. Creating from .env.example...
    copy .env.example .env
    echo [IMPORTANT] A new .env file has been created. Please edit it with your API Keys.
)

:: 5. LAUNCH
echo.
echo ===============================================================================
echo   [SUCCESS] System Ready. Starting Application...
echo   - Access Docs: http://localhost:8000/docs
echo   - Stop Server: Ctrl+C
echo ===============================================================================
echo.

uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

ENDLOCAL
