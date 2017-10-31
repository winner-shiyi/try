import React, { Component } from 'react';
// import { Button, Modal } from 'antd';
import { Link, browserHistory } from 'react-router';
// import OrderListPage from '../../../../components/OrderListPage';
import ListPage from '../../../../components/ListPage';
import formatDate from '../../../../util/formatDate';
// import { statusData } from '../modules';
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
    browserHistory.push('/Manage/Addreceiver');
  }

  render() {
    // const {
    //   data,
    // } = this.props;

    const columns = [
      {
        title: '商家ID',
        search: true,
        dataIndex: 'id',
        max: 50,
      },
      {
        title: '商家名称',
        search: true,
        dataIndex:'shopName',
        max: 50,
      },
      {
        title: '联系人',
        dataIndex: 'userName',
        max: 20,
      },
      {
        title: '联系电话', // 取设为默认的电话
        dataIndex: 'phone',
        search: true,
        max: 11,
        number: true,
      },
      {
        title: '所在地区',
        dataIndex: 'region',
        search: true,
        type: 'Cascader',
      },
      {
        title: '详细地址',
        dataIndex:'address',
        max: 50,
        // render: (text, record) => {
        //   const address = record.receiversInfoList.length === 1 ? record.receiversInfoList[0].address : '';
        //   return record.receiversInfoList.length > 1
        //     ? `${record.receiversInfoList[0].address}...` : address;
        // },
      },
      {
        title: '分组名称',
        dataIndex: 'tagName',
        search: true,
        max: 20,
      },
      {
        title: '创建时间',
        dataIndex:'time',
        render: (text, record) => (
          record.orderStatus !== 6
            ? formatDate(Number(text), 'yyyy-MM-dd HH:mm')
            : ''
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => (
          <Link
            to={`/Manage/Addreceiver/${record.id}`}
            className="add-btn ant-btn ant-btn-primary"
          >编辑</Link>
        ),
      },
    ];

    const buttons = [
      {
        label: '新增收货商家',
        onClick: () => {
          this.handleAddClick();
        },
      },
      {
        label: '新增商家分组',
        type: 'default',
        // className: 'order-upload- btn',
        onClick: () => {
          this.props.showModal();
          // this.props.add();
          // this.props.roleSearch();
        },
      },
    ];

    return (
      // title页面大标题 name弹窗的标题
      <ListPage
        {...this.props}
        title="收货商家管理"
        columns={columns}
        buttons={buttons}
        name="收货商家分组"
        formWidth={645}
      />
    );
  }
}

export default View;
