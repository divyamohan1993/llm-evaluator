"""
Rate Limiter Middleware - SmartEvaluator-Omni
==============================================

Simple in-memory sliding-window rate limiter that tracks requests per IP.
Returns HTTP 429 Too Many Requests when the threshold is exceeded.

Created by: Divya Mohan (Software Architect)

Note: This is suitable for single-process deployments. For multi-process
or distributed deployments, replace with a Redis-backed rate limiter.
"""

import time
from collections import defaultdict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    In-memory rate limiter using a sliding window per client IP.
    
    Args:
        app: The ASGI application.
        max_requests: Maximum number of requests allowed per window.
        window_seconds: The sliding window duration in seconds.
    """

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # Map of IP -> list of request timestamps
        self._request_log: dict[str, list[float]] = defaultdict(list)

    def _get_client_ip(self, request: Request) -> str:
        """Extract the client IP, respecting X-Forwarded-For."""
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def _cleanup_old_entries(self, ip: str, now: float) -> None:
        """Remove timestamps outside the current window."""
        cutoff = now - self.window_seconds
        self._request_log[ip] = [
            ts for ts in self._request_log[ip] if ts > cutoff
        ]
        # Prevent unbounded memory growth for stale IPs
        if not self._request_log[ip]:
            del self._request_log[ip]

    async def dispatch(self, request: Request, call_next) -> Response:
        ip = self._get_client_ip(request)
        now = time.time()

        self._cleanup_old_entries(ip, now)

        request_count = len(self._request_log.get(ip, []))
        if request_count >= self.max_requests:
            retry_after = self.window_seconds
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Please slow down.",
                    "retry_after_seconds": retry_after,
                },
                headers={"Retry-After": str(retry_after)},
            )

        self._request_log[ip].append(now)
        response = await call_next(request)
        return response
