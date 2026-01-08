"""
Consensus Configuration Tests
=============================

Tests for the consensus matrix configuration.
"""

import pytest
import json
import os


class TestConsensusMatrix:
    """Tests for consensus_matrix.json configuration."""
    
    @pytest.fixture
    def consensus_config(self):
        """Load consensus matrix configuration."""
        config_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "config",
            "consensus_matrix.json",
        )
        with open(config_path, "r") as f:
            return json.load(f)
    
    def test_config_loads(self, consensus_config):
        """Test configuration file loads correctly."""
        assert consensus_config is not None
        assert isinstance(consensus_config, dict)
    
    def test_grading_modes_exist(self, consensus_config):
        """Test all grading modes are defined."""
        modes = consensus_config.get("grading_modes", {})
        
        assert "strict_mode" in modes
        assert "balanced_mode" in modes
        assert "creative_mode" in modes
        assert "lenient_mode" in modes
    
    def test_weights_sum_to_one(self, consensus_config):
        """Test each mode's weights sum to 1.0."""
        modes = consensus_config.get("grading_modes", {})
        
        for mode_name, mode_config in modes.items():
            weights = [
                v for k, v in mode_config.items()
                if not k.startswith("_") and isinstance(v, (int, float))
            ]
            total = sum(weights)
            assert abs(total - 1.0) < 0.01, f"{mode_name} weights sum to {total}"
    
    def test_veto_rules_exist(self, consensus_config):
        """Test veto rules are defined."""
        veto = consensus_config.get("veto_rules", {})
        
        assert "plagiarism_veto" in veto
        assert "ai_generated_veto" in veto
    
    def test_plagiarism_veto_config(self, consensus_config):
        """Test plagiarism veto is properly configured."""
        veto = consensus_config["veto_rules"]["plagiarism_veto"]
        
        assert veto["enabled"] is True
        assert veto["agent"] == "security_agent"
        assert 0 <= veto["threshold"] <= 1
        assert veto["action"] == "zero_score"
    
    def test_thresholds_exist(self, consensus_config):
        """Test thresholds are defined."""
        thresholds = consensus_config.get("thresholds", {})
        
        assert "passing_grade" in thresholds
        assert "excellent_grade" in thresholds
        assert "minimum_confidence" in thresholds
    
    def test_agent_metadata_exists(self, consensus_config):
        """Test agent metadata is defined."""
        agents = consensus_config.get("agent_metadata", {})
        
        assert "fact_agent" in agents
        assert "structure_agent" in agents
        assert "critical_agent" in agents
        assert "security_agent" in agents
    
    def test_agent_metadata_structure(self, consensus_config):
        """Test each agent has required metadata fields."""
        agents = consensus_config.get("agent_metadata", {})
        
        required_fields = ["name", "type", "specialty", "priority"]
        
        for agent_name, agent_config in agents.items():
            for field in required_fields:
                assert field in agent_config, f"{agent_name} missing {field}"
