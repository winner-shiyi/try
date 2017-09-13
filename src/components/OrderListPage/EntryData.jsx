import React, { Component } from 'react';
import { Upload, message, Button, Icon } from 'antd';
import { getBaseUrl } from '../../util';
// 导入下载excel方法，或者写在这个页面也是可以的，因为这个方法没有经过action
import { downExcel } from '../../routes/Manage/Distribution/modules/index'; 

export default class EntryData extends Component {
  render() {
    const { that } = this.props; // 表示OrderListPage组件
    const uploadProps = {
      name: 'file',
      defaultFileList: [],
      action: `${getBaseUrl()}/order/import`,
      headers: {
        authorization: '', 
      },
      onChange: (info) => { // 上传中、完成、失败都会调用这个函数
        if (info.file.status === 'done') {
          if (info.file.response.resultCode === '0') {
            if (Number(info.file.response.resultData.successCount) > 0) {
              let errorStr = '';
              if (info.file.response.resultData.errorOrderNo.length) {
                const errorStrNo = info.file.response.resultData.errorOrderNo.join('、');
                errorStr = `；订单编号${errorStrNo}上传失败`;
                message.success(`已成功上传${info.file.response.resultData.successCount}条订单${errorStr}`, 5);
              } else {
                message.success(`已成功上传${info.file.response.resultData.successCount}条订单`);
              }
              that.props.search({
                ...that.props.searchParams,
                ...that.props.page,
              });
            } else {
              message.error('订单全部上传失败，请认真检查格式哟~', 5);
            }
          }
          this.upload.setState({
            fileList: [...this.upload.state.fileList].slice(0, -1), // 清空上传文件列表
          });
        }
      },
      beforeUpload: (file) => { // 上传文件之前的钩子，参数为上传的文件
        const suffix = file.name.split('.').pop();
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error('文件大小不能超过5MB', 3);
          return false;
        }
        if (suffix === 'xlsx' || suffix === 'xls') {
          return true;
        } 
        message.error('请选择Excel文件', 3);
        return false;
      },
      onRemove: () => true, // 点击移除文件时的回调，返回值为 false 时不移除 
    };
    return (
      <div>
        <p>1、下载导入模板 <a onClick={downExcel} role="button" tabIndex={0}>点此下载</a>；</p>
        <p>2、将订单信息填入Excel模板；</p>
        <p>3、将填好订单信息的Excel模板上传；</p>
        <Upload ref={(c) => { this.upload = c; }} {...uploadProps}>
          <Button style={{ marginTop:'16px' }}>
            <Icon type="upload" /> 选择导入文件
          </Button>
        </Upload>
        <div style={{ display:'block', textAlign:'center', marginTop:'16px' }}>
          <Button size="large" type="primary" onClick={that.props.cancel}>确定</Button>
        </div>
      </div>  
    );
  }
}
