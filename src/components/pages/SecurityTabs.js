import React, { useState, useMemo } from 'react';
import Icon from '../Icon';
import CyproteckLogo from '../CyproteckLogo';
import {
  getThreats, getAlerts, getAssignments, TRIGGERS, COURSES, PEAK_WINDOWS, severityColor, courseSlides,
} from '../../CommonData/securityFeed';
import './SecurityTabs.css';

function TabHead({ icon, title, subtitle, source }) {
  return (
    <div className="tab-head">
      <div className="tab-head-main">
        <div className="tab-head-icon"><Icon name={icon} size={18} /></div>
        <div>
          <h1 className="tab-title">{title}</h1>
          <p className="tab-sub">{subtitle}</p>
        </div>
      </div>
      {source && <div className="tab-source"><span className="tab-dot" /> {source}</div>}
    </div>
  );
}

function SevBadge({ sev }) {
  return <span className="sev-badge" style={{ color: severityColor(sev), borderColor: severityColor(sev) }}>{sev}</span>;
}

// ------------------------------ Threats ------------------------------
export function ThreatsView() {
  const threats = useMemo(() => getThreats(), []);
  const counts = threats.reduce((a, t) => ((a[t.severity] = (a[t.severity] || 0) + 1), a), {});
  return (
    <div className="tab">
      <TabHead icon="shield" title="Threats" subtitle="Live detections from your endpoint & identity protection" source="SentinelOne · Defender · Sentinel" />
      <div className="tab-kpis">
        <div className="tab-kpi danger"><b>{counts.critical || 0}</b><span>Critical</span></div>
        <div className="tab-kpi danger"><b>{counts.high || 0}</b><span>High</span></div>
        <div className="tab-kpi warn"><b>{counts.medium || 0}</b><span>Medium</span></div>
        <div className="tab-kpi"><b>{threats.filter((t) => t.status === 'contained').length}</b><span>Contained</span></div>
      </div>
      <div className="tab-panel">
        <div className="tab-table-wrap">
          <table className="tab-table">
            <thead><tr><th>Severity</th><th>Threat</th><th>Endpoint</th><th>Source</th><th>Status</th><th>Detected</th></tr></thead>
            <tbody>
              {threats.map((t) => (
                <tr key={t.id}>
                  <td><SevBadge sev={t.severity} /></td>
                  <td><div className="cell-title">{t.type}</div><div className="cell-sub">{t.description}</div></td>
                  <td className="mono">{t.host}</td>
                  <td className="cell-sub">{t.source}</td>
                  <td><span className={`state ${t.status}`}>{t.status}</span></td>
                  <td className="cell-sub">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ------------------------------ Alerts ------------------------------
export function AlertsView() {
  const alerts = useMemo(() => getAlerts(), []);
  const open = alerts.filter((a) => a.status === 'open').length;
  return (
    <div className="tab">
      <TabHead icon="alert" title="Security Alerts" subtitle="Notifications that may need review or action" source="SentinelOne · Defender · Sentinel" />
      <div className="tab-kpis">
        <div className="tab-kpi warn"><b>{open}</b><span>Open</span></div>
        <div className="tab-kpi"><b>{alerts.length - open}</b><span>Acknowledged</span></div>
        <div className="tab-kpi danger"><b>{alerts.filter((a) => a.severity === 'high').length}</b><span>High severity</span></div>
        <div className="tab-kpi"><b>{alerts.length}</b><span>Total</span></div>
      </div>
      <div className="tab-panel">
        <div className="tab-table-wrap">
          <table className="tab-table">
            <thead><tr><th>Severity</th><th>Alert</th><th>Asset</th><th>Source</th><th>Status</th><th>When</th></tr></thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id}>
                  <td><SevBadge sev={a.severity} /></td>
                  <td className="cell-title">{a.title}</td>
                  <td className="mono">{a.host}</td>
                  <td className="cell-sub">{a.source}</td>
                  <td><span className={`state ${a.status}`}>{a.status}</span></td>
                  <td className="cell-sub">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ------------------------------ Training ------------------------------
export function TrainingView() {
  const assignments = useMemo(() => getAssignments(), []);
  const [openCourse, setOpenCourse] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [slide, setSlide] = useState(0);
  const [pick, setPick] = useState(null);
  const [completed, setCompleted] = useState(() => new Set());
  const course = openCourse ? { id: openCourse, ...COURSES[openCourse] } : null;
  const slides = openCourse ? courseSlides(openCourse) : [];
  const cur = slides[slide];

  const open = (id) => { setOpenCourse(id); setPlaying(false); setSlide(0); setPick(null); };
  const close = () => { setOpenCourse(null); setPlaying(false); };
  const finish = () => { setCompleted((prev) => new Set(prev).add(openCourse)); };

  const done = assignments.filter((a) => a.status === 'completed').length;

  return (
    <div className="tab">
      <TabHead icon="book" title="Security Training" subtitle="Courses auto-assigned when risky behavior is detected" />

      <div className="tab-kpis">
        <div className="tab-kpi"><b>{TRIGGERS.length}</b><span>Active triggers</span></div>
        <div className="tab-kpi warn"><b>{assignments.length - done}</b><span>Outstanding</span></div>
        <div className="tab-kpi ok"><b>{done}</b><span>Completed</span></div>
        <div className="tab-kpi"><b>{Object.keys(COURSES).length}</b><span>Courses</span></div>
      </div>

      {/* Auto-assignment engine */}
      <div className="tab-panel">
        <div className="panel-hd"><h2><Icon name="shield" size={14} className="hd-ic" />Auto-Assignment Rules</h2><span className="panel-note">Behavior detected → course assigned automatically</span></div>
        <div className="rules">
          {TRIGGERS.map((t) => (
            <button key={t.id} className="rule" onClick={() => open(t.courseId)}>
              <span className={`rule-sev ${t.severity}`} />
              <div className="rule-main">
                <div className="rule-behavior">{t.behavior}</div>
                <div className="rule-cond">{t.condition}</div>
              </div>
              <div className="rule-arrow"><Icon name="arrowRight" size={13} /></div>
              <div className="rule-course">{COURSES[t.courseId].title}</div>
            </button>
          ))}
        </div>
        <div className="peak-note">
          <Icon name="alert" size={13} />
          <span>Peak hack windows (idle &gt; 13 min = high risk): {PEAK_WINDOWS.map((w) => `${w.start}–${w.end}`).join(' · ')}</span>
        </div>
      </div>

      {/* Recently auto-assigned */}
      <div className="tab-panel">
        <div className="panel-hd"><h2><Icon name="users" size={14} className="hd-ic" />Recently Auto-Assigned</h2></div>
        <div className="tab-table-wrap">
          <table className="tab-table">
            <thead><tr><th>Employee</th><th>Triggered by</th><th>Course</th><th>Status</th><th>When</th></tr></thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="click" onClick={() => open(a.courseId)}>
                  <td className="cell-title">{a.employee}</td>
                  <td className="cell-sub">{a.behavior}</td>
                  <td>{a.course}</td>
                  <td><span className={`state ${a.status}`}>{a.status.replace('-', ' ')}</span></td>
                  <td className="cell-sub">{a.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course drawer + interactive player */}
      {course && (
        <div className="course-overlay" onClick={close}>
          <div className="course-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="course-drawer-hd">
              <div><div className="course-cat">{course.category} · {course.duration} · {course.level}</div><h3>{course.title}</h3></div>
              <button className="course-x" onClick={close}>✕</button>
            </div>

            {!playing ? (
              <>
                {completed.has(openCourse) && <div className="course-complete-tag"><Icon name="shield" size={14} /> Completed</div>}
                <div className="course-block"><span className="cb-label">Why it matters</span><p>{course.why}</p></div>
                <div className="course-block"><span className="cb-label">Risk to the company</span><p>{course.impact}</p></div>
                <div className="course-block"><span className="cb-label">How to fix the behavior</span><p>{course.fix}</p></div>
                <div className="course-block">
                  <span className="cb-label">{course.lessons.length} lessons</span>
                  <ol className="lessons">{course.lessons.map((l, i) => <li key={i}>{l}</li>)}</ol>
                </div>
                <button className="course-start" onClick={() => { setPlaying(true); setSlide(0); setPick(null); }}>
                  <Icon name="arrowRight" size={15} /> {completed.has(openCourse) ? 'Retake course' : 'Start course'}
                </button>
              </>
            ) : (
              <div className="player">
                <div className="player-progress"><div className="player-progress-fill" style={{ width: `${((slide + 1) / slides.length) * 100}%` }} /></div>
                <div className="player-step">Step {slide + 1} of {slides.length}</div>

                {cur.kind === 'read' && (
                  <>
                    <h4 className="player-title">{cur.title}</h4>
                    <p className="player-body">{cur.body}</p>
                    <button className="course-start" onClick={() => setSlide((s) => s + 1)}>Continue</button>
                  </>
                )}

                {cur.kind === 'check' && (
                  <>
                    <h4 className="player-title">{cur.title}</h4>
                    <p className="player-body">{cur.check.q}</p>
                    <div className="player-opts">
                      {cur.check.options.map((o, i) => {
                        const state = pick == null ? '' : i === cur.check.answer ? 'right' : i === pick ? 'wrong' : '';
                        return <button key={i} className={`player-opt ${state}`} disabled={pick != null} onClick={() => { setPick(i); if (i === cur.check.answer) finish(); }}>{o}</button>;
                      })}
                    </div>
                    {pick != null && (
                      pick === cur.check.answer
                        ? <div className="player-done"><Icon name="shield" size={16} /> Correct — course complete! <button className="course-start" onClick={close}>Done</button></div>
                        : <div className="player-retry">Not quite — <button className="linkbtn" onClick={() => setPick(null)}>try again</button></div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------ Reports ------------------------------
const REPORTS = [
  { id: 'exec', title: 'Executive Summary', desc: 'Security posture, top risks, and trend for leadership.', icon: 'gauge' },
  { id: 'threat', title: 'Threat & Incident Report', desc: 'Detections, containment, and response over the period.', icon: 'shield' },
  { id: 'training', title: 'Training Compliance', desc: 'Assignments, completion rates, and overdue learners.', icon: 'book' },
  { id: 'compliance', title: 'Compliance Readiness', desc: 'HIPAA / CMMC / SOC 2 posture and evidence gaps.', icon: 'clipboard' },
];
export function ReportsView({ company = 'Your Organization' }) {
  const [built, setBuilt] = useState(null);
  const r = REPORTS.find((x) => x.id === built);
  return (
    <div className="tab">
      <TabHead icon="clipboard" title="Reports" subtitle="Executive-ready reports, branded and ready to send" />
      <div className="report-grid">
        {REPORTS.map((rep) => (
          <div key={rep.id} className="report-card">
            <div className="report-ic"><Icon name={rep.icon} size={18} /></div>
            <div className="report-t">{rep.title}</div>
            <div className="report-d">{rep.desc}</div>
            <button className="report-btn" onClick={() => setBuilt(rep.id)}>Generate</button>
          </div>
        ))}
      </div>
      {r && <ReportDocument report={r} company={company} onClose={() => setBuilt(null)} />}
    </div>
  );
}

// Full, branded, print-ready executive report.
export function ReportDocument({ report, company, onClose }) {
  const threats = getThreats();
  const alerts = getAlerts();
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const critical = threats.filter((t) => t.severity === 'critical').length;
  const high = threats.filter((t) => t.severity === 'high').length;
  const contained = threats.filter((t) => t.status === 'contained').length;
  const score = 85;

  return (
    <div className="doc-overlay" onClick={onClose}>
      <div className="doc-actions no-print">
        <button className="report-btn" onClick={() => window.print()}><Icon name="print" size={15} /> Print / Save PDF</button>
        <button className="doc-close" onClick={onClose}>Close</button>
      </div>
      <div className="doc" onClick={(e) => e.stopPropagation()}>
        {/* Branded header */}
        <div className="doc-head">
          <CyproteckLogo height={40} tone="dark" />
          <div className="doc-head-meta">
            <div className="doc-kicker">CyproSecure 360 · Confidential</div>
            <div className="doc-date">{today}</div>
          </div>
        </div>
        <div className="doc-title-block">
          <div className="doc-report-type">{report.title}</div>
          <h1 className="doc-title">Security Posture Report</h1>
          <div className="doc-company">Prepared for <strong>{company}</strong> by Cyproteck Technologies</div>
        </div>

        {/* Executive summary */}
        <section className="doc-sec">
          <h2>Executive Summary</h2>
          <p>
            {company}'s security posture is currently rated <strong>{score}/100 — Strong</strong>. Over the reporting
            period, endpoint and identity protection detected and contained <strong>{contained} of {threats.length}</strong> threats,
            with <strong>{critical} critical</strong> and <strong>{high} high-severity</strong> events fully remediated. Security
            awareness training completion stands at <strong>82%</strong>, with courses auto-assigned in response to risky behavior.
            No unresolved critical incidents remain open at the time of this report.
          </p>
        </section>

        {/* Scorecard */}
        <section className="doc-sec">
          <h2>Security Scorecard</h2>
          <div className="doc-cards">
            <div className="doc-card"><div className="dc-v" style={{ color: '#1a9d5f' }}>{score}</div><div className="dc-l">Security Score</div></div>
            <div className="doc-card"><div className="dc-v">{contained}/{threats.length}</div><div className="dc-l">Threats Contained</div></div>
            <div className="doc-card"><div className="dc-v">82%</div><div className="dc-l">Training Complete</div></div>
            <div className="doc-card"><div className="dc-v">{alerts.filter((a) => a.status === 'open').length}</div><div className="dc-l">Open Alerts</div></div>
          </div>
        </section>

        {/* Threats table */}
        <section className="doc-sec">
          <h2>Threat &amp; Incident Summary</h2>
          <table className="doc-table">
            <thead><tr><th>Severity</th><th>Threat</th><th>Endpoint</th><th>Source</th><th>Status</th></tr></thead>
            <tbody>
              {threats.slice(0, 6).map((t) => (
                <tr key={t.id}>
                  <td><span className="doc-sev" style={{ color: severityColor(t.severity) }}>{t.severity}</span></td>
                  <td><strong>{t.type}</strong><br /><span className="doc-muted">{t.description}</span></td>
                  <td className="doc-mono">{t.host}</td>
                  <td className="doc-muted">{t.source}</td>
                  <td style={{ textTransform: 'capitalize' }}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Training + Recommendations */}
        <section className="doc-sec doc-two">
          <div>
            <h2>Security Awareness</h2>
            <ul className="doc-list">
              <li>Overall completion: <strong>82%</strong></li>
              <li>Courses auto-assigned on risky behavior (password, USB, public Wi-Fi, idle-lock)</li>
              <li>Higher-risk assignments during peak windows (9:30–11, 11–1, 2:30–4)</li>
            </ul>
          </div>
          <div>
            <h2>Recommendations</h2>
            <ul className="doc-list">
              <li>Enforce MFA on the remaining {100 - 88}% of accounts without it</li>
              <li>Complete overdue training for flagged employees this quarter</li>
              <li>Maintain endpoint isolation runbooks for critical detections</li>
            </ul>
          </div>
        </section>

        <div className="doc-foot">
          <CyproteckLogo height={22} tone="dark" showText={true} />
          <div>Cyproteck Technologies · CyproSecure 360 · info@cyproteck.com · Confidential — for intended recipient only</div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------ Settings ------------------------------
const INTEGRATIONS = [
  { name: 'SentinelOne (via N-able)', kind: 'EDR / threat feed', status: 'simulated', icon: 'shield' },
  { name: 'Microsoft Defender', kind: 'Endpoint & identity protection', status: 'simulated', icon: 'monitor' },
  { name: 'Microsoft Sentinel', kind: 'SIEM / alerts', status: 'simulated', icon: 'alert' },
  { name: 'N-able MSP Manager', kind: 'Helpdesk / ticketing', status: 'setup', icon: 'ticket' },
];
const STATUS_LABEL = { connected: 'Connected', simulated: 'Simulated', setup: 'Setup pending' };

export function SettingsView({ company = 'Cyproteck Technologies', onToggleTheme, darkMode }) {
  const [notify, setNotify] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  return (
    <div className="tab">
      <TabHead icon="clipboard" title="Settings" subtitle="Integrations, data sources, and preferences" />

      <div className="tab-panel">
        <div className="panel-hd"><h2><Icon name="shield" size={14} className="hd-ic" />Data Sources &amp; Integrations</h2><span className="panel-note">Connect live feeds to replace simulated data</span></div>
        <div className="rules">
          {INTEGRATIONS.map((it) => (
            <div key={it.name} className="rule" style={{ cursor: 'default' }}>
              <span className="rule-sev" />
              <div className="rule-main">
                <div className="rule-behavior">{it.name}</div>
                <div className="rule-cond">{it.kind}</div>
              </div>
              <div />
              <div className={`int-status ${it.status}`}>{STATUS_LABEL[it.status]}</div>
            </div>
          ))}
        </div>
        <div className="peak-note"><Icon name="key" size={13} /><span>Connect these in Azure → your Static Web App → Configuration (keys stay server-side, never in the browser).</span></div>
      </div>

      <div className="tab-panel">
        <div className="panel-hd"><h2><Icon name="users" size={14} className="hd-ic" />Preferences</h2></div>
        <div className="set-rows">
          <div className="set-row"><div><div className="set-t">Appearance</div><div className="set-d">Light or dark theme</div></div>
            <button className="set-toggle-btn" onClick={onToggleTheme}><Icon name={darkMode ? 'sun' : 'moon'} size={15} /> {darkMode ? 'Switch to light' : 'Switch to dark'}</button></div>
          <div className="set-row"><div><div className="set-t">Email notifications</div><div className="set-d">Critical alerts &amp; weekly summary</div></div>
            <button className={`toggle ${notify ? 'on' : ''}`} onClick={() => setNotify((v) => !v)}><span /></button></div>
          <div className="set-row"><div><div className="set-t">Auto-assign training</div><div className="set-d">Assign courses automatically on risky behavior</div></div>
            <button className={`toggle ${autoAssign ? 'on' : ''}`} onClick={() => setAutoAssign((v) => !v)}><span /></button></div>
        </div>
      </div>

      <div className="tab-panel">
        <div className="panel-hd"><h2><Icon name="building" size={14} className="hd-ic" />Organization</h2></div>
        <div className="report-rows" style={{ padding: '4px 14px 14px' }}>
          <div className="rr"><span>Organization</span><b>{company}</b></div>
          <div className="rr"><span>Product</span><b>CyproSecure 360</b></div>
          <div className="rr"><span>Primary domain</span><b>app.cyproteck.com</b></div>
          <div className="rr"><span>Plan</span><b>MSSP · Standard</b></div>
        </div>
      </div>
    </div>
  );
}
