"""
JWT Token Management - SmartEvaluator-Omni
============================================

Handles creation and verification of JWT access and refresh tokens.
Uses python-jose with HS256 algorithm.

Created by: Divya Mohan (Software Architect)
"""

import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from jose import JWTError, jwt


SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_urlsafe(64))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a signed JWT access token.
    
    Each token includes a unique `jti` (JWT ID) claim to guarantee uniqueness.
    
    Args:
        data: Payload to encode in the token (must include 'sub' for user identity).
        expires_delta: Custom expiration time. Defaults to ACCESS_TOKEN_EXPIRE_MINUTES.
    
    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({
        "exp": expire,
        "type": "access",
        "jti": str(uuid.uuid4()),
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a signed JWT refresh token with a longer lifespan.
    
    Each token includes a unique `jti` (JWT ID) claim to guarantee uniqueness.
    
    Args:
        data: Payload to encode (must include 'sub' for user identity).
        expires_delta: Custom expiration time. Defaults to REFRESH_TOKEN_EXPIRE_DAYS.
    
    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "jti": str(uuid.uuid4()),
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT token.
    
    Args:
        token: The JWT string to decode.
    
    Returns:
        The decoded payload dictionary.
    
    Raises:
        HTTPException: 401 if the token is invalid, expired, or malformed.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing subject claim.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
