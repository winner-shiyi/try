import { message } from 'antd';
import fetch from '../../../../../lib/fetch';
import formatDate from '../../../../util/formatDate';

// ------------------------------------
// Constants
// ------------------------------------
const DISTRIBUTION_ORDER_DETAIL_REQUEST = 'DISTRIBUTION_ORDER_DETAIL_REQUEST';
const DISTRIBUTION_ORDER_DETAIL_SUCCESS = 'DISTRIBUTION_ORDER_DETAIL_SUCCESS';
const EDISTRIBUTION_ORDER_DETAIL_FAILURE = 'EDISTRIBUTION_ORDER_DETAIL_FAILURE';
const SEAECH_DRIVER_REQUEST = 'SEAECH_DRIVER_REQUES';
const SEAECH_DRIVER_SUCCESS = 'SEAECH_DRIVER_SUCCESS';
const SEAECH_DRIVER_FAILURE = 'SEAECH_DRIVER_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  Detail: (params) => ({
    types: [DISTRIBUTION_ORDER_DETAIL_REQUEST, DISTRIBUTION_ORDER_DETAIL_SUCCESS, EDISTRIBUTION_ORDER_DETAIL_FAILURE],
    callAPI:() => fetch('/order/detail', params, {
      method: 'POST',
    }),
  }),
  searchDriver:(params) => ({
    types: [SEAECH_DRIVER_REQUEST, SEAECH_DRIVER_SUCCESS, SEAECH_DRIVER_FAILURE],
    callAPI:() => fetch('/order/cardInfo', params, {
      method: 'POST',
    }),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISTRIBUTION_ORDER_DETAIL_REQUEST]: (state) => ({
    ...state,
  }),
  [DISTRIBUTION_ORDER_DETAIL_SUCCESS]: (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    let orderStatus = data.orderStatus;
    const dictionary = {
      0:'初始',
      1:'待分配',
      2:'待取货',
      3:'配送中',
      4:'已完成',
      5:'已取消',
    };
    orderStatus = dictionary[orderStatus];
    newState.data = Object.assign(newState.data, data);
    newState.data = Object.assign({}, newState.data, {
      orderStatus:data.orderStatus || '-',
      address:data.senderInfo.address || '-',
      shopName:data.senderInfo.shopName || '-',
      phone:data.senderInfo.phone || '-',
      dispatchTime:data.dispatchOrderTime ? formatDate(data.dispatchOrderTime, 'yyyy-MM-dd HH:mm:ss') : '-',
      orderTime:data.orderTime ? formatDate(data.orderTime, 'yyyy-MM-dd HH:mm:ss') : '-',
    });

    return {
      ...newState,
      orderStatus,
    };
  },
  [EDISTRIBUTION_ORDER_DETAIL_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [SEAECH_DRIVER_REQUEST]: (state) => ({
    ...state,
  }),
  [SEAECH_DRIVER_SUCCESS]: (state, action) => {
    const { data } = action;
    const newState = Object.assign({}, state);
    const dictionary = {
      0:'面包',
      1:'平板',
      2:'高栏',
      3:'厢式',
      4:'冷链',
    };
    newState.data = Object.assign({}, newState.data, data);
    newState.data = Object.assign({}, newState.data, {
      carType:dictionary[data.carType],
    });
    return {
      ...newState,
    };
  },
  [SEAECH_DRIVER_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  note: '',
  orderNo: '',
  orderStatus:1,
  dispatchTime: '',
  orderTime: '',
  waybillStatus: '',
  data:{
    receiversInfoList:[],
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
