import React, { useEffect, useState, useRef } from 'react';

export interface CursorState {
  label: string | null;
  active: boolean;
  magneticTarget: HTMLElement | null;
}

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<CursorState>({
    label: null,
    active: false,
    magneticTarget: null
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on devices with a fine pointer (desktop mouse)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setTargetPos({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive element with custom cursor attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorLabel = target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') || null;
      const isInteractive = !!target.closest('button, a, input, select, [role="button"], [data-cursor-active="true"]');

      setCursorState({
        label: cursorLabel,
        active: isInteractive || !!cursorLabel,
        magneticTarget: target.closest('[data-magnetic="true"]') as HTMLElement | null
      });
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  // Smooth lerp RAF loop for fluid, expensive cursor motion
  useEffect(() => {
    let animId: number;
    const lerp = () => {
      setPos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * 0.18,
        y: prev.y + (targetPos.y - prev.y) * 0.18
      }));
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [targetPos]);

  if (!isVisible) return null;

  const hasLabel = !!cursorState.label;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Outer Follower Halo */}
      <div
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-[width,height,background-color,border-color] duration-200 ease-out -translate-x-1/2 -translate-y-1/2 ${
          hasLabel
            ? 'w-24 h-24 bg-[#20D3C2]/20 border border-[#20D3C2] backdrop-blur-xs'
            : cursorState.active
            ? 'w-12 h-12 bg-[#20D3C2]/15 border border-[#20D3C2]/60'
            : 'w-8 h-8 bg-transparent border border-white/30'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
        }}
      >
        {hasLabel && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#5EE7DF] uppercase px-2 text-center select-none animate-pulse">
            {cursorState.label}
          </span>
        )}
      </div>

      {/* Center Precise Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#5EE7DF] shadow-[0_0_8px_#20D3C2] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          transform: `translate3d(${targetPos.x}px, ${targetPos.y}px, 0) translate(-50%, -50%)`
        }}
      />
    </div>
  );
};
