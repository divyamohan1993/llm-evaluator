"""
Authentication Business Logic - SmartEvaluator-Omni
=====================================================

Core authentication services: user lookup, registration, login attempt
tracking, account lockout, and permission resolution.

Created by: Divya Mohan (Software Architect)
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.password import hash_password, verify_password, validate_password_strength
from backend.auth.schemas import RegisterRequest
from backend.db.models import (
    Permission,
    Role,
    RolePermission,
    Tenant,
    User,
    UserRole,
)


LOCKOUT_THRESHOLD = 5
LOCKOUT_DURATION_MINUTES = 30


async def authenticate_user(
    db: AsyncSession,
    email: str,
    password: str,
) -> Optional[User]:
    """
    Authenticate a user by email and password.
    
    Args:
        db: Async database session.
        email: User email address.
        password: Plaintext password to verify.
    
    Returns:
        The User object if authentication succeeds, None otherwise.
    """
    user = await get_user_by_email(db, email)
    if user is None:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


async def register_user(
    db: AsyncSession,
    data: RegisterRequest,
) -> User:
    """
    Register a new user account.
    
    Validates password strength, resolves the tenant by slug, assigns the
    default "student" role, and persists the new user.
    
    Args:
        db: Async database session.
        data: Registration request data.
    
    Returns:
        The newly created User object with user_roles eagerly loaded.
    
    Raises:
        ValueError: If password is weak, tenant not found, email taken, or role missing.
    """
    is_valid, msg = validate_password_strength(data.password)
    if not is_valid:
        raise ValueError(msg)

    # Resolve tenant
    result = await db.execute(
        select(Tenant).where(Tenant.slug == data.tenant_slug, Tenant.is_active == True)
    )
    tenant = result.scalar_one_or_none()
    if tenant is None:
        raise ValueError(f"Tenant '{data.tenant_slug}' not found or inactive.")

    # Check for duplicate email within tenant
    result = await db.execute(
        select(User).where(User.tenant_id == tenant.id, User.email == data.email)
    )
    existing = result.scalar_one_or_none()
    if existing is not None:
        raise ValueError("A user with this email already exists in this institution.")

    # Resolve default student role
    result = await db.execute(
        select(Role).where(Role.tenant_id == tenant.id, Role.name == "student")
    )
    student_role = result.scalar_one_or_none()
    if student_role is None:
        raise ValueError("Default student role not configured for this institution.")

    # Create user
    user = User(
        tenant_id=tenant.id,
        email=data.email,
        username=data.email.split("@")[0],
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Assign student role
    user_role = UserRole(
        user_id=user.id,
        role_id=student_role.id,
        is_primary=True,
    )
    db.add(user_role)
    await db.commit()

    # Re-fetch with eager loading to avoid lazy-load issues outside async context
    result = await db.execute(
        select(User)
        .options(selectinload(User.user_roles).selectinload(UserRole.role))
        .where(User.id == user.id)
    )
    return result.scalar_one()


async def get_user_by_email(
    db: AsyncSession,
    email: str,
) -> Optional[User]:
    """
    Look up a user by email address (across all tenants).
    
    Args:
        db: Async database session.
        email: The email to search for.
    
    Returns:
        The User object or None.
    """
    result = await db.execute(
        select(User)
        .options(selectinload(User.user_roles).selectinload(UserRole.role))
        .where(User.email == email)
    )
    return result.scalar_one_or_none()


async def get_user_by_id(
    db: AsyncSession,
    user_id: str,
) -> Optional[User]:
    """
    Look up a user by their UUID.
    
    Args:
        db: Async database session.
        user_id: The user's UUID string.
    
    Returns:
        The User object or None.
    """
    result = await db.execute(
        select(User)
        .options(selectinload(User.user_roles).selectinload(UserRole.role))
        .where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_permissions(
    db: AsyncSession,
    user_id: str,
) -> list[str]:
    """
    Resolve all permissions for a user by aggregating across all assigned roles.
    
    Args:
        db: Async database session.
        user_id: The user's UUID.
    
    Returns:
        List of permission strings in "resource.action" format.
    """
    result = await db.execute(
        select(Permission.resource, Permission.action)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .join(Role, Role.id == RolePermission.role_id)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == user_id)
        .where(Role.is_active == True)
    )
    rows = result.all()
    return [f"{row.resource}.{row.action}" for row in rows]


async def record_login_attempt(
    db: AsyncSession,
    user: User,
    success: bool,
    ip: str,
) -> None:
    """
    Record a login attempt. On success, resets the failure counter and updates
    last_login metadata. On failure, increments the counter and potentially
    locks the account.
    
    Args:
        db: Async database session.
        user: The User object.
        success: Whether the login was successful.
        ip: The client IP address.
    """
    now = datetime.now(timezone.utc)
    if success:
        user.failed_login_count = 0
        user.locked_until = None
        user.last_login_at = now
        user.last_login_ip = ip
    else:
        user.failed_login_count = (user.failed_login_count or 0) + 1
        if user.failed_login_count >= LOCKOUT_THRESHOLD:
            user.locked_until = now + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
    await db.commit()


async def check_account_lockout(user: User) -> bool:
    """
    Check whether a user account is currently locked out.
    
    A user is locked if failed_login_count >= LOCKOUT_THRESHOLD and
    locked_until is in the future.
    
    Args:
        user: The User object to check.
    
    Returns:
        True if the account is locked, False otherwise.
    """
    if user.failed_login_count is None or user.failed_login_count < LOCKOUT_THRESHOLD:
        return False
    if user.locked_until is None:
        return False
    now = datetime.now(timezone.utc)
    return user.locked_until > now
