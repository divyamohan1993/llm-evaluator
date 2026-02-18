import { useEffect, useCallback, useRef } from 'react';

interface UseDevToolsDetectionOptions {
  enabled: boolean;
  onViolation: () => void;
}

export function useDevToolsDetection({ enabled, onViolation }: UseDevToolsDetectionOptions) {
  const thresholdRef = useRef(160);

  const handleResize = useCallback(() => {
    if (!enabled) return;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > thresholdRef.current || heightDiff > thresholdRef.current) {
      onViolation();
    }
  }, [enabled, onViolation]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        onViolation();
      }
      // Block Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        onViolation();
      }
      // Block Ctrl+Shift+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        onViolation();
      }
      // Block Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        onViolation();
      }
    },
    [enabled, onViolation]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleResize, handleKeyDown]);
}
