import { injectReducer } from '../../../store/reducers';
import { common } from '../../../store/common';
import { actions } from './modules';

export const moduleName = 'AddDistribution';

export default (store) => ({
  path : `${moduleName}(/:id)`,
  // onEnter: ({ location, routes, params }, replace, next) => {
  onEnter: ({ params }, replace, next) => {
    store.dispatch(common.initialMenu());
    if (!params.id) {
      store.dispatch(actions.clearData()); // 路由从编辑任务切换到新建任务的时候要清空数据
    } else {
      store.dispatch(actions.editOredr(params.id));
    }
    next();
  },
  onLeave: () => {
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const propertyContainer = require('./containers').default;
      const reducer = require('./modules').default;

      injectReducer(store, { key: moduleName, reducer });

      cb(null, propertyContainer);
    });
  },
});
