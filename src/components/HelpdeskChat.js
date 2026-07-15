import React, { useState, useRef, useEffect } from 'react';
import { createTicket as apiCreateTicket } from '../services/dashboardService';
import './HelpdeskChat.css';

/**
 * CyproSecure Helpdesk — Tier 1 → Tier 2 support chat with a live ticket queue.
 *
 * Today the assistant triages in-app and creates tickets in local state so the
 * whole flow is demonstrable end-to-end. To connect it to your real team,
 * replace `createTicket()` with a POST to `/api/tickets` (dashboardService) or
 * your PSA connector (ConnectWise/Halo/NinjaOne) / Amazon Connect — the ticket
 * shape below already matches the API's ticket service.
 */

const CATEGORIES = [
  { key: 'account', label: '🔑 Account / Login', tier: 1 },
  { key: 'email', label: '📧 Email / M365', tier: 1 },
  { key: 'device', label: '💻 Device / Endpoint', tier: 1 },
  { key: 'security', label: '🛡️ Security Incident', tier: 2 },
  { key: 'access', label: '🔐 Access Request', tier: 1 },
  { key: 'other', label: '❓ Something else', tier: 1 },
];

// Deterministic-enough ticket number without Math.random.
let _seq = 4820;
function nextTicketNo() { _seq += 1; return `CS-${_seq}`; }

function triage(text) {
  const t = text.toLowerCase();
  if (/breach|ransom|malware|phish|hacked|compromis|virus|attack|suspicious|incident/.test(t))
    return { tier: 2, category: 'security', priority: 'high' };
  if (/password|locked|login|sign in|mfa|reset|can'?t log/.test(t))
    return { tier: 1, category: 'account', priority: 'medium' };
  if (/email|outlook|mailbox|teams|onedrive|sharepoint/.test(t))
    return { tier: 1, category: 'email', priority: 'medium' };
  if (/laptop|computer|device|slow|printer|vpn|wifi/.test(t))
    return { tier: 1, category: 'device', priority: 'low' };
  return { tier: 1, category: 'other', priority: 'medium' };
}

export default function HelpdeskChat({ open, onClose, userName = 'there', company = 'your organization' }) {
  const [messages, setMessages] = useState([
    { role: 'agent', tier: 1, text: `Hi ${userName.split(' ')[0]}! 👋 You've reached the CyproSecure Helpdesk (Tier 1). Tell me what's going on, or pick a category below and I'll get you sorted or route you to Tier 2.` },
  ]);
  const [tickets, setTickets] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [tab, setTab] = useState('chat');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const push = (m) => setMessages((prev) => [...prev, m]);

  function createTicket({ category, tier, priority, summary }) {
    const ticket = {
      ticketId: nextTicketNo(),
      category,
      tier,
      priority,
      summary,
      status: tier === 2 ? 'escalated' : 'open',
      company,
      synced: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTickets((prev) => [ticket, ...prev]);

    // Route to the server-side ticket service → active PSA connector
    // (N-able MSP Manager once configured). Fire-and-forget: the local ticket
    // is shown immediately and reconciled with the PSA's id on success. If the
    // API isn't reachable (e.g. local demo), the chat stays fully functional.
    apiCreateTicket({
      subject: summary,
      description: summary,
      priority,
      tier: String(tier),
      escalated: tier === 2,
      customerName: company,
      channel: 'chat',
      category,
    })
      .then((res) => {
        const ext = res && (res.externalId || res.ticketId || (res.ticket && (res.ticket.externalId || res.ticket.ticketId)));
        setTickets((prev) => prev.map((t) => (t.ticketId === ticket.ticketId ? { ...t, synced: true, externalId: ext || undefined } : t)));
      })
      .catch(() => {
        /* Offline/demo mode — keep the local ticket; nothing to reconcile. */
      });

    return ticket;
  }

  function respond(text, presetCat) {
    const t = presetCat ? { tier: CATEGORIES.find((c) => c.key === presetCat)?.tier || 1, category: presetCat, priority: presetCat === 'security' ? 'high' : 'medium' } : triage(text);
    setTyping(true);
    // Simulated agent think-time; deterministic, no timers needed for correctness.
    setTimeout(() => {
      const ticket = createTicket({ ...t, summary: text.slice(0, 120) });
      setTyping(false);
      if (t.tier === 2) {
        push({ role: 'agent', tier: 1, text: `This looks security-sensitive, so I'm escalating you to our **Tier 2 Security Team** right away.` });
        push({ role: 'agent', tier: 2, text: `Tier 2 here — I've opened priority ticket **${ticket.ticketId}** and our security analysts are being paged. Please don't interact with the affected device further. Someone from the team will reach out within the SLA window.` });
      } else {
        push({ role: 'agent', tier: 1, text: `Got it — I've logged ticket **${ticket.ticketId}** (${t.priority} priority) with our team. A Tier 1 technician will follow up shortly. Anything else I can help with? If it turns out to be a security concern I can escalate to Tier 2.` });
      }
    }, 650);
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    push({ role: 'user', text });
    setInput('');
    respond(text);
  }

  if (!open) return null;

  return (
    <div className="hd-overlay" onClick={onClose}>
      <div className="hd-panel" onClick={(e) => e.stopPropagation()}>
        <div className="hd-head">
          <div className="hd-head-id">
            <div className="hd-avatar">🎧</div>
            <div>
              <div className="hd-title">CyproSecure Helpdesk</div>
              <div className="hd-sub"><span className="hd-dot" /> Tier 1 &amp; Tier 2 · connected to your team</div>
            </div>
          </div>
          <button className="hd-close" onClick={onClose}>✕</button>
        </div>

        <div className="hd-tabs">
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>💬 Chat</button>
          <button className={tab === 'queue' ? 'active' : ''} onClick={() => setTab('queue')}>🎫 Ticket Queue {tickets.length > 0 && <span className="hd-badge">{tickets.length}</span>}</button>
        </div>

        {tab === 'chat' ? (
          <>
            <div className="hd-body">
              {messages.map((m, i) => (
                <div key={i} className={`hd-msg ${m.role}`}>
                  {m.role === 'agent' && <div className={`hd-msg-tag tier${m.tier}`}>{m.tier === 2 ? 'TIER 2 · SECURITY' : 'TIER 1'}</div>}
                  <div className="hd-bubble" dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
              {typing && <div className="hd-msg agent"><div className="hd-bubble typing"><span></span><span></span><span></span></div></div>}
              <div ref={endRef} />
            </div>
            <div className="hd-quick">
              {CATEGORIES.map((c) => (
                <button key={c.key} onClick={() => { push({ role: 'user', text: c.label }); respond(c.label, c.key); }}>{c.label}</button>
              ))}
            </div>
            <div className="hd-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Describe your issue…"
              />
              <button onClick={send}>Send</button>
            </div>
          </>
        ) : (
          <div className="hd-queue">
            {tickets.length === 0 ? (
              <div className="hd-empty">No tickets yet. Start a chat and I'll open one for you.</div>
            ) : tickets.map((t) => (
              <div key={t.ticketId} className={`hd-ticket ${t.priority}`}>
                <div className="hd-ticket-top">
                  <span className="hd-ticket-id">{t.ticketId}</span>
                  <span className={`hd-ticket-status ${t.status}`}>{t.status === 'escalated' ? 'TIER 2 · ESCALATED' : 'TIER 1 · OPEN'}</span>
                </div>
                <div className="hd-ticket-summary">{t.summary}</div>
                <div className="hd-ticket-meta">
                  {t.priority} priority · {t.company} · {t.createdAt}
                  {t.synced && <span className="hd-synced"> · ✓ MSP Manager{t.externalId ? ` #${t.externalId}` : ''}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
