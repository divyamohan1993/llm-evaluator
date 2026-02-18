"""
Database Seed Script - SmartEvaluator-Omni
============================================

Initializes the database with default tenant, hierarchical roles,
fine-grained permissions, role-permission mappings, and a super-admin user.

Created by: Divya Mohan (Software Architect)
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.password import hash_password
from backend.db.models import (
    Permission,
    Role,
    RolePermission,
    Tenant,
    User,
    UserRole,
)


def _id() -> str:
    return str(uuid.uuid4())


# =============================================================================
# Permission Definitions
# =============================================================================

PERMISSIONS = [
    # Users
    ("users", "create", "Create user accounts"),
    ("users", "read", "View user profiles"),
    ("users", "update", "Modify user accounts"),
    ("users", "delete", "Deactivate user accounts"),
    ("users", "assign_role", "Assign roles to users"),
    # Roles
    ("roles", "create", "Create new roles"),
    ("roles", "read", "View roles and permissions"),
    ("roles", "update", "Modify role definitions"),
    ("roles", "delete", "Delete roles"),
    # Exams
    ("exams", "create", "Create examinations"),
    ("exams", "read", "View examination details"),
    ("exams", "update", "Modify examinations"),
    ("exams", "delete", "Delete examinations"),
    ("exams", "schedule", "Schedule examination dates"),
    ("exams", "publish", "Publish examinations to students"),
    # Questions
    ("questions", "create", "Create exam questions"),
    ("questions", "read", "View exam questions"),
    ("questions", "update", "Modify exam questions"),
    ("questions", "delete", "Delete exam questions"),
    # Submissions
    ("submissions", "create", "Submit exam answers"),
    ("submissions", "read", "View submission details"),
    ("submissions", "grade", "Grade student submissions"),
    ("submissions", "override", "Override AI-generated grades"),
    ("submissions", "export", "Export submission data"),
    # Reports
    ("reports", "view", "View analytical reports"),
    ("reports", "export", "Export reports to PDF/CSV"),
    # Audit
    ("audit", "read", "View audit trail logs"),
    # Settings
    ("settings", "read", "View system settings"),
    ("settings", "update", "Modify system settings"),
    # Tenants
    ("tenants", "read", "View tenant information"),
    ("tenants", "update", "Modify tenant settings"),
]


# =============================================================================
# Role Definitions (name, display_name, hierarchy_depth)
# =============================================================================

ROLES = [
    ("super_admin", "Super Administrator", 0),
    ("chancellor", "Chancellor", 1),
    ("director", "Director", 2),
    ("head_of_school", "Head of School", 3),
    ("in_charge", "In-Charge", 4),
    ("exam_cell_head", "Exam Cell Head", 5),
    ("exam_cell_member", "Exam Cell Member", 6),
    ("teacher", "Teacher", 7),
    ("student", "Student", 8),
]


# =============================================================================
# Role-Permission Mapping
# =============================================================================

ROLE_PERMISSIONS = {
    "super_admin": [
        # Super admin gets everything
        "users.create", "users.read", "users.update", "users.delete", "users.assign_role",
        "roles.create", "roles.read", "roles.update", "roles.delete",
        "exams.create", "exams.read", "exams.update", "exams.delete", "exams.schedule", "exams.publish",
        "questions.create", "questions.read", "questions.update", "questions.delete",
        "submissions.create", "submissions.read", "submissions.grade", "submissions.override", "submissions.export",
        "reports.view", "reports.export",
        "audit.read",
        "settings.read", "settings.update",
        "tenants.read", "tenants.update",
    ],
    "chancellor": [
        "users.read", "users.update", "users.assign_role",
        "roles.read",
        "exams.read", "exams.update", "exams.schedule", "exams.publish",
        "questions.read",
        "submissions.read", "submissions.override", "submissions.export",
        "reports.view", "reports.export",
        "audit.read",
        "settings.read", "settings.update",
        "tenants.read", "tenants.update",
    ],
    "director": [
        "users.read", "users.update", "users.assign_role",
        "roles.read",
        "exams.create", "exams.read", "exams.update", "exams.schedule", "exams.publish",
        "questions.read",
        "submissions.read", "submissions.override", "submissions.export",
        "reports.view", "reports.export",
        "audit.read",
        "settings.read",
        "tenants.read",
    ],
    "head_of_school": [
        "users.read", "users.create", "users.update",
        "roles.read",
        "exams.create", "exams.read", "exams.update", "exams.schedule", "exams.publish",
        "questions.create", "questions.read", "questions.update",
        "submissions.read", "submissions.grade", "submissions.override", "submissions.export",
        "reports.view", "reports.export",
    ],
    "in_charge": [
        "users.read",
        "exams.create", "exams.read", "exams.update", "exams.schedule",
        "questions.create", "questions.read", "questions.update",
        "submissions.read", "submissions.grade", "submissions.export",
        "reports.view", "reports.export",
    ],
    "exam_cell_head": [
        "users.read",
        "exams.create", "exams.read", "exams.update", "exams.delete", "exams.schedule", "exams.publish",
        "questions.create", "questions.read", "questions.update", "questions.delete",
        "submissions.read", "submissions.grade", "submissions.override", "submissions.export",
        "reports.view", "reports.export",
        "audit.read",
    ],
    "exam_cell_member": [
        "users.read",
        "exams.create", "exams.read", "exams.update", "exams.schedule",
        "questions.create", "questions.read", "questions.update",
        "submissions.read", "submissions.grade", "submissions.export",
        "reports.view",
    ],
    "teacher": [
        "exams.create", "exams.read", "exams.update",
        "questions.create", "questions.read", "questions.update", "questions.delete",
        "submissions.read", "submissions.grade",
        "reports.view",
    ],
    "student": [
        "exams.read",
        "questions.read",
        "submissions.create", "submissions.read",
    ],
}


async def seed_database(db: AsyncSession) -> None:
    """
    Seed the database with initial data if not already populated.
    
    Idempotent: checks for existing default tenant before seeding.
    
    Args:
        db: Async database session.
    """
    # Check if already seeded
    result = await db.execute(
        select(Tenant).where(Tenant.slug == "default-institution")
    )
    if result.scalar_one_or_none() is not None:
        print("  Database already seeded. Skipping.")
        return

    print("  Seeding database with default data...")

    # -------------------------------------------------------------------------
    # 1. Create default tenant
    # -------------------------------------------------------------------------
    tenant_id = _id()
    tenant = Tenant(
        id=tenant_id,
        name="Default Institution",
        slug="default-institution",
        domain="smartevaluator.local",
        is_active=True,
        settings={
            "grading_mode": "balanced",
            "plagiarism_threshold": 0.7,
            "ai_detection_threshold": 0.8,
        },
    )
    db.add(tenant)

    # -------------------------------------------------------------------------
    # 2. Create permissions
    # -------------------------------------------------------------------------
    permission_map: dict[str, str] = {}  # "resource.action" -> id
    for resource, action, description in PERMISSIONS:
        perm_id = _id()
        perm_key = f"{resource}.{action}"
        permission_map[perm_key] = perm_id
        db.add(Permission(
            id=perm_id,
            resource=resource,
            action=action,
            description=description,
        ))

    # -------------------------------------------------------------------------
    # 3. Create roles
    # -------------------------------------------------------------------------
    role_map: dict[str, str] = {}  # role_name -> id
    for role_name, display_name, depth in ROLES:
        role_id = _id()
        role_map[role_name] = role_id
        db.add(Role(
            id=role_id,
            tenant_id=tenant_id,
            name=role_name,
            display_name=display_name,
            hierarchy_depth=depth,
            is_system_role=True,
            is_active=True,
        ))

    # -------------------------------------------------------------------------
    # 4. Map role -> permissions
    # -------------------------------------------------------------------------
    for role_name, perm_keys in ROLE_PERMISSIONS.items():
        role_id = role_map[role_name]
        for perm_key in perm_keys:
            perm_id = permission_map.get(perm_key)
            if perm_id:
                db.add(RolePermission(role_id=role_id, permission_id=perm_id))

    # -------------------------------------------------------------------------
    # 5. Create default super_admin user
    # -------------------------------------------------------------------------
    admin_id = _id()
    admin = User(
        id=admin_id,
        tenant_id=tenant_id,
        email="admin@smartevaluator.com",
        username="admin",
        password_hash=hash_password("Admin@123456"),
        first_name="System",
        last_name="Administrator",
        is_active=True,
    )
    db.add(admin)

    # Assign super_admin role
    db.add(UserRole(
        user_id=admin_id,
        role_id=role_map["super_admin"],
        is_primary=True,
    ))

    await db.commit()
    print("  Database seeded successfully.")
    print(f"    Tenant: Default Institution (slug: default-institution)")
    print(f"    Roles: {len(ROLES)} system roles created")
    print(f"    Permissions: {len(PERMISSIONS)} permissions created")
    print(f"    Admin: admin@smartevaluator.com / Admin@123456")
