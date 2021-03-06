import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';
import { createFormItem } from '../../components';
import './ReceiverForm.scss';

export default class ReceiverForm extends Component {
  static propTypes = {
    fields: PropTypes.array,
    values: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      startValue: null,
      endValue: null,
      endOpen: false,
    };
    this.AmapId = `mapId${Math.random()}`;
    this.timer1 = null;
  }
  componentDidMount() {
    const map = new window.AMap.Map(this.AmapId, {
      resizeEnable: true,
    });
    window.AMap.service(['AMap.PlaceSearch'], () => {
      this.placeSearch = new window.AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map,
      });
      // 关键字查询
      this.placeSearch.search('');
    });
    this.mapChange();
  }
  /**
   * 监听收货商家名称输入值变化
   * 参数：val 表示用户输入的商家名称
   */
  onShopNameChange = (val) => { // 使用箭头函数,让this指向sendForm组件,否则这个this指向的是fields[0]
    clearTimeout(this.timer);
    // 如果商家名称为空则不发送请求，并清空原有填充值
    if (!val || !(`${val}`).trim()) {
      return;
    }

    this.timer = setTimeout(() => {
      this.props.receiverSearch(val).then((items) => {
        this.setState({
          dataSource: items && items.map((item) => item.shopName), // 需要判断，否则请求接口失败的时候 没有map方法
        });
      });
    }, 400);
  }

  onSelect = (val) => {
    const {
      newReceiverInfos, // redux中保存的 模糊搜索接口返回的发货信息数组
      values,
    } = this.props;

    const shopName = val;
    const _id = this.props.id;
    let shopItem = newReceiverInfos[_id].find((item) => item.shopName === shopName);

    shopItem = shopItem || {};
    const suffix = 'suffix';

    values[`userName-${_id}-${suffix}`].value = shopItem.userName;
    values[`phone-${_id}-${suffix}`].value = shopItem.phone;
    values[`region-${_id}-${suffix}`].value = [shopItem.province, shopItem.city, shopItem.area];
    values[`addressDetail-${_id}-${suffix}`].value = shopItem.addressDetail;

    this.props.clearErrors();
    this.props.changeRecord(values);
    this.mapChange();
  }

  onFocus = () => {
    this.props.getActiveId(this.props.id);
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
    this.timer1 = setTimeout(() => {
      const suffix = 'suffix';
      const val1Arr = this.props.values[`region-${this.props.id}-${suffix}`].value;

      const val2 = this.props.values[`addressDetail-${this.props.id}-${suffix}`].value;
      this.placeSearch.search(`${val1Arr.join(',')},${val2}`, (status, result) => {
        if (result.info === 'OK' && result.poiList) {
          const filterPois = result.poiList.pois.filter((item) => item.adcode);
          const pois = filterPois[0];
          // 不能这么写是因为比如：富春路100,这个地址的第一个adcode居然拿不到，const pois = result.poiList.pois[0];
          window[`${this.props.id}mapInfosToWindow`] = {
            adcode: pois.adcode,
            latitude: pois.location.lat,
            longitude: pois.location.lng,
          };
        }
        if (status === 'no_data') {
          window[`${this.props.id}mapInfosToWindow`] = {};
        }
      });
    }, 400);
  }
  /**
   * 删除收货地址
   * @param id 收货地址的id
   */
  reduce(id) {
    this.props.reduceReceiverInfo(id);
  }

  render() {
    const {
      fields,
      length,
      id,
    } = this.props;

    // 收货商家名称的onChange，onSelect事件，配置dataSource
    fields[0].onChange = this.onShopNameChange;
    fields[0].onSelect = this.onSelect;
    fields[0].dataSource = this.state.dataSource;
    fields[0].onFocus = this.onFocus;

    // 以下是绑定收货信息表单的【收货地区】和【详细地址】onChange事件
    fields[4].onChange = this.onRegionChange;
    fields[5].onChange = this.onAddressDetailChange;

    return (
      <li className="receiverForm-item-box" data-id={id}>
        {
          Number(length) > 1 &&
          <Icon type="close-circle" className="close-circle" onClick={this.reduce.bind(this, id)} />
        }
        <Row>
          {
            fields.map((item) => (
              createFormItem({
                field: item,
                form: this.props.form,
                formItemLayout: {
                  labelCol: { span: 4 },
                  wrapperCol: { span: 18 },
                },
                inputOpts: {},
                colSpan: 12,
              })
            ))
          }
        </Row>
        <Row>
          <Col><div id={this.AmapId} className="mapContainessr" /></Col>
        </Row>
      </li>
    );
  }
}
