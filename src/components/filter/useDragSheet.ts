import { useRef, useState } from 'react';

export function useDragSheet() {
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityRef = useRef(0);
  const dragYRef = useRef(0);
  const [dragY, _setDragY] = useState(0);
  const rafRef = useRef<number | null>(null);

  const setDragY = (y: number) => {
    dragYRef.current = y;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        _setDragY(dragYRef.current);
        rafRef.current = null;
      });
    }
  };

  const isValidDragStart = (
    target: EventTarget | null,
    handleRef: React.RefObject<HTMLDivElement | null>,
    headerRef: React.RefObject<HTMLElement | null>,
    sheetRef: React.RefObject<HTMLElement | null>,
    scrollAreaRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const h = handleRef.current;
    const header = headerRef.current;
    if (!sheetRef.current) return false;
    const inHandle = h && h.contains(target as Node);
    const inHeader = header && header.contains(target as Node);
    if (!inHandle && !inHeader) return false;

    const sc = scrollAreaRef.current;
    if (sc && sc.scrollTop > 0) return false;

    return true;
  };

  const onPointerDown = (e: React.PointerEvent, sheetRef: React.RefObject<HTMLElement | null>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);

    draggingRef.current = true;
    sheetRef.current?.classList.add('transition-none');

    const y = e.clientY;
    startYRef.current = y;
    lastYRef.current = y;
    lastTRef.current = performance.now();
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const y = e.clientY;
    const dy = y - startYRef.current;
    const offset = dy < 0 ? Math.max(-20, dy * 0.2) : dy;
    setDragY(Math.max(0, offset));

    const now = performance.now();
    const dt = now - lastTRef.current;
    if (dt > 0) {
      const vy = ((y - lastYRef.current) / dt) * 1000;
      velocityRef.current = vy;
      lastYRef.current = y;
      lastTRef.current = now;
    }
  };

  const onPointerUp = (sheetRef: React.RefObject<HTMLElement | null>, onClose: () => void) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    sheetRef.current?.classList.remove('transition-none');
    sheetRef.current?.classList.add('transition-transform', 'duration-200');

    const closeThreshold = 120;
    const velocityThreshold = 900;
    const shouldClose =
      dragYRef.current > closeThreshold || velocityRef.current > velocityThreshold;

    if (shouldClose) {
      onClose();
      setDragY(0);
    } else {
      setDragY(0);
      window.setTimeout(() => {
        sheetRef.current?.classList.remove('transition-transform', 'duration-200');
      }, 220);
    }
  };

  return {
    dragY,
    draggingRef,
    isValidDragStart,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
