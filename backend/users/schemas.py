"""
User Management Pydantic Schemas - SmartEvaluator-Omni
=======================================================

Request/response models for user CRUD and role management endpoints.

Created by: Divya Mohan (Software Architect)
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Admin-initiated user creation payload."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=150)
    last_name: str = Field(..., min_length=1, max_length=150)
    username: Optional[str] = Field(None, max_length=150)
    is_active: bool = True
    role_id: Optional[str] = Field(None, description="Initial role to assign")


class UserUpdate(BaseModel):
    """Partial user update payload."""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, max_length=150)
    last_name: Optional[str] = Field(None, max_length=150)
    username: Optional[str] = Field(None, max_length=150)
    is_active: Optional[bool] = None
    must_change_password: Optional[bool] = None
    profile: Optional[dict] = None


class UserDetail(BaseModel):
    """Detailed user response including roles."""
    id: str
    email: str
    username: Optional[str] = None
    first_name: str
    last_name: str
    is_active: bool
    last_login_at: Optional[datetime] = None
    roles: list[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserListItem(BaseModel):
    """Abbreviated user info for list responses."""
    id: str
    email: str
    first_name: str
    last_name: str
    is_active: bool
    primary_role: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    """Paginated user list response."""
    items: list[UserListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class RoleAssignment(BaseModel):
    """Payload for assigning a role to a user."""
    role_id: str
    is_primary: bool = False
    expires_at: Optional[datetime] = None
