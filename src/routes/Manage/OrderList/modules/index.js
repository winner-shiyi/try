import { message } from 'antd';
import fetch from '../../../../../lib/fetch';
import { createAction, isResultSuccessful } from '../../../../util';

export const statusData = [
  { statusCode: '1', statusLabel: '待分配' },
  { statusCode: '2', statusLabel: '待取货' },
  { statusCode: '3', statusLabel: '配送中' },
  { statusCode: '4', statusLabel: '已完成' },
  { statusCode: '5', statusLabel: '已取消' },
];


// ------------------------------------
// Constants
// ------------------------------------

const DISTRIBUTION_REQUEST = 'DISTRIBUTION_REQUEST';
const DISTRIBUTION_SUCCESS = 'DISTRIBUTION_SUCCESS';
const DISTRIBUTION_FAILURE = 'DISTRIBUTION_FAILURE';
const DISTRIBUTION_CHANGE_SEARCH = 'DISTRIBUTION_CHANGE_SEARCH';
const DISTRIBUTION_SEARCH_RESET = 'DISTRIBUTION_SEARCH_RESET';
const DISTRIBUTION_SET_STATUS_REQUEST = 'DISTRIBUTION_SET_STATUS_REQUEST';
const DISTRIBUTION_SET_STATUS_SUCCESS = 'DISTRIBUTION_SET_STATUS_SUCCESS';
const DISTRIBUTION_SET_STATUS_FAILURE = 'DISTRIBUTION_SET_STATUS_FAILURE';
const DISTRIBUTION_ENTRY_SHOW = 'DISTRIBUTION_ENTRY_SHOW';
const DISTRIBUTION_ENTRY_CANCEL = 'DISTRIBUTION_ENTRY_CANCEL';
const DISTRIBUTION_DELETE_REQUEST = 'DISTRIBUTION_DELETE_REQUEST';
const DISTRIBUTION_DELETE_SUCCESS = 'DISTRIBUTION_DELETE_SUCCESS';
const DISTRIBUTION_DELETE_FAILURE = 'DISTRIBUTION_DELETE_FAILURE';
const DISTRIBUTION_CLEAR_DATA = 'DISTRIBUTION_CLEAR_DATA';

// ------------------------------------
// Actions
// ------------------------------------

const request = () => ({
  type: DISTRIBUTION_REQUEST,
});

const success = (data) => ({
  type: DISTRIBUTION_SUCCESS,
  payload: data,
});

const failure = (msg) => ({
  type: DISTRIBUTION_FAILURE,
  payload: msg,
});

const search = (params) => (dispatch) => { // 第一次进入页面
  dispatch(request());
  fetch('/order/list', params)
    .then((json) => {
      const {
        resultCode,
        resultData,
        resultDesc,
      } = json;
      if (isResultSuccessful(resultCode)) {
        dispatch(success(resultData));
      } else {
        dispatch(failure(resultDesc));
      }
    });
};

export const downExcel = () => {
  fetch('/order/downExcel')
    .then((json) => {
      const binaryData = [];
      binaryData.push(json);
      const downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/zip' }));
      // const downloadUrl = window.URL.createObjectURL(json)  // todo替换成这行
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = '车配导入订单模板.xlsx';
      document.body.appendChild(a);
      a.click();
    });
};

export const actions = {
  reset: createAction(DISTRIBUTION_SEARCH_RESET),
  changeSearch: createAction(DISTRIBUTION_CHANGE_SEARCH, 'fields'),
  search,
  setStatus: (params) => ({
    types: [DISTRIBUTION_SET_STATUS_REQUEST, DISTRIBUTION_SET_STATUS_SUCCESS, DISTRIBUTION_SET_STATUS_FAILURE],
    callAPI: () => fetch('/order/cancel', { // 订单编号
      orderNo: params.orderNo,
    }),
  }),
  showModal: createAction(DISTRIBUTION_ENTRY_SHOW),
  cancel: createAction(DISTRIBUTION_ENTRY_CANCEL),
  deleteOrder: (params) => ({
    types: [DISTRIBUTION_DELETE_REQUEST, DISTRIBUTION_DELETE_SUCCESS, DISTRIBUTION_DELETE_FAILURE],
    callAPI: () => fetch('/order/delete', { // 订单编号
      orderNo: params.orderNo,
    }),
  }),
  clearData: createAction(DISTRIBUTION_CLEAR_DATA),
  // downExcel,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISTRIBUTION_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [DISTRIBUTION_SUCCESS]: (state, action) => {
    const {
      list,
      pageNo,
      pageSize,
      total,
    } = action.payload;
    return {
      ...state,
      loading: false,
      data: list, // 没有使用callAPI方法，通过原始传入payload: data
      page: {
        ...state.page,
        pageNo,
        pageSize,
        total,
      },
    };
  },
  [DISTRIBUTION_FAILURE]: (state, action) => {
    message.error(action.payload); // 没有使用callAPI方法,因为原始传入的dispatch(failure(json.resultDesc))就是msg
    return {
      ...state,
      loading: false,
      data: [],
    };
  },
  [DISTRIBUTION_CHANGE_SEARCH]: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  [DISTRIBUTION_SET_STATUS_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [DISTRIBUTION_SET_STATUS_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [DISTRIBUTION_SET_STATUS_FAILURE]: (state, action) => {
    message.error(action.msg); // 这里调接口的时候使用了callAPI方法，可以在creatStore里面看到封装返回msg
    return {
      ...state,
      loading: false,
    };
  },
  [DISTRIBUTION_DELETE_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [DISTRIBUTION_DELETE_SUCCESS]: (state) => {
    message.success('删除成功');
    return {
      ...state,
      loading: false,
    };
  },
  [DISTRIBUTION_DELETE_FAILURE]: (state, action) => {
    message.error(action.msg); // 这里调接口的时候使用了callAPI方法，可以在creatStore里面看到封装返回msg
    return {
      ...state,
      loading: false,
    };
  },
  [DISTRIBUTION_SEARCH_RESET]: (state) => ({
    ...state,
    searchParams: {
      pageNo:'1',
      pageSize:'10',
    },
  }),
  [DISTRIBUTION_ENTRY_SHOW]: (state) => ({
    ...state,
    visible: true,
  }),
  [DISTRIBUTION_ENTRY_CANCEL]: (state) => ({
    ...state,
    visible: false,
  }),
  [DISTRIBUTION_CLEAR_DATA]: (state) => ({
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
  visible: false,
  loading: false,
  page: {
    pageNo: '1',
    pageSize: '10',
    total: '0',
  },
  searchParams: {
  },
};
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
