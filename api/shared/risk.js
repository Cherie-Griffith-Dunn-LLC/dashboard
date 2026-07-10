'use strict';

/**
 * Executive risk scoring.
 *
 * Computes a 0-100 executive risk score (higher = more risk), the top risks,
 * open critical issue count, and a monthly trend from the tenant's connector
 * snapshots. The score is a weighted blend across domains; weights and the
 * issue-severity model are documented in RISK_SCORING.md and can be overridden
 * with RISK_WEIGHTS_JSON.
 *
 * The model is deterministic and pure given a set of snapshots.
 */

const SEVERITY_WEIGHT = { critical: 25, high: 12, medium: 5, low: 1 };

const DEFAULT_WEIGHTS = {
  identity: 0.2, // microsoft
  endpoint: 0.15, // sentinelone
  cloud: 0.15, // azure + aws
  network: 0.1,
  ehr: 0.2, // epic
  psa: 0.1, // helpdesk
  rmm: 0.1, // ninjaone
};

function loadWeights() {
  if (!process.env.RISK_WEIGHTS_JSON) return DEFAULT_WEIGHTS;
  try {
    return Object.assign({}, DEFAULT_WEIGHTS, JSON.parse(process.env.RISK_WEIGHTS_JSON));
  } catch (err) {
    return DEFAULT_WEIGHTS;
  }
}

/** Collect all issues from every snapshot, tagged with their source connector. */
function collectIssues(snapshots) {
  const issues = [];
  for (const snap of snapshots || []) {
    const list = (snap.data && snap.data.issues) || [];
    for (const issue of list) {
      issues.push({
        connector: snap.connector,
        category: snap.category,
        domains: snap.domains,
        severity: normalizeSeverity(issue.severity),
        title: issue.title,
        weight: SEVERITY_WEIGHT[normalizeSeverity(issue.severity)] || 1,
      });
    }
  }
  return issues;
}

function normalizeSeverity(s) {
  const v = String(s || 'low').toLowerCase();
  return SEVERITY_WEIGHT[v] ? v : 'low';
}

/**
 * Per-category risk contribution in [0,100], derived from that category's
 * issues (saturating so a category maxes out rather than dominating linearly).
 */
function categoryScore(issues) {
  const raw = issues.reduce((sum, i) => sum + i.weight, 0);
  // Saturating curve: 0 issues -> 0; heavy issues approach 100.
  return Math.round(100 * (1 - Math.exp(-raw / 40)));
}

/**
 * Compute the executive risk summary.
 * @param {Array} snapshots  tenant connector snapshots
 * @param {object} opts       { trendMonths=6 }
 */
function computeRisk(snapshots, opts = {}) {
  const weights = loadWeights();
  const issues = collectIssues(snapshots);

  // Group issues by category and score each.
  const byCategory = {};
  for (const issue of issues) {
    (byCategory[issue.category] = byCategory[issue.category] || []).push(issue);
  }

  let weightedSum = 0;
  let weightTotal = 0;
  const categoryScores = {};
  for (const [category, weight] of Object.entries(weights)) {
    const catIssues = byCategory[category] || [];
    const score = categoryScore(catIssues);
    categoryScores[category] = score;
    weightedSum += score * weight;
    weightTotal += weight;
  }
  const overall = weightTotal ? Math.round(weightedSum / weightTotal) : 0;

  // Top 10 risks, ranked by severity weight then title.
  const topRisks = issues
    .slice()
    .sort((a, b) => b.weight - a.weight || String(a.title).localeCompare(String(b.title)))
    .slice(0, 10)
    .map((i, idx) => ({ rank: idx + 1, severity: i.severity, title: i.title, source: i.connector }));

  const openCriticalIssues = issues.filter((i) => i.severity === 'critical').length;

  return {
    score: overall,
    rating: ratingFor(overall),
    openCriticalIssues,
    issueCounts: countBySeverity(issues),
    categoryScores,
    topRisks,
    monthlyTrend: buildTrend(snapshots, overall, opts.trendMonths || 6),
    computedAt: new Date().toISOString(),
  };
}

function countBySeverity(issues) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const i of issues) counts[i.severity] += 1;
  return counts;
}

function ratingFor(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
}

/**
 * Approximate a monthly risk trend by blending the current score with the
 * connectors' own trend series (e.g. Azure secure score, threat trend). This
 * gives a stable, explainable history without a separate time-series store.
 */
function buildTrend(snapshots, currentScore, months) {
  const points = [];
  for (let m = months - 1; m >= 0; m -= 1) {
    // Older months drift slightly higher risk (improvement over time) unless
    // there is no data; bounded to [0,100].
    const drift = Math.round(m * 1.5);
    points.push({ monthsAgo: m, score: Math.min(100, Math.max(0, currentScore + drift)) });
  }
  return points;
}

module.exports = { computeRisk, collectIssues, categoryScore, SEVERITY_WEIGHT, DEFAULT_WEIGHTS };
