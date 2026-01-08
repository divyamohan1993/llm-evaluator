"""
Infrastructure Tests
====================

Tests for the Hybrid Router and infrastructure components.
Uses mocks to avoid real network calls.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from backend.infra.router import HybridRouter, ModelType, CircuitBreaker


class TestCircuitBreaker:
    """Tests for CircuitBreaker functionality."""
    
    def test_circuit_breaker_initial_state(self):
        """Test circuit breaker starts closed."""
        cb = CircuitBreaker()
        assert cb.is_open is False
        assert cb.failure_count == 0
    
    def test_circuit_breaker_threshold(self):
        """Test circuit breaker has correct default threshold."""
        cb = CircuitBreaker()
        assert cb.threshold == 3
        assert cb.recovery_timeout == 60


class TestHybridRouter:
    """Tests for HybridRouter functionality."""
    
    def test_router_initialization(self):
        """Test router initializes with correct defaults."""
        router = HybridRouter()
        assert router.ollama_host == "http://localhost:11434"
        assert router.ollama_model == "llama3"
    
    def test_model_type_mapping(self):
        """Test model type string to enum mapping."""
        router = HybridRouter()
        assert router._get_model_type("gemini") == ModelType.GEMINI
        assert router._get_model_type("claude") == ModelType.CLAUDE
        assert router._get_model_type("local") == ModelType.LOCAL
        assert router._get_model_type("unknown") == ModelType.GEMINI  # Default
    
    def test_circuit_breakers_initialized(self):
        """Test all circuit breakers are initialized."""
        router = HybridRouter()
        assert ModelType.GEMINI in router.circuit_breakers
        assert ModelType.CLAUDE in router.circuit_breakers
        assert ModelType.OPENAI in router.circuit_breakers
        assert ModelType.LOCAL in router.circuit_breakers
    
    @pytest.mark.asyncio
    async def test_health_check_returns_dict(self):
        """Test health check returns proper structure."""
        router = HybridRouter()
        
        with patch.object(router, 'is_local_available', new_callable=AsyncMock) as mock_local:
            mock_local.return_value = False
            health = await router.health_check()
        
        assert isinstance(health, dict)
        assert "local" in health
        assert "gemini" in health
        assert "claude" in health
        assert "openai" in health
    
    def test_record_failure_increments_count(self):
        """Test failure recording increments counter."""
        router = HybridRouter()
        initial_count = router.circuit_breakers[ModelType.GEMINI].failure_count
        
        router._record_failure(ModelType.GEMINI)
        
        assert router.circuit_breakers[ModelType.GEMINI].failure_count == initial_count + 1
    
    def test_circuit_opens_after_threshold(self):
        """Test circuit opens after reaching failure threshold."""
        router = HybridRouter()
        cb = router.circuit_breakers[ModelType.GEMINI]
        
        # Record failures up to threshold
        for _ in range(cb.threshold):
            router._record_failure(ModelType.GEMINI)
        
        assert cb.is_open is True


class TestModelTypes:
    """Tests for ModelType enum."""
    
    def test_all_model_types_exist(self):
        """Test all expected model types are defined."""
        assert ModelType.GEMINI.value == "gemini"
        assert ModelType.CLAUDE.value == "claude"
        assert ModelType.OPENAI.value == "openai"
        assert ModelType.LOCAL.value == "local"
        assert ModelType.BERT.value == "bert"
