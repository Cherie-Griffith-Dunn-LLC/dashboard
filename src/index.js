import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  environment: process.env?.NODE_ENV ? process.env.NODE_ENV : "production",
  integrations: [
    Sentry.browserTracingIntegration(),
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: true,
    })
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
  <GoogleOAuthProvider clientId='569515826831-bqhd1afnbub87vhioe23g1nb7ctukp5r.apps.googleusercontent.com'>
    <Provider store={configureStore({})}>
      <React.Fragment>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  </GoogleOAuthProvider>
);
reportWebVitals();
// serviceWorker.unregister();

