import { injectReducer } from '../../../store/reducers';
import { common } from '../../../store/common';

export const moduleName = 'ChooseDriver';

export default (store) => ({
  path : `${moduleName}(/:id)`,
  onEnter: (opts, replace, next) => {
    store.dispatch(common.initialMenu());
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
