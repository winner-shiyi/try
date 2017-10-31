import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';
import Table from '../Table';
import SearchForm from '../SearchForm';
import ModalForm from '../ModalForm';

export default class ListPage extends Component {
  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    loading: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    fields: PropTypes.array,
    data: PropTypes.array,
    search: PropTypes.func,
    save: PropTypes.func,
    record: PropTypes.object,
    modalVisible: PropTypes.bool,
    cancel: PropTypes.func,
    tableOpts: PropTypes.object,
    changeRecord: PropTypes.func,
  }

  save(values) {
    const isAdd = !values.id;
    this.props.save(values).then((isSuccess) => {
      const pageNo = isAdd ? '1' : (this.props.page && this.props.page.pageNo) || '1';
      const pageSize = (this.props.page && this.props.page.pageSize) || '10';
      isSuccess && this.props.search({
        ...this.props.searchParams,
        pageNo,
        pageSize,
      });
    });
  }

  render() {
    const createButton = (btnOpts) => (
      btnOpts.map((item, index) => {
        if (!item.hidden) {
          const key = `button${index}`;
          return (
            <Button
              key={key}
              type={item.type || 'primary'}
              onClick={item.onClick.bind(this)}
            >
              {item.label}
            </Button>
          );
        }
        return undefined;
      })
    );

    const {
      title,
      name,
      loading = false,
      confirmLoading,
      columns,
      data,
      rowKey,
      search,
      cancel,
      record,
      fields = [],
      modalVisible,
      tableOpts,
      changeSearch,
      searchParams,
      page,
      buttons = [],
      searchFields,
      style,
      cusTitle,
      formWidth,
      children,
      changeRecord,
      expandedRowRender,
      reset,
    } = this.props;

    return (
      <div style={{ padding: 16, flex: 'auto', ...style }} >
        {
          (title || buttons.length > 0) &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
            <Col>
              {createButton(buttons)}
            </Col>
          </Row>
        }
        {
          !this.props.noSearch &&
          <SearchForm
            fields={searchFields || columns.filter((item) => !!item.search)}
            search={search}
            changeRecord={changeSearch}
            values={searchParams}
            page={page}
            reset={reset}
          />
        }
        <Table
          {...this.props}
          {...tableOpts}
          columns={columns.filter((item) => !item.hidden)}
          dataSource={data}
          loading={loading}
          search={search}
          expandedRowRender={expandedRowRender}
          rowKey={rowKey}
          pagination={
            page ? {
              current: page.pageNo,
              total: page.count,
              pageSize: page.pageSize || 10,
            } : null
          }
        />
        <ModalForm
          visible={modalVisible}
          onCancel={() => cancel()}
          confirmLoading={confirmLoading}
          onCreate={this.save.bind(this)}
          title={name}
          cusTitle={cusTitle}
          values={record}
          fields={fields}
          formWidth={formWidth}
          changeRecord={changeRecord}
        />
        {children}
      </div>
    );
  }
}
