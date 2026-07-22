import React from 'react';

/**
 * Minimal monochrome line-icon set (1.6px stroke, currentColor) for the
 * enterprise SOC look — replaces emoji so the console reads business-professional
 * rather than playful.
 */
const PATHS = {
  shield: <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.5a3 3 0 0 1 0 5.8" /><path d="M15.5 14.5a5.5 5.5 0 0 1 5 4.5" /></>,
  gauge: <><path d="M4 15a8 8 0 0 1 16 0" /><path d="M12 15l4-4" /></>,
  ticket: <><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" /><path d="M13 6v12" strokeDasharray="2 2" /></>,
  alert: <><path d="M12 4l9 15H3l9-15z" /><path d="M12 10v4" /><circle cx="12" cy="16.5" r=".6" fill="currentColor" stroke="none" /></>,
  building: <><rect x="5" y="4" width="14" height="16" rx="1" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  book: <><path d="M5 5a2 2 0 0 1 2-2h11v16H7a2 2 0 0 0-2 2z" /><path d="M5 5v14" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 10h6M9 14h4" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></>,
  headset: <><path d="M5 13v-1a7 7 0 0 1 14 0v1" /><rect x="3.5" y="13" width="4" height="6" rx="1.5" /><rect x="16.5" y="13" width="4" height="6" rx="1.5" /><path d="M20 19a4 4 0 0 1-4 3h-2" /></>,
  arrowLeft: <path d="M15 5l-7 7 7 7" />,
  arrowRight: <path d="M9 5l7 7-7 7" />,
  key: <><circle cx="8" cy="12" r="3.5" /><path d="M11.5 12H21l-2 2m-2-2v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  incident: <><path d="M12 3l9 16H3z" /><path d="M12 9v4" /><circle cx="12" cy="16" r=".6" fill="currentColor" stroke="none" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3" /><circle cx="12" cy="16.5" r=".6" fill="currentColor" stroke="none" /></>,
  send: <path d="M4 12l16-7-6 16-3-6-7-3z" />,
  print: <><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="7" rx="1" /><path d="M7 14h10v6H7z" /></>,
  dot: <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />,
};

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.6 }) {
  const p = PATHS[name];
  if (!p) return null;
  return (
    <svg
      className={`ic ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {p}
    </svg>
  );
}
