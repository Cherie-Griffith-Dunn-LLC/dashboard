import React from 'react';

/**
 * Cyproteck Technologies logo — shield mark + wordmark, recreated as scalable
 * SVG/markup so it stays crisp at any size and prints cleanly on reports.
 * `tone`: 'auto' (adapts to theme via currentColor), 'dark' (for white/print
 * backgrounds), or 'light' (for dark backgrounds).
 */
export default function CyproteckLogo({ height = 34, tone = 'auto', mark = 'CYPROTECK', showText = true }) {
  const wordColor = tone === 'dark' ? '#0d1117' : tone === 'light' ? '#ffffff' : 'currentColor';
  const shieldColor = wordColor;
  const pink = '#E20074';
  const s = height;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: s * 0.28, lineHeight: 1 }}>
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-label="Cyproteck">
        <path
          d="M24 3.5l16 5.2v11.1c0 10.4-6.9 18-16 20.7-9.1-2.7-16-10.3-16-20.7V8.7L24 3.5z"
          fill={shieldColor}
        />
        {/* negative-space split that reads as the Cyproteck shield */}
        <path d="M24 8.2v31.6c6.7-2.2 11.6-8 11.6-16V11.9L24 8.2z" fill={pink} opacity="0.001" />
        <path d="M24 7.6l11.8 3.8v8.4c0 8-4.9 13.9-11.8 16.3V7.6z" fill="#ffffff" opacity="0.14" />
        <path d="M18.2 22.6l4.2 4.2 8-8.4" stroke={pink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: s * 0.05 }}>
          <span style={{ fontSize: s * 0.62, fontWeight: 800, letterSpacing: '.01em', color: wordColor, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif' }}>{mark}</span>
          <span style={{ fontSize: s * 0.238, fontWeight: 700, letterSpacing: s * 0.028, color: pink, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif' }}>TECHNOLOGIES</span>
        </span>
      )}
    </span>
  );
}
