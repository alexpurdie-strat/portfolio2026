/*
 * The machine, heard.
 *
 * Every sound here is synthesised — there are no audio files. A motor hum is
 * two detuned oscillators through a lowpass; a detent click is a millisecond
 * of filtered noise; tape hiss is noise through a bandpass. That is a few
 * hundred bytes of code instead of a few hundred kilobytes of assets, nothing
 * to preload, nothing to lazy-load, and no network request that could fail
 * halfway through a page nobody asked to make noise.
 *
 * Nothing is created until the listener asks for it. The AudioContext itself
 * is not constructed until the first unmute, which is a click — so there is no
 * autoplay to block, no suspended-context warning, and no cost at all for the
 * visitor who never turns it on.
 */

/* Deliberately quiet. This is a room-noise layer, not a soundtrack: it should
   be the thing you notice has stopped, rather than the thing you notice. */
const HUM_GAIN = 0.045;
const HISS_GAIN = 0.011;
const WHIR_GAIN = 0.05;

/* The machine stops when nobody is working it. */
const IDLE_MS = 45_000;

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  whir: GainNode;
  noise: AudioBuffer;
};

let engine: Engine | null = null;
let idleTimer = 0;

function makeNoise(ctx: AudioContext): AudioBuffer {
  const frames = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  /* A fixed recurrence rather than Math.random, so the same two seconds of
     hiss are produced every session and the loop point is known-good. */
  let seed = 0x2f6e2b1;
  for (let i = 0; i < frames; i += 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    data[i] = (seed / 0x3fffffff - 1) * 0.6;
  }
  return buffer;
}

function build(): Engine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const noise = makeNoise(ctx);

  /* ── The motor: two low oscillators, slightly out of tune with each other,
        so they beat against one another the way a real one does. ────────── */
  const humBus = ctx.createGain();
  humBus.gain.value = HUM_GAIN;
  const humFilter = ctx.createBiquadFilter();
  humFilter.type = "lowpass";
  humFilter.frequency.value = 220;
  humFilter.Q.value = 0.7;
  humBus.connect(humFilter).connect(master);

  for (const [freq, level] of [
    [51.4, 1],
    [77.3, 0.55],
    [103.1, 0.22],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = level;
    osc.connect(g).connect(humBus);
    osc.start();
  }

  /* A slow wobble on the motor's level — a bearing that is not quite true. */
  const wobble = ctx.createOscillator();
  wobble.frequency.value = 0.23;
  const wobbleDepth = ctx.createGain();
  wobbleDepth.gain.value = HUM_GAIN * 0.3;
  wobble.connect(wobbleDepth).connect(humBus.gain);
  wobble.start();

  /* ── Tape hiss, under everything. ─────────────────────────────────────── */
  const hiss = ctx.createBufferSource();
  hiss.buffer = noise;
  hiss.loop = true;
  const hissFilter = ctx.createBiquadFilter();
  hissFilter.type = "bandpass";
  hissFilter.frequency.value = 3200;
  hissFilter.Q.value = 0.55;
  const hissGain = ctx.createGain();
  hissGain.gain.value = HISS_GAIN;
  hiss.connect(hissFilter).connect(hissGain).connect(master);
  hiss.start();

  /* ── The whir: film actually moving. Silent until something turns it. ─── */
  const whirSource = ctx.createBufferSource();
  whirSource.buffer = noise;
  whirSource.loop = true;
  const whirFilter = ctx.createBiquadFilter();
  whirFilter.type = "bandpass";
  whirFilter.frequency.value = 620;
  whirFilter.Q.value = 1.6;
  const whir = ctx.createGain();
  whir.gain.value = 0;
  whirSource.connect(whirFilter).connect(whir).connect(master);
  whirSource.start();

  return { ctx, master, whir, noise };
}

/* ── Public surface ─────────────────────────────────────────────────────── */

export function isRunning() {
  return engine !== null && engine.ctx.state === "running";
}

/** Starts the machine. Must be called from a user gesture. */
export async function start() {
  engine ??= build();
  if (engine.ctx.state === "suspended") await engine.ctx.resume();
  const { ctx, master } = engine;
  /* Ramped, never switched: a gain step is an audible click. */
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(1, ctx.currentTime, 0.25);
  nudgeIdle();
}

export function stop() {
  if (!engine) return;
  const { ctx, master } = engine;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
  /* Suspend once the fade has actually finished, so it is silent before the
     clock stops rather than cut off mid-ramp. */
  window.setTimeout(() => {
    if (engine && engine.master.gain.value < 0.02) void engine.ctx.suspend();
  }, 420);
  window.clearTimeout(idleTimer);
}

/** Idle machines switch themselves off. Any interaction winds it back up. */
export function nudgeIdle() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (engine && engine.ctx.state === "running") void engine.ctx.suspend();
  }, IDLE_MS);
}

export function wake() {
  if (engine && engine.ctx.state === "suspended" && engine.master.gain.value > 0.5) {
    void engine.ctx.resume();
  }
  if (engine) nudgeIdle();
}

export function pause() {
  if (engine && engine.ctx.state === "running") void engine.ctx.suspend();
}

/** How hard the film is running, 0…1. Drives the whir. */
export function setSpeed(v: number) {
  if (!engine || engine.ctx.state !== "running") return;
  const { ctx, whir } = engine;
  whir.gain.setTargetAtTime(
    Math.min(1, Math.max(0, v)) * WHIR_GAIN,
    ctx.currentTime,
    0.07,
  );
}

/** A sprocket detent — one frame passing the gate. */
export function click(strength = 1) {
  if (!engine || engine.ctx.state !== "running") return;
  const { ctx, master, noise } = engine;
  const now = ctx.currentTime;

  const src = ctx.createBufferSource();
  src.buffer = noise;
  /* An arbitrary point in the loop, so repeated clicks are not identical. */
  const offset = (now * 7.3) % 1.5;

  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2100;
  band.Q.value = 3.4;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.09 * strength, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  src.connect(band).connect(g).connect(master);
  src.start(now, offset, 0.06);
  src.stop(now + 0.07);
}

/** A cartridge seating. Low, brief, and only on a real load. */
export function thunk() {
  if (!engine || engine.ctx.state !== "running") return;
  const { ctx, master, noise } = engine;
  const now = ctx.currentTime;

  /* the body of it */
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(126, now);
  osc.frequency.exponentialRampToValueAtTime(41, now + 0.16);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0.001, now);
  og.gain.exponentialRampToValueAtTime(0.22, now + 0.012);
  og.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  osc.connect(og).connect(master);
  osc.start(now);
  osc.stop(now + 0.26);

  /* the mechanism around it */
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.1, now);
  ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  src.connect(lp).connect(ng).connect(master);
  src.start(now, 0.4, 0.14);
  src.stop(now + 0.15);
}
