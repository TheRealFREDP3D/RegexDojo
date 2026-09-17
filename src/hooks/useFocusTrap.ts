import { useEffect, useRef, RefObject } from 'react';

/**
 * Restricts focus to the mounted container and closes on Escape.
 * Restores focus to the previously-active element on unmount.
 */
export function useFocusTrap<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  initialFocusRef?: RefObject<T>
) {
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Snapshot the element that had focus before the modal opened.
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const getFocusable = (): HTMLElement[] => {
      const raw = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const nodes: HTMLElement[] = [];
      raw.forEach((el) => nodes.push(el));
      return nodes.filter((el) => !el.closest('[aria-hidden="true"]') && el.offsetParent !== null);
    };

    const focusFirst = () => {
      const nodes = getFocusable();
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }
      if (nodes.length > 0) {
        nodes[0].focus();
      } else {
        container.focus();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = getFocusable();
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    // Defer focus so the open click does not immediately steal it back.
    const timer = setTimeout(focusFirst, 0);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus to whatever was active before the modal opened.
      previousActiveElement.current?.focus?.();
    };
  }, [isOpen, onClose, initialFocusRef]);

  return containerRef;
}