"""
Hybrid Infrastructure Module
============================

Routes traffic between Cloud APIs and Local/Onboard LLM inference.

Assigned to: Anshuman (Hybrid Infrastructure)
Branch: feat/anshuman-hybrid
"""

from backend.infra.router import HybridRouter

__all__ = ["HybridRouter"]
