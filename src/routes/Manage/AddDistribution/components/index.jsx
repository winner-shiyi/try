import React, { Component } from 'react';
import WrappedFormPage from '../../../../components/FormPage';

class View extends Component {
  componentDidMount() {
    const id = this.props.params.id;
    if (id) {
      this.editTask(id);
    }
  }
  componentWillUnmount() {
    this.props.clearData();
  }

  editTask(id) {
    this.props.editOredr(id).then(() => {
      // console.log('this.props.data', this.props.data) 
      // const data = this.props.data
      // debugger
      // let values = this.props.record
      // values.shopName.value = data.shopName
      // values.userName.value = data.userName
      // values.phone.value = data.phone
      // values.region.value = [data.province, data.city, data.area]
      // values.addressDetail.value = data.addressDetail
    });
  }

  render() {
    const {
      record, // 保存填写的表单数据
      params, 
      data,
    } = this.props;
    return (
      <WrappedFormPage 
        {...this.props}
        title={params.id ? '编辑车配任务' : '新建车配任务'}
        values={record}
        data={data}
        params={params}
      />
    );
  }
}

export default View;
