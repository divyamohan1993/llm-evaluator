# Multi-stage build for SmartEvaluator-Omni
FROM python:3.11-slim AS backend-builder
WORKDIR /app
COPY requirements.txt requirements-test.txt ./
RUN pip install --no-cache-dir --prefix=/install -r requirements-test.txt

FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --production=false
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS production
WORKDIR /app

# Security: non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy Python deps
COPY --from=backend-builder /install /usr/local

# Copy backend source
COPY backend/ ./backend/
COPY config/ ./config/
COPY data/ ./data/

# Copy frontend build
COPY --from=frontend-builder /app/dist ./frontend/dist

# Security headers
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Create data directory
RUN mkdir -p /app/data && chown -R appuser:appuser /app

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
