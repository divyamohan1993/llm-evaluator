import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LandingPage from '@/features/landing/LandingPage';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import AppShell from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/features/auth/guards/ProtectedRoute';
import { RoleGuard } from '@/features/auth/guards/RoleGuard';
import { Role } from '@/types/roles';

import StudentDashboard from '@/features/student/pages/StudentDashboard';
import ExamTakingPage from '@/features/student/pages/ExamTakingPage';
import TeacherDashboard from '@/features/teacher/pages/TeacherDashboard';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import UserManagement from '@/features/admin/pages/UserManagement';
import ExamCellDashboard from '@/features/exam-cell/pages/ExamCellDashboard';
import NotFoundPage from '@/features/errors/NotFoundPage';
import UnauthorizedPage from '@/features/errors/UnauthorizedPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const ADMIN_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.CHANCELLOR,
  Role.DIRECTOR,
  Role.HEAD_OF_SCHOOL,
  Role.IN_CHARGE,
];

const EXAM_CELL_ROLES: Role[] = [Role.EXAM_CELL_HEAD, Role.EXAM_CELL_MEMBER];

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      /* Student routes */
      {
        path: 'student',
        element: (
          <RoleGuard allowedRoles={[Role.STUDENT]}>
            <StudentDashboard />
          </RoleGuard>
        ),
      },
      {
        path: 'student/exam/:id',
        element: (
          <RoleGuard allowedRoles={[Role.STUDENT]}>
            <ExamTakingPage />
          </RoleGuard>
        ),
      },
      /* Teacher routes */
      {
        path: 'teacher',
        element: (
          <RoleGuard allowedRoles={[Role.TEACHER]}>
            <TeacherDashboard />
          </RoleGuard>
        ),
      },
      /* Admin routes */
      {
        path: 'admin',
        element: (
          <RoleGuard allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <RoleGuard allowedRoles={ADMIN_ROLES}>
            <UserManagement />
          </RoleGuard>
        ),
      },
      /* Exam Cell routes */
      {
        path: 'exam-cell',
        element: (
          <RoleGuard allowedRoles={EXAM_CELL_ROLES}>
            <ExamCellDashboard />
          </RoleGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
