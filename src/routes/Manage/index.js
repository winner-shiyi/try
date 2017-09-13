// We only need to import the modules necessary for initial render
import CoreLayout from '../../layouts/CoreLayout';
import Home from '../Home';
import Distribution from './Distribution';
import AddDistribution from './AddDistribution';
import DistributionDetail from './DistributionDetail';
import ChooseDriver from './ChooseDriver';


/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/Manage',
  component   : CoreLayout,
  indexRoute  : Home,
  onEnter: (opts, replace, next) => {
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    Distribution(store), // 车配任务管理
    AddDistribution(store), // 新增车配任务
    DistributionDetail(store), // 车配任务明细
    ChooseDriver(store), // 选择司机
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
