"use client";
import "./line-animations.css";
import TranslatedContent from "@/components/TranslatedContent";


import { motion } from "framer-motion";

const ROUTE_D = "M20,300 C110,300 110,180 220,180 C330,180 330,60 460,60";

const WAYPOINTS = [
  { x: 20, y: 300 },
  { x: 140, y: 230 },
  { x: 300, y: 150 },
];

const DESTINATION = { x: 460, y: 60 };

function Waypoint({ x, y, delay }: { x: number; y: number; delay: number }) {
  return <TranslatedContent>{(
    <g>
      <circle cx={x} cy={y} r="11" fill="var(--accent-soft)" />
      <motion.circle
        cx={x}
        cy={y}
        r="5"
        fill="var(--accent)"
        animate={{ scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0, ease: "easeInOut", delay }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
    </g>
  )}</TranslatedContent>;
}

export default function RouteGraphic() {
  return <TranslatedContent>{(
    <motion.div
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <svg viewBox="0 0 500 340" className="w-full overflow-visible">
        <defs>
          <linearGradient id="routeFlow" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14baff" stopOpacity="0" />
          </linearGradient>
          <filter id="routeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        <path d={ROUTE_D} fill="none" stroke="#20261f" strokeOpacity="0.1" strokeWidth="3" strokeLinecap="round" />

        <path
          d={ROUTE_D}
          fill="none"
          stroke="url(#routeFlow)"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1000}
          strokeDasharray="220 280"
          className="route-flow"
          filter="url(#routeGlow)"
        />

        {WAYPOINTS.map((p, i) => (
          <Waypoint key={i} x={p.x} y={p.y} delay={i * 0.9} />
        ))}

        <circle cx={DESTINATION.x} cy={DESTINATION.y} r="22" fill="#14baff" fillOpacity="0.14" />
        <motion.circle
          cx={DESTINATION.x}
          cy={DESTINATION.y}
          r="22"
          fill="none"
          stroke="#14baff"
          strokeWidth="2"
          strokeOpacity="0.4"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0, ease: "easeOut" }}
          style={{ transformOrigin: `${DESTINATION.x}px ${DESTINATION.y}px` }}
        />
        <circle cx={DESTINATION.x} cy={DESTINATION.y} r="14" fill="#0c7fb0" />
        <path
          d={`M${DESTINATION.x - 6},${DESTINATION.y} l4,5 l8,-10`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute left-[2%] top-[76%] rounded-2xl border border-ink/8 bg-card px-4 py-3 shadow-md"
      >
        <p className="text-xs font-semibold text-ink/50">★★★★★ 4.9</p>
        <p className="text-sm font-bold text-ink">400+ Fahrschüler:innen</p>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute right-[4%] top-[6%] rounded-2xl border border-ink/8 bg-card px-4 py-3 shadow-md"
      >
        <p className="text-sm font-bold text-ink">🎓 Führerausweis</p>
        <p className="text-xs text-ink/50">Dein Ziel</p>
      </motion.div>
    </motion.div>
  )}</TranslatedContent>;
}
