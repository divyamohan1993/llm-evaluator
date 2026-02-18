"""
Auth Pydantic Schemas - SmartEvaluator-Omni
=============================================

Request/response models for all authentication endpoints.

Created by: Divya Mohan (Software Architect)
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Login request payload."""
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """JWT token pair response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Access token lifetime in seconds")


class RegisterRequest(BaseModel):
    """New user registration payload."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=150)
    last_name: str = Field(..., min_length=1, max_length=150)
    tenant_slug: str = Field(default="default-institution", max_length=100)


class UserResponse(BaseModel):
    """Public user profile response."""
    id: str
    email: str
    first_name: str
    last_name: str
    role: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PasswordChangeRequest(BaseModel):
    """Password change payload (requires current password)."""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)


class PasswordResetRequest(BaseModel):
    """Password reset request (email-based)."""
    email: EmailStr


class RefreshRequest(BaseModel):
    """Refresh token request payload."""
    refresh_token: str
