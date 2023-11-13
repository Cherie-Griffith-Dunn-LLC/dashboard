import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

import * as Sentry from "@sentry/react";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
  // https://docs.sentry.io/platforms/javascript/guides/react/features/redux/#redux-enhancer-options
});

export function configureStore(initialState) {

  const store = createStore(
    rootReducer,
      initialState,
      composeEnhancers(
          applyMiddleware(...middlewares),
          sentryReduxEnhancer
      ),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

