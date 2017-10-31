// We only need to import the modules necessary for initial render
import { injectReducer } from '../../store/reducers';
import CoreLayout from '../../layouts/CoreLayout';
import { common } from '../../store/common';
import Home from '../Home';

import Distribution from './Distribution';
import AddDistribution from './AddDistribution';
import DistributionDetail from './DistributionDetail';
import ChooseDriver from './ChooseDriver';
import ReceiverList from './ReceiverList';
import Addreceiver from './Addreceiver';
import OrderList from './OrderList';

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
    Distribution(store), // 配载单管理列表页
    AddDistribution(store), // 新增配载单
    DistributionDetail(store), // 配载单明细
    ChooseDriver(store), // 选择司机
    ReceiverList(store), // 收货商家管理列表页
    Addreceiver(store), // 新增收货商家
    OrderList(store), // 订单管理列表页
  ],
});

export function createChildRoutes(moduleName, id) {
  let path = moduleName;
  if (id) {
    path = `${moduleName}(/:id)`;
  }
  return (store) => ({
    path,
    onEnter: (opts, replace, next) => {
      store.dispatch(common.initMenu());
      next();
    },
    onLeave: () => {
    },
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        /* eslint-disable import/no-dynamic-require */
        const container = require(`./${moduleName}/containers/index`).default;
        const reducer = require(`./${moduleName}/modules/index`).default;
        injectReducer(store, { key: moduleName, reducer });
        cb(null, container);
      });
    },
  });
}

export default createRoutes;
