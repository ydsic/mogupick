import { useEffect, useRef, useState } from 'react';
import { SortKey } from './types';

export function SortSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const sheetRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<SortKey>(value);
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

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  function isValidDragStart(target: EventTarget | null) {
    const h = handleRef.current;
    const header = headerRef.current;
    if (!sheetRef.current) return false;
    const inHandle = h && h.contains(target as Node);
    const inHeader = header && header.contains(target as Node);
    if (!inHandle && !inHeader) return false;

    const sc = scrollAreaRef.current;
    if (sc && sc.scrollTop > 0) return false;

    return true;
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!open) return;
    if (!isValidDragStart(e.target)) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);

    draggingRef.current = true;
    sheetRef.current?.classList.add('transition-none');

    const y = e.clientY;
    startYRef.current = y;
    lastYRef.current = y;
    lastTRef.current = performance.now();
    velocityRef.current = 0;
  }

  function onPointerMove(e: React.PointerEvent) {
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
  }

  function onPointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    sheetRef.current?.classList.remove('transition-none');
    sheetRef.current?.classList.add('transition-transform', 'duration-200');

    const closeThreshold = 120;
    const velocityThreshold = 900;
    const shouldClose =
      dragYRef.current > closeThreshold || velocityRef.current > velocityThreshold;

    if (shouldClose) {
      onOpenChange(false);
      setDragY(0);
    } else {
      setDragY(0);
      window.setTimeout(() => {
        sheetRef.current?.classList.remove('transition-transform', 'duration-200');
      }, 220);
    }
  }

  const Item = ({ v, label }: { v: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => setLocal(v)}
      className={`w-full px-4 py-3 text-left text-base ${
        local === v ? 'bg-zinc-50 font-semibold text-black' : 'text-zinc-900'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 z-[60] bg-black/15 ${open ? '' : 'hidden'}`}
      />

      <section
        ref={sheetRef as any}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sortSheetTitle"
        className={`fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-screen-sm rounded-t-2xl bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.1)] will-change-transform ${
          open ? '' : 'translate-y-full'
        }`}
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          transform: open ? `translateY(${dragY}px)` : undefined,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={handleRef} className="flex touch-none items-center justify-center py-2">
          <span className="h-1.5 w-12 rounded-full bg-zinc-200" />
        </div>

        <div ref={scrollAreaRef} className="max-h-[60vh] overflow-y-auto">
          <div className="divide-y divide-zinc-200 py-1">
            <Item v="new" label="신상품순" />
            <Item v="popular" label="인기순" />
            <Item v="review" label="리뷰많은순" />
            <Item v="priceLow" label="낮은가격순" />
          </div>

          <div className="mt-3 flex items-center gap-3 px-4 pb-3">
            <button
              type="button"
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base font-medium text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
              onClick={() => onOpenChange(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-black px-4 py-3 text-base font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
              onClick={() => {
                onChange(local);
                onOpenChange(false);
              }}
            >
              적용
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center">
          <span className="h-1.5 w-36 rounded-full bg-black" />
        </div>
      </section>
    </>
  );
}
