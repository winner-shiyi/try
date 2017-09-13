import fetch from 'isomorphic-fetch';
import { getBaseUrl } from '../src/util';

const decorateParams = (params = {}) => { // compatible with the param like "foo: {value: 'xxx', ...}"
  const res = {};
  for (const i in params) {
    const param = params[i]; // TODO
    let value = typeof param === 'object' && // fields is a object perhaps
    !(param instanceof Array) && // not array
    !(param._d) // 提交参数的时候有进一步被包装
      ? (('value' in param) ? (param.value && param.value.trim && param.value.trim() || param.value) : param) : param;

    if (value instanceof Array && value.length === 2) { // dateRange, datetimeRange, numberRange
      if (param.type === 'datetimeRange' || param.type === 'numberRange') {
        res[`${i}Start`] = value[0] || undefined;
        res[`${i}End`] = value[1] || undefined;
      } else if (param.type === 'dateRange') {
        res[`${i}Start`] = value[0].format('YYYY-MM-DD 00:00:00');
        res[`${i}End`] = value[1].format('YYYY-MM-DD 23:59:59');
      } else {
        res[i] = value;
      }
    } else {
      if (/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}$/.test(value)) { // fix time string to second
        value += ':00';
      }
      res[i] = typeof value === 'undefined' ? '' : (value && value.trim && value.trim() || value);
    }
  }
  return res;
};

export default (url, params = {}, opts = {}) => {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionStorage.getItem('accessToken') || 'aa',
    },
  };
  opts = {
    ...defaultOpts,
    ...opts,
  };

  if (opts.method === 'POST') {
    opts.body = JSON.stringify(decorateParams(params));
  }
  document.querySelector('#overlay').style.display = 'block';
  url = url.indexOf('//') > -1 ? url : (getBaseUrl() + url);
  sessionStorage.setItem('url', url);
  return fetch(url, opts)
    .then((res) => {
      document.querySelector('#overlay').style.display = 'none';
      if (res.status < 200 || res.status >= 300) {
        return {
          resultCode: '-1',
          resultDesc: `${res.status} ${res.statusText}`,
        };
      }
      const contentType = res.headers.get('content-type');
      if (contentType.indexOf('application/json') > -1) {
        return res.json();
      } 
      return res.blob();
    })
    .then((json) => {
      if (json.type) { // blob
        return json;
      }
      if (json.resultCode === '0004' || json.resultCode === '0002') { // 登录过期或未登录
        sessionStorage.setItem('accessToken', '');
        sessionStorage.setItem('user', '{}');
        location.assign('/SignIn');
      }
      if (json.resultCode === '10') {
        const paramsTemp = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        if (opts.method === 'POST') {
          paramsTemp.body = JSON.stringify(decorateParams({ refreshToken : sessionStorage.getItem('refreshToken') }));
        }
        fetch((`${getBaseUrl()}/user/refreshToken`), paramsTemp)
        .then((res) => {
          if (res.status < 200 || res.status >= 300) {
            return {
              resultCode: '-1',
              resultDesc: `${res.status} ${res.statusText}`,
            };
          } 
          return res.json();
        }).then((json) => {
          const { resultData } = json;
          sessionStorage.setItem('accessToken', resultData.token);
          sessionStorage.setItem('refreshToken', resultData.refreshToken);

          const resetUrl = sessionStorage.getItem('url');
          sessionStorage.removeItem('url');

          document.querySelector('#overlay').style.display = 'block';
          opts.headers.Authorization = resultData.token;
          fetch(resetUrl, opts).then((res) => {
            document.querySelector('#overlay').style.display = 'none';
            if (res.status < 200 || res.status >= 300) {
              return {
                resultCode: '-1',
                resultDesc: `${res.status} ${res.statusText}`,
              };
            }
            const contentType = res.headers.get('content-type');
            if (contentType.indexOf('application/json') > -1) {
              return res.json();
            } 
            return res.blob();
          }).then(() => {
            if (json.type) { // blob
              return json;
            }
            return json;
          });
        });
      }
      sessionStorage.removeItem('url');
      return json;
    })
    .catch((e) => {
      document.querySelector('#overlay').style.display = 'none';
      return {
        resultCode: '-1',
        resultDesc: '网络异常，请重试',
      };
    });
};
