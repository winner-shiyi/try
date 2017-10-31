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
