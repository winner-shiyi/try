import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { Button, message } from 'antd';
import ListPage from '../../../../components/ListPage';


class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index:-1, // 保存当前选择的司机的index
      driverId:'',
    };
  }

  componentDidMount() {
    const { props } = this;
    // { token:sessionStorage.getItem('accessToken') } 这个删了不影响
    props.searchCar({ token:sessionStorage.getItem('accessToken') });
    props.searchDriver({
      ...this.props.searchParams,
      ...this.props.page,
    });
  }
  componentWillUnmount() {
    this.props.clearData();
  }

  search(params) {
    this.props.searchDriver(params);
  }

  dispatchOrder() {
    const that = this;
    const param = {};
    param.orderNo = that.props.params.id;
    param.driverId = that.state.driverId;
    this.props.dispatchOrder(param).then(
      () => {
        const { paths } = this.props;
        if (paths) {
          message.success('派单成功');
          browserHistory.push(paths);
        }
      }
    );
  }

  render() {
    const {
      data,
      // driverStatus,
      carClassesData,
      carLengthData,
      isCanChoose,
      page,
    } = this.props;

    const routeId = this.props.params.id;

    const columns = [
      {
        label: '司机ID',
        name: 'driverId',
        search: false,
        hidden: true,
      },
      {
        label: '司机姓名',
        name: 'driverName',
        search: true,
        max: 20,
      },
      {
        label: '车牌',
        name: 'carNumber',
        search: true,
      },
      {
        label: '车辆类型',
        name: 'carType', // 表格中的值
        type: 'select',
        data: carClassesData, // 搜索部分下拉框的值
        search: true,
      },
      {
        label: '车厢长度',
        name: 'carLength',
        data: carLengthData,
      },
      {
        label: '进行中任务数',
        name: 'driverOrderCount',
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record, index) => {
          const choice = routeId && isCanChoose[index] === 2 ? '已选择' : '';
          return (
            <span>
              {
                routeId && isCanChoose[index] === 1
                  ? <Button
                    type="secondary"
                    onClick={() => {
                      const item = isCanChoose;
                      if (this.state.index !== -1) {
                        item[this.state.index] = 1;
                      }
                      item[index] = 2;
                      this.setState({
                        isCanChoose: item,
                        index,
                        driverId:record.driverId,
                      });
                    }}
                  >选择</Button>
                  : choice
              }
            </span>
          );
        },
      },
    ];

    return (
      <div style={{ width:'100%' }} >
        <ListPage
          {...this.props}
          search={this.search.bind(this)}
          title="分配司机"
          columns={columns}
          formWidth={600}
          data={data.driverList}
          page={page}
        />
        {
          routeId &&
          <div style={{ textAlign:'center', marginBottom:'20px' }} >
            <Button type="secondary" onClick={this.dispatchOrder.bind(this)} >派单</Button>
          </div>
        }
      </div>
    );
  }
}

export default View;
