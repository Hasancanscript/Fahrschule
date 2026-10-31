// Schweizer Signale und Skizzen für das Verkehrs-Quiz.
// Signale stehen auf einem Mast mit Metallrand und Schatten, damit sie echt wirken.
import type { ReactNode } from "react";

const RED = "#d5121b";
const BLUE = "#0b4ea2";
const GREEN = "#00843d";
const YELLOW = "#ffcc00";
const RIM = "#b8bdc3";
const r2 = (n: number) => Math.round(n * 100) / 100;

// Mast mit Schelle, Signal oben drauf (Signal im Bereich 0..120)
function Post({ children, id }: { children: ReactNode; id: string }) {
  return (
    <svg viewBox="0 0 140 200" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`pole-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7d848c" />
          <stop offset="45%" stopColor="#d9dde1" />
          <stop offset="100%" stopColor="#6b7178" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.22" />
        </filter>
        <linearGradient id={`sheen-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="196" rx="22" ry="3.5" fill="#000" fillOpacity="0.12" />
      <rect x="64" y="96" width="12" height="100" rx="2" fill={`url(#pole-${id})`} />
      <rect x="61" y="104" width="18" height="6" rx="2" fill="#8a9097" />
      <g transform="translate(10 4)" filter={`url(#shadow-${id})`}>
        {children}
      </g>
      {/* leichter Glanz */}
      <rect x="10" y="4" width="120" height="120" fill={`url(#sheen-${id})`} style={{ mixBlendMode: "soft-light" }} pointerEvents="none" />
    </svg>
  );
}

// Kachel für Skizzen ohne Mast
function Tile({ children, bg = "#eef3ec" }: { children: ReactNode; bg?: string }) {
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full">
      <rect x="2" y="2" width="136" height="136" rx="28" fill={bg} />
      {children}
    </svg>
  );
}

function Car({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <path d="M-14,4 L-11,-6 C-10,-9 -8,-10 -5,-10 H5 C8,-10 10,-9 11,-6 L14,4 Z" />
      <rect x="-16" y="3" width="32" height="10" rx="3" />
      <rect x="-14" y="12" width="6" height="6" rx="1.5" />
      <rect x="8" y="12" width="6" height="6" rx="1.5" />
      <rect x="-8" y="-7" width="16" height="7" rx="1.5" fill="#fff" />
    </g>
  );
}

/* ---------- Vortritts-Signale ---------- */

export function SignRoundabout() {
  // Drei Pfeile im Gegenuhrzeigersinn wie auf dem Schweizer Signal 2.41.1
  const R = 30;
  const span = 72;
  const arrows = [0, 120, 240].map((offset) => {
    const startDeg = 300 - offset;
    const endDeg = startDeg - span;
    const toXY = (deg: number, rad = R) => {
      const a = (deg * Math.PI) / 180;
      return [60 + rad * Math.cos(a), 60 + rad * Math.sin(a)];
    };
    const [sx, sy] = toXY(startDeg);
    const [ex, ey] = toXY(endDeg);
    const a = (endDeg * Math.PI) / 180;
    const tan = [Math.sin(a), -Math.cos(a)];
    const nor = [Math.cos(a), Math.sin(a)];
    const tip = [ex + tan[0] * 14, ey + tan[1] * 14];
    const b1 = [ex + nor[0] * 11, ey + nor[1] * 11];
    const b2 = [ex - nor[0] * 11, ey - nor[1] * 11];
    return {
      arc: `M${r2(sx)},${r2(sy)} A${R},${R} 0 0 0 ${r2(ex)},${r2(ey)}`,
      head: `M${r2(b1[0])},${r2(b1[1])} L${r2(tip[0])},${r2(tip[1])} L${r2(b2[0])},${r2(b2[1])} Z`,
    };
  });
  return (
    <Post id="roundabout">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="54" fill={BLUE} />
      {arrows.map((ar, i) => (
        <g key={i}>
          <path d={ar.arc} fill="none" stroke="#fff" strokeWidth="10" />
          <path d={ar.head} fill="#fff" strokeLinejoin="round" stroke="#fff" strokeWidth="1.5" />
        </g>
      ))}
    </Post>
  );
}

export function SignStop() {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = ((22.5 + i * 45) * Math.PI) / 180;
    return [60 + 60 * Math.cos(a), 60 + 60 * Math.sin(a)];
  });
  const inner = pts.map(([x, y]) => [60 + (x - 60) * 0.9, 60 + (y - 60) * 0.9]);
  const d = (p: number[][]) => "M" + p.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" L") + " Z";
  return (
    <Post id="stop">
      <path d={d(pts)} fill={RIM} />
      <path d={d(pts.map(([x, y]) => [60 + (x - 60) * 0.97, 60 + (y - 60) * 0.97]))} fill="#fff" />
      <path d={d(inner)} fill={RED} />
      <text x="60" y="71" textAnchor="middle" fontSize="31" fontWeight="800" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">
        STOP
      </text>
    </Post>
  );
}

export function SignGiveWay() {
  return (
    <Post id="giveway">
      <path d="M2,8 H118 L60,112 Z" fill={RIM} strokeLinejoin="round" stroke={RIM} strokeWidth="6" />
      <path d="M8,11 H112 L60,104 Z" fill={RED} strokeLinejoin="round" stroke={RED} strokeWidth="6" />
      <path d="M30,24 H90 L60,78 Z" fill="#fff" strokeLinejoin="round" stroke="#fff" strokeWidth="4" />
    </Post>
  );
}

export function SignMainRoad() {
  return (
    <Post id="mainroad">
      <rect x="18" y="18" width="84" height="84" rx="5" fill={RIM} transform="rotate(45 60 60)" />
      <rect x="20" y="20" width="80" height="80" rx="4" fill="#fff" transform="rotate(45 60 60)" />
      <rect x="22" y="22" width="76" height="76" rx="3" fill="none" stroke="#222" strokeWidth="1.2" transform="rotate(45 60 60)" />
      <rect x="35" y="35" width="50" height="50" rx="2" fill={YELLOW} transform="rotate(45 60 60)" />
    </Post>
  );
}

/* ---------- Geschwindigkeit ---------- */

export function SignSpeed({ value }: { value: number }) {
  return (
    <Post id={`speed${value}`}>
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="51" fill={RED} />
      <circle cx="60" cy="60" r="39" fill="#fff" />
      <text x="60" y="75" textAnchor="middle" fontSize={value >= 100 ? 36 : 44} fontWeight="700" fill="#111" fontFamily="Arial, Helvetica, sans-serif">
        {value}
      </text>
    </Post>
  );
}

export function SignTownEnd() {
  return (
    <Post id="townend">
      <rect x="0" y="24" width="120" height="72" rx="6" fill={RIM} />
      <rect x="2" y="26" width="116" height="68" rx="5" fill={BLUE} />
      <rect x="6" y="30" width="108" height="60" rx="3" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="60" y="56" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff" fontFamily="Arial, Helvetica, sans-serif">Biel/</text>
      <text x="60" y="77" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff" fontFamily="Arial, Helvetica, sans-serif">Bienne</text>
      <path d="M10,86 L110,34" stroke={RED} strokeWidth="9" strokeLinecap="round" />
    </Post>
  );
}

export function SignMotorway() {
  return (
    <Post id="motorway">
      <rect x="0" y="0" width="120" height="120" rx="12" fill={RIM} />
      <rect x="2" y="2" width="116" height="116" rx="11" fill={GREEN} />
      <rect x="7" y="7" width="106" height="106" rx="8" fill="none" stroke="#fff" strokeWidth="2.5" />
      {/* Zwei Fahrbahnen in Perspektive, darüber eine Brücke */}
      <path d="M22,106 L52,58 H58 L56,106 Z" fill="#fff" />
      <path d="M98,106 L68,58 H62 L64,106 Z" fill="#fff" />
      <rect x="16" y="42" width="88" height="10" rx="1" fill="#fff" />
      <rect x="16" y="52" width="9" height="20" fill="#fff" />
      <rect x="95" y="52" width="9" height="20" fill="#fff" />
    </Post>
  );
}

/* ---------- Verbote ---------- */

export function SignNoEntry() {
  return (
    <Post id="noentry">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="54" fill={RED} />
      <rect x="22" y="51" width="76" height="18" rx="2" fill="#fff" />
    </Post>
  );
}

export function SignNoVehicles() {
  return (
    <Post id="novehicles">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="51" fill={RED} />
      <circle cx="60" cy="60" r="39" fill="#fff" />
    </Post>
  );
}

export function SignNoOvertaking() {
  return (
    <Post id="noovertaking">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="51" fill={RED} />
      <circle cx="60" cy="60" r="39" fill="#fff" />
      <Car x={44} y={58} color={RED} s={0.85} />
      <Car x={76} y={58} color="#111" s={0.85} />
    </Post>
  );
}

export function SignNoParking() {
  return (
    <Post id="noparking">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="54" fill={RED} />
      <circle cx="60" cy="60" r="44" fill={BLUE} />
      <path d="M29,29 L91,91" stroke={RED} strokeWidth="10" />
    </Post>
  );
}

export function SignNoStopping() {
  return (
    <Post id="nostopping">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="54" fill={RED} />
      <circle cx="60" cy="60" r="44" fill={BLUE} />
      <path d="M29,29 L91,91 M91,29 L29,91" stroke={RED} strokeWidth="10" />
    </Post>
  );
}

/* ---------- Gebote und Hinweise ---------- */

export function SignTurnRight() {
  return (
    <Post id="turnright">
      <circle cx="60" cy="60" r="59" fill={RIM} />
      <circle cx="60" cy="60" r="57" fill="#fff" />
      <circle cx="60" cy="60" r="54" fill={BLUE} />
      <path d="M48,94 V62 C48,52 54,48 62,48 H74" fill="none" stroke="#fff" strokeWidth="12" />
      <path d="M70,32 L94,48 L70,64 Z" fill="#fff" />
    </Post>
  );
}

export function SignCrosswalk() {
  return (
    <Post id="crosswalk">
      <rect x="0" y="0" width="120" height="120" rx="10" fill={RIM} />
      <rect x="2" y="2" width="116" height="116" rx="9" fill={BLUE} />
      <path d="M60,12 L110,104 H10 Z" fill="#fff" strokeLinejoin="round" stroke="#fff" strokeWidth="4" />
      {/* Zebrastreifen */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${30 + i * 13},98 l5,-12 h7 l-5,12 Z`} fill="#111" />
      ))}
      {/* Fussgänger */}
      <circle cx="62" cy="40" r="6" fill="#111" />
      <path d="M61,48 L56,66 L48,82 M57,64 L66,72 L68,84 M58,52 L48,60 M62,52 L72,58" stroke="#111" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Post>
  );
}

function Warning({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Post id={id}>
      <path d="M60,2 L118,108 H2 Z" fill={RIM} strokeLinejoin="round" stroke={RIM} strokeWidth="6" />
      <path d="M60,8 L113,104 H7 Z" fill={RED} strokeLinejoin="round" stroke={RED} strokeWidth="6" />
      <path d="M60,28 L97,94 H23 Z" fill="#fff" strokeLinejoin="round" stroke="#fff" strokeWidth="4" />
      {children}
    </Post>
  );
}

export function SignChildren() {
  return (
    <Warning id="children">
      <circle cx="52" cy="54" r="5" fill="#111" />
      <path d="M52,60 L49,74 L44,86 M50,72 L56,78 L58,88 M51,63 L44,68 M53,63 L60,67" stroke="#111" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="69" cy="60" r="4.2" fill="#111" />
      <path d="M69,65 L67,76 L63,86 M68,74 L73,79 L74,87 M68,67 L74,71" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Warning>
  );
}

export function SignDeer() {
  return (
    <Warning id="deer">
      {/* Springender Hirsch */}
      <g stroke="#111" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M70,70 L84,84 M66,72 L80,88" strokeWidth="3.2" />
        <path d="M50,76 L36,88 M48,72 L32,80" strokeWidth="3.2" />
        <path d="M68,68 L74,56" strokeWidth="5" />
        <path d="M76,52 L74,44 M75,47 L70,44 M79,51 L84,44 M82,47 L86,46" strokeWidth="2" />
      </g>
      <ellipse cx="59" cy="72" rx="15" ry="7" fill="#111" transform="rotate(-18 59 72)" />
      <ellipse cx="78" cy="54" rx="5" ry="3.2" fill="#111" transform="rotate(20 78 54)" />
      <path d="M45,72 l-4,-3" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </Warning>
  );
}

/* ---------- Skizzen (ohne Mast) ---------- */

export function IllustrationRightOfWay() {
  return (
    <Tile>
      <rect x="50" y="2" width="40" height="136" fill="#5b636b" />
      <rect x="2" y="50" width="136" height="40" fill="#5b636b" />
      <path d="M70,6 v40 M70,94 v40 M6,70 h40 M94,70 h40" stroke="#fff" strokeWidth="2" strokeDasharray="7 6" />
      <g transform="translate(80 112) rotate(0)">
        <rect x="-6" y="-12" width="12" height="24" rx="3" fill="#1d7a46" />
        <rect x="-4.5" y="-8" width="9" height="5" rx="1" fill="#cfe6ff" />
      </g>
      <g transform="translate(112 60) rotate(-90)">
        <rect x="-6" y="-12" width="12" height="24" rx="3" fill="#0b4ea2" />
        <rect x="-4.5" y="-8" width="9" height="5" rx="1" fill="#cfe6ff" />
      </g>
      <path d="M80,96 v-8" stroke="#1d7a46" strokeWidth="3" strokeLinecap="round" />
      <path d="M96,60 h-8" stroke="#0b4ea2" strokeWidth="3" strokeLinecap="round" />
    </Tile>
  );
}

export function IllustrationTrafficLight({ red, yellow, green }: { red?: boolean; yellow?: boolean; green?: boolean }) {
  const lamp = (cy: number, on: boolean | undefined, color: string) => (
    <g>
      {on && <circle cx="70" cy={cy} r="20" fill={color} opacity="0.35" />}
      <circle cx="70" cy={cy} r="14" fill={on ? color : "#2a2e33"} />
      {on && <circle cx="65" cy={cy - 5} r="4" fill="#fff" opacity="0.6" />}
    </g>
  );
  return (
    <Tile bg="#eef1f4">
      <rect x="62" y="122" width="16" height="16" fill="#3a4048" />
      <rect x="44" y="10" width="52" height="116" rx="16" fill="#1d2126" />
      {lamp(36, red, "#ff3b30")}
      {lamp(68, yellow, "#ffb400")}
      {lamp(100, green, "#22c55e")}
    </Tile>
  );
}

export function IllustrationAlcohol() {
  return (
    <Tile bg="#fff4e0">
      <path d="M50,30 h40 l-5,44 a15,15 0 0 1 -30,0 Z" fill="#fff" stroke="#c98a1b" strokeWidth="3" />
      <path d="M53,52 h34 l-2.2,22 a13,13 0 0 1 -29.6,0 Z" fill="#f2b33d" />
      <path d="M70,89 v16 M56,106 h28" stroke="#c98a1b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="70" r="52" fill="none" stroke={RED} strokeWidth="8" />
      <path d="M33,107 L107,33" stroke={RED} strokeWidth="8" strokeLinecap="round" />
    </Tile>
  );
}

export function IllustrationDistance() {
  return (
    <Tile bg="#eef1f4">
      <rect x="2" y="78" width="136" height="44" fill="#5b636b" />
      <path d="M6,100 h128" stroke="#fff" strokeWidth="2" strokeDasharray="8 7" />
      <Car x={30} y={84} color="#1d7a46" s={0.9} />
      <Car x={108} y={84} color="#0b4ea2" s={0.9} />
      <path d="M48,58 H92" stroke="#111" strokeWidth="2" />
      <path d="M48,52 v12 M92,52 v12" stroke="#111" strokeWidth="2" />
      <text x="70" y="48" textAnchor="middle" fontSize="15" fontWeight="800" fill="#111">2 s</text>
    </Tile>
  );
}

export function IllustrationPhone() {
  return (
    <Tile bg="#f3eef6">
      <rect x="50" y="26" width="40" height="76" rx="8" fill="#1d2126" />
      <rect x="54" y="34" width="32" height="56" rx="3" fill="#8fc3ff" />
      <circle cx="70" cy="96" r="2.5" fill="#555" />
      <circle cx="70" cy="64" r="50" fill="none" stroke={RED} strokeWidth="8" />
      <path d="M35,99 L105,29" stroke={RED} strokeWidth="8" strokeLinecap="round" />
    </Tile>
  );
}

export function IllustrationHeadlight() {
  return (
    <Tile bg="#e9f5ee">
      {/* Kontrollleuchte Abblendlicht */}
      <path d="M78,40 C100,40 110,56 110,70 C110,84 100,100 78,100 Z" fill={GREEN} />
      {[48, 62, 76, 90].map((y) => (
        <path key={y} d={`M68,${y} L32,${y + 10}`} stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
      ))}
    </Tile>
  );
}

export function IllustrationLearner() {
  return (
    <Tile bg="#eaf0fb">
      <rect x="32" y="32" width="76" height="76" rx="8" fill={RIM} />
      <rect x="34" y="34" width="72" height="72" rx="7" fill={BLUE} />
      <text x="70" y="94" textAnchor="middle" fontSize="62" fontWeight="800" fill="#fff" fontFamily="Arial, Helvetica, sans-serif">L</text>
    </Tile>
  );
}

export function IllustrationSeatbelt() {
  return (
    <Tile bg="#fdecea">
      <circle cx="70" cy="34" r="12" fill="#1d2126" />
      <path d="M46,112 V68 C46,56 56,50 70,50 C84,50 94,56 94,68 V112 Z" fill="#1d2126" />
      <path d="M86,52 L52,110" stroke={RED} strokeWidth="9" strokeLinecap="round" />
      <path d="M48,96 H92" stroke={RED} strokeWidth="7" strokeLinecap="round" />
    </Tile>
  );
}
