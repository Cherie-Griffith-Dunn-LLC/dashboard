import React, { act } from "react";
import { createRoot } from "react-dom/client";
import CustomerPortal from "./CustomerPortal";
const mockInstance = {
  acquireTokenSilent: jest.fn(async () => ({ accessToken: "test-token" })),
  logoutRedirect: jest.fn(),
};
const mockAccounts = [{ name: "Test Member" }];
jest.mock("@azure/msal-react", () => ({
  useMsal: () => ({ instance: mockInstance, accounts: mockAccounts }),
}));
let root, host;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  mockInstance.acquireTokenSilent.mockResolvedValue({
    accessToken: "test-token",
  });
  process.env.REACT_APP_PORTAL_API_SCOPE = "api://example/Portal.Read";
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  jest.clearAllMocks();
});
function responses(overrides = {}) {
  const values = {
    profile: {
      company: "Test Company",
      name: "Test Member",
      companyWide: false,
      packages: [],
    },
    defender: { status: "not_connected", message: "Consent required" },
    sentinel: { status: "not_connected" },
    tickets: { status: "connected", tickets: [], monthlyTotal: 0 },
    ...overrides,
  };
  global.fetch = jest.fn(async (path) => ({
    ok: true,
    headers: { get: () => "application/json" },
    json: async () => values[path.split("/").pop()],
  }));
}
test("unconfigured Microsoft services show no fabricated zero and no active download", async () => {
  responses();
  await act(async () => root.render(<CustomerPortal />));
  expect(host.textContent).toContain("Test Company");
  expect(host.textContent).toContain("Consent required");
  expect(
    [...host.querySelectorAll(".cp-metric>strong")].map((n) => n.textContent),
  ).toEqual(["—", "—", "—", "0"]);
  await act(async () =>
    [...host.querySelectorAll("nav button")]
      .find((b) => b.textContent.includes("Protect a device"))
      .click(),
  );
  const downloads = [...host.querySelectorAll("button")].filter(
    (b) => b.textContent === "Download package",
  );
  expect(downloads).toHaveLength(3);
  downloads.forEach((b) => expect(b.disabled).toBe(true));
});
test("ticket filtering works and executive totals are absent for employees", async () => {
  responses({
    tickets: {
      status: "connected",
      monthlyTotal: 1,
      tickets: [
        {
          id: "one",
          reference: "001",
          title: "VPN help",
          status: "open",
          submittedBy: "Test Member",
        },
        {
          id: "two",
          reference: "002",
          title: "Email fixed",
          status: "closed",
          submittedBy: "Test Member",
        },
      ],
    },
  });
  await act(async () => root.render(<CustomerPortal />));
  await act(async () =>
    [...host.querySelectorAll("nav button")]
      .find((b) => b.textContent.includes("IT support"))
      .click(),
  );
  expect(host.textContent).toContain("VPN help");
  expect(host.textContent).toContain("Email fixed");
  await act(async () => {
    const select = host.querySelector("select");
    select.value = "open";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(host.textContent).toContain("VPN help");
  expect(host.textContent).not.toContain("Email fixed");
  expect(host.textContent).not.toContain("Who requested support this month");
});
test("sign out uses Microsoft sign out and failures do not show stale records", async () => {
  responses();
  await act(async () => root.render(<CustomerPortal />));
  await act(async () =>
    [...host.querySelectorAll("button")]
      .find((b) => b.textContent === "Sign out")
      .click(),
  );
  expect(mockInstance.logoutRedirect).toHaveBeenCalledTimes(1);
  global.fetch = jest.fn(async () => ({
    ok: false,
    json: async () => ({ error: "Access revoked" }),
  }));
  await act(async () =>
    [...host.querySelectorAll("button")]
      .find((b) => b.textContent === "Refresh")
      .click(),
  );
  expect(host.textContent).toContain("Access revoked");
  expect(host.textContent).not.toContain("Test Company");
});
