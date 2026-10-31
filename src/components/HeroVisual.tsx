"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";

// Ampel wie in der Schweiz: Rot, Rot+Gelb, Grün, Gelb
const RED = "#ff3b30";
const YELLOW = "#ffb400";
const GREEN = "#22c55e";

type Lamp = "red" | "yellow" | "green";

const PHASES: {
  lamps: Lamp[];
  ms: number;
  glow: string;
  label: { de: string; fr: string };
  title: { de: string; fr: string };
  sub: { de: string; fr: string };
}[] = [
  {
    lamps: ["red"],
    ms: 3000,
    glow: RED,
    label: { de: "Rot", fr: "Rouge" },
    title: { de: "Gurt an.", fr: "Ceinture attachée." },
    sub: { de: "Wir starten ganz entspannt.", fr: "On démarre en douceur." },
  },
  {
    lamps: ["red", "yellow"],
    ms: 1500,
    glow: YELLOW,
    label: { de: "Rot-Gelb", fr: "Rouge-jaune" },
    title: { de: "Spiegel, Blinker, Blick.", fr: "Rétro, clignotant, regard." },
    sub: { de: "Gleich geht's los.", fr: "C'est presque parti." },
  },
  {
    lamps: ["green"],
    ms: 4500,
    glow: GREEN,
    label: { de: "Grün", fr: "Vert" },
    title: { de: "Los geht's!", fr: "C'est parti !" },
    sub: { de: "Deine erste Fahrstunde wartet.", fr: "Ta première leçon t'attend." },
  },
  {
    lamps: ["yellow"],
    ms: 1500,
    glow: YELLOW,
    label: { de: "Gelb", fr: "Jaune" },
    title: { de: "Kurz anhalten.", fr: "On ralentit." },
    sub: { de: "Sicherheit zuerst, immer.", fr: "La sécurité d'abord, toujours." },
  },
];

const GREEN_PHASE = 2;
const LAMP_COLORS: Record<Lamp, string> = { red: RED, yellow: YELLOW, green: GREEN };
const LAMP_Y: Record<Lamp, number> = { red: 82, yellow: 178, green: 274 };

function TrafficLight({ on }: { on: Lamp[] }) {
  return (
    <svg viewBox="0 0 160 430" className="h-full w-auto overflow-visible">
      <defs>
        <linearGradient id="tlHousing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#30363d" />
          <stop offset="55%" stopColor="#1d2126" />
          <stop offset="100%" stopColor="#121417" />
        </linearGradient>
        <linearGradient id="tlPole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4048" />
          <stop offset="100%" stopColor="#1a1d21" />
        </linearGradient>
        <pattern id="tlLeds" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.3" fill="#ffffff" fillOpacity="0.22" />
        </pattern>
        <filter id="tlGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        {(Object.keys(LAMP_COLORS) as Lamp[]).map((lamp) => (
          <radialGradient key={lamp} id={`tl-${lamp}`} cx="40%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor={LAMP_COLORS[lamp]} />
            <stop offset="100%" stopColor={LAMP_COLORS[lamp]} stopOpacity="0.75" />
          </radialGradient>
        ))}
      </defs>

      {/* Mast */}
      <rect x="70" y="340" width="20" height="90" rx="4" fill="url(#tlPole)" />

      {/* Gehäuse */}
      <rect x="18" y="12" width="124" height="336" rx="30" fill="url(#tlHousing)" />
      <rect x="18" y="12" width="124" height="336" rx="30" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
      <rect x="26" y="20" width="8" height="300" rx="4" fill="#ffffff" fillOpacity="0.05" />

      {(Object.keys(LAMP_Y) as Lamp[]).map((lamp) => {
        const cy = LAMP_Y[lamp];
        const color = LAMP_COLORS[lamp];
        const active = on.includes(lamp);
        return (
          <g key={lamp}>
            {/* Leuchten nach aussen */}
            <motion.circle
              cx="80"
              cy={cy}
              r="40"
              fill={color}
              filter="url(#tlGlow)"
              initial={false}
              animate={{ opacity: active ? 0.85 : 0 }}
              transition={{ duration: 0.25 }}
            />
            <circle cx="80" cy={cy} r="40" fill="#0a0c0e" />
            <circle cx="80" cy={cy} r="34" fill={color} fillOpacity="0.12" />
            <motion.circle
              cx="80"
              cy={cy}
              r="34"
              fill={`url(#tl-${lamp})`}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <circle cx="80" cy={cy} r="34" fill="url(#tlLeds)" />
            <ellipse cx="68" cy={cy - 14} rx="12" ry="6" fill="#ffffff" fillOpacity={active ? 0.45 : 0.08} transform={`rotate(-25 68 ${cy - 14})`} />
            {/* Schirm über der Lampe */}
            <path
              d={`M34,${cy - 30} Q80,${cy - 70} 126,${cy - 30} L126,${cy - 22} Q80,${cy - 58} 34,${cy - 22} Z`}
              fill="#0e1013"
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function HeroVisual() {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  // Vergangene Zeit in der aktuellen Phase, erst im Browser gezählt (sonst Hydration-Fehler)
  const [elapsed, setElapsed] = useState(0);

  const current = reduceMotion ? PHASES[GREEN_PHASE] : PHASES[phase];
  const isGreen = reduceMotion || phase === GREEN_PHASE;

  // Phase läuft ab, danach kommt die nächste
  useEffect(() => {
    if (reduceMotion) return;
    const start = Date.now();
    const tick = setInterval(() => setElapsed(Date.now() - start), 200);
    const next = setTimeout(() => {
      setElapsed(0);
      setPhase((p) => (p + 1) % PHASES.length);
    }, PHASES[phase].ms);
    return () => {
      clearInterval(tick);
      clearTimeout(next);
    };
  }, [phase, reduceMotion]);

  const untilGreen =
    PHASES.slice(phase, GREEN_PHASE).reduce((sum, p) => sum + p.ms, 0) - elapsed;
  const countdown = Math.max(1, Math.ceil(untilGreen / 1000));

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mx-auto flex w-full max-w-2xl items-center gap-6 sm:gap-10"
    >
      {/* Farbiges Licht im Hintergrund */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-1/2 -z-10 h-[120%] w-[70%] -translate-y-1/2 rounded-full blur-3xl"
        initial={false}
        animate={{ backgroundColor: current.glow, opacity: isGreen ? 0.32 : 0.22 }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative h-[300px] shrink-0 sm:h-[420px]" aria-hidden="true">
        <TrafficLight on={current.lamps} />
      </div>

      <div className="min-w-0 flex-1" aria-live="polite">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card/80 px-3 py-1.5 text-xs font-semibold text-ink/70 shadow-sm backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full transition-colors duration-300" style={{ backgroundColor: current.glow }} />
          {t(current.label)}
          {!isGreen && phase < GREEN_PHASE && (
            <span className="tabular-nums text-ink/50">· {countdown}s</span>
          )}
        </div>

        <div className="mt-4 min-h-[7.5rem] sm:min-h-[8.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={reduceMotion ? "green" : phase}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="font-jakarta text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
                {t(current.title)}
              </p>
              <p className="mt-2 text-sm text-ink/60 sm:text-base">{t(current.sub)}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Knopf funktioniert nur bei Grün, bei Rot und Gelb passiert nichts */}
        <motion.div
          initial={false}
          animate={{ scale: isGreen ? 1 : 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mt-4 inline-block"
        >
          {isGreen ? (
            <Link
              href="/booking"
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_6px_rgb(34_197_94/0.18),0_12px_30px_-8px_rgb(34_197_94/0.7)] transition-all duration-500 hover:bg-accent-hover hover:text-white sm:text-base"
            >
              {t({ de: "Fahrstunde anfragen", fr: "Demander une leçon" })}
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex min-h-11 cursor-not-allowed select-none items-center gap-2 rounded-full border border-ink/15 bg-card px-6 py-3 text-sm font-semibold text-ink/45 transition-all duration-500 sm:text-base"
            >
              {t({ de: "Warte auf Grün …", fr: "Attends le vert …" })}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
