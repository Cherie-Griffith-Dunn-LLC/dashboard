import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from "react-router-dom";

import { Provider } from "react-redux";

import "./i18n";

import {configureStore} from "./store/store";

// Initialize Sentry
Sentry.init({
  dsn: "https://12eef28bf24c483e98e6a9b2aeaf2e24@o4505110341812224.ingest.sentry.io/4505143868129280",
  environment: process.env?.MY_ENVIRONMENT ? "production" : "development",
  integrations: [
    new Sentry.BrowserTracing({
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay()
  ],
  traceSampleRate: 0.5,
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/cyproteckapi\.azurewebsites\.net\/api/,
    /^https:\/\/app\.cyproteck\.io\/api/
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configureStore({})}>
    <React.Fragment>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);
reportWebVitals();
// serviceWorker.unregister();

