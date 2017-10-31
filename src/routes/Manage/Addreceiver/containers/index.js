import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';

import View from '../components';

const mapDispatchToProps = {
  ...actions,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    permission: state.common.permission[state.common.selectedKeys[0]] || {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
