import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { Link } from 'react-router';
import OrderListPage from '../../../../components/OrderListPage';
import './style.scss';
import formatDate from '../../../../util/date';

class View extends Component {
  componentDidMount() { // 一进入页面后把table渲染出来
    this.props.search({
      ...this.props.searchParams,
      ...this.props.page,
    });
  }
  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {
      data,
    } = this.props;

    const columns = [
      {
        title: '订单编号',
        search: true,
        dataIndex: 'orderNo',
        key: 'orderNo',
        max: 80,
      }, 
      {
        title: '发货地址',
        dataIndex: 'address',
        key: 'address',
      },
      { 
        title: '订单状态',
        dataIndex: 'orderStatus',
        search: true,
        type: 'select',
        data: [['1', '待分配'], ['2', '待取货'], ['3', '配送中'], ['4', '已完成'], ['5', '已取消'], ['6', '待提交']],
        key: 'orderStatus',
        render: (text, record) => {
          const statusName = record.orderStatus;
          const statusObj = { 1: '待分配', 2: '待取货', 3: '配送中', 4: '已完成', 5: '已取消', 6: '待提交' };
          const statusValue = statusObj[statusName];
          return statusValue;
        },
      }, 
      {
        title: '发货人电话',
        dataIndex: 'phone',
        key: 'phone',
        search: true,
        number: true,
        max: 11,
        hidden: true,
      },
      {
        title: '司机姓名',
        dataIndex: 'driverName',
        key: 'driverName',
        search: true,
        max: 20,
      }, 
      {
        title: '司机电话',
        dataIndex: 'driverPhone',
        key: 'driverPhone',
        search: true,
        max: 11,
        number: true,
        hidden: true,
      }, 
      {
        title: '收货商家名称',
        dataIndex:'receiverShopName',
        max: 50,
        render: (text, record) => {
          const name = record && record.receiversInfoList.length === 1 ? record.receiversInfoList[0].shopName : '';
          return record.receiversInfoList.length > 1 
            ? `${record.receiversInfoList[0].shopName}...`
            : name;
          // record.receiversInfoList.length > 1 
          //   ? `${record.receiversInfoList[0].shopName}...` : record && record.receiversInfoList.length === 1
          //     ? record.receiversInfoList[0].shopName : ''
        },
      },
      {
        title: '收货地址',
        dataIndex:'receiverAddress',
        max: 50,
        render: (text, record) => {
          const address = record.receiversInfoList.length === 1 ? record.receiversInfoList[0].address : '';
          return record.receiversInfoList.length > 1
            ? `${record.receiversInfoList[0].address}...` : address;
          // record.receiversInfoList.length > 1 
          //   ? `${record.receiversInfoList[0].address}...` : record && record.receiversInfoList.length === 1
          //     ? record.receiversInfoList[0].address : ''
        },
      },
      {
        title: '收货方数量',
        dataIndex:'receiverNo',
        render: (text, record) => (
          record.receiversInfoList.length
        ),
      },
      {
        title: '下单时间',
        dataIndex:'orderTime',
        render: (text, record) => (
          record.orderStatus !== 6 
            ? formatDate(Number(text), 'yyyy-MM-dd HH:mm')
            : ''
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <span>
            {
              record.orderStatus === 6 &&
              <Link
                to={`/Manage/AddDistribution/${data[index].orderNo}`} 
                className="add-btn ant-btn ant-btn-primary Distribution-edit-btn"
              >编辑</Link>
            }
            {
              record.orderStatus === 6 && 
              <Button
                type="primary"
                className="Distribution-delete-btn"
                onClick={
                  () => {
                    Modal.confirm({
                      title: '该订单还没有提交，确定要删除吗？',
                      onOk: () => {
                        this.props.deleteOrder(record).then((success) => {
                          success && this.props.search({
                            ...this.props.searchParams,
                            ...this.props.page,
                          });
                        });
                      },
                      onCancel() {},
                    });
                  }
                }
              >删除</Button>
            }
            { 
              record.orderStatus !== 6 &&
              <Link
                to={`/Manage/DistributionDetail/${data[index].orderNo}`} 
                className="add-btn ant-btn ant-btn-primary Distribution-detail-btn"
              >明细</Link>
            }
            {
              record.orderStatus === 1 &&
              <Link
                to={`/Manage/ChooseDriver/${data[index].orderNo}`} 
                className="add-btn ant-btn ant-btn-primary Distribution-dispatch-btn"
              >派单</Link>
            }
            {
              record.orderStatus !== 4 && record.orderStatus !== 5 && record.orderStatus !== 6 &&
              <Button
                type="danger"
                className="Distribution-cancel-btn"
                onClick={
                  () => {
                    Modal.confirm({
                      title: '确定要取消该订单吗？',
                      onOk: () => {
                        this.props.setStatus(record, index).then((success) => {
                          success && this.props.search({
                            ...this.props.searchParams,
                            ...this.props.page,
                          });
                        });
                      },
                      onCancel() {},
                    });
                  }
                }
              >取消</Button>
            }
          </span>
        ),
      },
    ];

    return (
      <OrderListPage
        {...this.props}
        title="车配任务管理"
        columns={columns}
      />
    );
  }
}

export default View;
