import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Pause,
  PieChart,
  Play,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useLang } from '../context/LangContext';
import { SERVICES } from '../data/ecosystem';
import { PRODUCTS, type Product } from '../data/products';
import { SurfaceCard } from './ui';

interface HealthSnapshot {
  status: string;
  uptimeSeconds: number;
  productsCount: number;
  upcomingCount: number;
  inquiriesCount: number;
}

interface ProductWithLaunches extends Product {
  launches?: number;
}

interface PingSample {
  id: number;
  ms: number;
  prevMs: number;
  time: string;
  status: number;
}

type ChartMode = 'area' | 'candles' | 'bars';

function buildSmoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX.toFixed(1)},${p0.y.toFixed(1)} ${midX.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }
  return d;
}

export function EcosystemCharts() {
  const { t } = useLang();
  const [products, setProducts] = useState<ProductWithLaunches[]>(PRODUCTS);
  const [upcomingCount, setUpcomingCount] = useState(3);
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const [samples, setSamples] = useState<PingSample[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<ChartMode>('area');
  const [intervalMs, setIntervalMs] = useState<number>(2000);
  const [paused, setPaused] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const sampleBackend = useCallback(async (fetchProducts: boolean) => {
    const start = performance.now();
    try {
      const healthRes = await fetch('/api/health');
      const elapsed = Math.max(1, Math.round(performance.now() - start));
      const nowLabel = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setSamples((prev) => {
        const lastMs = prev.length ? prev[prev.length - 1].ms : elapsed;
        return [
          ...prev.slice(-29),
          {
            id: Date.now() + Math.random(),
            ms: elapsed,
            prevMs: lastMs,
            time: nowLabel,
            status: healthRes.status,
          },
        ];
      });

      if (healthRes.ok) {
        const h = await healthRes.json();
        setHealth(h);
      }

      if (fetchProducts) {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const p = await prodRes.json();
          if (Array.isArray(p.products)) setProducts(p.products);
          if (Array.isArray(p.upcomingModules)) setUpcomingCount(p.upcomingModules.length);
        }
      }
    } catch {
      // ignore transient errors
    }
  }, []);

  useEffect(() => {
    sampleBackend(true);
  }, [sampleBackend]);

  useEffect(() => {
    if (paused) return;
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      sampleBackend(tick % 3 === 0);
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, intervalMs, sampleBackend]);

  const serviceCounts = useMemo(
    () =>
      SERVICES.reduce<Record<string, number>>((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + 1;
        return acc;
      }, {}),
    [],
  );

  const distribution = useMemo(
    () => [
      { label: 'Active Web Products', count: products.length, color: '#FF3030' },
      { label: 'Upcoming Modules', count: upcomingCount, color: '#D41414' },
      { label: 'Engineering Services', count: serviceCounts.Engineering || 0, color: '#FF7A59' },
      {
        label: 'Creative & Design',
        count: (serviceCounts.Design || 0) + (serviceCounts.Creative || 0),
        color: '#850909',
      },
      { label: 'Growth Services', count: serviceCounts.Growth || 0, color: '#52525B' },
    ],
    [products.length, upcomingCount, serviceCounts],
  );

  const totalDistribution = distribution.reduce((sum, item) => sum + item.count, 0) || 1;
  const maxLaunches = Math.max(1, ...products.map((p) => p.launches ?? 0));

  // Trading Terminal Canvas Dimensions
  const W = 640;
  const H = 210;
  const PAD_T = 18;
  const PAD_B = 22;
  const RIGHT_AXIS = 52;
  const plotW = W - RIGHT_AXIS;
  const chartH = H - PAD_T - PAD_B;

  const msValues = samples.map((s) => s.ms);
  const minMs = msValues.length ? Math.min(...msValues) : 0;
  const maxMs = msValues.length ? Math.max(...msValues) : 10;
  const avgMs = msValues.length
    ? Math.round(msValues.reduce((a, b) => a + b, 0) / msValues.length)
    : 0;
  const scaleMax = Math.max(maxMs + 4, minMs + 8, 12);
  const scaleMin = Math.max(0, minMs - 2);
  const span = Math.max(1, scaleMax - scaleMin);

  const yFor = (val: number) => PAD_T + chartH - ((val - scaleMin) / span) * chartH;

  const coords = samples.map((s, idx) => {
    const x = samples.length > 1 ? 12 + (idx / (samples.length - 1)) * (plotW - 24) : plotW - 16;
    const y = yFor(s.ms);
    const prevY = yFor(s.prevMs);
    return { x, y, prevY, ...s };
  });

  const smoothLine = buildSmoothPath(coords);
  const smoothArea =
    coords.length > 1
      ? `${smoothLine} L ${coords[coords.length - 1].x.toFixed(1)},${H - PAD_B} L ${coords[0].x.toFixed(1)},${H - PAD_B} Z`
      : '';

  const latest = coords[coords.length - 1];
  const delta = latest ? latest.ms - latest.prevMs : 0;
  const activePoint = hoverIdx !== null && coords[hoverIdx] ? coords[hoverIdx] : latest;
  const recentTape = [...samples].reverse().slice(0, 5);
  const activeSliceObj = distribution.find((d) => d.label === hoveredSlice);

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">
            {t('Terminal Telemetri & Analitik Live', 'Live Telemetry & Analytics Terminal')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {t('Traffic Backend & Aktivitas Ekosistem', 'Live Backend Traffic & Ecosystem Pulse')}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171717] border border-[#242424] text-[11px] font-mono text-neutral-200">
            <span
              className={`w-2 h-2 rounded-full ${
                paused ? 'bg-amber-400' : 'bg-[#4ae176] animate-ping'
              }`}
            />
            <span>{paused ? 'PAUSED' : `LIVE · ${intervalMs / 1000}S`}</span>
          </div>
          <button
            type="button"
            onClick={() => sampleBackend(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171717] hover:bg-[#242424] border border-[#242424] hover:border-[#FF3030]/50 text-[11px] font-mono text-neutral-200 cursor-pointer"
            title="Ping API sekarang"
          >
            <RefreshCw className="w-3 h-3 text-[#FF3030]" />
            <span>Ping</span>
          </button>
        </div>
      </div>

      {/* PRO TRADING TERMINAL CARD */}
      <SurfaceCard className="p-5 sm:p-7 space-y-5 border-[#242424] bg-[#0B0B0F]/95">
        {/* Top Terminal Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3030]/25 to-[#850909]/10 border border-[#FF3030]/40 flex items-center justify-center text-[#FF3030]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  JEVALLENE // API-PING
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#4ae176]/15 text-[#4ae176] font-mono text-[10px]">
                  200 OK
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                {activePoint
                  ? `TICK ${activePoint.time} · ${activePoint.ms} ms · ${samples.length} samples`
                  : 'Menghubungkan ke /api/health...'}
              </p>
            </div>
          </div>

          {/* Chart Mode + Interval + Live Price Readout */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-0.5 rounded-full bg-[#171717] border border-[#242424]">
              {(['area', 'candles', 'bars'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setChartMode(mode)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase transition-all cursor-pointer ${
                    chartMode === mode
                      ? 'bg-[#FF3030] text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center p-0.5 rounded-full bg-[#171717] border border-[#242424]">
              {[1000, 2000, 5000].map((ms) => (
                <button
                  key={ms}
                  type="button"
                  onClick={() => setIntervalMs(ms)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                    intervalMs === ms
                      ? 'bg-[#242424] text-[#FF3030] font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {ms / 1000}s
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="p-2 rounded-full bg-[#171717] border border-[#242424] hover:border-[#FF3030]/60 text-white cursor-pointer"
              aria-label={paused ? 'Lanjutkan stream' : 'Jeda stream'}
            >
              {paused ? <Play className="w-3.5 h-3.5 text-[#4ae176]" /> : <Pause className="w-3.5 h-3.5 text-[#FF3030]" />}
            </button>

            <div className="sm:pl-3 sm:border-l border-[#242424] sm:text-right">
              <div className="font-mono text-lg sm:text-2xl font-bold text-white tabular-nums">
                {latest ? `${latest.ms} ms` : '—'}
              </div>
              <div
                className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                  delta <= 0 ? 'text-[#4ae176]' : 'text-[#FF3030]'
                }`}
              >
                {delta <= 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                <span>
                  {delta > 0 ? `+${delta}` : delta} ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Trading Chart Canvas */}
        <div className="rounded-2xl bg-[#070709] border border-[#242424] p-2.5 sm:p-4 overflow-hidden relative">
          <svg
            className="w-full h-44 sm:h-60 select-none"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="proTradingArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF3030" stopOpacity="0.42" />
                <stop offset="65%" stopColor="#D41414" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#090909" stopOpacity="0" />
              </linearGradient>
              <filter id="crimsonGlow" x="-10%" y="-20%" width="120%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal & Vertical Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = PAD_T + ratio * chartH;
              const val = Math.round(scaleMax - ratio * span);
              return (
                <g key={ratio}>
                  <line
                    x1="0"
                    y1={y}
                    x2={plotW}
                    y2={y}
                    stroke="#1c1c22"
                    strokeDasharray="3 3"
                    strokeWidth="0.9"
                  />
                  <text
                    x={plotW + 8}
                    y={y + 3}
                    fill="#737373"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {val}ms
                  </text>
                </g>
              );
            })}

            {/* MODE 1: SMOOTH AREA */}
            {chartMode === 'area' && smoothArea && (
              <>
                <path d={smoothArea} fill="url(#proTradingArea)" />
                <path
                  d={smoothLine}
                  fill="none"
                  stroke="#FF3030"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  filter="url(#crimsonGlow)"
                />
              </>
            )}

            {/* MODE 2: CANDLES */}
            {chartMode === 'candles' &&
              coords.map((c, idx) => {
                const isFaster = c.ms <= c.prevMs;
                const color = isFaster ? '#4ae176' : '#FF3030';
                const top = Math.min(c.y, c.prevY);
                const bodyH = Math.max(4, Math.abs(c.y - c.prevY));
                const wickTop = Math.max(PAD_T, top - 6);
                const wickBottom = Math.min(H - PAD_B, top + bodyH + 6);
                return (
                  <g key={`${c.id}-${idx}`}>
                    <line
                      x1={c.x}
                      y1={wickTop}
                      x2={c.x}
                      y2={wickBottom}
                      stroke={color}
                      strokeWidth="1.4"
                    />
                    <rect
                      x={c.x - 4.5}
                      y={top}
                      width="9"
                      height={bodyH}
                      rx="1.5"
                      fill={color}
                      opacity="0.9"
                    />
                  </g>
                );
              })}

            {/* MODE 3: BARS */}
            {chartMode === 'bars' &&
              coords.map((c, idx) => {
                const barH = Math.max(4, H - PAD_B - c.y);
                return (
                  <rect
                    key={`${c.id}-${idx}`}
                    x={c.x - 4}
                    y={c.y}
                    width="8"
                    height={barH}
                    rx="2"
                    fill={c.ms <= avgMs ? '#4ae176' : '#FF3030'}
                    opacity="0.85"
                  />
                );
              })}

            {/* Active / Live Crosshair & Price Tag */}
            {activePoint && (
              <g>
                <line
                  x1="0"
                  y1={activePoint.y}
                  x2={plotW}
                  y2={activePoint.y}
                  stroke="#FF3030"
                  strokeOpacity="0.55"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1={activePoint.x}
                  y1={PAD_T}
                  x2={activePoint.x}
                  y2={H - PAD_B}
                  stroke="#ffffff"
                  strokeOpacity="0.2"
                  strokeDasharray="2 3"
                  strokeWidth="0.9"
                />
                <rect
                  x={plotW + 4}
                  y={activePoint.y - 9}
                  width="46"
                  height="18"
                  rx="4"
                  fill="#FF3030"
                />
                <text
                  x={plotW + 27}
                  y={activePoint.y + 3.5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {activePoint.ms}ms
                </text>
                <circle cx={activePoint.x} cy={activePoint.y} r="8" fill="#FF3030" opacity="0.28" />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="#FF3030"
                  strokeWidth="1.8"
                />
              </g>
            )}

            {/* Interactive Hover Targets */}
            {coords.map((c, idx) => (
              <rect
                key={`hit-${c.id}-${idx}`}
                x={Math.max(0, c.x - 10)}
                y={0}
                width="20"
                height={H}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(idx)}
              />
            ))}
          </svg>
        </div>

        {/* Live Tick Tape */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mr-1">
            RECENT TICKS:
          </span>
          {recentTape.map((tick) => {
            const diff = tick.ms - tick.prevMs;
            return (
              <span
                key={tick.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171717] border border-[#242424] text-[10px] font-mono"
              >
                <span className="text-neutral-400">{tick.time}</span>
                <span className="text-white font-semibold">{tick.ms}ms</span>
                <span className={diff <= 0 ? 'text-[#4ae176]' : 'text-[#FF3030]'}>
                  {diff > 0 ? `+${diff}` : diff}
                </span>
              </span>
            );
          })}
        </div>

        {/* Live Ticker Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="rounded-xl bg-[#090909] border border-[#242424] p-3">
            <p className="font-mono text-sm font-bold text-[#4ae176] tabular-nums">{minMs} ms</p>
            <p className="text-[10px] text-neutral-400">MIN LATENCY</p>
          </div>
          <div className="rounded-xl bg-[#090909] border border-[#242424] p-3">
            <p className="font-mono text-sm font-bold text-white tabular-nums">{avgMs} ms</p>
            <p className="text-[10px] text-neutral-400">AVG LATENCY</p>
          </div>
          <div className="rounded-xl bg-[#090909] border border-[#242424] p-3">
            <p className="font-mono text-sm font-bold text-[#FF3030] tabular-nums">{maxMs} ms</p>
            <p className="text-[10px] text-neutral-400">PEAK LATENCY</p>
          </div>
          <div className="rounded-xl bg-[#090909] border border-[#242424] p-3">
            <p className="font-mono text-sm font-bold text-white tabular-nums">
              {health ? `${health.uptimeSeconds}s` : '—'}
            </p>
            <p className="text-[10px] text-neutral-400">API UPTIME</p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl bg-[#090909] border border-[#242424] p-3">
            <p className="font-mono text-sm font-bold text-white tabular-nums">
              {health ? health.inquiriesCount : 0}
            </p>
            <p className="text-[10px] text-neutral-400">INQUIRIES</p>
          </div>
        </div>
      </SurfaceCard>

      {/* BOTTOM ROW: Product Launches + Interactive Ecosystem Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurfaceCard className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#FF3030]" />
              <h3 className="text-sm font-bold text-white">
                {t('Peluncuran Produk (Live DB)', 'Product Launches (Live DB)')}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">GET /api/products</span>
          </div>

          <div className="space-y-4 pt-1">
            {products.map((p) => {
              const launches = p.launches ?? 0;
              const widthPct =
                launches === 0 ? 6 : Math.max(12, Math.round((launches / maxLaunches) * 100));
              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200">{p.shortTitle}</span>
                    <span className="font-mono text-[#FF3030] tabular-nums">
                      {launches} {t('kali dibuka', 'launches')} · {p.bentoSpecs.length}{' '}
                      {t('modul', 'specs')}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#090909] border border-[#242424] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#850909] via-[#D41414] to-[#FF3030] transition-all duration-700 shadow-[0_0_12px_rgba(255,48,48,0.45)]"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#FF3030]" />
              <h3 className="text-sm font-bold text-white">
                {t('Komposisi Ekosistem', 'Ecosystem Composition')}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {totalDistribution} {t('unit aktif', 'total units')}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#242424" strokeWidth="10" />
                {
                  distribution.reduce<{ offset: number; els: React.ReactNode[] }>(
                    (acc, item) => {
                      const circumference = 2 * Math.PI * 38;
                      const dash = (item.count / totalDistribution) * circumference;
                      const isHovered = hoveredSlice === item.label;
                      acc.els.push(
                        <circle
                          key={item.label}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke={item.color}
                          strokeWidth={isHovered ? '13' : '10'}
                          strokeDasharray={`${dash} ${circumference}`}
                          strokeDashoffset={-acc.offset}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredSlice(item.label)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />,
                      );
                      acc.offset += dash;
                      return acc;
                    },
                    { offset: 0, els: [] },
                  ).els
                }
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-mono text-lg font-bold text-white leading-none">
                  {activeSliceObj
                    ? `${Math.round((activeSliceObj.count / totalDistribution) * 100)}%`
                    : totalDistribution}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 mt-1">
                  {activeSliceObj ? activeSliceObj.label.split(' ')[0] : 'UNITS'}
                </span>
              </div>
            </div>

            <ul className="space-y-2 flex-1 w-full text-xs">
              {distribution.map((item) => (
                <li
                  key={item.label}
                  onMouseEnter={() => setHoveredSlice(item.label)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    hoveredSlice === item.label ? 'bg-white/[0.06]' : ''
                  }`}
                >
                  <span className="flex items-center gap-2 text-neutral-300 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
