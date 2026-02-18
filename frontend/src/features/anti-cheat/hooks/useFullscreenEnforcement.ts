import { useEffect, useCallback, useState } from 'react';

interface UseFullscreenEnforcementOptions {
  enabled: boolean;
  onExitFullscreen: () => void;
}

export function useFullscreenEnforcement({
  enabled,
  onExitFullscreen,
}: UseFullscreenEnforcementOptions) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const requestFullscreen = useCallback(async () => {
    if (!enabled) return;
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      // Fullscreen not supported or blocked
    }
  }, [enabled]);

  const handleFullscreenChange = useCallback(() => {
    const fs = !!document.fullscreenElement;
    setIsFullscreen(fs);
    if (!fs && enabled) {
      onExitFullscreen();
    }
  }, [enabled, onExitFullscreen]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enabled, handleFullscreenChange]);

  return { isFullscreen, requestFullscreen };
}
