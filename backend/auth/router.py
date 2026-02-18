"""
Auth API Routes - SmartEvaluator-Omni
=======================================

Endpoints for login, registration, token refresh, logout, password
change, and profile retrieval.

Created by: Divya Mohan (Software Architect)
"""

import hashlib
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.dependencies import CurrentUser, get_current_user
from backend.auth.jwt_handler import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from backend.auth.password import hash_password, verify_password, validate_password_strength
from backend.auth.schemas import (
    LoginRequest,
    PasswordChangeRequest,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from backend.auth.service import (
    authenticate_user,
    check_account_lockout,
    get_user_by_email,
    get_user_by_id,
    record_login_attempt,
    register_user,
)
from backend.db.base import get_db
from backend.db.models import RefreshToken, User


router = APIRouter(prefix="/auth", tags=["Authentication"])


def _get_client_ip(request: Request) -> str:
    """Extract the client IP from the request, respecting X-Forwarded-For."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _hash_token(token: str) -> str:
    """SHA-256 hash a token for safe database storage."""
    return hashlib.sha256(token.encode()).hexdigest()


def _build_token_pair(user: User, role_name: str) -> TokenResponse:
    """Create an access/refresh token pair for a user."""
    token_data = {
        "sub": user.id,
        "email": user.email,
        "tenant_id": user.tenant_id,
        "role": role_name,
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


def _get_primary_role_name(user: User) -> str:
    """Resolve the primary role name from a user's role assignments."""
    for ur in user.user_roles:
        if ur.is_primary and ur.role:
            return ur.role.name
    return "student"


def _ensure_utc(dt: datetime) -> datetime:
    """Ensure a datetime is timezone-aware (UTC). SQLite may store naive datetimes."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


# =============================================================================
# POST /auth/login
# =============================================================================

@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticate with email and password. Returns JWT access and refresh tokens.
    Implements account lockout after repeated failures.
    """
    ip = _get_client_ip(request)

    # Check if user exists first (for lockout tracking)
    user = await get_user_by_email(db, body.email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Check lockout
    if await check_account_lockout(user):
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account is temporarily locked due to repeated failed login attempts. Please try again later.",
        )

    # Verify password
    authenticated_user = await authenticate_user(db, body.email, body.password)
    if authenticated_user is None:
        await record_login_attempt(db, user, success=False, ip=ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not authenticated_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact your administrator.",
        )

    # Record success
    await record_login_attempt(db, authenticated_user, success=True, ip=ip)

    # Build tokens
    role_name = _get_primary_role_name(authenticated_user)
    token_response = _build_token_pair(authenticated_user, role_name)

    # Store refresh token hash
    refresh_record = RefreshToken(
        user_id=authenticated_user.id,
        token_hash=_hash_token(token_response.refresh_token),
        device_info={"user_agent": request.headers.get("user-agent", "")},
        ip_address=ip,
        expires_at=datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_record)
    await db.commit()

    return token_response


# =============================================================================
# POST /auth/register
# =============================================================================

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user account with the default student role."""
    try:
        user = await register_user(db, body)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    role_name = _get_primary_role_name(user)
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=role_name,
        is_active=user.is_active,
        created_at=user.created_at,
    )


# =============================================================================
# POST /auth/refresh
# =============================================================================

@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    request: Request,
    body: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Exchange a valid refresh token for a new access/refresh token pair.
    The old refresh token is rotated (marked as used).
    """
    # Decode the refresh token
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Refresh token required.",
        )

    user_id = payload.get("sub")
    token_hash = _hash_token(body.refresh_token)

    # Look up stored refresh token
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.user_id == user_id,
            RefreshToken.is_active == True,
        )
    )
    stored_token = result.scalar_one_or_none()
    if stored_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or already revoked.",
        )

    # Check expiration (handle timezone-naive SQLite datetimes)
    now = datetime.now(timezone.utc)
    expires_at = _ensure_utc(stored_token.expires_at)
    if expires_at < now:
        stored_token.is_active = False
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired.",
        )

    # Rotate: deactivate old token
    stored_token.is_active = False
    stored_token.rotated_at = now

    # Load user
    user = await get_user_by_id(db, user_id)
    if user is None or not user.is_active:
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated.",
        )

    # Issue new pair
    role_name = _get_primary_role_name(user)
    token_response = _build_token_pair(user, role_name)

    # Store new refresh token
    new_refresh = RefreshToken(
        user_id=user.id,
        token_hash=_hash_token(token_response.refresh_token),
        device_info=stored_token.device_info,
        ip_address=_get_client_ip(request),
        expires_at=now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(new_refresh)
    await db.commit()

    return token_response


# =============================================================================
# POST /auth/logout
# =============================================================================

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Logout the current user by revoking all active refresh tokens.
    """
    now = datetime.now(timezone.utc)
    await db.execute(
        update(RefreshToken)
        .where(
            RefreshToken.user_id == current_user.user_id,
            RefreshToken.is_active == True,
        )
        .values(is_active=False, revoked_at=now)
    )
    await db.commit()
    return None


# =============================================================================
# POST /auth/change-password
# =============================================================================

@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    body: PasswordChangeRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Change the current user's password. Requires the current password for
    verification. Validates the new password against strength requirements.
    """
    # Load full user record
    user = await get_user_by_id(db, current_user.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Verify current password
    if not verify_password(body.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    # Validate new password strength
    is_valid, msg = validate_password_strength(body.new_password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    # Update password
    user.password_hash = hash_password(body.new_password)
    user.password_changed_at = datetime.now(timezone.utc)
    user.must_change_password = False
    await db.commit()

    return {"message": "Password changed successfully."}


# =============================================================================
# GET /auth/me
# =============================================================================

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the authenticated user's profile."""
    user = await get_user_by_id(db, current_user.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=current_user.role,
        is_active=user.is_active,
        created_at=user.created_at,
    )
