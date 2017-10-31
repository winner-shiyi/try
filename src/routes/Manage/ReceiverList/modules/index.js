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

const RECEIVERLIST_REQUEST = 'RECEIVERLIST_REQUEST';
const RECEIVERLIST_SUCCESS = 'RECEIVERLIST_SUCCESS';
const RECEIVERLIST_FAILURE = 'RECEIVERLIST_FAILURE';

const RECEIVERLIST_CHANGE_SEARCH = 'RECEIVERLIST_CHANGE_SEARCH';
const RECEIVERLIST_SEARCH_RESET = 'RECEIVERLIST_SEARCH_RESET';

const RECEIVERLIST_SET_STATUS_REQUEST = 'RECEIVERLIST_SET_STATUS_REQUEST';
const RECEIVERLIST_SET_STATUS_SUCCESS = 'RECEIVERLIST_SET_STATUS_SUCCESS';
const RECEIVERLIST_SET_STATUS_FAILURE = 'RECEIVERLIST_SET_STATUS_FAILURE';

const RECEIVERLIST_MODEL_SHOW = 'RECEIVERLIST_MODEL_SHOW';
const RECEIVERLIST_MODEL_CANCEL = 'RECEIVERLIST_MODEL_CANCEL';

const RECEIVERLIST_DELETE_REQUEST = 'RECEIVERLIST_DELETE_REQUEST';
const RECEIVERLIST_DELETE_SUCCESS = 'RECEIVERLIST_DELETE_SUCCESS';
const RECEIVERLIST_DELETE_FAILURE = 'RECEIVERLIST_DELETE_FAILURE';

const RECEIVERLIST_CLEAR_DATA = 'RECEIVERLIST_CLEAR_DATA';

// ------------------------------------
// Actions
// ------------------------------------

const request = () => ({
  type: RECEIVERLIST_REQUEST,
});

const success = (data) => ({
  type: RECEIVERLIST_SUCCESS,
  payload: data,
});

const failure = (msg) => ({
  type: RECEIVERLIST_FAILURE,
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
  reset: createAction(RECEIVERLIST_SEARCH_RESET),
  changeSearch: createAction(RECEIVERLIST_CHANGE_SEARCH, 'fields'),
  search,
  setStatus: (params) => ({
    types: [RECEIVERLIST_SET_STATUS_REQUEST, RECEIVERLIST_SET_STATUS_SUCCESS, RECEIVERLIST_SET_STATUS_FAILURE],
    callAPI: () => fetch('/order/cancel', { // 订单编号
      orderNo: params.orderNo,
    }),
  }),
  showModal: createAction(RECEIVERLIST_MODEL_SHOW),
  cancel: createAction(RECEIVERLIST_MODEL_CANCEL),
  deleteOrder: (params) => ({
    types: [RECEIVERLIST_DELETE_REQUEST, RECEIVERLIST_DELETE_SUCCESS, RECEIVERLIST_DELETE_FAILURE],
    callAPI: () => fetch('/order/delete', { // 订单编号
      orderNo: params.orderNo,
    }),
  }),
  clearData: createAction(RECEIVERLIST_CLEAR_DATA),
  // downExcel,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVERLIST_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [RECEIVERLIST_SUCCESS]: (state, action) => {
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
  [RECEIVERLIST_FAILURE]: (state, action) => {
    message.error(action.payload); // 没有使用callAPI方法,因为原始传入的dispatch(failure(json.resultDesc))就是msg
    return {
      ...state,
      loading: false,
      data: [],
    };
  },
  [RECEIVERLIST_CHANGE_SEARCH]: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  [RECEIVERLIST_SET_STATUS_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [RECEIVERLIST_SET_STATUS_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [RECEIVERLIST_SET_STATUS_FAILURE]: (state, action) => {
    message.error(action.msg); // 这里调接口的时候使用了callAPI方法，可以在creatStore里面看到封装返回msg
    return {
      ...state,
      loading: false,
    };
  },
  [RECEIVERLIST_DELETE_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [RECEIVERLIST_DELETE_SUCCESS]: (state) => {
    message.success('删除成功');
    return {
      ...state,
      loading: false,
    };
  },
  [RECEIVERLIST_DELETE_FAILURE]: (state, action) => {
    message.error(action.msg); // 这里调接口的时候使用了callAPI方法，可以在creatStore里面看到封装返回msg
    return {
      ...state,
      loading: false,
    };
  },
  [RECEIVERLIST_SEARCH_RESET]: (state) => ({
    ...state,
    searchParams: {
      pageNo:'1',
      pageSize:'10',
    },
  }),
  [RECEIVERLIST_MODEL_SHOW]: (state) => ({
    ...state,
    modalVisible: true,
  }),
  [RECEIVERLIST_MODEL_CANCEL]: (state) => ({
    ...state,
    modalVisible: false,
  }),
  [RECEIVERLIST_CLEAR_DATA]: (state) => ({
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
  modalVisible: false,
  rowKey: 'id',
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
