import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Brain,
  Home,
  Users,
  FileText,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  BookOpen,
  ClipboardList,
  Shield,
  GraduationCap,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { Role, ROLE_LABELS } from '@/types/roles';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getNavItems(role: string): NavItem[] {
  switch (role) {
    case Role.SUPER_ADMIN:
    case Role.CHANCELLOR:
    case Role.DIRECTOR:
    case Role.HEAD_OF_SCHOOL:
    case Role.IN_CHARGE:
      return [
        { label: 'Dashboard', href: '/app/admin', icon: <Home className="h-5 w-5" /> },
        { label: 'User Management', href: '/app/admin/users', icon: <Users className="h-5 w-5" /> },
        { label: 'Analytics', href: '/app/admin', icon: <BarChart3 className="h-5 w-5" /> },
        { label: 'Settings', href: '/app/admin', icon: <Settings className="h-5 w-5" /> },
      ];
    case Role.EXAM_CELL_HEAD:
    case Role.EXAM_CELL_MEMBER:
      return [
        { label: 'Dashboard', href: '/app/exam-cell', icon: <Home className="h-5 w-5" /> },
        { label: 'Exams', href: '/app/exam-cell', icon: <ClipboardList className="h-5 w-5" /> },
        { label: 'Schedule', href: '/app/exam-cell', icon: <Calendar className="h-5 w-5" /> },
        { label: 'Integrity', href: '/app/exam-cell', icon: <Shield className="h-5 w-5" /> },
      ];
    case Role.TEACHER:
      return [
        { label: 'Dashboard', href: '/app/teacher', icon: <Home className="h-5 w-5" /> },
        { label: 'Grading', href: '/app/teacher', icon: <FileText className="h-5 w-5" /> },
        { label: 'My Classes', href: '/app/teacher', icon: <BookOpen className="h-5 w-5" /> },
        { label: 'Analytics', href: '/app/teacher', icon: <BarChart3 className="h-5 w-5" /> },
      ];
    case Role.STUDENT:
    default:
      return [
        { label: 'Dashboard', href: '/app/student', icon: <Home className="h-5 w-5" /> },
        { label: 'My Exams', href: '/app/student', icon: <GraduationCap className="h-5 w-5" /> },
        { label: 'Results', href: '/app/student', icon: <BarChart3 className="h-5 w-5" /> },
      ];
  }
}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navItems = getNavItems(user?.role ?? Role.STUDENT);
  const roleLabel = user ? ROLE_LABELS[user.role as Role] ?? user.role : '';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-navy-50">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r border-navy-100 transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2 border-b border-navy-100 px-6">
          <Brain className="h-7 w-7 text-navy-700" />
          <span className="text-lg font-bold text-navy-950">
            Smart<span className="text-navy-600">Eval</span>
          </span>
          <button
            type="button"
            className="ml-auto lg:hidden text-navy-400"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-navy-100 text-navy-900'
                    : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-navy-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-200 text-sm font-bold text-navy-700">
              {user?.first_name?.charAt(0) ?? 'U'}
              {user?.last_name?.charAt(0) ?? ''}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-navy-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="truncate text-xs text-navy-500">{roleLabel}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-navy-100 bg-white px-6">
          <button
            type="button"
            className="lg:hidden text-navy-600"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-lg p-2 text-navy-500 hover:bg-navy-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-navy-700 hover:bg-navy-50 transition-colors"
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-200 text-xs font-bold text-navy-700">
                {user?.first_name?.charAt(0) ?? 'U'}
              </div>
              <span className="hidden sm:block font-medium">
                {user?.first_name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white border border-navy-100 shadow-lg py-1"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
