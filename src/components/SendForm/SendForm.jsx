import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { createFormItem } from '../../components';
import fields from './fields'; // 新建车配任务表单字段

import './SendForm.scss';

export default class SendForm extends Component {
  static propTypes = {
    newSenderInfos: PropTypes.array,
    values: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.timer = null;
    this.timer1 = null;
  }

  componentDidMount() {
    const map1 = new window.AMap.Map('mapContainessrSender', {
      resizeEnable: true,
    });
    window.AMap.service(['AMap.PlaceSearch'], () => {
      this.placeSearch = new window.AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map: map1,
      });
    });
    // this.props.route.onEnter = () => {
    // 保证路由切换后高德定位正确，不能componentDidMount里面写route的onEnter
    this.mapChange();
    // }
  }
  /**
   * 监听发货商家名称输入值变化
   * 参数：val 表示用户输入的商家名称
   */
  onShopNameChange = (val) => { // 使用箭头函数,让this指向sendForm组件,否则这个this指向的是fields[0]
    clearTimeout(this.timer);
    // 如果商家名称为空则不发送请求，并清空原有填充值
    if (!(`${val}`).trim()) {
      return;
    }

    this.timer = setTimeout(() => {
      this.props.senderSearch(val).then((items) => {
        this.setState({
          dataSource: items && items.map((item) => item.shopName), // 需要判断，否则请求接口失败的时候 没有map方法
        });
      });
    }, 400);
  }

  onSelect = (val) => {
    const {
      newSenderInfos, // redux中保存的 模糊搜索接口返回的发货信息数组
      values,
    } = this.props;

    const shopName = val;
    let shopItem = newSenderInfos.find((item) => item.shopName === shopName);

    shopItem = shopItem || {};

    values.userName.value = shopItem.userName;
    values.phone.value = shopItem.phone;
    values.region.value = [shopItem.province, shopItem.city, shopItem.area];
    values.addressDetail.value = shopItem.addressDetail;
    this.props.clearErrors();
    this.props.changeRecord(values);
    this.mapChange();
  }

  onFocus = () => {
    this.props.getActiveId('-1');
  }

  /**
   * 地区改变时
   */
  onRegionChange = () => {
    this.mapChange();
  }
  /**
   * 详细地址改变时
   */
  onAddressDetailChange = () => {
    this.mapChange();
  }
  /**
   * val1Arr拼接val2作为值传给高得地图api的公共函数
   */
  mapChange = () => {
    clearTimeout(this.timer1);
    this.timer1 = setTimeout(() => { // 使用setTimeout才能实时拿到最新的val1Arr和val2
      const val1Arr = this.props.values.region.value;
      const val2 = this.props.values.addressDetail.value;
      this.placeSearch.search(val1Arr.join(',') + val2, (status, result) => {
        if (result.info === 'OK' && result.poiList) {
          const pois = result.poiList.pois[0];
          window.mapInfosToWindow = {
            adcode: pois.adcode,
            latitude: pois.location.lat,
            longitude: pois.location.lng,
          };
        }
        if (status === 'no_data') {
          window.mapInfosToWindow = {};
          // message.error('请输入有正确的发货地址')
        }
      });
    }, 400);
  }

  render() {
    // 下面是绑定发货商家名称这个表单的onChange、onSelect事件、配置dataSource
    fields[0].onChange = this.onShopNameChange;
    fields[0].onSelect = this.onSelect;
    fields[0].dataSource = this.state.dataSource;
    fields[0].onFocus = this.onFocus;
    fields[4].onChange = this.onRegionChange;
    fields[5].onChange = this.onAddressDetailChange;
    return (
      <div className="senderForm-box">
        <Row>
          {
            fields.map((item) => (
              createFormItem({
                field: item,
                form: this.props.form,
                formItemLayout: {
                  labelCol: { span:4 },
                  wrapperCol: { span: 18 },
                },
                inputOpts: {},
                colSpan: 12,
              })
            ))
          }
        </Row>
        <Row>
          <Col><div id="mapContainessrSender" className="mapContainessr" /></Col>
        </Row>
      </div>
    );
  }
}
