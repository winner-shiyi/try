import React, { Component } from 'react';
import { Layout, Input, Icon, Steps } from 'antd';
import { Link } from 'react-router';
import Captcha from '../../../components/Captcha';
import WrappedVerifyForm from './VerifyForm';
import WrappedSetForm from './SetForm';
import WrappedLoginForm from './LoginForm';
import '../../../styles/core.scss';
import './style.scss';

const Step = Steps.Step;

const { Header, Content, Footer } = Layout;

const createInput = (opts) => {
  switch (opts.type) {
    case 'captcha':
      return (
        <Captcha
          placeholder={opts.label}
          onClick={opts.onClick}
          icon={opts.icon}
        />
      );
    case 'text':
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />
      );
    case 'password':
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />
      );
    default:
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type="text" placeholder={opts.label} />
      );
  }
};

export const createFormItem = (opts) => {
  const rules = [];
  if (opts.require) {
    rules.push({ required: true, message: `请输入${opts.label}` });
  }
  if (opts.validator) {
    rules.push({ validator: opts.validator });
  }
  if (opts.max) {
    rules.push({ max: opts.max, message: `${opts.label}必须小于${opts.max}个字符` });
  }
  if (opts.min) {
    rules.push({ min: opts.min, message: `${opts.label}必须大于${opts.min}个字符` });
  }
  if (opts.pattern) {
    rules.push({ pattern: opts.pattern, message: opts.patternMsg });
  }
  if (opts.phone) {
    rules.push({ pattern: /^1[34578][0-9]{9}$/, message: '请输入正确的手机格式' });
  }
  return opts.getFieldDecorator(opts.name, {
    rules,
  })(createInput(opts));
};

const steps = [{
  title: '身份验证',
}, {
  title: '设置密码',
}, {
  title: '完成',
}];

class View extends Component {
  setPwd(values) {
    this.props.set({
      ...values,
      identity: this.props.identity,
    });
  }

  verify(values) {
    this.props.verify(values);
  }

  login() {
    this.props.login(0);
  }

  render() {
    const {
      current,
      code,
      verifyLoading,
      setLoading,
    } = this.props;
    return (
      <Layout className="layout">
        <Header className="flex flex-js xg-header">
          <div className="logo-wrapper flex flex-c">
            <img alt="" src="/logo-w.png" style={{ width: 70 }} />
            <div>
              <div className="logo-title">新辰产业园</div>
              <div className="logo-text">园区管理系统</div>
            </div>
          </div>
          <div className="header-link"><Link to="/SignIn">登录</Link></div>
        </Header>
        <Content className="flex flex-v flex-c">
          <Steps className="fp-steps" current={current}>
            {steps.map((item) => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content flex flex-c flex-a">{
            current === 0 &&
              <WrappedVerifyForm onClick={this.verify.bind(this)} code={code} loading={verifyLoading} />
          }{
            current === 1 && <WrappedSetForm onClick={this.setPwd.bind(this)} loading={setLoading} />
          }{
            current === 2 && <WrappedLoginForm onClick={this.login.bind(this)} />
          }</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; 产业互联技术中心
        </Footer>
      </Layout>
    );
  }
}

export default View;
