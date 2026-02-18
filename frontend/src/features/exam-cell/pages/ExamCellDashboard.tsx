import { motion } from 'framer-motion';
import {
  ClipboardList,
  Calendar,
  AlertTriangle,
  Clock,

  FileText,
  Shield,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stats = [
  { label: 'Active Exams', value: '5', icon: <ClipboardList className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100' },
  { label: 'Scheduled', value: '12', icon: <Calendar className="h-5 w-5" />, color: 'text-purple-600 bg-purple-100' },
  { label: 'Integrity Alerts', value: '3', icon: <AlertTriangle className="h-5 w-5" />, color: 'text-amber-600 bg-amber-100' },
  { label: 'Completion Rate', value: '94%', icon: <TrendingUp className="h-5 w-5" />, color: 'text-emerald-600 bg-emerald-100' },
];

const activeExams = [
  { id: '1', name: 'CS301 - Algorithms Final', startTime: '10:00 AM', endTime: '1:00 PM', enrolled: 58, submitted: 42, status: 'in_progress' as const },
  { id: '2', name: 'CS201 - Data Structures Midterm', startTime: '2:00 PM', endTime: '4:00 PM', enrolled: 65, submitted: 0, status: 'scheduled' as const },
  { id: '3', name: 'CS101 - Intro to CS Quiz', startTime: '9:00 AM', endTime: '10:00 AM', enrolled: 120, submitted: 120, status: 'completed' as const },
];

const upcomingSchedule = [
  { date: 'Feb 20', exams: 2, department: 'Computer Science' },
  { date: 'Feb 22', exams: 3, department: 'Electrical Engineering' },
  { date: 'Feb 25', exams: 1, department: 'Mathematics' },
  { date: 'Mar 1', exams: 4, department: 'Multiple Departments' },
];

const alerts = [
  { id: '1', type: 'integrity' as const, message: 'Tab switch detected: Student #4521 in CS301 Final', time: '2 min ago', severity: 'high' as const },
  { id: '2', type: 'integrity' as const, message: 'Copy-paste attempt blocked: Student #3892', time: '8 min ago', severity: 'medium' as const },
  { id: '3', type: 'system' as const, message: 'High submission volume: CS101 Quiz approaching deadline', time: '15 min ago', severity: 'low' as const },
];

export default function ExamCellDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-2xl font-bold text-navy-950">Exam Cell Dashboard</h1>
        <p className="mt-1 text-navy-600">
          Welcome, {user?.first_name}. Monitoring {activeExams.length} exams today.
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
          </motion.div>
        ))}
      </div>

      {/* Active Exams */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-navy-100 bg-white"
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy-950">Active Exams</h2>
          <Eye className="h-5 w-5 text-navy-400" />
        </div>
        <div className="divide-y divide-navy-50">
          {activeExams.map((exam) => (
            <div key={exam.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-navy-900">{exam.name}</p>
                <p className="mt-0.5 text-sm text-navy-500">
                  {exam.startTime} - {exam.endTime} &middot; {exam.enrolled} enrolled
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-navy-700">
                    {exam.submitted}/{exam.enrolled} submitted
                  </p>
                  <div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-navy-100">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        exam.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${(exam.submitted / exam.enrolled) * 100}%` }}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    exam.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : exam.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-navy-100 text-navy-700'
                  )}
                >
                  {exam.status === 'in_progress' ? 'In Progress' : exam.status === 'completed' ? 'Completed' : 'Scheduled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Schedule */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Upcoming Schedule</h2>
            <Calendar className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {upcomingSchedule.map((item) => (
              <div key={item.date} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-navy-100">
                    <span className="text-xs font-medium text-navy-500">{item.date.split(' ')[0]}</span>
                    <span className="text-lg font-bold text-navy-900">{item.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{item.exams} exam{item.exams > 1 ? 's' : ''}</p>
                    <p className="text-sm text-navy-500">{item.department}</p>
                  </div>
                </div>
                <FileText className="h-5 w-5 text-navy-400" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alert Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Integrity Alerts</h2>
            <Shield className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 px-6 py-4">
                <div
                  className={cn(
                    'mt-0.5 rounded-lg p-2',
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-600'
                      : alert.severity === 'medium'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-blue-100 text-blue-600'
                  )}
                >
                  {alert.type === 'integrity' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-900">{alert.message}</p>
                  <p className="mt-0.5 text-xs text-navy-500">{alert.time}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-700'
                      : alert.severity === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  )}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
