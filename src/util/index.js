import config from '../config.json';

export function isResultSuccessful(code) {
  return parseInt(code, 10) === 0;
}

export const getFieldsValue = (fields = {}) => {
  const res = {};
  const keys = Object.keys(fields || {});
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = fields[key];
    res[key] = typeof param === 'object' && !(param instanceof Array) ? param.value : param;
  }
  return res;
};

export const getSessionValue = (key) => JSON.parse(sessionStorage.getItem('user'))[key];

export const getNodeEnv = () => {
  let env = 'development';
  if (__ONLINE__) {
    env = 'online';
  } else if (__PRE__) {
    env = 'pre';
  } else if (__QAIF__) {
    env = 'qaif';
  } else if (__QAFC__) {
    env = 'qafc';
  } else if (__DEV__) {
    env = 'dev';
  } else if (__DEVELOPMENT__) {
    env = 'development';
  }
  return env;
};
/*
* get url prefix according to the env, default development
* */
export const getBaseUrl = () => config.apiAddress[getNodeEnv()];

export const isArray = (obj) => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(obj);
  }
  return Object.prototype.toString.call(obj) === '[object Array]';
};


export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function formatMoney(num) {
  const numStr = `${num}`;
  const nums = numStr.split('.');

  const integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return nums.length > 1 ? `${integer}.${nums[1]}` : integer;
}
