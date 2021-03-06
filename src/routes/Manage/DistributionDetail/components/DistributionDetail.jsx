/**
 * Created by kakeiChen on 2017/7/24
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Form, Input, Row, Table, Button } from 'antd';
import { createFormItem } from '../../../../components';
import formatDate from '../../../../util/formatDate';
import difftime from '../../../../util/difftime';
import PreviewPic from '../../../../components/PreviewPic';

const FormItem = Form.Item;

class DistributionDetailForm extends Component {
  goDispatch() {
    browserHistory.push(`/Manage/ChooseDriver/${this.props.paramsId}`);
  }

  render() {
    const {
      form,
      fields,
      orderInfo,
      values,
      receiversInfoList,
      orderStatus,
    } = this.props;

    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };

    if (receiversInfoList && receiversInfoList.length !== 0) {
      receiversInfoList.map((itemTemp, index) => {
        const item = itemTemp;
        item.key = index;
        return false;
      });
    }

    const punchInfo = values.punchInfo;
    const cardArray = [];
    if (punchInfo && punchInfo.length !== 0) {
      punchInfo.map((itemTemp, index) => {
        const item = itemTemp;
        const {
          hasArrived,
          hasLeft,
          receiverFlag,
          shopName,
          arriveTime,
          leaveTime,
          actualArriveAddress,
          actualLeaveAddress,
        } = item;
        let theBooleans = [hasArrived, hasLeft, receiverFlag];
        theBooleans = theBooleans.join();
        let newItem;
        let newItem2;
        if (theBooleans === [true, false, false].toString()) { // 到达发货地
          newItem = {
            node:`到达发货地：${shopName}`,
            time : arriveTime ? formatDate(arriveTime, 'yyyy-MM-dd HH:mm:ss') : '-',
            address : actualArriveAddress,
          };
          cardArray.push(newItem);
        } else if (theBooleans === [false, true, false].toString()) { // 离开发货地
          newItem2 = {
            node:`离开发货地：${shopName}`,
            time : leaveTime ? formatDate(leaveTime, 'yyyy-MM-dd HH:mm:ss') : '-',
            address : actualLeaveAddress,
          };
          cardArray.push(newItem2);
        } else if (theBooleans === [true, false, true].toString()) { // 到达收货地
          newItem = {
            node:`到达收货地：${shopName}`,
            time : arriveTime ? formatDate(arriveTime, 'yyyy-MM-dd HH:mm:ss') : '-',
            address : actualArriveAddress,
          };
          cardArray.push(newItem);
        } else if (theBooleans === [false, true, true].toString()) { // 离开收货地
          newItem2 = {
            node:`离开收货地：${shopName}`,
            time : leaveTime ? formatDate(leaveTime, 'yyyy-MM-dd HH:mm:ss') : '-',
            address : leaveTime ? actualLeaveAddress : '-',
            stopTime: leaveTime ? difftime(punchInfo[index - 1].arriveTime, leaveTime) : '-',
          };
          cardArray.push(newItem2);
        }
        cardArray.map((itemTempTwo, indexTwo) => {
          const itemCar = itemTempTwo;
          itemCar.key = indexTwo;
          return false;
        });
        return false;
      });
    }

    /**
     * 收货信息表格
     * @param {*} customerfields
     */
    const customerInfo = (customerfields) => {
      const columns = [
        {
          title: '收货商家名称',
          dataIndex: 'shopName',
          key: 'shopName',
        },
        {
          title: '收货地址',
          dataIndex: 'address',
          key:'address',
        },
        {
          title: '收货联系电话',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: '收货状态',
          dataIndex: 'receiverStatus',
          key: 'receiverStatus',
          render: (text, record) => {
            const textStatus = ['未处理', '已妥投', '未妥投'];
            return textStatus[Number(record.receiverStatus - 1)];
          },
        },
        {
          title: '文字备注',
          dataIndex: 'textTip',
          key: 'textTip',
          render: (text, record) => {
            const joinText = record.reason ? `【${record.reason}】${text}` : text;
            return joinText;
          },
        },
        {
          title: '图片备注',
          dataIndex: 'imageTip',
          key: 'imageTip',
          render: (text, record, index) => (
            <div>
              {
                record.imageTip && record.imageTip.length > 0 &&
                <PreviewPic imagrUrlArr={record.imageTip} width={50} height={50} key={index} />
              }
            </div>
          ),
        },
      ];
      return (
        <div style={{ marginTop:'20px' }} >
          <Table title={() => '收货信息'} columns={columns} pagination={{ pageSize: 10 }} dataSource={customerfields} />
        </div>
      );
    };
    /**
     * 订单信息表格
     * @param {*} orderfields
     */
    const orderForm = (orderfields) => (
      <div>
        <Form layout="horizontal">
          <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('id', {
            })(
              <Input type="hidden" />
            )}
          </FormItem>
          <Row>
            {
              orderfields.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  formItemLayout,
                  inputOpts: {
                  },
                })
              ))
            }
          </Row>
        </Form>
      </div>
    );
    /**
     * 司机信息表格
     * @param {*} driverfields
     */
    const driverForm = (driverfields) => (
      <div>
        <Row><h3 style={{ marginTop: '20px', marginBottom: '20px', textAlign:'center', fontSize: '16px' }}>
        司机信息</h3></Row>
        <div>
          <Form layout="horizontal">
            <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
              {getFieldDecorator('id', {
              })(
                <Input type="hidden" />
              )}
            </FormItem>
            <Row>
              {
                driverfields.map((item) => (
                  createFormItem({
                    field: item,
                    form,
                    formItemLayout,
                    inputOpts: {
                    },
                  })
                ))
              }
            </Row>
          </Form>
        </div>
      </div>
    );
    /**
     * 打卡信息表格
     * @param {*} clockData
     */
    const clockForm = (clockData) => {
      const columns = [
        {
          title: '打卡节点',
          dataIndex: 'node',
          key: 'node',
        },
        {
          title: '打卡时间',
          dataIndex: 'time',
          key:'time',
        },
        {
          title: '停留时间',
          dataIndex: 'stopTime',
          key:'stopTime',
        },
        {
          title: '打卡地址信息',
          dataIndex: 'address',
          key: 'addresss',
        },
      ];
      return (
        <div style={{ marginTop:'20px' }} >
          <Table title={() => '打卡信息'} columns={columns} pagination={{ pageSize: 10 }} dataSource={clockData} />
        </div>
      );
    };

    return (
      <div>
        {orderForm(orderInfo)}
        {customerInfo(receiversInfoList)}
        {values.driverId && orderStatus !== '待分配' ? driverForm(fields) : ''}
        {values.driverId && orderStatus !== '待分配' ? clockForm(cardArray) : ''}
        {orderStatus === '待分配' ? <div className="dispatch">
          <Button type="primary" onClick={this.goDispatch.bind(this)} >派单</Button>
        </div> : ''}
      </div>
    );
  }
}

const DistributionDetail = Form.create({
  mapPropsToFields(props) {
    const res = {};
    const keys = Object.keys(props.values || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      res[key] = { value: props.values[key] };
    }
    return res;
  },
})(DistributionDetailForm);

export default DistributionDetail;
