import { useEffect, useCallback } from 'react';

interface UseCopyPasteBlockingOptions {
  enabled: boolean;
  onViolation: (type: 'copy' | 'paste' | 'cut') => void;
}

export function useCopyPasteBlocking({ enabled, onViolation }: UseCopyPasteBlockingOptions) {
  const handleCopy = useCallback(
    (e: ClipboardEvent) => {
      if (!enabled) return;
      e.preventDefault();
      onViolation('copy');
    },
    [enabled, onViolation]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!enabled) return;
      e.preventDefault();
      onViolation('paste');
    },
    [enabled, onViolation]
  );

  const handleCut = useCallback(
    (e: ClipboardEvent) => {
      if (!enabled) return;
      e.preventDefault();
      onViolation('cut');
    },
    [enabled, onViolation]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
    };
  }, [enabled, handleCopy, handlePaste, handleCut]);
}
