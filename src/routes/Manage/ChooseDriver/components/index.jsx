import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { Button } from 'antd';
import ListPage from '../../../../components/ListPage';


class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index:-1,
      driverId:'',
    };
  }

  componentDidMount() {
    const { props } = this;
    props.searchCar({ token:sessionStorage.getItem('accessToken') });
    props.searchDriver(this.props.searchParams);
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
          browserHistory.push(paths);
        }
      }
    );
  }

  render() {
    const {
      data,
      carClassesData,
      carLengthData,
      isCanChoose,
      page,
    } = this.props;

    // let dictionary = {
    //   '0':'配送中',
    //   '1':'已完成'
    // };

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
      // {
      //   label: '司机工作状态',
      //   name:'driverWorkStatus',
      //   type: 'select',
      //   data:driverStatus,
      // },
      {
        label: '进行中任务数',
        name: 'driverOrderCount',
      },
      {
        label: '操作',
        name: 'action',
        // render: (text, record, index) => (
        //   <span>
        //     {
        //       routeId && isCanChoose[index] === 1 
        //       ? <Button
        //         ref="choose"
        //         type="secondary"
        //         onClick={
        //         () => {
        //           const item = isCanChoose;
        //           console.log('item', item);
        //           if (this.state.index !== -1) {
        //             item[this.state.index] = 1;
        //           }
        //           item[index] = 2;
        //           this.setState({
        //             isCanChoose:item,
        //             index,
        //             driverId:record.driverId,
        //           });
        //         }
        //       }
        //       >选择</Button> 
        //       : routeId && isCanChoose[index] === 2 ? '已选择' : ''
        //     } 
        //   </span>
        // ),
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
                  >
                    选择</Button>
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
