import { useState, useEffect, ChangeEvent } from 'react';

/**
 * Returns [immediateValue, setImmediateValue, debouncedValue].
 * The input stays responsive (immediateValue drives the UI), while
 * debouncedValue only updates `delay` ms after the user stops typing —
 * which is what feeds the expensive regex recompilation.
 */
export function useDebouncedValue<T>(initialValue: T, delay: number): [T, (v: T) => void, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debounced, setDebounced] = useState<T>(initialValue);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return [value, setValue, debounced];
}

/** Convenience wrapper for controlled input/textarea change handlers. */
export function useDebouncedInput<T>(
  initialValue: T,
  delay: number
): [T, (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, T] {
  const [value, setValue, debounced] = useDebouncedValue(initialValue, delay);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as T);
  };

  return [value, handleChange, debounced];
}