import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/api/client';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/stores/useAuthStore';
import { Role } from '@/types/roles';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

function getDashboardPath(role: string): string {
  switch (role) {
    case Role.SUPER_ADMIN:
    case Role.CHANCELLOR:
    case Role.DIRECTOR:
      return '/app/admin';
    case Role.HEAD_OF_SCHOOL:
    case Role.IN_CHARGE:
      return '/app/admin';
    case Role.EXAM_CELL_HEAD:
    case Role.EXAM_CELL_MEMBER:
      return '/app/exam-cell';
    case Role.TEACHER:
      return '/app/teacher';
    case Role.STUDENT:
      return '/app/student';
    default:
      return '/app/student';
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const res = await api.post<LoginResponse>('/auth/login', data);
      login(res.access_token, res.refresh_token, res.user);

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from ?? getDashboardPath(res.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2" aria-label="Back to home">
            <Brain className="h-8 w-8 text-navy-700" />
            <span className="text-xl font-bold text-navy-950">
              Smart<span className="text-navy-600">Evaluator</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-navy-950">Welcome back</h1>
          <p className="mt-2 text-navy-600">Sign in to your account to continue.</p>

          {error && (
            <div
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-800">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cn(
                  'mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                )}
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-800">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={cn(
                    'block w-full rounded-lg border px-4 py-2.5 pr-10 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                  )}
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-navy-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-navy-700 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Decorative panel */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 lg:flex">
        <div className="max-w-md px-12 text-center">
          <Brain className="mx-auto h-16 w-16 text-accent-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">AI-Powered Evaluation</h2>
          <p className="mt-4 text-navy-300 leading-relaxed">
            Four specialized agents work together to deliver the fairest, most transparent
            grading experience in education.
          </p>
        </div>
      </div>
    </div>
  );
}
