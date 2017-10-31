// We only need to import the modules necessary for initial render
import React from 'react';
import { Input, Icon } from 'antd';
import Captcha from '../components/Captcha';
import Home from './Home';
import SignInRoute from './SignIn';
import FindPwdRoute from './FindPwd';
import ManageRoute from './Manage';
import CountlyManager from '../util/monitor/CountlyManager';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */
const createRoutes = (store) => ({
  path        : '/',
  component   : null,
  indexRoute  : Home,
  onEnter: ({ location }, replace, next) => {
    // 初始化的appKey和url在src/config.json中的countly处可找到
    CountlyManager.init();

    if (location.pathname === '/' && sessionStorage.getItem('accessToken')) {
      replace('/Manage');
    }
    if (location.pathname !== '/SignIn' && !sessionStorage.getItem('accessToken')) {
      replace('/SignIn');
    }
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    SignInRoute(store),
    ManageRoute(store),
    FindPwdRoute(store),
  ],
});
const createInput = (opts) => {
  switch (opts.type) {
    case 'captcha':
      return (
        <Captcha
          placeholder={opts.label}
          onClick={opts.onClick}
          icon={opts.icon}
        />
      );
    case 'text':
    case 'password':
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />
      );
    default:
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type="text" placeholder={opts.label} />
      );
  }
};
export const createFormItem = (opts) => {
  const rules = [];
  if (opts.require) {
    rules.push({ required: true, message: `请输入${opts.label}` });
  }
  if (opts.validator) {
    rules.push({ validator: opts.validator });
  }
  if (opts.max) {
    rules.push({ max: opts.max, message: `${opts.label}必须小于${opts.max}个字符` });
  }
  if (opts.min) {
    rules.push({ min: opts.min, message: `${opts.label}必须大于${opts.min}个字符` });
  }
  if (opts.pattern) {
    rules.push({ pattern: opts.pattern, message: opts.patternMsg });
  }
  if (opts.phone) {
    rules.push({ pattern: /^1[34578][0-9]{9}$/, message: '请输入正确的手机格式' });
  }
  return opts.getFieldDecorator(opts.name, {
    rules,
  })(createInput(opts));
};

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes;
