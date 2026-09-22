import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMsal } from "@azure/msal-react";
import "./CustomerPortal.css";

const NAV = [
  ["overview", "Overview"],
  ["devices", "Devices"],
  ["incidents", "Incidents"],
  ["tickets", "IT support"],
  ["setup", "Protect a device"],
];
const EMPTY_ROWS = [];
const date = (value) =>
  value ? new Date(value).toLocaleString() : "Not reported";
function Badge({ children }) {
  return (
    <span
      className={`cp-badge cp-${String(children)
        .toLowerCase()
        .replace(/[^a-z]/g, "")}`}
    >
      {children || "Unknown"}
    </span>
  );
}
function Empty({ children }) {
  return <div className="cp-empty">{children}</div>;
}
function Connection({ name, result }) {
  const connected = result?.status === "connected";
  return (
    <div className="cp-connection">
      <span className={connected ? "cp-dot connected" : "cp-dot"} />
      <div>
        <strong>{name}</strong>
        <small>
          {connected
            ? `Checked ${date(result.checkedAt)}`
            : result?.message || result?.error || "Checking connection…"}
        </small>
      </div>
      <Badge>
        {connected
          ? "Connected"
          : result?.status === "restricted"
            ? "Restricted"
            : "Needs attention"}
      </Badge>
    </div>
  );
}
function Rows({ headers, rows, empty }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <div className="cp-table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CustomerPortal() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const [page, setPage] = useState(
    window.location.pathname.startsWith("/it") ? "tickets" : "overview",
  );
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ticketFilter, setTicketFilter] = useState("all");
  const [downloadState, setDownloadState] = useState("");
  const request = useCallback(
    async (section, binary = false) => {
      const scope = process.env.REACT_APP_PORTAL_API_SCOPE;
      if (!scope)
        throw new Error(
          "The customer portal is awaiting secure connection setup. Your existing support page is available below.",
        );
      let auth;
      try {
        auth = await instance.acquireTokenSilent({ account, scopes: [scope] });
      } catch (_) {
        throw new Error(
          "Your Microsoft session needs attention. Sign out and sign in again to continue.",
        );
      }
      const response = await fetch(`/api/customer-portal/${section}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          Accept: binary ? "application/zip" : "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.error || `Connection unavailable (${response.status}).`,
        );
      }
      if (
        !binary &&
        !(response.headers.get("content-type") || "").includes(
          "application/json",
        )
      )
        throw new Error("The portal service has not been deployed yet.");
      return binary ? response.blob() : response.json();
    },
    [instance, account],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    // Remove previous data on refresh so a failed provider never appears current.
    setData({});
    setProfile(null);
    try {
      const identity = await request("profile");
      setProfile(identity);
      const sources = ["defender", "sentinel", "tickets"];
      const results = await Promise.allSettled(sources.map((s) => request(s)));
      setData(
        Object.fromEntries(
          sources.map((s, i) => [
            s,
            results[i].status === "fulfilled"
              ? results[i].value
              : { status: "error", error: results[i].reason.message },
          ]),
        ),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [request]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const devices = data.defender?.devices || [];
  const incidents = data.sentinel?.incidents || [];
  const alerts = data.defender?.alerts || [];
  const tickets = data.tickets?.tickets || EMPTY_ROWS;
  const filteredTickets = useMemo(
    () =>
      tickets.filter((t) => {
        const matches =
          `${t.reference || ""} ${t.title || ""} ${t.submittedBy || ""}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return (
          matches &&
          (ticketFilter === "all" ||
            (ticketFilter === "open"
              ? t.status !== "closed"
              : t.status === "closed"))
        );
      }),
    [tickets, search, ticketFilter],
  );
  const beginDownload = async (platform) => {
    setDownloadState(`Preparing ${platform} download…`);
    try {
      const blob = await request(`downloads/${platform}`, true);
      const url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = `CyproSecure-${platform}-onboarding.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadState(
        "Package downloaded. Follow your company’s deployment instructions. Protection is confirmed only after the device reports to Defender.",
      );
    } catch (e) {
      setDownloadState(e.message);
    }
  };
  const metric = (source, value) =>
    data[source]?.status === "connected" ? value : "—";
  const partial = Object.values(data).some((d) => d.partial);

  return (
    <div className="cp-shell">
      <aside className="cp-sidebar">
        <a className="cp-brand" href="/">
          CYPRO<span>SECURE</span>
          <small>360° / CUSTOMER PORTAL</small>
        </a>
        <div className="cp-company">
          <span>YOUR WORKSPACE</span>
          <strong>{profile?.company || "Secure customer workspace"}</strong>
          <small>
            {profile?.companyWide
              ? "Company administrator"
              : "Personal workspace"}
          </small>
        </div>
        <nav aria-label="Portal navigation">
          {NAV.map(([key, name], i) => (
            <button
              key={key}
              aria-current={page === key ? "page" : undefined}
              onClick={() => setPage(key)}
            >
              <span className="cp-nav-number">0{i + 1}</span>
              {name}
            </button>
          ))}
        </nav>
        <div className="cp-sidebar-footer">
          <strong>Cyproteck Technologies Inc.</strong>
          <p>Predict. Protect. Prevent.</p>
          <a href="https://cyproteck.com/support">
            Talk to Sapphire 2.0 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
      <main className="cp-main">
        <header className="cp-topbar">
          <span>SECURITY & IT, TOGETHER</span>
          <div>
            <span>{profile?.name || account?.name}</span>
            <button onClick={() => instance.logoutRedirect()}>Sign out</button>
          </div>
        </header>
        <section className="cp-heading">
          <div>
            <p className="cp-eyebrow">CYPROSECURE 360°</p>
            <h1>
              {
                {
                  overview: "Clarity. Confidence. Control.",
                  devices: "Your devices, in view.",
                  incidents: "Know what needs attention.",
                  tickets: "Support that moves you forward.",
                  setup: "Protection starts here.",
                }[page]
              }
            </h1>
            <p>
              {page === "overview"
                ? "One place to understand your security and keep your business moving."
                : page === "tickets"
                  ? "Track requests handled by your Cyproteck support team."
                  : page === "setup"
                    ? "Get the approved Defender onboarding package for your company."
                    : "Visibility from your connected Microsoft security services."}
            </p>
          </div>
          <button className="cp-secondary" disabled={loading} onClick={refresh}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </section>
        {error && (
          <div className="cp-notice" role="alert">
            {error} <a href="https://cyproteck.com/support">Open support</a>
          </div>
        )}
        {partial && (
          <div className="cp-notice">
            Some results are incomplete. Counts below reflect the records
            loaded, not your full environment.
          </div>
        )}
        {!error && (
          <>
            {page === "overview" && (
              <>
                <div className="cp-metrics">
                  {[
                    [
                      "Devices reporting",
                      metric("defender", devices.length),
                      "Defender device inventory",
                    ],
                    [
                      "Active Defender alerts",
                      metric("defender", alerts.length),
                      "Investigation may be required",
                    ],
                    [
                      "Open Sentinel incidents",
                      metric(
                        "sentinel",
                        incidents.filter((i) => i.status !== "Closed").length,
                      ),
                      "Correlated security activity",
                    ],
                    [
                      "Open support cases",
                      metric(
                        "tickets",
                        tickets.filter((t) => t.status !== "closed").length,
                      ),
                      profile?.companyWide
                        ? "Across your company"
                        : "Submitted by you",
                    ],
                  ].map(([label, value, note]) => (
                    <article className="cp-metric" key={label}>
                      <h2>{label}</h2>
                      <strong>{value}</strong>
                      <small>{note}</small>
                    </article>
                  ))}
                </div>
                <div className="cp-grid">
                  <section className="cp-panel">
                    <div className="cp-panel-title">
                      <h2>Your connected services</h2>
                      <span>CONNECTION HEALTH</span>
                    </div>
                    <Connection
                      name="Microsoft Defender for Endpoint"
                      result={data.defender}
                    />
                    <Connection
                      name="Microsoft Sentinel"
                      result={data.sentinel}
                    />
                    <Connection
                      name="Amazon Connect Cases"
                      result={data.tickets}
                    />
                    <p className="cp-footnote">
                      A successful connection confirms data access. It does not
                      certify that every device is protected.
                    </p>
                  </section>
                  <section className="cp-panel cp-feature">
                    <p className="cp-eyebrow">YOUR IT TEAM, ONE CLICK AWAY</p>
                    <h2>
                      Less disruption.
                      <br />
                      More progress.
                    </h2>
                    <p>
                      Start a support request or ask Sapphire 2.0 for help. Your
                      team continues the conversation in Amazon Connect.
                    </p>
                    <a
                      className="cp-primary"
                      href="https://cyproteck.com/support"
                    >
                      Get support <span aria-hidden="true">↗</span>
                    </a>
                    <button
                      className="cp-text-button"
                      onClick={() => setPage("tickets")}
                    >
                      View your cases
                    </button>
                  </section>
                </div>
              </>
            )}
            {page === "devices" && (
              <section className="cp-panel">
                <div className="cp-panel-title">
                  <h2>Device inventory</h2>
                  <button
                    className="cp-secondary"
                    onClick={() => setPage("setup")}
                  >
                    Protect a device
                  </button>
                </div>
                <Connection
                  name="Microsoft Defender for Endpoint"
                  result={data.defender}
                />
                <Rows
                  headers={[
                    "Device",
                    "Platform",
                    "Sensor health",
                    "Risk",
                    "Onboarding",
                    "Last seen",
                  ]}
                  rows={devices.map((d) => [
                    d.name,
                    d.os,
                    <Badge>{d.health}</Badge>,
                    <Badge>{d.risk}</Badge>,
                    d.onboarding,
                    date(d.lastSeen),
                  ])}
                  empty={
                    data.defender?.status === "connected"
                      ? "No devices were returned by Defender. Confirm licensing and onboarding with your administrator."
                      : "Device inventory will appear after your company’s connection and access are verified."
                  }
                />
              </section>
            )}
            {page === "incidents" && (
              <>
                <section className="cp-panel">
                  <div className="cp-panel-title">
                    <h2>Microsoft Sentinel incidents</h2>
                    <span>CUSTOMER WORKSPACE</span>
                  </div>
                  <Connection
                    name="Microsoft Sentinel"
                    result={data.sentinel}
                  />
                  <Rows
                    headers={[
                      "Incident",
                      "Title",
                      "Severity",
                      "Status",
                      "Updated",
                    ]}
                    rows={incidents.map((i) => [
                      i.number,
                      i.title,
                      <Badge>{i.severity}</Badge>,
                      <Badge>{i.status}</Badge>,
                      date(i.updatedAt),
                    ])}
                    empty={
                      data.sentinel?.status === "connected"
                        ? "No incidents returned in the loaded results."
                        : "Sentinel incidents will appear after your workspace is connected."
                    }
                  />
                </section>
                <section className="cp-panel">
                  <h2>Defender alerts</h2>
                  <Connection
                    name="Microsoft Defender for Endpoint"
                    result={data.defender}
                  />
                  <Rows
                    headers={["Alert", "Severity", "Status", "Created"]}
                    rows={alerts.map((a) => [
                      a.title,
                      <Badge>{a.severity}</Badge>,
                      a.status,
                      date(a.createdAt),
                    ])}
                    empty="No alert records available in this view."
                  />
                </section>
              </>
            )}
            {page === "tickets" && (
              <>
                <div className="cp-support-summary">
                  <div>
                    <span>
                      {profile?.companyWide ? "COMPANY SUPPORT" : "MY SUPPORT"}
                    </span>
                    <h2>
                      {metric("tickets", data.tickets?.monthlyTotal ?? 0)}{" "}
                      <small>cases submitted this month (UTC)</small>
                    </h2>
                  </div>
                  <a
                    className="cp-primary"
                    href="https://cyproteck.com/support"
                  >
                    New support request <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <section className="cp-panel">
                  <Connection
                    name="Amazon Connect Cases"
                    result={data.tickets}
                  />
                  <div className="cp-filters">
                    <label>
                      Find a case
                      <input
                        placeholder="Search title, number or submitter"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </label>
                    <label>
                      Status
                      <select
                        value={ticketFilter}
                        onChange={(e) => setTicketFilter(e.target.value)}
                      >
                        <option value="all">All cases</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </label>
                  </div>
                  <Rows
                    headers={[
                      "Case",
                      "Request",
                      "Status",
                      "Submitted by",
                      "Last updated",
                    ]}
                    rows={filteredTickets.map((t) => [
                      t.reference || t.id,
                      t.title,
                      <Badge>{t.status}</Badge>,
                      t.submittedBy,
                      date(t.updatedAt),
                    ])}
                    empty={
                      data.tickets?.status === "connected"
                        ? "No cases match this view."
                        : "Your existing cases will appear after your support account is linked."
                    }
                  />
                </section>
                {profile?.companyWide &&
                  data.tickets?.status === "connected" && (
                    <section className="cp-panel">
                      <h2>Who requested support this month</h2>
                      <Rows
                        headers={["Team member", "Cases submitted"]}
                        rows={Object.entries(data.tickets.submittedBy || {})}
                        empty="No requests submitted this month."
                      />
                    </section>
                  )}
                <p className="cp-footnote">
                  New requests and chat currently open the existing support
                  page, which may require a separate support sign-in. Internal
                  agent notes are not displayed here.
                </p>
              </>
            )}
            {page === "setup" && (
              <>
                <div className="cp-setup-intro">
                  <p className="cp-eyebrow">COMPANY-SPECIFIC ONBOARDING</p>
                  <h2>
                    The right protection.
                    <br />
                    In the right environment.
                  </h2>
                  <p>
                    Your package enrolls devices in your company’s Microsoft
                    Defender environment. Use it only on devices approved by
                    your company.
                  </p>
                </div>
                <div className="cp-downloads">
                  {["windows", "macos", "linux"].map((platform, i) => {
                    const available = profile?.packages?.some(
                      (p) => p.platform === platform && p.available,
                    );
                    return (
                      <section className="cp-panel" key={platform}>
                        <span className="cp-step">0{i + 1}</span>
                        <h2>
                          {platform === "macos"
                            ? "macOS"
                            : platform === "windows"
                              ? "Windows"
                              : "Linux"}
                        </h2>
                        <p>
                          {available
                            ? "Your administrator has approved a company-specific onboarding package."
                            : "Your administrator needs to prepare and approve your company’s package."}
                        </p>
                        <button
                          className="cp-primary"
                          disabled={
                            !available || downloadState.startsWith("Preparing")
                          }
                          onClick={() => beginDownload(platform)}
                        >
                          Download package
                        </button>
                      </section>
                    );
                  })}
                </div>
                <p role="status" className="cp-download-status">
                  {downloadState}
                </p>
                <section className="cp-panel">
                  <h2>After installation</h2>
                  <ol className="cp-steps">
                    <li>
                      Follow the instructions supplied by your administrator for
                      your device and operating system.
                    </li>
                    <li>
                      Keep the device online so it can report to Microsoft
                      Defender.
                    </li>
                    <li>
                      Ask your administrator to verify onboarding and sensor
                      health in Devices.
                    </li>
                  </ol>
                  <p className="cp-footnote">
                    Downloading a package does not confirm installation,
                    licensing, active protection, or Microsoft partner credit.
                  </p>
                </section>
              </>
            )}
          </>
        )}
        <footer className="cp-footer">
          <span>Cyproteck Technologies Inc.</span>
          <span>We See What Others Miss.</span>
        </footer>
      </main>
    </div>
  );
}
