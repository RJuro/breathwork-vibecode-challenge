// "Contour": the session visual and the app's line art. Nested contour lines, like a
// topographic map, that widen on the in-breath and settle on the out-breath, over two
// overlapping washes of colour (a riso-style overprint) that follow the phase. Holds fill
// the rings from the centre outward as time passes; hums send a ripple outward. A few points of
// light ride the contours and twinkle, over a faint drift of dust.

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
  return Array.from({ length: n }, (_, i) => ringAt(k, (i / n) * Math.PI * 2, drift));
}

/** The point at angle `a` (radians) on ring k, in unit space. */
function ringAt(k, a, drift = 0) {
  const base = 0.085 + 0.66 * k;
  const w = 0.06 + 0.1 * k;
  const r =
    base *
    (1 +
      w * Math.sin(2 * a + 0.6 + k * 0.9 + drift) +
      w * 0.6 * Math.sin(3 * a + 1.7 - k * 0.5 - drift * 0.7) +
      w * 0.3 * Math.sin(5 * a + k * 2.1 + drift * 0.4));
  return [0.039 * k * k + Math.cos(a) * r, -0.023 * k + Math.sin(a) * r * 0.92];
}

const rand = (a, b) => a + Math.random() * (b - a);
/** A glint: a point of light on a contour line, drifting along it while it twinkles. */
const glint = (age = 0) => ({ k: [0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9][(Math.random() * 7) | 0], a: rand(0, Math.PI * 2), v: rand(0.03, 0.08) * (Math.random() < 0.5 ? -1 : 1), life: age, dur: rand(3.5, 7) });

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

const cosEase = (x) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
const outExpo = (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));
/** The app's own rhythm, six breaths a minute: 0 → 1 over a 4 s in-breath, back over a 6 s out-breath. */
const breathAt = (t) => {
  const p = ((t % 10) + 10) % 10;
  return p < 4 ? cosEase(p / 4) : 1 - cosEase((p - 4) / 6);
};

/** The contour art behind the library and practice headers, in motion. Washes bloom, the rings
 *  draw themselves in from the centre, then the map breathes at six a minute: each ring lags
 *  the one inside it, so every breath travels outward as a ripple. The wobble slowly morphs,
 *  a point of light runs along the index lines, and the pointer tilts the rings like stacked
 *  layers. Colours come from CSS (`.w1`, `.w2`, `.ix`), so a section can recolour it.
 *  Static under prefers-reduced-motion. */
export class ContourArt {
  constructor(host, { w, h, cx, cy, s, drift = 0 }) {
    Object.assign(this, { host, cx, cy, s, drift0: drift, raf: 0, on: false });
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs) => {
      const e = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
      return e;
    };
    this.svg = el('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMaxYMin meet', 'aria-hidden': 'true', focusable: 'false' });
    this.w1 = this.svg.appendChild(el('circle', { class: 'w1' }));
    this.w2 = this.svg.appendChild(el('circle', { class: 'w2' }));
    this.rings = Array.from({ length: RINGS }, (_, j) => {
      const k = j / (RINGS - 1);
      const p = this.svg.appendChild(el('path', { class: j === 3 || j === 8 ? 'ix' : 'rl', pathLength: 1 }));
      p.style.setProperty('--o', (0.62 - 0.48 * k).toFixed(2));
      return { k, p };
    });
    // Points of light running along the two index lines (a soft halo under a bright core).
    this.runs = [3, 8].map((j, n) => ({
      k: j / (RINGS - 1),
      glow: this.svg.appendChild(el('path', { class: 'run-glow', pathLength: 1 })),
      core: this.svg.appendChild(el('path', { class: 'run', pathLength: 1 })),
      period: n ? 13 : 9,
      offset: n ? 4.5 : 0,
      dir: n ? -1 : 1,
    }));
    host.replaceChildren(this.svg);
    this.pointer = [0, 0];
    this.tilt = [0, 0];
    addEventListener('pointermove', (e) => (this.pointer = [e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5]), { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? this.pause() : this.on && !this.reduced && this.loop()));
    this.t0 = performance.now();
    this.frame(this.t0, true);
  }

  /** Start (or restart, with the draw-in) when its screen shows; stop when it hides. */
  play() {
    this.on = true;
    this.t0 = performance.now();
    this.last = this.t0;
    if (this.reduced) return this.frame(this.t0, true);
    this.loop();
  }

  stop() {
    this.on = false;
    this.pause();
  }

  pause() {
    cancelAnimationFrame(this.raf);
  }

  loop() {
    cancelAnimationFrame(this.raf);
    const tick = (now) => {
      this.frame(now);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  frame(now, still = this.reduced) {
    const t = (now - this.t0) / 1000;
    const dt = Math.min(0.1, (now - (this.last ?? now)) / 1000);
    this.last = now;
    const { cx, cy, s } = this;
    const L = (a, b, k) => a + (b - a) * k;

    // Arrival: washes bloom (0–1.4 s); rings draw in from the centre, 70 ms apart.
    const bloom = still ? 1 : outExpo(t / 1.4);
    const draw = (j) => (still ? 1 : outExpo(Math.max(0, t - 0.25 - j * 0.07) / 1.3));

    // Idle: breathing, drift, pointer tilt (smoothed), a gentle lift as the page scrolls.
    const b = still ? 0.35 : breathAt(t - 1.5);
    const drift = this.drift0 + (still ? 0 : t * 0.035);
    const ease = 1 - Math.exp(-dt * 3);
    this.tilt = this.tilt.map((v, i) => L(v, still ? 0 : this.pointer[i], ease));
    const scroll = still ? 0 : Math.min(1, scrollY / 320);
    this.svg.style.transform = scroll ? `translateY(${(-scroll * 28).toFixed(1)}px)` : '';
    this.svg.style.opacity = (1 - scroll * 0.55).toFixed(3);

    const wob = (a, p) => Math.sin((t * 2 * Math.PI) / p + a);
    const w = (circle, x, y, r, a) => {
      circle.setAttribute('cx', (x + (still ? 0 : wob(a, 23) * s * 0.05)).toFixed(1));
      circle.setAttribute('cy', (y + (still ? 0 : wob(a + 1.3, 31) * s * 0.04)).toFixed(1));
      circle.setAttribute('r', (r * L(0.55, 1, bloom) * (1 + 0.07 * b)).toFixed(1));
      circle.style.fillOpacity = (bloom * (0.85 + 0.15 * b)).toFixed(3);
    };
    w(this.w1, cx - s * 0.13, cy - s * 0.1, s * 0.34, 0);
    w(this.w2, cx + s * 0.16, cy + s * 0.12, s * 0.26, 2.1);

    const at = (k) => {
      const lag = breathAt(t - 1.5 - k * 2.2); // outer rings breathe later: a ripple
      const sk = s * (1 + (still ? 0 : 0.045 * lag));
      const shift = 14 * k;
      return [cx + this.tilt[0] * shift, cy + this.tilt[1] * shift, sk];
    };
    for (const [j, r] of this.rings.entries()) {
      const [x, y, sk] = at(r.k);
      r.p.setAttribute('d', ringPath(r.k, x, y, sk, drift));
      const d = draw(j);
      r.p.style.strokeDasharray = d < 1 ? '1 1' : '';
      r.p.style.strokeDashoffset = d < 1 ? (1 - d).toFixed(4) : '';
    }

    for (const run of this.runs) {
      if (still) {
        run.core.style.opacity = run.glow.style.opacity = 0;
        continue;
      }
      const [x, y, sk] = at(run.k);
      const d = ringPath(run.k, x, y, sk, drift);
      const life = (t - 2.4 - run.offset) / run.period; // first run once the rings are drawn
      const env = life < 0 ? 0 : Math.sin(Math.PI * Math.min(1, (life % 1) / 0.55)) ** 2 * ((life % 1) < 0.55 ? 1 : 0);
      for (const [p, len] of [[run.glow, 0.09], [run.core, 0.035]]) {
        p.setAttribute('d', d);
        p.style.strokeDasharray = `${len} ${1 - len}`;
        p.style.strokeDashoffset = (run.dir * (life % 1) * 1.6).toFixed(4);
        p.style.opacity = env.toFixed(3);
      }
    }
  }
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
    this.glints = Array.from({ length: 6 }, () => glint(rand(0, 5)));
    this.dust = Array.from({ length: 26 }, () => ({ x: rand(-1.15, 1.15), y: rand(-1.15, 1.15), ph: rand(0, 6.3), w: rand(0.4, 1.1) }));
    this.ringOpen = Array(RINGS).fill(this.open);
    this.born = performance.now();
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
  }

  /** Replay the draw-in (rings drawing themselves from the centre) at the start of a session. */
  restart() {
    this.born = performance.now();
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
    // Each ring follows the breath a beat after the one inside it, so a breath travels outward.
    this.ringOpen = this.ringOpen.map((v, j) => lerp(v, this.open, 1 - Math.exp(-dt * (this.reduced ? 12 : 12 - 8.5 * (j / (RINGS - 1))))));
    const born = this.reduced ? 9 : (now - this.born) / 1000;
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
      const sj = R * lerp(0.8, 1, this.ringOpen[j]);
      const p = ringPoints(k, d);
      // Draw-in: each ring strokes itself, centre first, 70 ms apart.
      const drawn = outExpo(Math.max(0, born - 0.15 - j * 0.07) / 1.3);
      if (drawn < 1) {
        let len = 0;
        for (let i = 0; i < p.length; i++) len += Math.hypot(p[i][0] - p[(i + 1) % p.length][0], p[i][1] - p[(i + 1) % p.length][1]) * sj;
        ctx.setLineDash([len * drawn, len]);
      }
      ctx.beginPath();
      const mx = (a, b) => (a + b) / 2;
      const last = p[p.length - 1];
      ctx.moveTo(cx + mx(last[0], p[0][0]) * sj, cy + mx(last[1], p[0][1]) * sj);
      for (let i = 0; i < p.length; i++) {
        const q = p[(i + 1) % p.length];
        ctx.quadraticCurveTo(cx + p[i][0] * sj, cy + p[i][1] * sj, cx + mx(p[i][0], q[0]) * sj, cy + mx(p[i][1], q[1]) * sj);
      }
      ctx.strokeStyle = rgba(color, alpha);
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.setLineDash([]);
      if (ix && !this.reduced && born > 2) this.runner(j, k, sj, cx, cy, d, now / 1000, A);
    }

    if (!this.reduced) this.glimmer(dt, t, cx, cy, R, s, d, A);
  }

  /** A point of light running along index ring j now and then: a soft halo under a bright core. */
  runner(j, k, sj, cx, cy, d, now, A) {
    const { ctx, dpr } = this;
    const [period, dir, off] = j === 3 ? [9, 1, 0] : [13, -1, 4.5];
    const life = ((now + off) / period) % 1;
    if (life > 0.55) return;
    const env = Math.sin((Math.PI * life) / 0.55) ** 2;
    const a0 = dir * life * Math.PI * 3.2 + j;
    const seg = (span) => {
      ctx.beginPath();
      for (let i = 0; i <= 14; i++) {
        const [x, y] = ringAt(k, a0 - dir * span * (i / 14), d);
        i ? ctx.lineTo(cx + x * sj, cy + y * sj) : ctx.moveTo(cx + x * sj, cy + y * sj);
      }
    };
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    seg(0.55);
    ctx.strokeStyle = rgba(A, 0.22 * env);
    ctx.lineWidth = 8 * dpr;
    ctx.stroke();
    seg(0.22);
    ctx.strokeStyle = rgba([255, 250, 240], 0.85 * env);
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'butt';
  }

  /** Dust: faint specks drifting up and twinkling slowly. Glints: soft points of light on the
   *  contours with a thin four-point star at their peak, a little brighter as the map opens. */
  glimmer(dt, t, cx, cy, R, s, d, A) {
    const { ctx, dpr } = this;
    ctx.globalCompositeOperation = 'lighter';
    for (const m of this.dust) {
      m.y -= dt * 0.012;
      if (m.y < -1.15) m.y = 1.15;
      const a = 0.05 + 0.13 * (0.5 + 0.5 * Math.sin(t * m.w + m.ph));
      ctx.fillStyle = rgba(INK, a);
      ctx.beginPath();
      ctx.arc(cx + m.x * R, cy + m.y * R, 0.9 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < this.glints.length; i++) {
      const g = this.glints[i];
      g.life += dt;
      g.a += g.v * dt;
      if (g.life > g.dur) this.glints[i] = glint();
      const env = Math.sin(Math.PI * Math.min(1, g.life / g.dur)) ** 2 * (0.55 + 0.45 * this.open);
      if (env < 0.02) continue;
      const [ux, uy] = ringAt(g.k, g.a, d);
      const sg = R * lerp(0.8, 1, this.ringOpen[Math.round(g.k * (RINGS - 1))]); // ride the ring's own lag
      const x = cx + ux * sg;
      const y = cy + uy * sg;
      const r = 10 * dpr;
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r);
      halo.addColorStop(0, rgba([255, 250, 240], 0.85 * env));
      halo.addColorStop(0.3, rgba(A, 0.3 * env));
      halo.addColorStop(1, rgba(A, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (env > 0.5) {
        const len = (4 + 6 * env) * dpr;
        ctx.strokeStyle = rgba([255, 250, 240], 0.5 * env);
        ctx.lineWidth = 0.8 * dpr;
        ctx.beginPath();
        ctx.moveTo(x - len, y);
        ctx.lineTo(x + len, y);
        ctx.moveTo(x, y - len);
        ctx.lineTo(x, y + len);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}
