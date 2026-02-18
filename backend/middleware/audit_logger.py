"""
Audit Logger Middleware - SmartEvaluator-Omni
==============================================

Automatically logs all write operations (POST, PUT, PATCH, DELETE)
to the audit_logs table via FastAPI background tasks.

Created by: Divya Mohan (Software Architect)
"""

import uuid
from datetime import datetime, timezone

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from backend.db.base import async_session_factory
from backend.db.models import AuditLog


WRITE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


class AuditLoggerMiddleware(BaseHTTPMiddleware):
    """
    ASGI middleware that captures metadata from mutating HTTP requests
    and persists an audit trail entry after the response is sent.
    """

    def _get_client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def _extract_user_id(self, request: Request) -> str | None:
        """
        Attempt to extract user_id from the request state.
        This will be set by the auth dependency if the endpoint requires auth.
        Falls back to None for unauthenticated write endpoints (login, register).
        """
        return getattr(request.state, "user_id", None)

    def _extract_tenant_id(self, request: Request) -> str | None:
        return getattr(request.state, "tenant_id", None)

    async def dispatch(self, request: Request, call_next) -> Response:
        # Initialize state attributes for downstream use
        if not hasattr(request.state, "user_id"):
            request.state.user_id = None
        if not hasattr(request.state, "tenant_id"):
            request.state.tenant_id = None

        response = await call_next(request)

        if request.method in WRITE_METHODS:
            # Fire-and-forget audit log write
            await self._write_audit_log(request, response)

        return response

    async def _write_audit_log(self, request: Request, response: Response) -> None:
        """Persist an audit log entry in a separate session."""
        try:
            path = request.url.path
            method = request.method

            # Determine resource type and action from the URL path
            path_parts = [p for p in path.split("/") if p]
            resource_type = path_parts[-1] if path_parts else "unknown"
            action = f"{method.lower()}:{path}"

            # Determine status
            status_code = response.status_code
            if 200 <= status_code < 400:
                log_status = "success"
            elif 400 <= status_code < 500:
                log_status = "client_error"
            else:
                log_status = "server_error"

            async with async_session_factory() as session:
                audit_entry = AuditLog(
                    id=str(uuid.uuid4()),
                    tenant_id=self._extract_tenant_id(request),
                    user_id=self._extract_user_id(request),
                    action=action,
                    resource_type=resource_type,
                    resource_id=None,
                    details={
                        "method": method,
                        "path": path,
                        "status_code": status_code,
                        "query_params": dict(request.query_params),
                    },
                    ip_address=self._get_client_ip(request),
                    user_agent=request.headers.get("user-agent", ""),
                    status=log_status,
                    created_at=datetime.now(timezone.utc),
                )
                session.add(audit_entry)
                await session.commit()
        except Exception:
            # Audit logging failures must never break the request pipeline.
            # In production, this would be sent to a dedicated error tracking service.
            pass
