// We only need to import the modules necessary for initial render
import Home from './Home';
import SignInRoute from './SignIn';
import FindPwdRoute from './FindPwd';
import ManageRoute from './Manage';
/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */
const createRoutes = (store) => ({
  path        : '/',
  component   : null,
  indexRoute  : Home,
  onEnter: ({ location }, replace, next) => {
    // 初始化的appKey和url在src/config.json中的countly处可找到

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
