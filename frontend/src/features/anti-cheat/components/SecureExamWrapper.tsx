import { useAntiCheatOrchestrator } from '@/features/anti-cheat/hooks/useAntiCheatOrchestrator';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ShieldX, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecureExamWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
  maxWarnings?: number;
  onTerminate?: () => void;
}

export function SecureExamWrapper({
  children,
  enabled = true,
  maxWarnings = 5,
  onTerminate,
}: SecureExamWrapperProps) {
  const {
    violations,
    showWarning,
    isTerminated,
    isFullscreen,
    requestFullscreen,
    dismissWarning,
    warningsRemaining,
  } = useAntiCheatOrchestrator({ enabled, maxWarnings });

  const latestViolation = violations[violations.length - 1];

  if (isTerminated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 px-6">
        <div className="max-w-md text-center">
          <ShieldX className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-red-900">Exam Terminated</h1>
          <p className="mt-2 text-red-700">
            Your exam has been terminated due to multiple integrity violations.
            All activity has been logged and reported to the exam cell.
          </p>
          <p className="mt-4 text-sm text-red-600">
            Total violations: {violations.length}
          </p>
          {onTerminate && (
            <button
              type="button"
              onClick={onTerminate}
              className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" onContextMenu={(e) => enabled && e.preventDefault()}>
      {/* Fullscreen prompt */}
      {enabled && !isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-sm">
          <div className="max-w-sm text-center">
            <Maximize className="mx-auto h-12 w-12 text-accent-400" />
            <h2 className="mt-4 text-xl font-bold text-white">Fullscreen Required</h2>
            <p className="mt-2 text-navy-300">
              This exam must be taken in fullscreen mode for academic integrity purposes.
            </p>
            <button
              type="button"
              onClick={requestFullscreen}
              className="mt-6 rounded-lg bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Security badge */}
      {enabled && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <Shield className="h-3.5 w-3.5" />
          Secure Exam Mode
          {violations.length > 0 && (
            <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
              {violations.length} warning{violations.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Warning toast */}
      <AnimatePresence>
        {showWarning && latestViolation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'fixed top-16 left-1/2 z-50 -translate-x-1/2 max-w-md rounded-xl border p-4 shadow-lg',
              latestViolation.severity === 'high'
                ? 'border-red-200 bg-red-50'
                : 'border-amber-200 bg-amber-50'
            )}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0',
                  latestViolation.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                )}
              />
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    latestViolation.severity === 'high' ? 'text-red-800' : 'text-amber-800'
                  )}
                >
                  Integrity Violation Detected
                </p>
                <p
                  className={cn(
                    'mt-1 text-sm',
                    latestViolation.severity === 'high' ? 'text-red-700' : 'text-amber-700'
                  )}
                >
                  {latestViolation.message}
                </p>
                <p className="mt-1 text-xs text-navy-500">
                  {warningsRemaining} warning{warningsRemaining !== 1 ? 's' : ''} remaining before
                  exam termination.
                </p>
              </div>
              <button
                type="button"
                onClick={dismissWarning}
                className="text-navy-400 hover:text-navy-600"
                aria-label="Dismiss warning"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
