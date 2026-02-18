import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stats = [
  { label: 'Pending Grading', value: '24', icon: <Clock className="h-5 w-5" />, color: 'text-amber-600 bg-amber-100', trend: '+5 today' },
  { label: 'Graded This Week', value: '87', icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-emerald-600 bg-emerald-100', trend: '+12 vs last week' },
  { label: 'Active Classes', value: '4', icon: <Users className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100', trend: '156 students' },
  { label: 'Avg. Class Score', value: '76%', icon: <TrendingUp className="h-5 w-5" />, color: 'text-purple-600 bg-purple-100', trend: '+3% vs midterm' },
];

const gradingQueue = [
  { id: '1', subject: 'Data Structures', class: 'CS201-A', pending: 18, urgent: true },
  { id: '2', subject: 'Algorithms', class: 'CS301-B', pending: 6, urgent: false },
  { id: '3', subject: 'Database Systems', class: 'CS401-A', pending: 0, urgent: false },
];

const classAnalytics = [
  { name: 'CS201-A', avgScore: 78, passRate: 92, students: 45 },
  { name: 'CS301-B', avgScore: 72, passRate: 85, students: 38 },
  { name: 'CS401-A', avgScore: 81, passRate: 95, students: 42 },
  { name: 'CS101-C', avgScore: 68, passRate: 78, students: 31 },
];

export default function TeacherDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-2xl font-bold text-navy-950">
          Good morning, {user?.first_name ?? 'Professor'}!
        </h1>
        <p className="mt-1 text-navy-600">
          You have <span className="font-semibold text-accent-600">24 papers</span> waiting to be evaluated.
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
            <p className="mt-1 text-xs text-navy-500">{s.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grading Queue */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Grading Queue</h2>
            <FileText className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {gradingQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  {item.urgent && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  <div>
                    <p className="font-medium text-navy-900">{item.subject}</p>
                    <p className="text-sm text-navy-500">{item.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.pending > 0 ? (
                    <>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        {item.pending} pending
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-800 transition-colors"
                      >
                        <Zap className="h-3 w-3" /> AI Grade
                      </button>
                    </>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Complete
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Class Analytics */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Class Analytics</h2>
            <BarChart3 className="h-5 w-5 text-navy-400" />
          </div>
          <div className="px-6 py-4">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="text-left text-navy-500">
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Avg Score</th>
                  <th className="pb-3 font-medium">Pass Rate</th>
                  <th className="pb-3 font-medium">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {classAnalytics.map((c) => (
                  <tr key={c.name}>
                    <td className="py-3 font-medium text-navy-900">{c.name}</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          'font-semibold',
                          c.avgScore >= 80
                            ? 'text-emerald-600'
                            : c.avgScore >= 70
                            ? 'text-amber-600'
                            : 'text-red-600'
                        )}
                      >
                        {c.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 text-navy-700">{c.passRate}%</td>
                    <td className="py-3 text-navy-700">{c.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
