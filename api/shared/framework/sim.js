'use strict';

/**
 * Deterministic pseudo-random helpers for connector simulation mode.
 *
 * Connectors that lack live credentials still return *representative*,
 * server-side data so the dashboards, risk scoring, and reports are fully
 * exercised before real integrations are provisioned. The data must be:
 *   - deterministic per tenant (so dashboards are stable and tests can assert)
 *   - clearly marked `simulated: true` upstream
 *
 * This is NOT frontend mock data — it originates in the connector layer, the
 * same place live data will arrive, and flows through the identical transform
 * pipeline. Swapping in real credentials replaces the numbers, not the shape.
 */

/** FNV-1a 32-bit hash of a string -> unsigned int seed. */
function hashSeed(str) {
  let h = 0x811c9dc5;
  const s = String(str || 'seed');
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG factory seeded from a string. Returns () => float in [0,1). */
function seeded(seedStr) {
  let a = hashSeed(seedStr);
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] inclusive from a PRNG. */
function intBetween(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Pick one element deterministically. */
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * A descending monthly trend series of `count` points ending at `latest`.
 * Used for "monthly trends" widgets. Values wobble but trend toward `latest`.
 */
function monthlyTrend(rng, latest, count, spread) {
  const points = [];
  let value = latest + intBetween(rng, 0, spread);
  for (let i = count - 1; i >= 0; i -= 1) {
    points.unshift({ monthsAgo: i, value: Math.max(0, Math.round(value)) });
    value += intBetween(rng, -Math.ceil(spread / 2), spread);
  }
  return points;
}

module.exports = { hashSeed, seeded, intBetween, pick, monthlyTrend };
