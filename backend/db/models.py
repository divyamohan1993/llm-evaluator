"""
SQLAlchemy ORM Models - SmartEvaluator-Omni
=============================================

Defines all database tables for the multi-tenant examination system.
Uses UUID primary keys and timezone-aware timestamps throughout.

Created by: Divya Mohan (Software Architect)

Tables:
    - tenants: Multi-tenant institution records
    - roles: Hierarchical role definitions per tenant
    - permissions: Fine-grained resource.action permission entries
    - role_permissions: Many-to-many mapping of roles to permissions
    - users: User accounts with security metadata
    - user_roles: Many-to-many mapping of users to roles
    - refresh_tokens: JWT refresh token tracking and rotation
    - audit_logs: Immutable audit trail for all operations
    - exams: Examination definitions
    - exam_questions: Individual questions within exams
    - student_submissions: Student exam submission records
    - submission_answers: Individual answers with AI grading data
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from backend.db.base import Base


def _utcnow():
    """Return current UTC time with timezone info."""
    return datetime.now(timezone.utc)


def _new_uuid():
    """Generate a new UUID4 string."""
    return str(uuid.uuid4())


# =============================================================================
# Tenants
# =============================================================================

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    domain = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    settings = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)

    # Relationships
    roles = relationship("Role", back_populates="tenant", lazy="selectin")
    users = relationship("User", back_populates="tenant", lazy="selectin")
    audit_logs = relationship("AuditLog", back_populates="tenant", lazy="noload")
    exams = relationship("Exam", back_populates="tenant", lazy="noload")


# =============================================================================
# Roles
# =============================================================================

class Role(Base):
    __tablename__ = "roles"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    display_name = Column(String(200), nullable=False)
    hierarchy_depth = Column(Integer, nullable=False, default=99)
    is_system_role = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="roles")
    permissions = relationship(
        "Permission",
        secondary="role_permissions",
        back_populates="roles",
        lazy="selectin",
    )
    user_roles = relationship("UserRole", back_populates="role", lazy="noload")

    __table_args__ = (
        Index("ix_roles_tenant_name", "tenant_id", "name", unique=True),
    )


# =============================================================================
# Permissions
# =============================================================================

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    resource = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)

    # Relationships
    roles = relationship(
        "Role",
        secondary="role_permissions",
        back_populates="permissions",
        lazy="noload",
    )

    __table_args__ = (
        UniqueConstraint("resource", "action", name="uq_permission_resource_action"),
        Index("ix_permissions_resource_action", "resource", "action"),
    )


# =============================================================================
# Role-Permissions (Association Table)
# =============================================================================

class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(
        String(36),
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    permission_id = Column(
        String(36),
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    )


# =============================================================================
# Users
# =============================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    email = Column(String(320), nullable=False, index=True)
    username = Column(String(150), nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    failed_login_count = Column(Integer, default=0, nullable=False)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    last_login_ip = Column(String(45), nullable=True)
    password_changed_at = Column(DateTime(timezone=True), default=_utcnow, nullable=True)
    must_change_password = Column(Boolean, default=False, nullable=False)
    profile = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    user_roles = relationship("UserRole", back_populates="user", lazy="selectin", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", lazy="noload", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", lazy="noload")
    created_exams = relationship("Exam", back_populates="created_by_user", lazy="noload")
    submissions = relationship("StudentSubmission", back_populates="student", lazy="noload")

    __table_args__ = (
        UniqueConstraint("tenant_id", "email", name="uq_user_tenant_email"),
        Index("ix_users_tenant_email", "tenant_id", "email"),
    )


# =============================================================================
# User-Roles (Association Table with metadata)
# =============================================================================

class UserRole(Base):
    __tablename__ = "user_roles"

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    role_id = Column(
        String(36),
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    is_primary = Column(Boolean, default=False, nullable=False)
    granted_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles", lazy="selectin")


# =============================================================================
# Refresh Tokens
# =============================================================================

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(255), unique=True, nullable=False, index=True)
    device_info = Column(JSON, default=dict)
    ip_address = Column(String(45), nullable=True)
    issued_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    rotated_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    user = relationship("User", back_populates="refresh_tokens")

    __table_args__ = (
        Index("ix_refresh_tokens_user_active", "user_id", "is_active"),
    )


# =============================================================================
# Audit Logs
# =============================================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=True)
    resource_id = Column(String(36), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    status = Column(String(50), default="success", nullable=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False, index=True)

    # Relationships
    tenant = relationship("Tenant", back_populates="audit_logs")
    user = relationship("User", back_populates="audit_logs")

    __table_args__ = (
        Index("ix_audit_logs_tenant_created", "tenant_id", "created_at"),
        Index("ix_audit_logs_user_created", "user_id", "created_at"),
        Index("ix_audit_logs_action", "action"),
    )


# =============================================================================
# Exams
# =============================================================================

class Exam(Base):
    __tablename__ = "exams"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(200), nullable=True)
    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="exams")
    created_by_user = relationship("User", back_populates="created_exams")
    questions = relationship("ExamQuestion", back_populates="exam", lazy="selectin", cascade="all, delete-orphan")
    submissions = relationship("StudentSubmission", back_populates="exam", lazy="noload")

    __table_args__ = (
        Index("ix_exams_tenant_active", "tenant_id", "is_active"),
    )


# =============================================================================
# Exam Questions
# =============================================================================

class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    exam_id = Column(String(36), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    max_marks = Column(Float, nullable=False, default=10.0)
    order_index = Column(Integer, nullable=False, default=0)

    # Relationships
    exam = relationship("Exam", back_populates="questions")
    answers = relationship("SubmissionAnswer", back_populates="question", lazy="noload")

    __table_args__ = (
        Index("ix_exam_questions_exam_order", "exam_id", "order_index"),
    )


# =============================================================================
# Student Submissions
# =============================================================================

class StudentSubmission(Base):
    __tablename__ = "student_submissions"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    exam_id = Column(String(36), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="in_progress", nullable=False)
    total_score = Column(Float, nullable=True)
    letter_grade = Column(String(5), nullable=True)
    anti_cheat_violations = Column(Integer, default=0, nullable=False)
    is_flagged = Column(Boolean, default=False, nullable=False)

    # Relationships
    exam = relationship("Exam", back_populates="submissions")
    student = relationship("User", back_populates="submissions")
    answers = relationship("SubmissionAnswer", back_populates="submission", lazy="selectin", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_submissions_exam_student", "exam_id", "student_id"),
        Index("ix_submissions_status", "status"),
    )


# =============================================================================
# Submission Answers
# =============================================================================

class SubmissionAnswer(Base):
    __tablename__ = "submission_answers"

    id = Column(String(36), primary_key=True, default=_new_uuid)
    submission_id = Column(String(36), ForeignKey("student_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("exam_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    answer_text = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    agent_votes = Column(JSON, default=dict)
    feedback = Column(Text, nullable=True)
    time_spent_seconds = Column(Integer, default=0, nullable=False)

    # Relationships
    submission = relationship("StudentSubmission", back_populates="answers")
    question = relationship("ExamQuestion", back_populates="answers")

    __table_args__ = (
        Index("ix_submission_answers_submission_question", "submission_id", "question_id"),
    )
