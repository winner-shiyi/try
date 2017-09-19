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

const CHOOSE_DRIVER_CHANGE_SEARCH = 'CHOOSE_DRIVER_CHANGE_SEARCH';

const CHOOSE_DRIVER_CLEAR_DATA = 'CHOOSE_DRIVER_CLEAR_DATA';

const CHOOSE_DRIVER_SEARCH_RESET = 'CHOOSE_DRIVER_SEARCH_RESET';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  reset: createAction(CHOOSE_DRIVER_SEARCH_RESET),
  changeSearch: createAction(CHOOSE_DRIVER_CHANGE_SEARCH, 'fields'),
  searchCar: (params) => ({
    types: [CHOOSE_DRIVER_CARSEARCH_REQUEST,
      CHOOSE_DRIVER_CARSEARCH_SUCCESS,
      CHOOSE_DRIVER_CARSEARCH_FAILURE],
    callAPI: () => fetch(`//${location.host}/mock/SearchCar.json`, params, {
      method: 'GET',
    }),
  }),
  searchDriver: (params) => ({
    types: [CHOOSE_DRIVER_SEARCH_REQUEST,
      CHOOSE_DRIVER_SEARCH_SUCCESS,
      CHOOSE_DRIVER_SEARCH_FAILURE],
    callAPI: () => fetch('/order/driver/list', params, {
      method:'POST',
    }),
  }),
  dispatchOrder: (params) => ({
    types: [CHOOSE_DRIVER_DISPATCHORDER_REQUEST,
      CHOOSE_DRIVER_DISPATCHORDER_SUCCESS,
      CHOOSE_DRIVER_DISPATCHORDER_FAILURE],
    callAPI: () => fetch('/order/dispatch', params, {
      method:'POST',
    }),
  }),
  clearData: createAction(CHOOSE_DRIVER_CLEAR_DATA),
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
  // 一进入页面初始化司机列表数据
  [CHOOSE_DRIVER_SEARCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
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
    if (driverList && driverList.length !== 0) {
      driverList.map((itemTemp, index) => {
        const item = itemTemp;
        item.key = index;
        item.id = index;
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
  [CHOOSE_DRIVER_SEARCH_FAILURE] : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
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
  [CHOOSE_DRIVER_SEARCH_RESET]: (state) => ({
    ...state,
    searchParams: {
      pageNo:'1',
      pageSize:'10',
    },
  }),
  [CHOOSE_DRIVER_CHANGE_SEARCH]: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  [CHOOSE_DRIVER_CLEAR_DATA]: (state) => ({
    ...state,
    searchParams: {
      pageNo:'1',
      pageSize:'10',
    },
    page: {
      pageNo: 1, // 控制台警告提示期望是number
      pageSize: 10,
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  // noteStatusData: [],
  // exportStatusData: [],
  data: {
    driverList:[],
  },
  // driverStatus:[
  //   ['0', '配送中'],
  //   ['1', '已完成'],
  // ],
  page: {
    pageNo: '1',
    pageSize: '10',
    count: '0',
  },
  searchParams: {
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

