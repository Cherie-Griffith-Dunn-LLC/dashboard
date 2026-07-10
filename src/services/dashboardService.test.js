/**
 * Frontend service tests.
 *
 * These mock the fetch transport only (no data fixtures) to verify the service
 * calls the correct server-side routes and never talks to an AI provider
 * directly — Copilot goes through /api/ai/copilot.
 */

import { getDashboard, askCopilot, getReport } from './dashboardService';

describe('dashboardService', () => {
  afterEach(() => {
    delete global.fetch;
  });

  function mockFetch(payload, ok = true, status = 200) {
    const fn = jest.fn().mockResolvedValue({
      ok,
      status,
      text: () => Promise.resolve(JSON.stringify(payload)),
    });
    global.fetch = fn;
    return fn;
  }

  test('getDashboard calls the tenant-scoped dashboard route and returns data', async () => {
    const fetchMock = mockFetch({ view: 'executive', riskScore: 42 });
    const data = await getDashboard('executive');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toBe('/api/dashboard/executive');
    expect(data.riskScore).toBe(42);
  });

  test('askCopilot posts to the server-side AI route (no direct AI calls)', async () => {
    const fetchMock = mockFetch({
      response: { summary: 's', topRisks: [], nextActions: [], responsibleOwner: 'MSP Lead' },
    });
    const result = await askCopilot('What are our biggest risks?');

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/ai/copilot');
    expect(options.method).toBe('POST');
    // The browser must never call an external AI endpoint directly.
    expect(url.startsWith('/api/')).toBe(true);
    expect(result.response.responsibleOwner).toBe('MSP Lead');
  });

  test('getReport rejects unknown report types before hitting the network', async () => {
    const fetchMock = mockFetch({});
    await expect(getReport('not-a-report')).rejects.toThrow(/Unknown report type/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
