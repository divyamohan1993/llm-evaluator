import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Activity,
  Shield,
  Server,
  TrendingUp,
  UserPlus,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stats = [
  { label: 'Total Users', value: '2,847', icon: <Users className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100', change: '+124 this month' },
  { label: 'Active Evaluations', value: '156', icon: <FileText className="h-5 w-5" />, color: 'text-emerald-600 bg-emerald-100', change: '23 in progress' },
  { label: 'System Uptime', value: '99.97%', icon: <Server className="h-5 w-5" />, color: 'text-purple-600 bg-purple-100', change: 'Last 30 days' },
  { label: 'AI Accuracy', value: '99.7%', icon: <TrendingUp className="h-5 w-5" />, color: 'text-accent-600 bg-accent-100', change: '+0.2% this quarter' },
];

const recentActivity = [
  { type: 'user', message: 'New teacher registered: Dr. Emily Watson', time: '5 min ago', icon: <UserPlus className="h-4 w-4" />, iconColor: 'text-blue-600 bg-blue-100' },
  { type: 'eval', message: 'Batch evaluation completed: CS301 Final', time: '12 min ago', icon: <CheckCircle2 className="h-4 w-4" />, iconColor: 'text-emerald-600 bg-emerald-100' },
  { type: 'alert', message: 'High plagiarism detected in submission #4521', time: '28 min ago', icon: <AlertTriangle className="h-4 w-4" />, iconColor: 'text-amber-600 bg-amber-100' },
  { type: 'eval', message: 'Grading in progress: CS201 Midterm (45/60)', time: '1 hr ago', icon: <Clock className="h-4 w-4" />, iconColor: 'text-purple-600 bg-purple-100' },
  { type: 'system', message: 'System maintenance completed successfully', time: '3 hrs ago', icon: <Server className="h-4 w-4" />, iconColor: 'text-navy-600 bg-navy-100' },
];

const systemHealth = [
  { name: 'API Server', status: 'healthy', latency: '45ms' },
  { name: 'AI Pipeline', status: 'healthy', latency: '1.2s' },
  { name: 'Database', status: 'healthy', latency: '12ms' },
  { name: 'Queue Worker', status: 'healthy', latency: '89ms' },
];

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-2xl font-bold text-navy-950">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-navy-600">
          Welcome, {user?.first_name}. Here is your system overview.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-navy-100 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-navy-600">{s.label}</p>
              <div className={cn('rounded-lg p-2', s.color)}>{s.icon}</div>
            </div>
            <p className="mt-3 text-3xl font-bold text-navy-950">{s.value}</p>
            <p className="mt-1 text-xs text-navy-500">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.3 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <Link
          to="/app/admin/users"
          className="flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-5 hover:shadow-md transition-shadow"
        >
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy-900">Manage Users</p>
            <p className="text-sm text-navy-500">Add, edit, or remove users</p>
          </div>
          <ArrowRight className="h-5 w-5 text-navy-400" />
        </Link>
        <button
          type="button"
          className="flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-5 hover:shadow-md transition-shadow text-left"
        >
          <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy-900">View Audit Log</p>
            <p className="text-sm text-navy-500">Review system activity</p>
          </div>
          <ArrowRight className="h-5 w-5 text-navy-400" />
        </button>
        <button
          type="button"
          className="flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-5 hover:shadow-md transition-shadow text-left"
        >
          <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy-900">Security Settings</p>
            <p className="text-sm text-navy-500">Configure access policies</p>
          </div>
          <ArrowRight className="h-5 w-5 text-navy-400" />
        </button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Recent Activity</h2>
            <Activity className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4">
                <div className={cn('rounded-lg p-2 mt-0.5', a.iconColor)}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-900">{a.message}</p>
                  <p className="mt-0.5 text-xs text-navy-500">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">System Health</h2>
            <Server className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {systemHealth.map((s) => (
              <div key={s.name} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      s.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
                    )}
                    aria-label={`${s.name}: ${s.status}`}
                  />
                  <span className="font-medium text-navy-900">{s.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-navy-500">{s.latency}</span>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      s.status === 'healthy'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    )}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
