import config from '../config.json'
export const serialize = (obj) => {
  var str = ''
  for (let k in obj) {
    if (obj[k]) {
      str += k + '=' + obj[k] + '&'
    }
  }
  return str.slice(0, str.length - 1)
}

export const getFieldsValue = (fields = {}) => {
  let res = {}
  for (let i in fields) {
    let param = fields[i]
    res[i] = typeof param === 'object' && !(param instanceof Array) ? param.value : param
  }
  return res
}

export const getSessionValue = (key) => {
  return JSON.parse(sessionStorage.getItem('user'))[key]
}

/*
* get url prefix according to the env, default development
* */
export const getBaseUrl = () => {
  const address = config.apiAddress
  let env = 'development'

  if (__DEV__) {
    env = 'development'
  } else if (__TEST__) {
    env = 'test'
  } else if (__PROD__) {
    env = 'production'
  } else if (__UAT__) {
    env = 'uat'
  } else if (__DEVREMOTE__) {
    env = 'devRemote'
  }

  return address[env]
}

export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;

    let ret = new obj.constructor();

    if (isArray(obj)) {
        ret = [];
        for (let i = 0, l = obj.length; i < l; i++) {
            ret[i] = deepClone(obj[i]);
        }
    } else {

        if (obj instanceof Date) {
            return new Date(obj.valueOf());
        }

        if (obj instanceof RegExp) {
            var pattern = obj.valueOf();
            var flags = '';
            flags += pattern.global ? 'g' : '';
            flags += pattern.ignoreCase ? 'i' : '';
            flags += pattern.multiline ? 'm' : '';
            return new RegExp(pattern.source, flags);
        }

        if (obj instanceof Function) {
            // 函数的话直接指向相对的内存地址
            return obj;
        }

        for (let attr in obj) {
            if (Object.hasOwnProperty.call(obj, attr)) {
                ret[attr] = deepClone(obj[attr]);
            }
        }
    }
    return ret;
}

export const isArray = (obj) => {
    if (typeof Array.isArray == 'function') {
        return Array.isArray(obj);
    } else {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}

export function createAction (type, ...argNames) {
  return function (...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

export function formatMoney (num) {
  let numStr = '' + num
  let nums = numStr.split('.')

  let integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return nums.length > 1 ? integer + '.' + nums[1] : integer
}

export function createEmptyObject (option) {
  if (!option) {
    option = {}
  }
}
