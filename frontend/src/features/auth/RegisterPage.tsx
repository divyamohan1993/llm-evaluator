import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brain, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/api/client';

const registerSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      await api.post('/auth/register', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-6">
        <div className="max-w-sm text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold text-navy-950">Account Created!</h1>
          <p className="mt-2 text-navy-600">
            Your account has been created successfully. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Decorative */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 lg:flex">
        <div className="max-w-md px-12 text-center">
          <Brain className="mx-auto h-16 w-16 text-accent-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">Join SmartEvaluator</h2>
          <p className="mt-4 text-navy-300 leading-relaxed">
            Create your account and experience the future of fair, transparent,
            AI-powered academic evaluation.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2" aria-label="Back to home">
            <Brain className="h-8 w-8 text-navy-700" />
            <span className="text-xl font-bold text-navy-950">
              Smart<span className="text-navy-600">Evaluator</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-navy-950">Create your account</h1>
          <p className="mt-2 text-navy-600">Fill in the details below to get started.</p>

          {error && (
            <div
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-navy-800">
                  First name
                </label>
                <input
                  id="first_name"
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={!!errors.first_name}
                  className={cn(
                    'mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                    errors.first_name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                  )}
                  placeholder="John"
                  {...register('first_name')}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-navy-800">
                  Last name
                </label>
                <input
                  id="last_name"
                  type="text"
                  autoComplete="family-name"
                  aria-invalid={!!errors.last_name}
                  className={cn(
                    'mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                    errors.last_name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                  )}
                  placeholder="Doe"
                  {...register('last_name')}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-navy-800">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={cn(
                  'mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                  errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                )}
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-navy-800">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className={cn(
                    'block w-full rounded-lg border px-4 py-2.5 pr-10 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                  )}
                  placeholder="Min 8 characters"
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
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-navy-800">
                Confirm password
              </label>
              <input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm_password}
                className={cn(
                  'mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-navy-900 outline-none transition-colors placeholder:text-navy-400',
                  errors.confirm_password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
                )}
                placeholder="Re-enter your password"
                {...register('confirm_password')}
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-navy-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-navy-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
