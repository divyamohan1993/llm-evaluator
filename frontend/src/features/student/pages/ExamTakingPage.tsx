import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SecureExamWrapper } from '@/features/anti-cheat/components/SecureExamWrapper';

/* ---- Mock questions ---- */
const QUESTIONS = [
  {
    id: '1',
    number: 1,
    text: 'Explain the time complexity of QuickSort in the best, average, and worst cases. Discuss what causes the worst case and how it can be mitigated.',
    maxMarks: 10,
  },
  {
    id: '2',
    number: 2,
    text: 'Compare and contrast a Binary Search Tree (BST) with an AVL Tree. When would you prefer one over the other? Provide examples.',
    maxMarks: 10,
  },
  {
    id: '3',
    number: 3,
    text: 'Describe the concept of dynamic programming. Solve the 0/1 Knapsack problem using dynamic programming and explain your approach step by step.',
    maxMarks: 15,
  },
  {
    id: '4',
    number: 4,
    text: 'What is a hash table? Explain collision resolution techniques (chaining vs. open addressing) with their trade-offs.',
    maxMarks: 10,
  },
  {
    id: '5',
    number: 5,
    text: "Explain Dijkstra's shortest path algorithm. What are its limitations? How does the Bellman-Ford algorithm address them?",
    maxMarks: 15,
  },
];

const EXAM_DURATION_SECONDS = 2 * 60 * 60; // 2 hours

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function ExamContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const question = QUESTIONS[currentQ];
  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;
  const isLowTime = timeLeft < 300; // less than 5 minutes

  const updateAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    },
    [question.id]
  );

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    setShowConfirm(false);
  };

  const handleTerminate = () => {
    navigate('/app/student', { replace: true });
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-6">
        <div className="max-w-sm text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold text-navy-950">Exam Submitted</h1>
          <p className="mt-2 text-navy-600">
            Your answers have been submitted successfully. You answered{' '}
            <span className="font-semibold">{answeredCount}</span> out of{' '}
            <span className="font-semibold">{QUESTIONS.length}</span> questions.
          </p>
          <p className="mt-1 text-sm text-navy-500">
            Results will be available once grading is complete.
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/student', { replace: true })}
            className="mt-6 rounded-lg bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <SecureExamWrapper enabled maxWarnings={5} onTerminate={handleTerminate}>
      <div className="min-h-screen bg-navy-50">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-navy-600" />
            <div>
              <h1 className="text-sm font-semibold text-navy-900">
                Data Structures & Algorithms
              </h1>
              <p className="text-xs text-navy-500">Exam ID: {id}</p>
            </div>
          </div>

          <div
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-mono font-bold',
              isLowTime
                ? 'bg-red-100 text-red-700 animate-pulse'
                : 'bg-navy-100 text-navy-800'
            )}
            role="timer"
            aria-label={`Time remaining: ${formatTime(timeLeft)}`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Submit Exam
          </button>
        </header>

        <div className="mx-auto flex max-w-5xl gap-6 p-6">
          {/* Question navigation sidebar */}
          <aside className="hidden w-48 shrink-0 md:block" aria-label="Question navigation">
            <div className="sticky top-24 space-y-3">
              <h2 className="text-sm font-semibold text-navy-700">Questions</h2>
              <div className="grid grid-cols-3 gap-2">
                {QUESTIONS.map((q, i) => {
                  const hasAnswer = !!answers[q.id]?.trim();
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQ(i)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                        i === currentQ
                          ? 'bg-navy-700 text-white'
                          : hasAnswer
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
                      )}
                      aria-label={`Question ${q.number}${hasAnswer ? ' (answered)' : ''}`}
                      aria-current={i === currentQ ? 'step' : undefined}
                    >
                      {q.number}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-1 pt-2 text-xs text-navy-500">
                <p className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded bg-emerald-100 border border-emerald-200" />
                  Answered ({answeredCount})
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded bg-white border border-navy-200" />
                  Unanswered ({QUESTIONS.length - answeredCount})
                </p>
              </div>
            </div>
          </aside>

          {/* Main question area */}
          <main className="flex-1">
            <div className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-navy-100 px-3 py-1 text-sm font-semibold text-navy-700">
                  Question {question.number} of {QUESTIONS.length}
                </span>
                <span className="text-sm font-medium text-navy-500">
                  {question.maxMarks} marks
                </span>
              </div>

              <p className="text-base leading-relaxed text-navy-900">{question.text}</p>

              <div className="mt-6">
                <label htmlFor="answer-area" className="block text-sm font-medium text-navy-700 mb-2">
                  Your Answer
                </label>
                <textarea
                  id="answer-area"
                  value={answers[question.id] ?? ''}
                  onChange={(e) => updateAnswer(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border border-navy-200 px-4 py-3 text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 resize-y placeholder:text-navy-400"
                  placeholder="Type your answer here..."
                  aria-label={`Answer for question ${question.number}`}
                />
                <p className="mt-1 text-xs text-navy-500">
                  {(answers[question.id] ?? '').length} characters
                </p>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                  disabled={currentQ === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {/* Mobile question selector */}
                <span className="text-sm text-navy-500 md:hidden">
                  {currentQ + 1} / {QUESTIONS.length}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentQ((p) => Math.min(QUESTIONS.length - 1, p + 1))}
                  disabled={currentQ === QUESTIONS.length - 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 disabled:opacity-40 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Submit confirmation modal */}
        {showConfirm && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowConfirm(false)}
              aria-hidden="true"
            />
            <div
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirm exam submission"
            >
              <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
              <h2 className="mt-4 text-center text-lg font-bold text-navy-950">
                Submit Exam?
              </h2>
              <p className="mt-2 text-center text-sm text-navy-600">
                You have answered <span className="font-semibold">{answeredCount}</span> out of{' '}
                <span className="font-semibold">{QUESTIONS.length}</span> questions.
                {answeredCount < QUESTIONS.length && (
                  <span className="text-amber-600">
                    {' '}
                    {QUESTIONS.length - answeredCount} question
                    {QUESTIONS.length - answeredCount > 1 ? 's are' : ' is'} unanswered.
                  </span>
                )}
              </p>
              <p className="mt-1 text-center text-xs text-navy-500">
                This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-navy-200 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </SecureExamWrapper>
  );
}

export default function ExamTakingPage() {
  return <ExamContent />;
}
