"""
User Management API Routes - SmartEvaluator-Omni
==================================================

CRUD endpoints for managing user accounts and their role assignments.
All endpoints require appropriate permissions enforced via dependency injection.

Created by: Divya Mohan (Software Architect)
"""

import math
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.dependencies import CurrentUser, require_permission
from backend.auth.password import hash_password, validate_password_strength
from backend.db.base import get_db
from backend.db.models import Role, User, UserRole
from backend.users.schemas import (
    RoleAssignment,
    UserCreate,
    UserDetail,
    UserListItem,
    UserListResponse,
    UserUpdate,
)


router = APIRouter(prefix="/api/v1/users", tags=["User Management"])


# =============================================================================
# GET /api/v1/users - List Users (paginated)
# =============================================================================

@router.get("", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    is_active: bool | None = Query(None, description="Filter by active status"),
    search: str | None = Query(None, description="Search by name or email"),
    current_user: CurrentUser = Depends(require_permission("users.read")),
    db: AsyncSession = Depends(get_db),
):
    """List all users in the current tenant with pagination and filters."""
    base_query = select(User).where(User.tenant_id == current_user.tenant_id)

    if is_active is not None:
        base_query = base_query.where(User.is_active == is_active)

    if search:
        pattern = f"%{search}%"
        base_query = base_query.where(
            (User.email.ilike(pattern))
            | (User.first_name.ilike(pattern))
            | (User.last_name.ilike(pattern))
        )

    # Count total
    count_query = select(func.count()).select_from(base_query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    total_pages = max(1, math.ceil(total / page_size))

    # Fetch page
    offset = (page - 1) * page_size
    rows_query = (
        base_query
        .options(selectinload(User.user_roles).selectinload(UserRole.role))
        .order_by(User.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(rows_query)
    users = result.scalars().all()

    items = []
    for u in users:
        primary_role = None
        for ur in u.user_roles:
            if ur.is_primary and ur.role:
                primary_role = ur.role.display_name
                break
        items.append(
            UserListItem(
                id=u.id,
                email=u.email,
                first_name=u.first_name,
                last_name=u.last_name,
                is_active=u.is_active,
                primary_role=primary_role,
                created_at=u.created_at,
            )
        )

    return UserListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


# =============================================================================
# POST /api/v1/users - Create User
# =============================================================================

@router.post("", response_model=UserDetail, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: UserCreate,
    current_user: CurrentUser = Depends(require_permission("users.create")),
    db: AsyncSession = Depends(get_db),
):
    """Create a new user within the current tenant."""
    # Validate password
    is_valid, msg = validate_password_strength(body.password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    # Check duplicate email
    existing = await db.execute(
        select(User).where(
            User.tenant_id == current_user.tenant_id,
            User.email == body.email,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    user = User(
        tenant_id=current_user.tenant_id,
        email=body.email,
        username=body.username or body.email.split("@")[0],
        password_hash=hash_password(body.password),
        first_name=body.first_name,
        last_name=body.last_name,
        is_active=body.is_active,
    )
    db.add(user)
    await db.flush()

    # Assign role if specified
    role_names = []
    if body.role_id:
        result = await db.execute(
            select(Role).where(Role.id == body.role_id, Role.tenant_id == current_user.tenant_id)
        )
        role = result.scalar_one_or_none()
        if role is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found.")
        user_role = UserRole(user_id=user.id, role_id=role.id, is_primary=True)
        db.add(user_role)
        role_names.append(role.display_name)
    else:
        # Assign default student role
        result = await db.execute(
            select(Role).where(Role.tenant_id == current_user.tenant_id, Role.name == "student")
        )
        student_role = result.scalar_one_or_none()
        if student_role:
            user_role = UserRole(user_id=user.id, role_id=student_role.id, is_primary=True)
            db.add(user_role)
            role_names.append(student_role.display_name)

    await db.commit()
    await db.refresh(user)

    return UserDetail(
        id=user.id,
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        last_login_at=user.last_login_at,
        roles=role_names,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


# =============================================================================
# GET /api/v1/users/{user_id} - User Detail
# =============================================================================

@router.get("/{user_id}", response_model=UserDetail)
async def get_user(
    user_id: str,
    current_user: CurrentUser = Depends(require_permission("users.read")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve detailed information about a specific user."""
    result = await db.execute(
        select(User)
        .options(selectinload(User.user_roles).selectinload(UserRole.role))
        .where(User.id == user_id, User.tenant_id == current_user.tenant_id)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    role_names = [ur.role.display_name for ur in user.user_roles if ur.role]

    return UserDetail(
        id=user.id,
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        last_login_at=user.last_login_at,
        roles=role_names,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


# =============================================================================
# PATCH /api/v1/users/{user_id} - Update User
# =============================================================================

@router.patch("/{user_id}", response_model=UserDetail)
async def update_user(
    user_id: str,
    body: UserUpdate,
    current_user: CurrentUser = Depends(require_permission("users.update")),
    db: AsyncSession = Depends(get_db),
):
    """Partially update a user's profile fields."""
    result = await db.execute(
        select(User)
        .options(selectinload(User.user_roles).selectinload(UserRole.role))
        .where(User.id == user_id, User.tenant_id == current_user.tenant_id)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    update_data = body.model_dump(exclude_unset=True)
    for field_name, value in update_data.items():
        setattr(user, field_name, value)

    user.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(user)

    role_names = [ur.role.display_name for ur in user.user_roles if ur.role]

    return UserDetail(
        id=user.id,
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        last_login_at=user.last_login_at,
        roles=role_names,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


# =============================================================================
# DELETE /api/v1/users/{user_id} - Soft Delete User
# =============================================================================

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: CurrentUser = Depends(require_permission("users.delete")),
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a user by deactivating their account."""
    result = await db.execute(
        select(User).where(User.id == user_id, User.tenant_id == current_user.tenant_id)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if user.id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account.",
        )

    user.is_active = False
    user.updated_at = datetime.now(timezone.utc)
    await db.commit()
    return None


# =============================================================================
# POST /api/v1/users/{user_id}/roles - Assign Role
# =============================================================================

@router.post("/{user_id}/roles", status_code=status.HTTP_201_CREATED)
async def assign_role(
    user_id: str,
    body: RoleAssignment,
    current_user: CurrentUser = Depends(require_permission("users.assign_role")),
    db: AsyncSession = Depends(get_db),
):
    """Assign a role to a user."""
    # Verify user exists in tenant
    result = await db.execute(
        select(User).where(User.id == user_id, User.tenant_id == current_user.tenant_id)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Verify role exists in tenant
    result = await db.execute(
        select(Role).where(Role.id == body.role_id, Role.tenant_id == current_user.tenant_id)
    )
    role = result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found.")

    # Check if assignment already exists
    result = await db.execute(
        select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == body.role_id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already has this role assigned.",
        )

    # If this is a primary role, demote existing primary
    if body.is_primary:
        await db.execute(
            update(UserRole)
            .where(UserRole.user_id == user_id, UserRole.is_primary == True)
            .values(is_primary=False)
        )

    user_role = UserRole(
        user_id=user_id,
        role_id=body.role_id,
        is_primary=body.is_primary,
        expires_at=body.expires_at,
    )
    db.add(user_role)
    await db.commit()

    return {"message": f"Role '{role.display_name}' assigned to user.", "role_id": role.id}


# =============================================================================
# DELETE /api/v1/users/{user_id}/roles/{role_id} - Remove Role
# =============================================================================

@router.delete("/{user_id}/roles/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_role(
    user_id: str,
    role_id: str,
    current_user: CurrentUser = Depends(require_permission("users.assign_role")),
    db: AsyncSession = Depends(get_db),
):
    """Remove a role from a user."""
    result = await db.execute(
        select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id)
    )
    user_role = result.scalar_one_or_none()
    if user_role is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role assignment not found.",
        )

    await db.delete(user_role)
    await db.commit()
    return None
