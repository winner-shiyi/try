import { message } from 'antd';
import { createAction } from '../../../../util';
import fetch from '../../../../../lib/fetch';


// ------------------------------------
// Constants
// ------------------------------------
const CHOOSE_DRIVER_CARSEARCH_REQUEST = 'CHOOSE_DRIVER_CARSEARCH_REQUEST';
const CHOOSE_DRIVER_CARSEARCH_SUCCESS = 'CHOOSE_DRIVER_CARSEARCH_SUCCESS';
const CHOOSE_DRIVER_CARSEARCH_FAILURE = 'CHOOSE_DRIVER_CARSEARCH_FAILURE';

const CHOOSE_DRIVER_SEARCH_REQUEST = 'CHOOSE_DRIVER_SEARCH_REQUEST';
const CHOOSE_DRIVER_SEARCH_SUCCESS = 'CHOOSE_DRIVER_SEARCH_SUCCESS';
const CHOOSE_DRIVER_SEARCH_FAILURE = 'CHOOSE_DRIVER_SEARCH_FAILURE';

const CHOOSE_DRIVER_DISPATCHORDER_REQUEST = 'CHOOSE_DRIVER_DISPATCHORDER_REQUEST';
const CHOOSE_DRIVER_DISPATCHORDER_SUCCESS = 'CHOOSE_DRIVER_DISPATCHORDER_SUCCESS';
const CHOOSE_DRIVER_DISPATCHORDER_FAILURE = 'CHOOSE_DRIVER_DISPATCHORDER_FAILURE';

const CHOOSE_DRIVER_MOCK_RADIO = 'CHOOSE_DRIVER_MOCK_RADIO';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  mockRadio: createAction(CHOOSE_DRIVER_MOCK_RADIO, 'driverId'),
  searchCar: (params) => ({
    types: [CHOOSE_DRIVER_CARSEARCH_REQUEST, CHOOSE_DRIVER_CARSEARCH_SUCCESS, CHOOSE_DRIVER_CARSEARCH_FAILURE],
    callAPI: () => fetch(`//${location.host}/mock/SearchCar.json`, params, {
      method: 'GET',
    }),
  }),
  searchDriver: (params) => ({
    types: [CHOOSE_DRIVER_SEARCH_REQUEST, CHOOSE_DRIVER_SEARCH_SUCCESS, CHOOSE_DRIVER_SEARCH_FAILURE],
    callAPI: () => fetch('/order/driver/list', params, {
      method:'POST',
    }),
  }),
  dispatchOrder: (params) => ({
    types: [CHOOSE_DRIVER_DISPATCHORDER_REQUEST, CHOOSE_DRIVER_DISPATCHORDER_SUCCESS, 
      CHOOSE_DRIVER_DISPATCHORDER_FAILURE],
    callAPI: () => fetch('/order/dispatch', params, {
      method:'POST',
    }),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CHOOSE_DRIVER_CARSEARCH_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [CHOOSE_DRIVER_CARSEARCH_SUCCESS] : (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    const carClassesData = data;
    return {
      carClassesData,
      ...newState,
    };
  },
  [CHOOSE_DRIVER_CARSEARCH_FAILURE] : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    };
  },
  [CHOOSE_DRIVER_SEARCH_REQUEST]: (state) => ({
    ...state,
  }),
  [CHOOSE_DRIVER_SEARCH_SUCCESS] : (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    const driverList = data.list;
    const dictionary = {
      0:'面包',
      1:'平板',
      2:'高栏',
      3:'厢式',
      4:'冷链',
    };
    const isCanChoose = [];
    if (driverList && driverList !== 0) {
      driverList.map((itemTemp, index) => {
        const item = itemTemp;
        item.key = index;
        item.id = index;
        item.lock = true; // 给每个list增加一个变量锁
        // if(item.driverWorkStatus==0){
        //   isCanChoose.push(1);
        //   item.driverWorkStatus = '配送中';
        // }else if(item.driverWorkStatus==1){
        //   isCanChoose.push(1);
        //   item.driverWorkStatus = '已完成';
        // }
        isCanChoose.push(1);
        item.carType = dictionary[item.carType];
        return false;
      });
    }

    newState.data.driverList = driverList;
    newState.data = Object.assign({}, newState.data, data);

    return {
      ...newState,
      isCanChoose,
      loading: false,
      page: {
        ...state.page,
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        count: data.total,
      },
    };
  },
  [CHOOSE_DRIVER_MOCK_RADIO] : (state, action) => {
    const newState = Object.assign({}, state);
    const driverList = newState.data.list;
    if (driverList.length !== 0) {
      driverList.map((item) => {
        if (item.driverId === action.driverId) {
          // item.lock = !item.lock;  // todo
        }
        return false;
      });
    }
    newState.data.driverList = driverList;
    return {
      ...state,
      data: newState.data,
    };
  },
  [CHOOSE_DRIVER_SEARCH_FAILURE] : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [CHOOSE_DRIVER_DISPATCHORDER_REQUEST]: (state) => ({
    ...state,
  }),
  [CHOOSE_DRIVER_DISPATCHORDER_SUCCESS] : (state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    newState.data = Object.assign({}, newState.data, data);
    const paths = '/Manage/Distribution';
    return {
      ...newState,
      paths,
      loading: false,
    };
  },
  [CHOOSE_DRIVER_DISPATCHORDER_FAILURE] : (state, action) => {
    if (action.msg === 'driverId不能为空') {
      message.error('请选择司机');
    } else {
      message.error(action.msg);
    }
    const paths = false;
    return {
      ...state,
      paths,
    };
  },

};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  noteStatusData: [],
  exportStatusData: [],
  data: {
    driverList:[],
  },
  driverStatus:[
    ['0', '配送中'],
    ['1', '已完成'],
  ],
  page: {
    current: 1,
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  searchParams: {
    pageNo: 1,
    pageSize: 10,
    driverName:'',
    carType:'',
    carNumber:'',
  },
};

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

