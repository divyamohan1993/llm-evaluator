"""
Security Headers Middleware - SmartEvaluator-Omni
==================================================

Injects recommended security headers into every HTTP response to protect
against common web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.).

Created by: Divya Mohan (Software Architect)
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    ASGI middleware that appends security headers to all outgoing responses.
    """

    SECURITY_HEADERS = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "X-XSS-Protection": "0",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Content-Security-Policy": (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "font-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        ),
    }

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        for header_name, header_value in self.SECURITY_HEADERS.items():
            response.headers[header_name] = header_value
        return response
