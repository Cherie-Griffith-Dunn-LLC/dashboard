/**
 * Render smoke tests — confirm the console + helpdesk mount without throwing
 * and surface the expected content. Uses react-dom/server (no extra deps).
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import PortfolioConsole from './PortfolioConsole';
import HelpdeskChat from './HelpdeskChat';

test('PortfolioConsole renders the rollup and company cards', () => {
  const html = renderToString(<PortfolioConsole onOpenHelpdesk={() => {}} />);
  expect(html).toContain('Portfolio Command Center');
  expect(html).toContain('Employees Protected');
  expect(html).toContain('CGD LLC');
  expect(html).toContain('Acme Healthcare');
});

test('HelpdeskChat renders nothing when closed and the panel when open', () => {
  expect(renderToString(<HelpdeskChat open={false} onClose={() => {}} />)).toBe('');
  const open = renderToString(<HelpdeskChat open={true} onClose={() => {}} userName="Cherie" company="CGD LLC" />);
  expect(open).toContain('CyproSecure Helpdesk');
  expect(open).toContain('Tier 1');
});
