// "Contour": the session visual and the app's line art. Nested contour lines, like a
// topographic map, that widen on the in-breath and settle on the out-breath, over two
// overlapping washes of colour (a riso-style overprint) that follow the phase. Holds fill
// the rings from the centre outward as time passes; hums send a ripple outward.

const RINGS = 11;
const LO = 0.46;
const HI = 1;

// Two overprinted inks per phase.
const PALETTE = {
  in: ['#8adbe0', '#b7a4ff'],
  top: ['#ffb38a', '#ffd46b'],
  full: ['#ffb38a', '#ffd46b'],
  out: ['#b7a4ff', '#ff8fbf'],
  bottom: ['#62c2ae', '#7da2ff'],
  empty: ['#62c2ae', '#7da2ff'],
  hum: ['#ff7eb6', '#7da2ff'],
  pump: ['#ff9e6b', '#ff7eb6'],
  rest: ['#e5aa55', '#62c2ae'],
};
const INK = [240, 235, 227];

const lerp = (a, b, k) => a + (b - a) * k;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/** Ring k (0 = centre … 1 = outermost) as points in unit space (outer extent ≈ 1).
 *  `drift` slowly turns the wobble so the map breathes without repeating. */
export function ringPoints(k, drift = 0, n = 40) {
  const base = 0.085 + 0.66 * k;
  const w = 0.06 + 0.1 * k;
  const ox = 0.039 * k * k;
  const oy = -0.023 * k;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r =
      base *
      (1 +
        w * Math.sin(2 * a + 0.6 + k * 0.9 + drift) +
        w * 0.6 * Math.sin(3 * a + 1.7 - k * 0.5 - drift * 0.7) +
        w * 0.3 * Math.sin(5 * a + k * 2.1 + drift * 0.4));
    pts.push([ox + Math.cos(a) * r, oy + Math.sin(a) * r * 0.92]);
  }
  return pts;
}

/** A smooth closed SVG path through ring k, scaled by `s` around (cx, cy). */
export function ringPath(k, cx, cy, s, drift = 0) {
  const p = ringPoints(k, drift).map(([x, y]) => [cx + x * s, cy + y * s]);
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (v) => v.toFixed(1);
  let d = `M${mid(p[p.length - 1], p[0]).map(f).join(' ')}`;
  for (let i = 0; i < p.length; i++) {
    const m = mid(p[i], p[(i + 1) % p.length]);
    d += `Q${f(p[i][0])} ${f(p[i][1])} ${f(m[0])} ${f(m[1])}`;
  }
  return d + 'Z';
}

/** Static contour art (hero, backgrounds): rings plus two overprinted washes. Wash and
 *  index colours come from CSS (`.w1`, `.w2`, `.ix`), so a section can recolour it. */
export function contourSvg({ w, h, cx, cy, s, rings = RINGS, drift = 0 }) {
  let out = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMaxYMin slice" aria-hidden="true" focusable="false">`;
  out += `<circle class="w1" cx="${cx - s * 0.13}" cy="${cy - s * 0.1}" r="${s * 0.34}"/>`;
  out += `<circle class="w2" cx="${cx + s * 0.16}" cy="${cy + s * 0.12}" r="${s * 0.26}"/>`;
  for (let j = 0; j < rings; j++) {
    const k = j / (RINGS - 1);
    const ix = j === 3 || j === 8;
    out += `<path class="${ix ? 'ix' : 'rl'}" style="--o:${(0.62 - 0.48 * k).toFixed(2)}" d="${ringPath(k, cx, cy, s, drift)}"/>`;
  }
  return out + '</svg>';
}

export class Contour {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.host = canvas.closest('section') || canvas.parentElement;
    this.col = PALETTE.rest.map(hex);
    this.open = 0.3;
    this.drift = 0;
    this.last = performance.now();
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.inkKey = '';
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = this.c.getBoundingClientRect();
    this.dpr = dpr;
    this.c.width = Math.max(1, Math.round(width * dpr));
    this.c.height = Math.max(1, Math.round(height * dpr));
  }

  /** st: engine state at time t (seconds into the session). */
  draw(st, t) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const { ctx, dpr } = this;
    const W = this.c.width;
    const H = this.c.height;
    const R = (Math.min(W, H) / 2) * 0.97;
    const cx = W / 2;
    const cy = H / 2;

    // Ease the inks and the openness toward the phase.
    const target = (PALETTE[st.phase] || PALETTE.rest).map(hex);
    const ck = 1 - Math.exp(-dt * 2.2);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) this.col[i][j] = lerp(this.col[i][j], target[i][j], ck);
    const [A, B] = this.col;
    const key = A.map((v) => v | 0).join(',');
    if (key !== this.inkKey) {
      this.inkKey = key;
      this.host.style.setProperty('--ink-a', `rgb(${key})`);
    }
    const o = Math.max(0, Math.min(1.05, (st.scale - LO) / (HI - LO)));
    this.open = lerp(this.open, o, 1 - Math.exp(-dt * 12));
    const s = R * lerp(0.8, 1, this.open);
    if (!this.reduced) this.drift += dt * (st.phase === 'pump' ? 0.25 : 0.06);
    const d = this.drift;

    ctx.clearRect(0, 0, W, H);

    // Washes, overprinted.
    ctx.globalCompositeOperation = 'screen';
    const wash = (x, y, r, c, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(0.93, rgba(c, a));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    wash(cx - s * 0.13 + Math.sin(d * 0.7) * R * 0.03, cy - s * 0.1, s * 0.42, A, 0.5);
    wash(cx + s * 0.15, cy + s * 0.11 + Math.cos(d * 0.6) * R * 0.03, s * 0.35, B, 0.46);
    ctx.globalCompositeOperation = 'source-over';

    // Contours.
    const hold = st.seg && st.seg.kind === 'hold' ? st.p || 0 : -1;
    const ripple = st.phase === 'hum' && !this.reduced ? (t * 0.85) % 1 : -1;
    for (let j = 0; j < RINGS; j++) {
      const k = j / (RINGS - 1);
      const ix = j === 3 || j === 8;
      let color = INK;
      let alpha = 0.7 - 0.56 * k;
      let width = (ix ? 2.1 : 1.15) * dpr;
      if (ix) {
        color = A;
        alpha = Math.min(1, alpha + 0.25);
      }
      if (hold >= 0 && k <= hold) {
        color = B;
        alpha = 0.95;
        width = 1.7 * dpr;
      }
      if (ripple >= 0) {
        const near = 1 - Math.abs(k - ripple) / 0.14;
        if (near > 0) {
          color = A;
          alpha = Math.max(alpha, 0.55 + 0.45 * near);
          width += 2.2 * dpr * near;
        }
      }
      const p = ringPoints(k, d);
      ctx.beginPath();
      const mx = (a, b) => (a + b) / 2;
      const last = p[p.length - 1];
      ctx.moveTo(cx + mx(last[0], p[0][0]) * s, cy + mx(last[1], p[0][1]) * s);
      for (let i = 0; i < p.length; i++) {
        const q = p[(i + 1) % p.length];
        ctx.quadraticCurveTo(cx + p[i][0] * s, cy + p[i][1] * s, cx + mx(p[i][0], q[0]) * s, cy + mx(p[i][1], q[1]) * s);
      }
      ctx.strokeStyle = rgba(color, alpha);
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }
}
