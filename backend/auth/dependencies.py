"""
FastAPI Auth Dependencies - SmartEvaluator-Omni
=================================================

Provides injectable dependencies for route-level authentication and
authorization: token extraction, current user resolution, permission
checks, and role hierarchy enforcement.

Created by: Divya Mohan (Software Architect)
"""

from dataclasses import dataclass, field
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.jwt_handler import decode_token
from backend.auth.service import get_user_by_id, get_user_permissions
from backend.db.base import get_db
from backend.db.models import User


security_scheme = HTTPBearer()


@dataclass
class CurrentUser:
    """Resolved identity of the authenticated user."""
    user_id: str
    tenant_id: str
    email: str
    role: str
    role_depth: int
    permissions: list[str] = field(default_factory=list)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> CurrentUser:
    """
    FastAPI dependency that extracts and validates the JWT bearer token,
    resolves the user from the database, and builds a CurrentUser identity.
    
    Raises:
        HTTPException 401: If the token is invalid or user not found.
        HTTPException 403: If the user account is inactive.
    """
    payload = decode_token(credentials.credentials)

    token_type = payload.get("type")
    if token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Access token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    user = await get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated.",
        )

    # Determine primary role
    primary_role_name = "student"
    primary_role_depth = 99
    for ur in user.user_roles:
        if ur.is_primary and ur.role:
            primary_role_name = ur.role.name
            primary_role_depth = ur.role.hierarchy_depth
            break

    # Resolve permissions
    permissions = await get_user_permissions(db, user.id)

    return CurrentUser(
        user_id=user.id,
        tenant_id=user.tenant_id,
        email=user.email,
        role=primary_role_name,
        role_depth=primary_role_depth,
        permissions=permissions,
    )


def require_permission(permission: str):
    """
    Returns a FastAPI dependency that checks whether the current user
    holds a specific permission (e.g. "users.read").
    
    Usage:
        @router.get("/users", dependencies=[Depends(require_permission("users.read"))])
    """
    async def _check(current_user: CurrentUser = Depends(get_current_user)):
        if permission not in current_user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Required: {permission}",
            )
        return current_user
    return _check


def require_role(min_depth: int):
    """
    Returns a FastAPI dependency that enforces a minimum role hierarchy depth.
    Lower depth = higher privilege (e.g. super_admin=0, student=8).
    
    Usage:
        @router.get("/admin", dependencies=[Depends(require_role(2))])
    """
    async def _check(current_user: CurrentUser = Depends(get_current_user)):
        if current_user.role_depth > min_depth:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient role hierarchy. Required depth <= {min_depth}, your depth = {current_user.role_depth}.",
            )
        return current_user
    return _check
