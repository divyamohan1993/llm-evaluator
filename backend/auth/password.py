"""
Password Hashing & Validation - SmartEvaluator-Omni
=====================================================

Uses passlib with bcrypt for secure password hashing.
Includes password strength validation enforcing institutional security policies.

Created by: Divya Mohan (Software Architect)
"""

import re
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    
    Args:
        password: The plaintext password to hash.
    
    Returns:
        The bcrypt hash string.
    """
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify a plaintext password against a bcrypt hash.
    
    Args:
        plain: The plaintext password to verify.
        hashed: The stored bcrypt hash.
    
    Returns:
        True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain, hashed)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate that a password meets institutional security requirements.
    
    Requirements:
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
    
    Args:
        password: The password to validate.
    
    Returns:
        A tuple of (is_valid, message). If valid, message is "Password meets all requirements."
        If invalid, message describes the first unmet requirement.
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."

    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit."

    if not re.search(r"[!@#$%^&*()\-_+=\[\]{}|;:,.<>?/\\`~\"']", password):
        return False, "Password must contain at least one special character."

    return True, "Password meets all requirements."
