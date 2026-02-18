import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Role } from '@/types/roles';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user || !allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
