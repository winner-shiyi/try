import { Message } from 'antd';
import fetch from '../../../../lib/fetch';


// const CryptoJS = require('../../../util/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
const loginRequest = (params) => ({
  type: LOGIN_REQUEST,
  payload: params,
});

const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

const loginFailure = (msg) => ({
  type: LOGIN_FAILURE,
  payload: msg,
});

// const key = CryptoJS.enc.Latin1.parse('dGJiZXhwcmVzcw==');
// const iv = CryptoJS.enc.Latin1.parse('fxlyyqiuwwljqwss');

const login = (params) => (dispatch) => {
  dispatch(loginRequest(params));
  /* let encrypted = CryptoJS.AES.encrypt(
      params.password,
      key,
      {
        iv:iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      })
    params.password = encrypted.toString() */

  return fetch('/login', params)
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(loginSuccess(json.resultData));
        return true;
      }
      dispatch(loginFailure(json.resultDesc));
      return false;
    });
};

export const actions = {
  login,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: (state, action) => ({
    ...state,
    username: action.payload.username,
    password: action.payload.password,
    loading: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => {
    sessionStorage.setItem('accessToken', action.payload.token);
    sessionStorage.setItem('refreshToken', action.payload.refreshToken);
    sessionStorage.setItem('name', JSON.stringify(action.payload.name));
    return {
      ...state,
      user: action.payload.user,
      loading: false,
    };
  },
  [LOGIN_FAILURE]: (state, action) => {
    Message.error(action.payload);
    sessionStorage.setItem('accessToken', '');
    return {
      ...state,
      user: '',
      loading: false,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  detail: true,
  username: '',
  password: '',
  user: '',
  loading: false,
};
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
