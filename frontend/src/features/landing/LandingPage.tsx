import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  Brain,
  Zap,
  Shield,
  Eye,
  Lock,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Star,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Target,
  Layers,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      initial={reduced ? 'visible' : 'hidden'}
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Primary navigation"
      >
        <Link to="/" className="flex items-center gap-2" aria-label="SmartEvaluator home">
          <Brain className="h-8 w-8 text-navy-700" />
          <span className="text-xl font-bold text-navy-950">
            Smart<span className="text-navy-600">Evaluator</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-navy-800 hover:text-navy-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-navy-800 hover:text-navy-600 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm font-medium text-navy-800 hover:text-navy-600 transition-colors">
            Pricing
          </a>
          <Link
            to="/login"
            className="rounded-lg border border-navy-300 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-navy-800"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 pb-6 space-y-4">
          <a href="#features" onClick={() => setOpen(false)} className="block py-2 text-navy-800 font-medium">
            Features
          </a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block py-2 text-navy-800 font-medium">
            How It Works
          </a>
          <a href="#pricing" onClick={() => setOpen(false)} className="block py-2 text-navy-800 font-medium">
            Pricing
          </a>
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1 rounded-lg border border-navy-300 py-2 text-center text-sm font-medium text-navy-700">
              Log In
            </Link>
            <Link to="/register" className="flex-1 rounded-lg bg-navy-700 py-2 text-center text-sm font-medium text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function LandingPage() {
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ---- Hero ---- */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 px-6 pt-24 pb-16 text-center">
        {/* Animated gradient orbs */}
        {!reduced && (
          <>
            <motion.div
              className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-navy-600/20 blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-navy-500/30 bg-navy-800/60 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span className="text-sm text-navy-200">Powered by 4 specialized AI agents</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            The Future of{' '}
            <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
              Fair Grading
            </span>{' '}
            is&nbsp;Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-navy-300 sm:text-xl"
          >
            SmartEvaluator&#8209;Omni uses a multi-agent AI pipeline with a
            digital-twin rubric engine to evaluate answer sheets with
            unprecedented accuracy, speed, and transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
            >
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-navy-500 px-8 py-3.5 text-base font-semibold text-navy-200 hover:bg-navy-800 transition-colors"
            >
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6 text-navy-500" />
        </motion.div>
      </section>

      {/* ---- Problem ---- */}
      <AnimatedSection className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              The Problem
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">
              Traditional grading is broken
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-600">
              Inconsistency, bias, and sheer volume overwhelm even the best
              educators. Students deserve better.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Clock className="h-7 w-7" />,
                title: 'Time-Consuming',
                desc: 'Professors spend 20+ hours per week grading, stealing time from teaching and research.',
              },
              {
                icon: <Users className="h-7 w-7" />,
                title: 'Inconsistent Scoring',
                desc: 'The same answer graded by different evaluators can receive wildly different marks.',
              },
              {
                icon: <Eye className="h-7 w-7" />,
                title: 'Unconscious Bias',
                desc: 'Fatigue, handwriting legibility, and implicit bias impact fairness silently.',
              },
              {
                icon: <FileText className="h-7 w-7" />,
                title: 'No Transparency',
                desc: 'Students rarely understand why they received a specific grade.',
              },
              {
                icon: <Shield className="h-7 w-7" />,
                title: 'Plagiarism Blindspots',
                desc: 'Manual detection misses sophisticated copying and paraphrasing.',
              },
              {
                icon: <BarChart3 className="h-7 w-7" />,
                title: 'No Analytics',
                desc: 'Institutions lack data-driven insight into student performance trends.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group rounded-2xl border border-navy-100 bg-navy-50/50 p-8 transition-shadow hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-red-100 p-3 text-red-600">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-navy-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- How It Works ---- */}
      <AnimatedSection
        className="bg-gradient-to-b from-navy-950 to-navy-900 py-24 px-6 text-white"
      >
        <div id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-400">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Four AI agents. One perfect grade.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-300">
              Our multi-agent pipeline ensures every answer is evaluated from
              every angle, then reconciled into a single transparent score.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                icon: <Target className="h-8 w-8" />,
                title: 'Rubric Agent',
                desc: 'Generates a granular rubric from the ideal answer, weighting each concept precisely.',
              },
              {
                step: '02',
                icon: <Brain className="h-8 w-8" />,
                title: 'Evaluator Agent',
                desc: 'Scores the student answer against the rubric, producing section-by-section marks.',
              },
              {
                step: '03',
                icon: <Layers className="h-8 w-8" />,
                title: 'Moderator Agent',
                desc: 'Cross-checks scores for consistency and flags edge cases for review.',
              },
              {
                step: '04',
                icon: <Award className="h-8 w-8" />,
                title: 'Feedback Agent',
                desc: 'Generates detailed, constructive feedback the student can actually learn from.',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="relative rounded-2xl border border-navy-700 bg-navy-800/60 p-8 backdrop-blur-sm"
              >
                <span className="text-5xl font-black text-navy-700/40">{item.step}</span>
                <div className="mt-4 inline-flex rounded-xl bg-accent-500/20 p-3 text-accent-400">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-navy-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Features Grid ---- */}
      <AnimatedSection className="bg-white py-24 px-6">
        <div id="features" className="mx-auto max-w-6xl scroll-mt-24">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">
              Everything you need, nothing you don't
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Brain className="h-7 w-7" />,
                title: 'Multi-Agent AI',
                desc: 'Four specialized agents collaborate for the most comprehensive evaluation possible.',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: <Layers className="h-7 w-7" />,
                title: 'Digital Twin Rubrics',
                desc: 'AI generates a virtual replica of the ideal answer to benchmark against.',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: 'Lightning Speed',
                desc: 'Grade an entire class of 60 students in under 5 minutes with parallel processing.',
                color: 'bg-amber-100 text-amber-600',
              },
              {
                icon: <Shield className="h-7 w-7" />,
                title: 'Plagiarism Shield',
                desc: 'Advanced similarity detection catches even paraphrased and translated content.',
                color: 'bg-red-100 text-red-600',
              },
              {
                icon: <Eye className="h-7 w-7" />,
                title: 'Transparent Grades',
                desc: 'Every mark comes with a detailed rubric breakdown and explanation.',
                color: 'bg-emerald-100 text-emerald-600',
              },
              {
                icon: <Lock className="h-7 w-7" />,
                title: 'Enterprise Security',
                desc: 'Role-based access, end-to-end encryption, and full audit trails.',
                color: 'bg-navy-100 text-navy-600',
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl border border-navy-100 p-8 transition-all hover:border-navy-200 hover:shadow-lg"
              >
                <div className={cn('inline-flex rounded-xl p-3', f.color)}>{f.icon}</div>
                <h3 className="mt-5 text-lg font-semibold text-navy-950">{f.title}</h3>
                <p className="mt-2 text-navy-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Stats ---- */}
      <AnimatedSection className="bg-navy-950 py-24 px-6 text-white">
        <div className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {[
            { value: 99.7, suffix: '%', label: 'Grading Accuracy' },
            { value: 4, suffix: '', label: 'AI Agents' },
            { value: 5, suffix: 's', label: 'Avg. Grading Time' },
            { value: 50000, suffix: '+', label: 'Papers Evaluated' },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <p className="text-5xl font-extrabold text-accent-400">
                {s.label === 'Avg. Grading Time' && '<'}
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-navy-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ---- Testimonials ---- */}
      <AnimatedSection className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">
              Trusted by leading educators
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  'SmartEvaluator cut our grading time by 85% while improving consistency across sections. The transparency reports won over even our most skeptical faculty.',
                name: 'Dr. Sarah Chen',
                title: 'Dean of Engineering, Stanford University',
                stars: 5,
              },
              {
                quote:
                  'The multi-agent approach is brilliant. The feedback my students receive is more detailed than anything I could write manually for 200 students.',
                name: 'Prof. James Miller',
                title: 'Computer Science Dept., MIT',
                stars: 5,
              },
              {
                quote:
                  'We reduced academic integrity incidents by 40% in the first semester. The plagiarism detection is in a league of its own.',
                name: 'Dr. Priya Nair',
                title: 'Academic Integrity Office, Oxford',
                stars: 5,
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="rounded-2xl border border-navy-100 bg-navy-50/30 p-8"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <p className="mt-4 text-navy-700 italic leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-200 text-sm font-bold text-navy-700">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-950">{t.name}</p>
                    <p className="text-sm text-navy-500">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Pricing ---- */}
      <AnimatedSection className="bg-gradient-to-b from-navy-50 to-white py-24 px-6">
        <div id="pricing" className="mx-auto max-w-6xl scroll-mt-24">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-navy-600">
              Start for free, scale when ready.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                period: '/mo',
                desc: 'Perfect for trying out SmartEvaluator.',
                features: [
                  '50 evaluations / month',
                  '1 AI agent (basic)',
                  'Email support',
                  'Standard rubrics',
                ],
                cta: 'Get Started',
                featured: false,
              },
              {
                name: 'Professional',
                price: '$199',
                period: '/mo',
                desc: 'For departments and growing institutions.',
                features: [
                  'Unlimited evaluations',
                  'All 4 AI agents',
                  'Priority support',
                  'Custom rubrics',
                  'Plagiarism detection',
                  'Analytics dashboard',
                ],
                cta: 'Start Free Trial',
                featured: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For universities and large organizations.',
                features: [
                  'Everything in Professional',
                  'SSO & SAML',
                  'Dedicated success manager',
                  'SLA guarantee',
                  'On-premise option',
                  'Custom integrations',
                ],
                cta: 'Contact Sales',
                featured: false,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={cn(
                  'relative rounded-2xl border p-8',
                  plan.featured
                    ? 'border-accent-400 bg-white shadow-xl shadow-accent-500/10 ring-1 ring-accent-400'
                    : 'border-navy-200 bg-white'
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-navy-950">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-navy-950">{plan.price}</span>
                  {plan.period && <span className="text-navy-500">{plan.period}</span>}
                </div>
                <p className="mt-2 text-navy-600">{plan.desc}</p>
                <ul className="mt-8 space-y-3" role="list">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-navy-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={cn(
                    'mt-8 block w-full rounded-xl py-3 text-center font-semibold transition-colors',
                    plan.featured
                      ? 'bg-accent-500 text-white hover:bg-accent-600'
                      : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- FAQ ---- */}
      <AnimatedSection className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-3xl font-bold text-navy-950 sm:text-4xl">
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: 'How accurate is AI-based grading compared to human graders?',
                a: 'Our multi-agent pipeline achieves 99.7% alignment with expert human graders on standardized rubrics. The moderation agent specifically catches edge cases that single-model systems miss.',
              },
              {
                q: 'Can I customize the rubric?',
                a: 'Absolutely. You can provide your own rubric, let the AI generate one from an ideal answer, or use a hybrid approach where the AI proposes and you refine.',
              },
              {
                q: 'Is student data secure?',
                a: 'Yes. All data is encrypted at rest and in transit. We support role-based access control with a 9-level hierarchy, full audit trails, and optional on-premise deployment for Enterprise customers.',
              },
              {
                q: 'What subjects does it support?',
                a: 'SmartEvaluator works with any text-based subject including STEM, humanities, social sciences, law, and medicine. Image and diagram support is on the roadmap.',
              },
              {
                q: 'Can students see why they got their grade?',
                a: 'Yes. Every evaluation comes with a detailed rubric breakdown showing exactly which criteria were met, partially met, or missed, along with constructive feedback.',
              },
            ].map((item) => (
              <FAQItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- CTA ---- */}
      <section className="bg-gradient-to-r from-navy-900 to-navy-950 py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Transform Grading?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-navy-300">
            Join thousands of educators who are saving time, improving fairness,
            and giving students the feedback they deserve.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
            >
              Start Your Free Trial <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="bg-navy-950 py-16 px-6 text-navy-400">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-navy-300" />
                <span className="text-lg font-bold text-white">
                  Smart<span className="text-navy-400">Evaluator</span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                AI-powered evaluation platform that brings fairness,
                speed, and transparency to academic grading.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Product</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-navy-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SmartEvaluator-Omni. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---- FAQ accordion item ---- */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="rounded-xl border border-navy-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-navy-950">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-navy-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-navy-600 leading-relaxed">{answer}</div>
      )}
    </motion.div>
  );
}
