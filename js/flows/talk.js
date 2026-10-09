// "Teacher's notes" as a listenable track: each practice's notes (before you start,
// common slips, what you might notice, going further, when to skip) plus the science
// lines from its session, read by its instructor. Built as an ordinary practice of talk steps, so
// the same engine, recorder and mixer handle it.

import { line } from './lib.js';
import { compile } from '../engine.js';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const hash = (s) => {
  let h = 5381;
  for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  return h.toString(36);
};
/** Written notes → speakable text (counts as words, no symbols). */
const speakable = (s) =>
  s
    .replace(/(\d)-(\d)-(\d)/g, '$1, $2, $3')
    .replace(/(\d+)\s*(?:–|-|to)\s*(\d+)/g, '$1 to $2')
    .replace(/[“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const note = (text, kind = 'tip') => {
  const t = speakable(text);
  return line(`nt_${slug(t).slice(0, 40)}_${hash(t)}`, t, kind);
};

export function teacherTalk(flow) {
  const n = flow.notes;
  if (!n) return null;
  const steps = [];
  const add = (c, gap = 1.1) => steps.push({ say: c, gap });
  const head = (text) => add(note(text, 'guide'), 0.7);
  add(note(`Teacher's notes for ${flow.title}.`, 'guide'), 1.5);
  if (n.before) {
    head('Before you start.');
    n.before.forEach((x) => add(note(x)));
  }
  if (n.mistakes) {
    head('Common slips, and what helps.');
    n.mistakes.forEach(([m, f]) => add(note(`${m}? ${f}`)));
  }
  if (n.feel) {
    head('What you might notice.');
    n.feel.forEach((x) => add(note(x)));
  }
  if (n.progress) {
    head('Going further.');
    n.progress.forEach((x) => add(note(x)));
  }
  if (n.skip) {
    head('Skip it, or go gentle, if…');
    n.skip.forEach((x) => add(note(x)));
  }
  // The science lines the session itself can speak (Voice: Full), in session order.
  const level = flow.defaultLevel || 'standard';
  const seen = new Set();
  const science = compile(flow, {}, { holdScale: 1, talk: 'full', ...(level === 'gentle' ? { holdScale: 0.6, gentle: true } : {}) })
    .voice.filter((v) => v.kind === 'science' && !seen.has(v.id) && seen.add(v.id))
    .map((v) => ({ id: v.id, text: v.tts, kind: 'science' }));
  if (science.length) {
    head('What the research says.');
    science.forEach((c) => add(c));
  }
  add(note("That's everything. Enjoy the practice.", 'guide'), 2);
  return {
    id: `${flow.id}-talk`,
    title: `${flow.title}: teacher's notes`,
    sections: [{ id: 'talk', title: "Teacher's notes", steps }],
  };
}
