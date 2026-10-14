// "Bloom": the session visual. Two counter-rotating rings of translucent petals that
// open on the in-breath and fold on the out-breath. Petals blend additively (overlaps
// glow), leave a short afterglow as they turn, and drifting motes show the direction of
// the breath. Holds shimmer, hums ripple, kapalabhati pulses. Colour follows the phase.

const PALETTE = {
  in: [[118, 232, 205], [86, 160, 255]],
  top: [[255, 216, 140], [255, 148, 112]],
  full: [[255, 216, 140], [255, 148, 112]],
  out: [[186, 146, 255], [108, 118, 255]],
  bottom: [[142, 152, 255], [92, 104, 226]],
  empty: [[142, 152, 255], [92, 104, 226]],
  hum: [[206, 168, 255], [255, 168, 222]],
  pump: [[255, 184, 120], [255, 104, 92]],
  rest: [[150, 205, 232], [192, 160, 236]],
};
const LO = 0.46;
const HI = 1;
const lerp = (a, b, k) => a + (b - a) * k;
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

export class Bloom {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.col = PALETTE.rest.map((x) => x.slice());
    this.rot = 0;
    this.open = 0.3;
    this.last = performance.now();
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.motes = Array.from({ length: 42 }, () => ({ a: Math.random() * Math.PI * 2, r: 0.2 + Math.random() * 0.95, s: 0.4 + Math.random() * 0.8, z: Math.random() }));
    this.ripples = [];
    this.lastRipple = 0;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = this.c.getBoundingClientRect();
    this.c.width = Math.max(1, Math.round(width * dpr));
    this.c.height = Math.max(1, Math.round(height * dpr));
  }

  /** st: engine state at time t (seconds into the session). */
  draw(st, t) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const { ctx } = this;
    const W = this.c.width;
    const H = this.c.height;
    const R = Math.min(W, H) / 2;
    const cx = W / 2;
    const cy = H / 2;

    // Ease colour and openness toward the phase.
    const target = PALETTE[st.phase] || PALETTE.rest;
    const ck = 1 - Math.exp(-dt * 2.2);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) this.col[i][j] = lerp(this.col[i][j], target[i][j], ck);
    const o = Math.max(0, Math.min(1.05, (st.scale - LO) / (HI - LO)));
    this.open = lerp(this.open, o, 1 - Math.exp(-dt * 14));
    const open = this.open;

    // Rotation: turns as it opens (and unwinds as it closes), plus a slow drift.
    const drift = this.reduced ? 0 : dt * (st.phase === 'full' || st.phase === 'top' ? 0.12 : 0.05);
    this.rot += drift;
    const turn = this.rot + open * (Math.PI / 3);

    // Afterglow: fade the previous frame by F rather than clearing it. Light then builds
    // to 1/F of each frame's, so everything drawn is scaled by F to settle where intended.
    const F = this.reduced ? 1 : 0.3;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${F})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    // Hold shimmer, hum vibration, pump pulse.
    let wobble = 0;
    if (st.phase === 'full' || st.phase === 'empty') wobble = 0.018 * Math.sin(t * 2.4);
    if (st.phase === 'hum') wobble = 0.012 * Math.sin(t * 60);

    const rings = [
      { n: 6, off: 0, d: lerp(0.06, 0.37, open), r: lerp(0.27, 0.43, open), dir: 1, a: 0.42 },
      { n: 6, off: Math.PI / 6, d: lerp(0.03, 0.22, open), r: lerp(0.19, 0.3, open), dir: -0.6, a: 0.34 },
    ];
    for (const ring of rings) {
      for (let i = 0; i < ring.n; i++) {
        const ang = ring.off + (i / ring.n) * Math.PI * 2 + turn * ring.dir;
        const px = cx + Math.cos(ang) * ring.d * R;
        const py = cy + Math.sin(ang) * ring.d * R;
        const pr = ring.r * R * (1 + wobble * (i % 2 ? 1 : -1));
        const c = i % 2 ? this.col[1] : this.col[0];
        // Edge-lit glass: a quiet centre that brightens toward a crisp rim, so the
        // overlaps read as clean geometric lenses.
        const g = ctx.createRadialGradient(px, py, 0, px, py, pr);
        g.addColorStop(0, rgba(c, F * ring.a * 0.38));
        g.addColorStop(0.7, rgba(c, F * ring.a * 0.5));
        g.addColorStop(0.97, rgba(c, F * ring.a * 0.78));
        g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = rgba(c, F * (0.18 + 0.2 * open) * (ring.dir === 1 ? 1 : 0.7));
        ctx.lineWidth = Math.max(1, R * 0.005);
        ctx.stroke();
      }
    }

    // Motes: drift inward on the in-breath, outward on the out-breath.
    if (!this.reduced) {
      const flow = st.phase === 'in' ? -1 : st.phase === 'out' || st.phase === 'hum' ? 1 : 0.15 * Math.sin(t * 0.7);
      for (const m of this.motes) {
        m.r += flow * dt * 0.22 * m.s;
        m.a += dt * 0.08 * (m.z - 0.5);
        if (m.r < 0.12) m.r = 1.05;
        if (m.r > 1.08) m.r = 0.14;
        const x = cx + Math.cos(m.a + turn * 0.3) * m.r * R;
        const y = cy + Math.sin(m.a + turn * 0.3) * m.r * R;
        const edge = Math.min(1, (1.08 - m.r) * 4, (m.r - 0.12) * 6);
        ctx.fillStyle = rgba(this.col[m.z > 0.5 ? 0 : 1], F * 0.5 * edge * (0.4 + m.z * 0.6));
        ctx.beginPath();
        ctx.arc(x, y, R * (0.004 + m.z * 0.006), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Hum ripples.
    if (st.phase === 'hum' && !this.reduced && t - this.lastRipple > 0.7) {
      this.ripples.push({ t0: t });
      this.lastRipple = t;
    }
    this.ripples = this.ripples.filter((rp) => t - rp.t0 < 2.4 && t >= rp.t0);
    for (const rp of this.ripples) {
      const k = (t - rp.t0) / 2.4;
      ctx.strokeStyle = rgba(this.col[1], F * 0.35 * (1 - k));
      ctx.lineWidth = Math.max(1, R * 0.006);
      ctx.beginPath();
      ctx.arc(cx, cy, R * (0.3 + 0.75 * k), 0, Math.PI * 2);
      ctx.stroke();
    }

    // A darker lens in the middle, so the phase word and timer stay readable. Applied
    // every frame it compounds with the fade, so solve for a steady ~45% of full light.
    const keep = 0.45;
    const L = 1 - keep / (F + keep * (1 - F));
    ctx.globalCompositeOperation = 'destination-out';
    const lens = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.34);
    lens.addColorStop(0, `rgba(0,0,0,${L})`);
    lens.addColorStop(0.6, `rgba(0,0,0,${L * 0.45})`);
    lens.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lens;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
}
