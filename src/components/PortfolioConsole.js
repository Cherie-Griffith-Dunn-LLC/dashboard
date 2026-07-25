import React, { useState, useMemo } from 'react';
import { getPortfolio, computeRollup, statusColor } from '../CommonData/portfolio';
import Icon from './Icon';
import './PortfolioConsole.css';

// Monogram initials from a company name (e.g. "Summit Manufacturing" -> "SM").
function initials(name) {
  const words = String(name || '').replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Small inline sparkline for score trend.
function Sparkline({ data, color = '#5de4c7', w = 96, h = 30 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} preserveAspectRatio="none">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / span) * (h - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

// Circular score gauge.
function ScoreRing({ score, size = 64, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = score >= 85 ? '#3fc98a' : score >= 72 ? '#4f8ff7' : score >= 65 ? '#e0a72e' : '#f0616a';
  return (
    <div className="score-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(128,128,128,.22)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="score-ring-num" style={{ color }}>{score}</div>
    </div>
  );
}

function KpiTile({ icon, value, label, tone, sub }) {
  return (
    <div className={`pf-kpi ${tone || ''}`}>
      <div className="pf-kpi-icon"><Icon name={icon} size={18} /></div>
      <div className="pf-kpi-body">
        <div className="pf-kpi-value">{value}</div>
        <div className="pf-kpi-label">{label}</div>
      </div>
      {sub != null && <div className="pf-kpi-sub">{sub}</div>}
    </div>
  );
}

export default function PortfolioConsole({ onOpenHelpdesk, initialCompanyId = null }) {
  const companies = useMemo(() => getPortfolio(), []);
  const rollup = useMemo(() => computeRollup(companies), [companies]);
  const [selectedId, setSelectedId] = useState(initialCompanyId);
  const [sort, setSort] = useState('risk');
  const [query, setQuery] = useState('');
  const [showReport, setShowReport] = useState(false);

  const selected = selectedId ? companies.find((c) => c.tenantId === selectedId) : null;

  const visible = useMemo(() => {
    let list = companies.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'risk') list = [...list].sort((a, b) => a.securityScore - b.securityScore);
    else if (sort === 'score') list = [...list].sort((a, b) => b.securityScore - a.securityScore);
    else if (sort === 'employees') list = [...list].sort((a, b) => b.headcount - a.headcount);
    else if (sort === 'alerts') list = [...list].sort((a, b) => b.alerts.critical - a.alerts.critical);
    return list;
  }, [companies, sort, query]);

  const fmt = (n) => n.toLocaleString();

  // ---------------- Company drill-down ----------------
  if (selected) {
    const c = selected;
    return (
      <div className="pf-console">
        <button className="pf-back" onClick={() => { setSelectedId(null); setShowReport(false); }}><Icon name="arrowLeft" size={15} /> All Companies</button>

        <div className="pf-drill-hero">
          <div className="pf-drill-id">
            <div className="pf-drill-logo" data-status={c.status}>{initials(c.name)}</div>
            <div>
              <div className="pf-drill-name">{c.name} {c.live ? <span className="pf-live">LIVE</span> : <span className="pf-sim">SIMULATED</span>}</div>
              <div className="pf-drill-meta">{c.industry} · {c.domain} · {fmt(c.headcount)} employees</div>
            </div>
          </div>
          <div className="pf-drill-actions">
            <button className="pf-btn ghost" onClick={onOpenHelpdesk}><Icon name="headset" size={16} /> Open Helpdesk</button>
            <button className="pf-btn" onClick={() => setShowReport((s) => !s)}><Icon name="clipboard" size={16} /> {showReport ? 'Hide' : 'Generate'} Report</button>
          </div>
        </div>

        <div className="pf-drill-kpis">
          <div className="pf-drill-score">
            <ScoreRing score={c.securityScore} size={110} stroke={9} />
            <div>
              <div className="pf-drill-score-lbl">Security Score</div>
              <div className="pf-status-pill" style={{ color: statusColor(c.status), borderColor: statusColor(c.status) }}>{c.status.replace('-', ' ')}</div>
              <Sparkline data={c.scoreTrend} color={statusColor(c.status)} w={150} h={36} />
            </div>
          </div>
          <div className="pf-drill-stats">
            <KpiTile icon="shield" value={fmt(c.threatsBlocked)} label="Threats Blocked" />
            <KpiTile icon="alert" value={c.alerts.critical} label="Critical Alerts" tone={c.alerts.critical ? 'danger' : 'ok'} />
            <KpiTile icon="ticket" value={c.openTickets} label="Open Tickets" />
            <KpiTile icon="lock" value={`${c.mfaCoverage}%`} label="MFA Coverage" />
            <KpiTile icon="book" value={`${c.trainingCompletion}%`} label="Training Done" />
            <KpiTile icon="clipboard" value={`${c.compliance.score}%`} label={`${c.compliance.framework} Ready`} />
          </div>
        </div>

        {showReport && (
          <div className="pf-report">
            <div className="pf-report-hdr">
              <h3>Security Posture Report — {c.name}</h3>
              <div className="pf-report-sub">Generated {new Date().toLocaleDateString()} · CyproSecure 360 · {c.compliance.framework}</div>
            </div>
            <div className="pf-report-grid">
              <div className="pf-report-row"><span>Overall Security Score</span><strong style={{ color: statusColor(c.status) }}>{c.securityScore}/100 ({c.status.replace('-', ' ')})</strong></div>
              <div className="pf-report-row"><span>Employees Monitored</span><strong>{fmt(c.headcount)}</strong></div>
              <div className="pf-report-row"><span>Critical / High Alerts</span><strong>{c.alerts.critical} critical · {c.alerts.high} high</strong></div>
              <div className="pf-report-row"><span>MFA Coverage</span><strong>{c.mfaCoverage}%</strong></div>
              <div className="pf-report-row"><span>Endpoint Compliance</span><strong>{c.endpointCompliance}%</strong></div>
              <div className="pf-report-row"><span>Security Training Completion</span><strong>{c.trainingCompletion}%</strong></div>
              <div className="pf-report-row"><span>{c.compliance.framework} Readiness</span><strong>{c.compliance.score}%</strong></div>
              <div className="pf-report-row"><span>Open Helpdesk Tickets</span><strong>{c.openTickets}</strong></div>
            </div>
            <div className="pf-report-actions">
              <button className="pf-btn" onClick={() => window.print()}><Icon name="print" size={16} /> Print / Save PDF</button>
            </div>
          </div>
        )}

        <div className="pf-drill-cols">
          <div className="pf-panel">
            <div className="pf-panel-hdr"><h3><Icon name="users" size={15} className="h3-ic" />Employees Requiring Attention</h3><span className="pf-count">{c.employees.filter((e) => e.status !== 'low').length} flagged</span></div>
            <div className="pf-emp-list">
              {c.employees.map((e) => (
                <div key={e.id} className={`pf-emp ${e.status}`}>
                  <div className="pf-emp-avatar">{e.name.charAt(0)}</div>
                  <div className="pf-emp-main">
                    <div className="pf-emp-top"><span className="pf-emp-name">{e.name}</span><span className="pf-emp-dept">{e.department}</span></div>
                    <div className="pf-emp-issues">
                      {e.issues.length ? e.issues.map((i, idx) => <span key={idx} className="pf-chip">{i}</span>) : <span className="pf-chip ok">No open issues</span>}
                    </div>
                    <div className="pf-emp-foot">{e.device} · <span className={e.mfa ? 'pf-mfa-on' : 'pf-mfa-off'}>{e.mfa ? 'MFA on' : 'No MFA'}</span> · {e.lastActive}</div>
                  </div>
                  <div className={`pf-emp-risk ${e.status}`}>{e.riskScore}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pf-panel">
            <div className="pf-panel-hdr"><h3><Icon name="alert" size={15} className="h3-ic" />Recent Alerts</h3><span className="pf-live-dot"><i className="pf-dot" />Live</span></div>
            <div className="pf-alert-list">
              {c.recentAlerts.map((a, idx) => (
                <div key={idx} className={`pf-alert ${a.sev}`}>
                  <span className={`pf-alert-dot ${a.sev}`} />
                  <div><div className="pf-alert-title">{a.title}</div><div className="pf-alert-detail">{a.detail}</div><div className="pf-alert-time">{a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Portfolio overview ----------------
  return (
    <div className="pf-console">
      <div className="pf-hero">
        <div>
          <h1>Portfolio Command Center</h1>
          <p>All {rollup.companies} managed organizations · {fmt(rollup.employeesProtected)} employees protected</p>
        </div>
        <div className="pf-hero-badge"><span className="pf-live-dot"><i className="pf-dot" />Live</span> CyproSecure 360</div>
      </div>

      <div className="pf-rollup">
        <KpiTile icon="building" value={rollup.companies} label="Companies" sub={`${rollup.liveCompanies} live`} />
        <KpiTile icon="users" value={fmt(rollup.employeesProtected)} label="Employees Protected" />
        <KpiTile icon="gauge" value={rollup.avgSecurityScore} label="Avg Security Score" tone={rollup.avgSecurityScore >= 80 ? 'ok' : 'warn'} />
        <KpiTile icon="shield" value={fmt(rollup.threatsBlocked)} label="Threats Blocked" />
        <KpiTile icon="alert" value={rollup.criticalAlerts} label="Critical Alerts" tone={rollup.criticalAlerts ? 'danger' : 'ok'} />
        <KpiTile icon="ticket" value={rollup.openTickets} label="Open Tickets" />
        <KpiTile icon="incident" value={rollup.atRisk} label="Need Attention" tone={rollup.atRisk ? 'warn' : 'ok'} />
        <KpiTile icon="clipboard" value={`${rollup.avgCompliance}%`} label="Avg Compliance" />
      </div>

      <div className="pf-toolbar">
        <div className="pf-search">
          <Icon name="search" size={16} />
          <input placeholder="Search companies…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="pf-sort">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="risk">Highest Risk First</option>
            <option value="score">Best Score First</option>
            <option value="employees">Most Employees</option>
            <option value="alerts">Most Critical Alerts</option>
          </select>
        </div>
      </div>

      <div className="pf-grid">
        {visible.map((c) => (
          <button key={c.tenantId} className={`pf-card ${c.status}`} onClick={() => setSelectedId(c.tenantId)}>
            <div className="pf-card-top">
              <div className="pf-card-logo" data-status={c.status}>{initials(c.name)}</div>
              <div className="pf-card-id">
                <div className="pf-card-name">{c.name}</div>
                <div className="pf-card-industry">{c.industry}</div>
              </div>
              <ScoreRing score={c.securityScore} size={56} stroke={5} />
            </div>
            <div className="pf-card-trend">
              <Sparkline data={c.scoreTrend} color={statusColor(c.status)} />
              <span className="pf-status-pill sm" style={{ color: statusColor(c.status), borderColor: statusColor(c.status) }}>{c.status.replace('-', ' ')}</span>
            </div>
            <div className="pf-card-stats">
              <div><span className="pf-cs-v">{fmt(c.headcount)}</span><span className="pf-cs-l">Employees</span></div>
              <div><span className={`pf-cs-v ${c.alerts.critical ? 'danger' : ''}`}>{c.alerts.critical}</span><span className="pf-cs-l">Critical</span></div>
              <div><span className="pf-cs-v">{c.openTickets}</span><span className="pf-cs-l">Tickets</span></div>
              <div><span className="pf-cs-v">{c.compliance.score}%</span><span className="pf-cs-l">{c.compliance.framework}</span></div>
            </div>
            <div className="pf-card-foot">{c.live ? <span className="pf-live"><i className="pf-dot" />LIVE DATA</span> : <span className="pf-sim">SIMULATED</span>} <span className="pf-open">Open <Icon name="arrowRight" size={13} /></span></div>
          </button>
        ))}
      </div>
    </div>
  );
}
