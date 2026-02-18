import { useEffect, useRef, useCallback } from 'react';

export interface TabSwitchEvent {
  timestamp: number;
  type: 'tab_hidden' | 'tab_visible';
}

interface UseTabSwitchDetectionOptions {
  enabled: boolean;
  onViolation: (event: TabSwitchEvent) => void;
}

export function useTabSwitchDetection({ enabled, onViolation }: UseTabSwitchDetectionOptions) {
  const violationCount = useRef(0);

  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return;

    if (document.hidden) {
      violationCount.current += 1;
      onViolation({
        timestamp: Date.now(),
        type: 'tab_hidden',
      });
    }
  }, [enabled, onViolation]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, handleVisibilityChange]);

  return { violationCount: violationCount.current };
}
