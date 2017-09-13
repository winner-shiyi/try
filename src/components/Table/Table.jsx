import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import PropTypes from 'prop-types';

export default class CommonTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.object,
    search: PropTypes.func,
    searchParams: PropTypes.object,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    expandedRowRender: PropTypes.func,
  }

  onChange(page) {
    this.props.search({
      ...this.props.searchParams,
      pageNo: page.current,
      pageSize: page.pageSize,
    });
  }

  render() {
    const {
      loading,
      columns,
      dataSource,
      pagination,
      searchParams,
      rowSelection,
      onChange,
      bordered,
      expandedRowRender,
    } = this.props;

    const mapColumns = [
      ...columns,
    ];

    mapColumns.forEach((columnTemp) => {
      const column = columnTemp;
      if ('label' in column) {
        column.title = column.label;
      }
      if ('name' in column) {
        column.dataIndex = column.name;
        column.key = column.dataIndex;
      }
    });

    return (
      <Spin spinning={loading}>
        <Table
          bordered={bordered}
          searchParams={searchParams}
          rowKey={this.props.rowKey || 'id'} // 表格行 key 的取值，可以是字符串或一个函数
          style={{ marginTop: '16px' }}
          columns={mapColumns}
          dataSource={dataSource}
          pagination={
            pagination ? {
              pageSize: 10,
              ...pagination,
              showTotal: (total, range) => `显示第 ${range[0]} 到第 ${range[1]} 条记录，总共 ${total} 条记录`,
            } : false}
          onChange={onChange || this.onChange.bind(this)}
          rowSelection={rowSelection}
          expandedRowRender={expandedRowRender}
        />
      </Spin>
    );
  }
}
