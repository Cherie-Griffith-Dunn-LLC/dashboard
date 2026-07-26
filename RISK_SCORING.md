# RISK_SCORING.md

How Security 360 turns connector findings into an executive risk score.
Implementation: `api/shared/risk.js`. The model is pure and deterministic given
a set of connector snapshots.

## Inputs

Every connector emits an `issues[]` list in its transformed data, each with a
severity. Risk scoring consumes these uniformly — it does not need to know the
provider.

## Severity weights

| Severity | Weight |
| -------- | ------ |
| critical | 25 |
| high | 12 |
| medium | 5 |
| low | 1 |

## Category score (0–100)

Issues are grouped by connector **category**. Each category's raw weight is the
sum of its issues' weights, mapped through a saturating curve so one noisy
category cannot dominate linearly:

```
categoryScore = round( 100 * (1 - e^(-rawWeight / 40)) )
```

- 0 issues → 0
- a couple of highs → ~40–55
- many criticals → approaches 100

## Overall executive score

A weighted average of category scores. Default category weights (override with
`RISK_WEIGHTS_JSON`):

| Category | Weight | Source connectors |
| -------- | ------ | ----------------- |
| identity | 0.20 | microsoft |
| ehr | 0.20 | epic |
| endpoint | 0.15 | sentinelone |
| cloud | 0.15 | azure, aws |
| network | 0.10 | network |
| psa | 0.10 | connectwise, halo |
| rmm | 0.10 | ninjaone |

```
overall = Σ(categoryScore * weight) / Σ(weight)
```

Healthcare weighting is deliberate: identity and EHR access carry the highest
weight because they are the primary PHI exposure paths.

## Rating bands

| Score | Rating |
| ----- | ------ |
| 75–100 | critical |
| 50–74 | high |
| 25–49 | moderate |
| 0–24 | low |

## Outputs

`computeRisk(snapshots)` returns:

- `score` (0–100) and `rating`
- `openCriticalIssues` — count of critical issues
- `issueCounts` — `{ critical, high, medium, low }`
- `categoryScores` — per-category contribution
- `topRisks` — top 10 issues ranked by severity weight (`{ rank, severity, title, source }`)
- `monthlyTrend` — 6-point trend for the executive view

These feed the executive dashboard, the Security Copilot four-part briefing, and
the executive/posture reports.

## Tuning

- `RISK_WEIGHTS_JSON` — override category weights per deployment/customer.
- Severity weights and the saturation constant (40) live in `risk.js` and are
  the two levers for global sensitivity.
