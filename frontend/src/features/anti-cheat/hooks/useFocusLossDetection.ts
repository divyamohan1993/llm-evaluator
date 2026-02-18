import { useEffect, useCallback, useRef } from 'react';

interface UseFocusLossDetectionOptions {
  enabled: boolean;
  onViolation: () => void;
}

export function useFocusLossDetection({ enabled, onViolation }: UseFocusLossDetectionOptions) {
  const violationCountRef = useRef(0);

  const handleBlur = useCallback(() => {
    if (!enabled) return;
    violationCountRef.current += 1;
    onViolation();
  }, [enabled, onViolation]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, handleBlur]);

  return { focusLossCount: violationCountRef.current };
}
