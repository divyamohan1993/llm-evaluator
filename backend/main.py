"""
SmartEvaluator-Omni - Main FastAPI Application
===============================================

This is the entry point for the Multi-Agent Swarm examination grading system.
All routes are async to handle parallel LLM inference efficiently.
"""

import asyncio
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.swarm.orchestrator import SwarmCouncil
from backend.digital_twin.personality_loader import load_teacher_persona
from backend.digital_twin.decision_maker import synthesize_grade
from backend.infra.router import HybridRouter


# =============================================================================
# Lifespan Management
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Initializes the Swarm Council and Hybrid Router on startup.
    """
    # Startup: Initialize components
    print("🚀 Initializing SmartEvaluator-Omni...")
    
    app.state.swarm_council = SwarmCouncil()
    app.state.hybrid_router = HybridRouter()
    
    # Pre-warm local LLM if available
    await app.state.hybrid_router.health_check()
    
    print("✅ SmartEvaluator-Omni is ready!")
    
    yield
    
    # Shutdown: Cleanup
    print("👋 Shutting down SmartEvaluator-Omni...")


# =============================================================================
# FastAPI Application
# =============================================================================

app = FastAPI(
    title="SmartEvaluator-Omni",
    description="A Hybrid-AI Examination System powered by a Consensus Swarm of 4 Distinct AI Models",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Request/Response Models
# =============================================================================

class EvaluationRequest(BaseModel):
    """Request model for answer evaluation."""
    student_answer: str = Field(..., description="The student's answer text")
    pdf_context: Optional[str] = Field(None, description="Reference PDF content for fact-checking")
    teacher_id: str = Field(..., description="Teacher ID for Digital Twin persona loading")
    grading_mode: Optional[str] = Field("balanced", description="Grading mode: strict, balanced, creative")


class AgentVote(BaseModel):
    """Individual agent voting result."""
    agent_name: str
    agent_role: str
    score: float
    confidence: float
    feedback: str


class EvaluationResponse(BaseModel):
    """Response model for answer evaluation."""
    final_grade: float = Field(..., description="Final grade (0-100)")
    letter_grade: str = Field(..., description="Letter grade (A-F)")
    teacher_feedback: str = Field(..., description="Personalized feedback in teacher's style")
    agent_votes: list[AgentVote] = Field(..., description="Individual agent voting results")
    consensus_method: str = Field(..., description="Consensus method used (weighted_average or veto)")
    plagiarism_flag: bool = Field(False, description="Whether plagiarism was detected")
    ai_generated_flag: bool = Field(False, description="Whether AI-generated content was detected")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    swarm_status: dict
    local_llm_available: bool


# =============================================================================
# API Routes
# =============================================================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information."""
    return {
        "name": "SmartEvaluator-Omni",
        "version": "1.0.0",
        "description": "Multi-Agent Swarm Examination Grading System",
        "docs": "/docs",
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Returns status of all swarm agents and infrastructure.
    """
    swarm_council: SwarmCouncil = app.state.swarm_council
    hybrid_router: HybridRouter = app.state.hybrid_router
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        swarm_status=await swarm_council.get_agent_status(),
        local_llm_available=await hybrid_router.is_local_available(),
    )


@app.post("/api/evaluate", response_model=EvaluationResponse, tags=["Evaluation"])
async def evaluate_answer(request: EvaluationRequest):
    """
    Main evaluation endpoint.
    
    This endpoint orchestrates the entire grading process:
    1. Dispatches the student answer to all 4 swarm agents in parallel
    2. Loads the teacher's Digital Twin persona
    3. Applies consensus logic with teacher bias weights
    4. Returns the final grade with personalized feedback
    """
    swarm_council: SwarmCouncil = app.state.swarm_council
    
    try:
        # Step 1: Gather votes from all 4 agents (async parallel execution)
        council_votes = await swarm_council.gather_council_votes(
            student_answer=request.student_answer,
            pdf_context=request.pdf_context,
        )
        
        # Step 2: Load teacher's Digital Twin persona
        teacher_persona = await load_teacher_persona(request.teacher_id)
        
        # Step 3: Synthesize final grade using teacher bias
        result = await synthesize_grade(
            council_votes=council_votes,
            teacher_persona=teacher_persona,
            grading_mode=request.grading_mode,
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@app.post("/api/evaluate/batch", tags=["Evaluation"])
async def evaluate_batch(
    requests: list[EvaluationRequest],
    background_tasks: BackgroundTasks,
):
    """
    Batch evaluation endpoint for processing multiple answers.
    Uses background tasks for long-running batch operations.
    """
    # TODO: Implement batch processing with progress tracking
    return {
        "message": "Batch evaluation started",
        "total_items": len(requests),
        "status": "processing",
    }


@app.get("/api/teachers/{teacher_id}/persona", tags=["Digital Twin"])
async def get_teacher_persona(teacher_id: str):
    """
    Retrieve a teacher's Digital Twin persona.
    Returns the personality vectors and style preferences.
    """
    persona = await load_teacher_persona(teacher_id)
    return persona


@app.get("/api/swarm/status", tags=["Swarm"])
async def get_swarm_status():
    """
    Get the current status of all swarm agents.
    Useful for monitoring and debugging.
    """
    swarm_council: SwarmCouncil = app.state.swarm_council
    return await swarm_council.get_agent_status()


# =============================================================================
# Run with Uvicorn (Development)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
