import React, { Component } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import EntryData from './EntryData';
import Table from '../Table';
import SearchForm from '../SearchForm';
import './style.scss';

export default class OrderListPage extends Component {
  static propTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array,
    search: PropTypes.func,
    changeSearch: PropTypes.func,
    reset: PropTypes.func,
    searchParams: PropTypes.object,
    page: PropTypes.object,
  }
  clearUploadFileList() { // 清空上传文件
    const { entryData } = this;
    entryData.upload.setState({
      fileList: [],
    }, () => {
    });
  }
  render() {
    const {
      title,
      loading = false,
      columns,
      data,
      search,
      changeSearch,
      searchParams,
      page,
      style,
      expandedRowRender,
      reset,
    } = this.props;

    return (
      <div style={{ padding: 16, flex: 'auto', ...style }} >
        {
          (title) &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
            <Col>
              <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">新建车配任务</Link>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.props.showModal}
                className="order-upload-btn"
              >订单批量导入</Button>
            </Col>
          </Row>
        }
        <SearchForm
          fields={columns.filter((item) => !!item.search)}
          search={search}
          changeRecord={changeSearch}
          values={searchParams}
          page={page}
          reset={reset}
        />
        <Table
          {...this.props}
          columns={columns.filter((item) => !item.hidden)}
          dataSource={data}
          loading={loading}
          search={search}
          expandedRowRender={expandedRowRender}
          rowKey="orderNo"
          pagination={
            page ? {
              current: page.pageNo,
              total: page.total,
              pageSize: page.pageSize || '10',
            } : null
          }
        />
        <Modal
          title="订单批量导入"
          width="600px"
          maskClosable={false}
          visible={this.props.visible}
          onCancel={this.props.cancel}
          footer={null}
          afterClose={this.clearUploadFileList.bind(this)}
        >
          <EntryData ref={(c) => { this.entryData = c; }} that={this} />
        </Modal>
      </div>
    );
  }
}
