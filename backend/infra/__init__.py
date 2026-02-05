"""
Hybrid Infrastructure Module
============================

Routes traffic between Cloud APIs and Local/Onboard LLM inference.

Created by: Divya Mohan (Software Architect)
Open for: Cloud/DevOps Contributors
"""

from backend.infra.router import HybridRouter

__all__ = ["HybridRouter"]
