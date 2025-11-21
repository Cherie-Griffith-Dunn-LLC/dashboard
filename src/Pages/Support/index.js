import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupportPage = () => {
  const [events, setEvents] = useState([]);
  const [vulns, setVulns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.REACT_APP_BACKEND_URL || '';
        // Fetch events and vulnerabilities from your API
        const [eventsRes, vulnsRes] = await Promise.all([
          axios.get(`${baseUrl}/events`),
          axios.get(`${baseUrl}/vulnerabilities`)
        ]);
        setEvents(eventsRes.data.events || eventsRes.data);
        setVulns(vulnsRes.data.vulns || vulnsRes.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Support &amp; Security</h1>
      {loading && <p>Loading data…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <>
          <h2>Events</h2>
          <ul>
            {events.map((ev, idx) => (
              <li key={idx}>{JSON.stringify(ev)}</li>
            ))}
          </ul>
          <h2>Vulnerabilities</h2>
          <ul>
            {vulns.map((v, idx) => (
              <li key={idx}>{JSON.stringify(v)}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SupportPage;
