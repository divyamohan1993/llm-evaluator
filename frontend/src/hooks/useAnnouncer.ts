import { useCallback, useEffect, useRef } from 'react';

export function useAnnouncer() {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.style.position = 'absolute';
    el.style.width = '1px';
    el.style.height = '1px';
    el.style.overflow = 'hidden';
    el.style.clip = 'rect(0,0,0,0)';
    el.style.whiteSpace = 'nowrap';
    el.style.border = '0';
    document.body.appendChild(el);
    regionRef.current = el;

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (regionRef.current) {
      regionRef.current.textContent = '';
      requestAnimationFrame(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      });
    }
  }, []);

  return { announce };
}
