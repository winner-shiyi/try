import React, { Component } from 'react';
import { Table, Collapse, Spin } from 'antd';
import './OrgFeeDetails.scss';

const Panel = Collapse.Panel;

class OrgFeeDetails extends Component {
  render() {
    const { sumData, detailColumns, detailUnit, loading } = this.props;

    if (loading) {
      return (
        <div style={{
          textAlign: 'center',
          borderRadius: '4px',
          marginBottom: '20px',
          padding: '30px 50px',
          margin: '20px 0',
        }}
        >
          <Spin />
        </div>
      );
    }
    return (
      sumData.length ? (<Collapse defaultActiveKey={['details-0']}>
        {
          sumData.map((item, index) => {
            const { sumDate, sumKWH, sumPrice, detailData } = item;
            const dataSumDiv = (
              <div>
                <span style={{ display: 'inline-block', minWidth: '150px' }}>
                  {sumDate}
                </span>
                <span style={{ display: 'inline-block', minWidth: '150px', float: 'right' }}>
                  合计￥<b style={{ fontWight: 'bold' }}>{sumPrice}</b>元
                </span>
                <span style={{ display: 'inline-block', minWidth: '150px', float: 'right' }}>
                  共用{sumKWH + detailUnit}
                </span>
              </div>
            );
            return (
              <Panel header={dataSumDiv} key={`details-${index}`}>
                <Table
                  showHeader={false}
                  columns={detailColumns}
                  dataSource={detailData}
                  pagination={false}
                />
              </Panel>
            );
          })
        }
      </Collapse>) : <div style={{ textAlign: 'center' }}>暂无数据</div>
    );
  }
}

export default OrgFeeDetails;
