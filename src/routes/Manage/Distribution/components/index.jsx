import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { Link, browserHistory } from 'react-router';
import OrderListPage from '../../../../components/OrderListPage';
import formatDate from '../../../../util/formatDate';
import { statusData } from '../modules';
import './style.scss';

class View extends Component {
  componentDidMount() { // 一进入页面后把table渲染出来
    this.props.search({
      ...this.props.searchParams,
      ...this.props.page,
    });
  }
  componentWillUnmount() {
    this.props.clearData();// 这里不直接调用reset()方法是因为，reset只重置了搜索字段，没有重置分页
  }
  handleAddClick = () => {
    // browserHistory.push(`/Manage/MailingDetail/${record.waybillNo}`);
    browserHistory.push('/Manage/AddDistribution');
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
        max: 50,
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
        data: statusData.map((item) => ([item.statusCode, item.statusLabel])),
        key: 'orderStatus',
        render: (text, record) => {
          const statusName = record.orderStatus;
          const statusObj = {};
          statusData.map((item) => {
            statusObj[item.statusCode] = item.statusLabel;
            return statusObj;
          });
          return statusObj[statusName];
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
        render: (text, record, index) => {
          // actionStatus状态码：{ 1: '待分配', 2: '待取货', 3: '配送中', 4: '已完成', 5: '已取消', 6: '待提交' }
          const actionList = [
            {
              actionStatus: null,
              noActionStatus: [6], // 非待提交状态下 才显示【明细】
              elem: (
                <Link
                  to={`/Manage/DistributionDetail/${data[index].orderNo}`}
                  className="add-btn ant-btn ant-btn-primary Distribution-btn Distribution-detail-btn"
                >明细</Link>
              ),
            },
            {
              actionStatus: [1], // 待分配状态下 才显示【派单】
              noActionStatus: null,
              elem: (
                <Link
                  to={`/Manage/ChooseDriver/${data[index].orderNo}`}
                  className="add-btn ant-btn ant-btn-primary Distribution-btn Distribution-dispatch-btn"
                >派单</Link>
              ),
            },
            {
              actionStatus: null,
              noActionStatus: [4, 5, 6], // 非已完成、已取消、待提交状态下 才显示【取消】
              elem: (
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
              ),
            },
          ];
          return (
            <span>
              {
                actionList.map((item) => {
                  const { actionStatus, noActionStatus, elem } = item;
                  const elemList = [];
                  actionStatus && actionStatus.includes(record.orderStatus) && elemList.push(elem);
                  noActionStatus && !noActionStatus.includes(record.orderStatus) && elemList.push(elem);
                  return elemList;
                })
              }
            </span>
          );
        },
      },
    ];

    const buttons = [
      {
        label: '新建车配任务',
        onClick: () => {
          this.handleAddClick();
        },
      },
      {
        label: '订单批量导入',
        type: 'default',
        // className: 'order-upload-btn',
        onClick: () => {
          this.props.showModal();
          // this.props.add();
          // this.props.roleSearch();
        },
      },
    ];

    return (
      <OrderListPage
        {...this.props}
        title="车配任务管理"
        columns={columns}
        buttons={buttons}
      />
    );
  }
}

export default View;
