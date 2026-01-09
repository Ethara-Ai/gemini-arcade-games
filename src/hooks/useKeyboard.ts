import { useEffect, useState, useCallback } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }, [targetKey]);

  const upHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }, [targetKey]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
}

// Hook to track multiple keys
export function useMultiKeyPress(targetKeys: string[]): Set<string> {
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    if (targetKeys.includes(key)) {
      setKeysPressed(prev => new Set(prev).add(key));
    }
  }, [targetKeys]);

  const upHandler = useCallback(({ key }: KeyboardEvent) => {
    if (targetKeys.includes(key)) {
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, [targetKeys]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return keysPressed;
}

