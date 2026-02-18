import { motion } from 'framer-motion';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stats = [
  { label: 'Upcoming Exams', value: '3', icon: <Calendar className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100' },
  { label: 'Completed', value: '12', icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-emerald-600 bg-emerald-100' },
  { label: 'Average Score', value: '87%', icon: <TrendingUp className="h-5 w-5" />, color: 'text-accent-600 bg-accent-100' },
  { label: 'Pending Results', value: '2', icon: <Clock className="h-5 w-5" />, color: 'text-purple-600 bg-purple-100' },
];

const upcomingExams = [
  { id: '1', subject: 'Data Structures & Algorithms', date: 'Feb 22, 2026', time: '10:00 AM', duration: '2 hours' },
  { id: '2', subject: 'Operating Systems', date: 'Feb 25, 2026', time: '2:00 PM', duration: '3 hours' },
  { id: '3', subject: 'Database Management Systems', date: 'Mar 1, 2026', time: '9:00 AM', duration: '2 hours' },
];

const recentResults = [
  { subject: 'Computer Networks', score: 92, maxScore: 100, date: 'Feb 10, 2026', grade: 'A' },
  { subject: 'Software Engineering', score: 78, maxScore: 100, date: 'Feb 5, 2026', grade: 'B+' },
  { subject: 'Discrete Mathematics', score: 95, maxScore: 100, date: 'Jan 28, 2026', grade: 'A+' },
];

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-2xl font-bold text-navy-950">
          Welcome back, {user?.first_name ?? 'Student'}!
        </h1>
        <p className="mt-1 text-navy-600">
          Here is an overview of your exams and performance.
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming exams */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Upcoming Exams</h2>
            <GraduationCap className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-navy-900">{exam.subject}</p>
                  <p className="mt-0.5 text-sm text-navy-500">
                    {exam.date} at {exam.time} &middot; {exam.duration}
                  </p>
                </div>
                <Link
                  to={`/app/student/exam/${exam.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-navy-100 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-200 transition-colors"
                >
                  Enter <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent results */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-navy-100 bg-white"
        >
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy-950">Recent Results</h2>
            <FileText className="h-5 w-5 text-navy-400" />
          </div>
          <div className="divide-y divide-navy-50">
            {recentResults.map((r) => (
              <div key={r.subject} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-navy-900">{r.subject}</p>
                  <p className="mt-0.5 text-sm text-navy-500">{r.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-navy-950">
                    {r.score}/{r.maxScore}
                  </p>
                  <span
                    className={cn(
                      'inline-block rounded-full px-2 py-0.5 text-xs font-semibold',
                      r.score >= 90
                        ? 'bg-emerald-100 text-emerald-700'
                        : r.score >= 75
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {r.grade}
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
