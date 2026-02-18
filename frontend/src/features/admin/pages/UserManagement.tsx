import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Role, ROLE_LABELS } from '@/types/roles';

/* ---- Types ---- */
interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

/* ---- Mock data ---- */
const MOCK_USERS: UserRow[] = [
  { id: '1', email: 'sarah.chen@uni.edu', first_name: 'Sarah', last_name: 'Chen', role: Role.TEACHER, is_active: true, created_at: '2025-09-15' },
  { id: '2', email: 'james.m@uni.edu', first_name: 'James', last_name: 'Miller', role: Role.TEACHER, is_active: true, created_at: '2025-10-02' },
  { id: '3', email: 'alice.w@uni.edu', first_name: 'Alice', last_name: 'Wang', role: Role.STUDENT, is_active: true, created_at: '2025-11-20' },
  { id: '4', email: 'bob.j@uni.edu', first_name: 'Bob', last_name: 'Johnson', role: Role.STUDENT, is_active: false, created_at: '2025-08-10' },
  { id: '5', email: 'priya.n@uni.edu', first_name: 'Priya', last_name: 'Nair', role: Role.EXAM_CELL_HEAD, is_active: true, created_at: '2025-07-01' },
  { id: '6', email: 'tom.d@uni.edu', first_name: 'Tom', last_name: 'Davis', role: Role.EXAM_CELL_MEMBER, is_active: true, created_at: '2025-12-05' },
  { id: '7', email: 'emma.l@uni.edu', first_name: 'Emma', last_name: 'Lee', role: Role.DIRECTOR, is_active: true, created_at: '2025-06-15' },
  { id: '8', email: 'carlos.g@uni.edu', first_name: 'Carlos', last_name: 'Garcia', role: Role.STUDENT, is_active: true, created_at: '2026-01-08' },
];

/* ---- Form Schema ---- */
const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum([Role.SUPER_ADMIN, Role.CHANCELLOR, Role.DIRECTOR, Role.HEAD_OF_SCHOOL, Role.IN_CHARGE, Role.EXAM_CELL_HEAD, Role.EXAM_CELL_MEMBER, Role.TEACHER, Role.STUDENT]),
  password: z.string().min(8, 'Min 8 characters').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

/* ---- Modal ---- */
function UserModal({
  isOpen,
  onClose,
  editUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  editUser: UserRow | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: editUser
      ? {
          first_name: editUser.first_name,
          last_name: editUser.last_name,
          email: editUser.email,
          role: editUser.role,
        }
      : { role: Role.STUDENT },
  });

  const onSubmit = async (_data: UserFormData) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label={editUser ? 'Edit user' : 'Create user'}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-navy-950">
                {editUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-navy-400 hover:bg-navy-100"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-fname" className="block text-sm font-medium text-navy-800">
                    First name
                  </label>
                  <input
                    id="modal-fname"
                    className={cn(
                      'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-navy-900 outline-none',
                      errors.first_name ? 'border-red-300' : 'border-navy-200 focus:border-navy-500'
                    )}
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="modal-lname" className="block text-sm font-medium text-navy-800">
                    Last name
                  </label>
                  <input
                    id="modal-lname"
                    className={cn(
                      'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-navy-900 outline-none',
                      errors.last_name ? 'border-red-300' : 'border-navy-200 focus:border-navy-500'
                    )}
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-navy-800">
                  Email
                </label>
                <input
                  id="modal-email"
                  type="email"
                  className={cn(
                    'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-navy-900 outline-none',
                    errors.email ? 'border-red-300' : 'border-navy-200 focus:border-navy-500'
                  )}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="modal-role" className="block text-sm font-medium text-navy-800">
                  Role
                </label>
                <select
                  id="modal-role"
                  className="mt-1 block w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500"
                  {...register('role')}
                >
                  {Object.values(Role).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>

              {!editUser && (
                <div>
                  <label htmlFor="modal-pw" className="block text-sm font-medium text-navy-800">
                    Temporary Password
                  </label>
                  <input
                    id="modal-pw"
                    type="password"
                    className={cn(
                      'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-navy-900 outline-none',
                      errors.password ? 'border-red-300' : 'border-navy-200 focus:border-navy-500'
                    )}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---- Page ---- */
export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [page, setPage] = useState(1);

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch =
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const openCreate = () => {
    setEditUser(null);
    setModalOpen(true);
  };

  const openEdit = (u: UserRow) => {
    setEditUser(u);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">User Management</h1>
            <p className="mt-1 text-navy-600">{MOCK_USERS.length} total users</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="search"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-navy-200 py-2.5 pl-10 pr-4 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
            aria-label="Search users"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-navy-200 px-4 py-2.5 text-sm text-navy-700 outline-none focus:border-navy-500"
          aria-label="Filter by role"
        >
          <option value="all">All Roles</option>
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-navy-100 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-left text-navy-600">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {paged.map((u) => (
                <tr key={u.id} className="hover:bg-navy-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-200 text-xs font-bold text-navy-700">
                        {u.first_name[0]}
                        {u.last_name[0]}
                      </div>
                      <span className="font-medium text-navy-900">
                        {u.first_name} {u.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-navy-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-700">
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <UserCheck className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        <UserX className="h-3 w-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-navy-600">{u.created_at}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 transition-colors"
                        aria-label={`Edit ${u.first_name} ${u.last_name}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${u.first_name} ${u.last_name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-navy-500">
                    <Users className="mx-auto h-8 w-8 mb-2 text-navy-300" />
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-navy-100 px-6 py-3">
          <p className="text-sm text-navy-500">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={cn(
                  'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-600 hover:bg-navy-100'
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editUser={editUser}
      />
    </div>
  );
}
