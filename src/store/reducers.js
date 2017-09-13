import { combineReducers } from 'redux';
import locationReducer from './location';
import commonReducer from './common';
import dictReducer from './dict';

const makeRootReducer = (asyncReducers) => 
  // 合并
  combineReducers({
    // locationreducer 返回变化后的路径地址
    location: locationReducer,
    common: commonReducer,
    dict: dictReducer,
    ...asyncReducers,
  });

export const injectReducer = (storeTemp, { key, reducer }) => {
  const store = storeTemp;
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
