import { useState, useCallback } from 'react';
import { useTabSwitchDetection } from './useTabSwitchDetection';
import { useCopyPasteBlocking } from './useCopyPasteBlocking';
import { useFullscreenEnforcement } from './useFullscreenEnforcement';
import { useDevToolsDetection } from './useDevToolsDetection';
import { useFocusLossDetection } from './useFocusLossDetection';

export interface AntiCheatViolation {
  id: string;
  type: string;
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

interface UseAntiCheatOrchestratorOptions {
  enabled: boolean;
  maxWarnings?: number;
}

export function useAntiCheatOrchestrator({
  enabled,
  maxWarnings = 5,
}: UseAntiCheatOrchestratorOptions) {
  const [violations, setViolations] = useState<AntiCheatViolation[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);

  const addViolation = useCallback(
    (type: string, message: string, severity: AntiCheatViolation['severity']) => {
      const violation: AntiCheatViolation = {
        id: crypto.randomUUID(),
        type,
        message,
        timestamp: Date.now(),
        severity,
      };

      setViolations((prev) => {
        const next = [...prev, violation];
        if (next.length >= maxWarnings) {
          setIsTerminated(true);
        }
        return next;
      });

      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    },
    [maxWarnings]
  );

  useTabSwitchDetection({
    enabled,
    onViolation: useCallback(
      () => addViolation('tab_switch', 'Tab switch detected. This activity has been logged.', 'high'),
      [addViolation]
    ),
  });

  useCopyPasteBlocking({
    enabled,
    onViolation: useCallback(
      (type: string) =>
        addViolation(
          'clipboard',
          `${type.charAt(0).toUpperCase() + type.slice(1)} action blocked.`,
          'medium'
        ),
      [addViolation]
    ),
  });

  const { isFullscreen, requestFullscreen } = useFullscreenEnforcement({
    enabled,
    onExitFullscreen: useCallback(
      () => addViolation('fullscreen', 'Exited fullscreen mode. Please return to fullscreen.', 'high'),
      [addViolation]
    ),
  });

  useDevToolsDetection({
    enabled,
    onViolation: useCallback(
      () => addViolation('devtools', 'Developer tools access attempted.', 'high'),
      [addViolation]
    ),
  });

  useFocusLossDetection({
    enabled,
    onViolation: useCallback(
      () => addViolation('focus_loss', 'Window focus lost. Please stay on the exam window.', 'medium'),
      [addViolation]
    ),
  });

  const dismissWarning = useCallback(() => setShowWarning(false), []);

  return {
    violations,
    showWarning,
    isTerminated,
    isFullscreen,
    requestFullscreen,
    dismissWarning,
    warningsRemaining: maxWarnings - violations.length,
  };
}
