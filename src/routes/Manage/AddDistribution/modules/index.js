import { message } from 'antd';
import { createAction } from '../../../../util';
import fetch from '../../../../../lib/fetch';
import addr from '../../../../../public/mock/addr2.json';
import formatDate from '../../../../util/date';

// ------------------------------------
// Constants
// ------------------------------------
const ADDDISTRIBUTION_REQUEST = 'ADDDISTRIBUTION_REQUEST';
const ADDDISTRIBUTION_SUCCESS = 'ADDDISTRIBUTION_SUCCESS';
const ADDDISTRIBUTION_FAILURE = 'ADDDISTRIBUTION_FAILURE';
const ADDDISTRIBUTION_ADD_RECEIVER_INFO = 'ADDDISTRIBUTION_ADD_RECEIVER_INFO';
const ADDDISTRIBUTION_REDUCE_RECEIVER_INFO = 'ADDDISTRIBUTION_REDUCE_RECEIVER_INFO';
const ADDDISTRIBUTION_RECORD_CHANGE = 'ADDDISTRIBUTION_RECORD_CHANGE';
const ADDDISTRIBUTION_SUBMIT_REQUEST = 'ADDDISTRIBUTION_SUBMIT_REQUEST';
const ADDDISTRIBUTION_SUBMIT_SUCCESS = 'ADDDISTRIBUTION_SUBMIT_SUCCESS';
const ADDDISTRIBUTION_SUBMIT_FAILURE = 'ADDDISTRIBUTION_SUBMIT_FAILURE';
// 发货商家名称模糊搜索
const ADDDISTRIBUTION_SENDER_SEARCH_REQUEST = 'ADDDISTRIBUTION_SENDER_SEARCH_REQUEST';
const ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS = 'ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS';
const ADDDISTRIBUTION_SENDER_SEARCH_FAILURE = 'ADDDISTRIBUTION_SENDER_SEARCH_FAILURE';
// 收货商家名称模糊搜索
const ADDDISTRIBUTION_RECEIVER_SEARCH_REQUEST = 'ADDDISTRIBUTION_RECEIVER_SEARCH_REQUEST';
const ADDDISTRIBUTION_RECEIVER_SEARCH_SUCCESS = 'ADDDISTRIBUTION_RECEIVER_SEARCH_SUCCESS';
const ADDDISTRIBUTION_RECEIVER_SEARCH_FAILURE = 'ADDDISTRIBUTION_RECEIVER_SEARCH_FAILURE';
// 获取聚焦的收货信息表单id
const ADDDISTRIBUTION_RECEIVER_ACTIVE_ID = 'ADDDISTRIBUTION_RECEIVER_ACTIVE_ID';
// 清空数据
const ADDDISTRIBUTION_CLEAR_DATA = 'ADDDISTRIBUTION_CLEAR_DATA';
// 清空表单红色错误errors
const ADDDISTRIBUTION_CLEAR_ERRORS = 'ADDDISTRIBUTION_CLEAR_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------

const request = () => ({
  type: ADDDISTRIBUTION_REQUEST,
});
const success = (data) => ({
  type: ADDDISTRIBUTION_SUCCESS,
  payload: data,
});
const failure = (msg) => ({
  type: ADDDISTRIBUTION_FAILURE,
  payload: msg,
});

const editOredr = (id) => (dispatch) => {
  dispatch(request());
  return fetch('/order/infoDetail', { orederNo:id })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(success(json.resultData));
      } else {
        dispatch(failure(json.resultDesc));
      }
    });
};

const senderSearchRequest = (params) => ({
  type: 'ADDDISTRIBUTION_SENDER_SEARCH_REQUEST',
  payload: params,
});
const senderSearchSuccess = (data) => ({
  type: 'ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS',
  payload: data,
});
const senderSearchFailure = (msg) => ({
  type: 'ADDDISTRIBUTION_SENDER_SEARCH_FAILURE',
  payload: msg,
});
// 发货商家模糊搜索
const senderSearch = (params) => (dispatch) => {
  dispatch(senderSearchRequest(params));
  return fetch('/sender/fuzzyQuery', { shopName: params })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(senderSearchSuccess(json.resultData));
        return json.resultData.list;
      }
      dispatch(senderSearchFailure(json.resultDesc));
      return false;
    });
};

const receiverSearchRequest = (params) => ({
  type: 'ADDDISTRIBUTION_RECEIVER_SEARCH_REQUEST',
  payload: params,
});

const receiverSearchSuccess = (data) => ({
  type: 'ADDDISTRIBUTION_RECEIVER_SEARCH_SUCCESS',
  payload: data,
});

const receiverSearchFailure = (msg) => ({
  type: 'ADDDISTRIBUTION_RECEIVER_SEARCH_FAILURE',
  payload: msg,
});

// 收货商家模糊搜索
const receiverSearch = (params) => (dispatch) => {
  dispatch(receiverSearchRequest(params));
  return fetch('/sender/fuzzyQuery', { shopName: params })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(receiverSearchSuccess(json.resultData));
        return json.resultData.list;
      }
      dispatch(receiverSearchFailure(json.resultDesc));
      return false;
    });
};

export const actions = {
  addReceiverInfo: createAction(ADDDISTRIBUTION_ADD_RECEIVER_INFO),
  reduceReceiverInfo: createAction(ADDDISTRIBUTION_REDUCE_RECEIVER_INFO, 'id'),
  changeRecord: createAction(ADDDISTRIBUTION_RECORD_CHANGE, 'fields'),
  submit: (params) =>
    ({
      types: [ADDDISTRIBUTION_SUBMIT_REQUEST, ADDDISTRIBUTION_SUBMIT_SUCCESS, ADDDISTRIBUTION_SUBMIT_FAILURE],
      callAPI: () => fetch('/order/create', params),
    }),
  senderSearch,
  receiverSearch,
  editOredr,
  getActiveId: createAction(ADDDISTRIBUTION_RECEIVER_ACTIVE_ID, 'id'),
  clearErrors: createAction(ADDDISTRIBUTION_CLEAR_ERRORS),
  clearData: createAction(ADDDISTRIBUTION_CLEAR_DATA),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  /**
   * 编辑车配任务请求数据填充页面
   */
  [ADDDISTRIBUTION_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [ADDDISTRIBUTION_SUCCESS]: (state, action) => {
    const newState = Object.assign({}, state);
    const newRecord = Object.assign({}, newState.record);

    newRecord.shopName.value = action.payload.shopName;
    newRecord.userName.value = action.payload.userName;
    newRecord.phone.value = action.payload.phone;
    newRecord.region.value = [action.payload.province, action.payload.city, action.payload.area];
    newRecord.addressDetail.value = action.payload.addressDetail;
    if (!newRecord.drivingTime) {
      newRecord.drivingTime = {};
    }
    if (!action.payload.drivingTime) { // 非必填字段
      newRecord.drivingTime.value = '';
    } else {
      newRecord.drivingTime.value = formatDate(Number(action.payload.drivingTime), 'yyyy-MM-dd HH:mm');
    }

    // 初始化为空对象
    action.payload.receiversInfoList.forEach((item, index) => {
      [
        'region',
        'addressDetail',
        'phone',
        'shopName',
        'userName',
        'deliveryBeginTime',
        'deliveryEndTime',
      ].forEach((key) => {
        newRecord[`${key}-${index}-suffix`] = {};
      });
    });
    // 填充数据
    action.payload.receiversInfoList.forEach((item, index) => {
      [
        'region',
        'addressDetail',
        'phone',
        'shopName',
        'userName',
        'deliveryBeginTime',
        'deliveryEndTime',
      ].forEach((key) => {
        newRecord[`${key}-${index}-suffix`].value = item[`${key}`];
        if (key === 'deliveryBeginTime' || key === 'deliveryEndTime') {
          const dateValue = item[`${key}`] ? formatDate(Number(item.deliveryBeginTime), 'yyyy-MM-dd HH:mm') : '';
          newRecord[`${key}-${index}`].value = dateValue;
        }
      });
    });
    newState.record = newRecord;

    // const genUUID = (name, numId, suffix = 'suffix') => {
    //   return `${name}-${numId}-${suffix}`;
    // };
    // 点击【编辑】按钮填充数据
    const newReceiverFields = action.payload.receiversInfoList.map((item, index) => ({
      id: index.toString(),
      fields: [
        {
          label: '商家名称',
          name: initialUUID('shopName', index),
          required: true,
          max: 20,
        },
        {
          label: '联系人',
          name: initialUUID('userName', index),
          required: true,
          max: 20,
        },
        {
          label: '联系电话',
          name: initialUUID('phone', index),
          required: true,
          phone: true,
        },
        {
          label: '送达起始时间',
          name: initialUUID('deliveryBeginTime', index),
          required: false,
          type: 'datetime',
        },
        {
          label: '收货地区',
          required: true,
          name: initialUUID('region', index),
          type: 'Cascader',
          data: addr,
          changeOnSelect: 'true', // 每选择一项就会马上改变
        },
        {
          label: '送达结束时间',
          name: initialUUID('deliveryEndTime', index),
          required: false,
          type: 'datetime',
        },
        {
          label: '详细地址',
          name: initialUUID('addressDetail', index),
          required: true,
          type: 'textarea',
          max: 60,
        },
      ],
    }));

    newState.receiverFields = newReceiverFields;
    newState.receiverFormNo = action.payload.receiversInfoList.length - 1;
    newState.loading = false;
    newState.data = action.payload;
    return newState;
  },
  [ADDDISTRIBUTION_FAILURE]: (state, action) => {
    message.error(action.payload);
    return {
      ...state,
      loading: false,
      data: {},
    };
  },

  /**
   * 增加收货地址
   */
  [ADDDISTRIBUTION_ADD_RECEIVER_INFO]: (state) => {
    let numId = state.receiverFormNo;
    numId += 1;
    const receiverFields = state.receiverFields;
    const genUUID = (name, suffix = 'suffix') => {
      return `${name}-${numId}-${suffix}`;
    };
    receiverFields.push({
      id: numId,
      fields: [
        {
          label: '商家名称',
          name: genUUID('shopName'),
          required: true,
          max: 20,
        },
        {
          label: '联系人',
          name: genUUID('userName'),
          required: true,
          max: 20,
        },
        {
          label: '联系电话',
          name: genUUID('phone'),
          required: true,
          phone: true,
        },
        {
          label: '送达起始时间',
          name: genUUID('deliveryBeginTime'),
          required: false,
          type: 'datetime',
        },
        {
          label: '收货地区',
          required: true,
          name: genUUID('region'),
          type: 'Cascader',
          data: addr,
          changeOnSelect: 'true', // 每选择一项就会马上改变
        },
        {
          label: '送达结束时间',
          name: genUUID('deliveryEndTime'),
          required: false,
          type: 'datetime',
        },
        {
          label: '详细地址',
          name: genUUID('addressDetail'),
          required: true,
          type: 'textarea',
          max: 60,
        },
      ],
    });
    const record = state.record;

    [
      'region',
      'addressDetail',
      'shopName',
      'userName',
      'phone',
    ].forEach((name) => {
      const uuid = genUUID(name);
      record[uuid] = { value: '' };
      if (name === 'region') {
        record[uuid] = {
          value: ['浙江省', '杭州市', '江干区'],
        };
      }
    });

    const newState = {
      ...state,
      receiverFormNo:numId,
      receiverFields,
      record,
    };
    return newState;
  },
  /**
   * 删除收货地址
   */
  [ADDDISTRIBUTION_REDUCE_RECEIVER_INFO]: (state, action) => {
    const newState = Object.assign({}, state);
    const newReceiverFields = [...newState.receiverFields];
    const index = newReceiverFields.findIndex((item) => item.id === action.id);
    const { id } = action;
    newReceiverFields.splice(index, 1);
    newState.receiverFields = newReceiverFields;

    [
      'region',
      'addressDetail',
      'shopName',
      'userName',
      'phone',
      'deliveryBeginTime',
      'deliveryEndTime',
    ].forEach((prefix) => {
      delete newState.record[`${prefix}-${id}-suffix`];
    });
    delete newState.newReceiverInfos[`${id}`];
    return { ...newState };
  },
  /**
   * 发货商家名称模糊搜索
   */
  [ADDDISTRIBUTION_SENDER_SEARCH_REQUEST]: (state) => ({
    ...state,
  }),
  [ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS]: (state, action) => {
    // message.success('搜索成功')
    const newState = Object.assign({}, state);
    newState.newSenderInfos = action.payload.list;
    return newState;
  },
  [ADDDISTRIBUTION_SENDER_SEARCH_FAILURE]: (state, action) => {
    message.error(action.payload); // 没有使用callAPI封装的action时候，根据action.payload对应获取
    return {
      ...state,
    };
  },
  /**
   * 收货商家名称模糊搜索
   */
  [ADDDISTRIBUTION_RECEIVER_SEARCH_REQUEST]: (state) => ({
    ...state,
  }),
  [ADDDISTRIBUTION_RECEIVER_SEARCH_SUCCESS]: (state, action) => {
    // message.success('搜索成功')
    const newState = Object.assign({}, state);
    const activeId = newState.activeReceiverId;
    newState.newReceiverInfos[activeId] = action.payload.list;
    return newState;
  },
  [ADDDISTRIBUTION_RECEIVER_SEARCH_FAILURE]: (state, action) => {
    message.error(action.payload); // 没有使用callAPI封装的action时候，根据action.payload对应获取
    return {
      ...state,
    };
  },
  /**
   * 获取收货信息中聚焦的当前表单id
   */
  [ADDDISTRIBUTION_RECEIVER_ACTIVE_ID]: (state, action) => ({
    ...state,
    activeReceiverId: action.id, // 当id为-1的时候表示：聚焦的是发货商家表单
  }),
  /**
   * 清空表单中的红色errors
   */
  [ADDDISTRIBUTION_CLEAR_ERRORS]: (state) => {
    const newState = Object.assign({}, state);
    const activeId = newState.activeReceiverId;
    const isSenderForm = Number(activeId) < 0;
    const suffix = 'suffix';
    const rawIds = [
      'userName',
      'phone',
      'region',
      'addressDetail',
    ];
    let uuids = [];

    if (isSenderForm) {
      uuids = rawIds;
    } else {
      uuids = rawIds.map((rawId) => {
        return `${rawId}-${activeId}-${suffix}`;
      });
    }
    uuids.forEach((uuid) => {
      newState.record[uuid].errors = false;
    });
    return newState;
  },
  /**
   * 提交车配任务表单
   */
  [ADDDISTRIBUTION_SUBMIT_REQUEST]: (state) => ({
    ...state,
  }),
  [ADDDISTRIBUTION_SUBMIT_SUCCESS]: (state) => {
    message.success('提交成功');
    return {
      ...state,
    };
  },
  [ADDDISTRIBUTION_SUBMIT_FAILURE]: (state, action) => {
    message.error(action.msg); // 使用callAPI封装的action时候直接action.msg就可得到错误信息
    return {
      ...state,
    };
  },

  /**
   * 表单数据改变更新
   */
  [ADDDISTRIBUTION_RECORD_CHANGE]: (state, action) => {
    const newState = {
      ...state,
      record: {
        ...state.record,
        ...action.fields,
      },
    };
    return newState;
  },

  /**
   * 清空数据，回到初始界面
   */
  [ADDDISTRIBUTION_CLEAR_DATA]: (state) => ({
    ...state,
    receiverFormNo: 0,
    // 保存填写的表单数据 就是 后面组件中的values
    record: {
      ...makeValuesInfo([]),
      ...makeValuesInfo([], 0),
    },
    newSenderInfos:[],
    receiverFields: [
      {
        id:'0',
        fields:[
          {
            label: '商家名称',
            name: initialUUID('shopName', 0),
            required: true,
            max: 20,
          },
          {
            label: '联系人',
            name: initialUUID('userName', 0),
            required: true,
            max: 20,
          },
          {
            label: '联系电话',
            name: initialUUID('phone', 0),
            required: true,
            phone: true,
          },
          {
            label: '送达起始时间',
            name: initialUUID('deliveryBeginTime', 0),
            required: false,
            type: 'datetime',
          },
          {
            label: '收货地区',
            required: true,
            name: initialUUID('region', 0),
            type: 'Cascader',
            data: addr,
            changeOnSelect: 'true',
          },
          {
            label: '送达结束时间',
            name: initialUUID('deliveryEndTime', 0),
            required: false,
            type: 'datetime',
          },
          {
            label: '详细地址',
            name: initialUUID('addressDetail', 0),
            required: true,
            type: 'textarea',
            max: 60,
          },
        ],
      },
    ],
    newReceiverInfos: {}, 
    searchParams: {},
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  receiverFormNo: 0,
  receiverFields: [
    {
      id:'0',
      fields:[
        {
          label: '商家名称',
          name: initialUUID('shopName', 0),
          required: true,
          max: 20,
        },
        {
          label: '联系人',
          name: initialUUID('userName', 0),
          required: true,
          max: 20,
        },
        {
          label: '联系电话',
          name: initialUUID('phone', 0),
          required: true,
          phone: true,
        },
        {
          label: '送达起始时间',
          name: initialUUID('deliveryBeginTime', 0),
          required: false,
          type: 'datetime',
        },
        {
          label: '收货地区',
          required: true,
          name: initialUUID('region', 0),
          type: 'Cascader',
          data: addr,
          changeOnSelect: 'true',
        },
        {
          label: '送达结束时间',
          name: initialUUID('deliveryEndTime', 0),
          required: false,
          type: 'datetime',
        },
        {
          label: '详细地址',
          name: initialUUID('addressDetail', 0),
          required: true,
          type: 'textarea',
          max: 60,
        },
      ],
    },
  ],
  // 保存填写的表单数据 就是 后面组件中的values
  record: {
    ...makeValuesInfo([]), // 存放发货表单
    ...makeValuesInfo([], 0), // 存放收货表单
  },
  newSenderInfos: [], // 保存发货商家名称模糊搜索自动填充数据
  newReceiverInfos: {}, // 保存收货商家名称模糊搜索自动填充数据
  searchParams: {},
};

function initialUUID (name, numId, suffix = 'suffix') {
  return `${name}-${numId}-${suffix}`;
}

function makeValuesInfo (extendProps = [], seq = -1) {
  const props = Object.assign([
    'region',
    'addressDetail',
    'shopName',
    'userName',
    'phone',
  ], extendProps);

  const genUUID = (prop) => {
    return seq > -1 ? `${prop}-${seq}-suffix` : prop;
  };
  
  const obj = {};
  props.forEach((prop) => {
    const propId = genUUID(prop);
    obj[propId] = { value: '' };

    if (prop === 'region') {
      obj[propId] = ['浙江省', '杭州市', '江干区'];
    }
  });

  return obj;
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
