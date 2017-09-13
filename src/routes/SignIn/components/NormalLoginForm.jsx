import React, { Component } from 'react';
import { Form, Button, Modal } from 'antd';
import { createFormItem } from './index';
import './style.scss';

const FormItem = Form.Item;

class NormalLoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values);
      }
    });
  }

  warn() {
    this && Modal.warning({
      title: '请联系系统管理员',
      okText: '确定',
      onOk() {},
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="login-logo-wrapper flex flex-c">
          <div className="login-logo"><img src="/tobobo_logo.png" alt="" style={{ width: 120 }} /></div>
          <div className="login-logo-text">兔波波车配管理后台</div>
        </div>
        <FormItem>
          {createFormItem({
            getFieldDecorator,
            require: true,
            icon: 'user',
            type: 'text',
            label: '账号',
            name: 'userName',
          })}
        </FormItem>
        <FormItem>
          {createFormItem({
            getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'password',
            label: '密码',
            name: 'password',
          })}
        </FormItem>
        <FormItem>
          <div className="login-fp">
            <a role="button" tabIndex={0} onClick={this.warn.bind(this)}>忘记密码</a>
          </div>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.loading}>
            登录
          </Button>

        </FormItem>
      </Form>
    );
  }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
