import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Rocket } from 'lucide-react';

const WARP_STREAKS = [
  { id: 1, left: '8%', height: '52px', delay: '0ms', duration: '0.58s' },
  { id: 2, left: '16%', height: '74px', delay: '110ms', duration: '0.68s' },
  { id: 3, left: '25%', height: '42px', delay: '50ms', duration: '0.52s' },
  { id: 4, left: '34%', height: '66px', delay: '140ms', duration: '0.62s' },
  { id: 5, left: '43%', height: '58px', delay: '30ms', duration: '0.56s' },
  { id: 6, left: '57%', height: '64px', delay: '90ms', duration: '0.60s' },
  { id: 7, left: '66%', height: '48px', delay: '20ms', duration: '0.54s' },
  { id: 8, left: '75%', height: '76px', delay: '130ms', duration: '0.66s' },
  { id: 9, left: '84%', height: '44px', delay: '70ms', duration: '0.58s' },
  { id: 10, left: '92%', height: '60px', delay: '160ms', duration: '0.64s' },
];

export function RocketLaunchOverlay({
  active,
  onMidpoint,
  onComplete,
}: {
  active: boolean;
  onMidpoint: () => void;
  onComplete: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const midTimer = window.setTimeout(() => onMidpoint(), 520);
    const doneTimer = window.setTimeout(() => onComplete(), 1480);
    return () => {
      window.clearTimeout(midTimer);
      window.clearTimeout(doneTimer);
    };
  }, [active, onMidpoint, onComplete]);

  if (!active || typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] overflow-hidden"
    >
      {/* Left Split Door */}
      <div className="animate-door-left absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-[#FF3030]/75 bg-[#060609]/95 shadow-[12px_0_48px_rgba(255,48,48,0.35)] backdrop-blur-md will-change-transform">
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF7A59] to-transparent opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(255,48,48,0.16),transparent_60%)]" />
      </div>

      {/* Right Split Door */}
      <div className="animate-door-right absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-[#FF3030]/75 bg-[#060609]/95 shadow-[-12px_0_48px_rgba(255,48,48,0.35)] backdrop-blur-md will-change-transform">
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF7A59] to-transparent opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(255,48,48,0.16),transparent_60%)]" />
      </div>

      {/* Falling Warp Streaks */}
      <div className="absolute inset-0">
        {WARP_STREAKS.map((s) => (
          <span
            key={s.id}
            style={{
              left: s.left,
              height: s.height,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
            className="animate-streak-fall absolute top-0 w-px rounded-full bg-gradient-to-b from-transparent via-white/80 to-[#FF3030]/70 will-change-transform"
          />
        ))}
      </div>

      {/* Bottom Shockwave Ring */}
      <div className="animate-shockwave absolute bottom-6 left-1/2 h-36 w-36 rounded-full border-2 border-[#FF7A59]/80 bg-[radial-gradient(circle,rgba(255,48,48,0.35),transparent_70%)] shadow-[0_0_40px_rgba(255,48,48,0.75)] will-change-transform" />

      {/* Central Vertical Laser Beam */}
      <div className="animate-beam-rise absolute inset-y-0 left-1/2 w-[4px] bg-gradient-to-t from-[#FF3030] via-[#FF7A59] to-white shadow-[0_0_30px_rgba(255,48,48,0.95)] will-change-transform" />

      {/* Launching Rocket */}
      <div className="animate-rocket-fly absolute left-1/2 top-0 flex flex-col items-center will-change-transform">
        <div className="pointer-events-none absolute -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,48,48,0.5),transparent_70%)] animate-pulse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#FF3030]/80 bg-[#0B0B0F] shadow-[0_0_30px_rgba(255,48,48,0.8)]">
          <Rocket className="w-6 h-6 text-white -rotate-45" />
        </div>
        <div className="w-2 h-20 bg-gradient-to-b from-white via-[#FF3030] to-transparent blur-[1px]" />
      </div>
    </div>,
    document.body,
  );
}
