import config from '../config.json';

export function isResultSuccessful(code) {
  return parseInt(code, 10) === 0;
}

export const getFieldsValue = (fields = {}) => {
  const res = {};
  // for (const i in fields) {
  //   const param = fields[i];
  //   res[i] = typeof param === 'object' && !(param instanceof Array) ? param.value : param;
  // }
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
  if (__DEV__) {
    env = 'development';
  } else if (__TEST__) {
    env = 'test';
  } else if (__PROD__) {
    env = 'production';
  } else if (__UAT__) {
    env = 'uat';
  } else if (__DEVREMOTE__) {
    env = 'devRemote';
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
