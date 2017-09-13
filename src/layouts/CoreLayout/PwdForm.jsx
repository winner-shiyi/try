import React, { Component } from 'react';
import { Icon, Modal, Button, Row, Form } from 'antd';
import { connect } from 'react-redux';
import '../../styles/core.scss';
import './CoreLayout.scss';
import { createFormItem } from '../../components';
import { common } from '../../store/common';

class ChangePwdForm extends Component {
  componentDidMount() {
    this.props.initCommon();
  }

  onCancel() {
    this.props.hideEditPwd();
    this.props.form.resetFields();
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.savePwd(values).then((isSuccess) => {
          if (isSuccess) {
            this.props.form.resetFields();
            const user = JSON.parse(sessionStorage.getItem('user'));
            // user.firstLogin = false
            sessionStorage.setItem('user', JSON.stringify(user));
          }
        });
      }
    });
  }

  render() {
    const {
      form,
      savePwdLoading,
    } = this.props;

    const user = JSON.parse(sessionStorage.getItem('user'));
    const firstLogin = user && user.firstLogin;

    const fields = [{
      type: 'title',
      label: <span><Icon type="exclamation-circle-o" />为了你的账号安全，请修改密码</span>,
      className: 'warning',
      hidden: true,
    }, {
      label: '原密码',
      name: 'oldPwd',
      long: true,
      simple: true,
      type: 'password',
      required: true,
      min: 8,
      max: 20,
    }, {
      label: '新密码',
      name: 'newPwd',
      long: true,
      simple: true,
      type: 'password',
      required: true,
      char:true,
      min: 8,
      max: 20,
      validator: (rule, value, callback) => {
        const formTemp = this.props.form;
        if (value && formTemp.getFieldValue('pwdConfirm')) {
          formTemp.validateFields(['pwdConfirm'], { force: true });
        }
        callback();
      },
    }, {
      label: '新密码确认',
      name: 'pwdConfirm',
      long: true,
      simple: true,
      type: 'password',
      required: true,
      validator: (rule, value, callback) => {
        const formTemp = this.props.form;
        if (value && value !== formTemp.getFieldValue('newPwd')) {
          callback('两次密码输入不一致');
        } else {
          callback();
        }
      },
    }];

    const footer = [
      <Button size="large" key="submit" type="primary" onClick={this.save.bind(this)} loading={savePwdLoading}>
        保存
      </Button>,
      <Button size="large" key="back" onClick={this.onCancel.bind(this)}>取消</Button>,
    ];

    // !firstLogin && footer.push(<Button size="large" key="back" onClick={this.onCancel.bind(this)}>取消</Button>)

    return (
      <Modal
        visible={this.props.editPwdVisible}
        okText="保存"
        title="修改密码"
        closable={!firstLogin}
        onCancel={firstLogin ? null : this.onCancel.bind(this)}
        onOk={this.save}
        footer={footer}
        maskClosable={false}
      >
        <Form layout="horizontal">
          <Row>
            {
              fields.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  inputOpts: {
                  },
                })
              ))
            }
          </Row>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  editPwdVisible: state.common.editPwdVisible,
  savePwdLoading: state.common.savePwdLoading,
});

const mapDispatchToProps = {
  showEditPwd: common.showEditPwd,
  hideEditPwd: common.hideEditPwd,
  savePwd: common.savePwd,
  initCommon: common.initCommon,
};

const ChangePwdFormWrapper = Form.create()(connect(mapStateToProps, mapDispatchToProps)(ChangePwdForm));

export default ChangePwdFormWrapper;
