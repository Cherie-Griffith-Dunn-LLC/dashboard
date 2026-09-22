import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
jest.mock("@azure/msal-react", () => ({
  MsalProvider: ({ children }) => children,
  AuthenticatedTemplate: ({ children }) => children,
  UnauthenticatedTemplate: () => null,
}));
jest.mock("./components/Dashboard", () => () => <div>Existing dashboard</div>);
jest.mock("./components/customer/CustomerPortal", () => () => (
  <div>Customer security portal</div>
));
test("new portal requires explicit activation; existing dashboard remains the fallback", () => {
  delete process.env.REACT_APP_CUSTOMER_PORTAL_ENABLED;
  expect(renderToString(<App />)).toContain("Existing dashboard");
  process.env.REACT_APP_CUSTOMER_PORTAL_ENABLED = "true";
  expect(renderToString(<App />)).toContain("Customer security portal");
  delete process.env.REACT_APP_CUSTOMER_PORTAL_ENABLED;
});
