import React, { Component } from 'react';
import { Row, Col } from 'antd';
import DistributionDetail from './DistributionDetail';
import './style.scss';

class View extends Component {
  componentDidMount() {
    const { props } = this;
    const id = props.params.id;
    // console.log(id);
    props.Detail({ orderNo : id }).then(
      () => {
        if (this.props.orderStatus !== '待分配') {
          props.searchDriver({ orderNo : id });
        }
      }
    );
  }

  render() {
    const {
      orderStatus,
      data,
      params,
    } = this.props;

    // console.log(data);

    const orderInfo = [
      { label: '订单编号', name: 'orderNo', className: 'xg', simpleList: true, disabled: true },
      { label: '创建订单时间', name: 'orderTime', className: 'xg', simpleList: true, disabled: true },
      { label: '派单时间', name: 'dispatchTime', className: 'xg', simpleList: true, disabled: true },
      { label: '发货地', name: 'shopName', className: 'xg', simpleList: true, disabled: true },
      { label: '发货联系电话', name: 'phone', className: 'xg', simpleList: true, disabled: true },
      { label: '发货地址', name: 'address', className: 'xg', simpleList: true, disabled: true },
    ];

    const fields = [
      { label: '司机编号', name: 'driverId', className: 'xg', simpleList: true, disabled: true },
      { label: '司机姓名', name: 'driverName', className: 'xg', simpleList: true, disabled: true },
      { label: '司机电话', name: 'driverPhone', className: 'xg', simpleList: true, disabled: true },
      { label: '车牌', name: 'carNumber', className: 'xg', simpleList: true, disabled: true },
      { label: '车辆类型', name: 'carType', className: 'xg', simpleList: true, disabled: true },
    ];

    const clockData = [
      {
        key: 1,
        name:'到达发货地1',
        time:'2017-03-22 12:00:00',
        address:'杭州市滨江区伟业路38号',
      }, {
        key: 2,
        name:'到达发货地2',
        time:'2017-03-22 12:00:00',
        address:'杭州市滨江区伟业路38号',
      }, {
        key: 3,
        name:'到达发货地3',
        time:'2017-03-22 12:00:00',
        address:'杭州市滨江区伟业路38号',
      },
    ];

    return (
      <div className="ant-content-inner">
        <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: 16, marginTop:10 }}>
          <Col>
            <h2 className="ant-page-title">
                车配任务详情
            </h2>
          </Col>
        </Row>
        <Row><h3 style={{ marginTop: '20px', marginBottom: '20px', textAlign:'center', fontSize: '16px' }}>
          {orderStatus}</h3></Row>
        <DistributionDetail 
          receiversInfoList={data.receiversInfoList} 
          orderInfo={orderInfo} 
          orderStatus={orderStatus} 
          paramsId={params.id} 
          fields={fields} 
          values={data} 
          clockData={clockData} 
        />
      </div>
    );
  }
}

export default View;
