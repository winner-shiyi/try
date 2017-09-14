import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import reducers from './reducers';
import { updateLocation } from './location';

function callAPIMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    const {
      types,
      callAPI,
      shouldCallAPI,
      payload = {},
      callback,
    } = action;

    if (!types) {
      // Normal action: pass it on
      return next(action);
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every((type) => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }

    if (typeof shouldCallAPI === 'function' && !shouldCallAPI(getState())) {
      return false;
    }

    const [requestType, successType, failureType] = types;

    dispatch(Object.assign({}, payload, {
      type: requestType,
    }));

    return callAPI(getState()).then(
      (response) => {
        if (response.resultCode === '0') {
          const newPayload = {
            ...payload,
            data: response.resultData,
            type: successType,
            success: true,
          };
          callback && callback(newPayload, dispatch, getState());
          return dispatch(newPayload);
        }
        const failurePayload = {
          msg: response.resultDesc,
          type: failureType,
          success: false,
        };
        callback && callback(failurePayload, dispatch, getState());
        dispatch(failurePayload);
        return false;
      },
      (error) => {
        const errorPayload = {
          msg: error,
          type: failureType,
          success: false,
        };
        callback && callback(errorPayload, dispatch, getState());
        dispatch(errorPayload);
      }
    );
  };
}

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, callAPIMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];

  let composeEnhancers = compose;

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    reducers(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
