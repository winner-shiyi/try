import React, { Component } from 'react';
import { Layout, Input, Icon } from 'antd';
import { browserHistory } from 'react-router';
import WrappedNormalLoginForm from './NormalLoginForm';
import './style.scss';

const { Content, Footer } = Layout;


// const args = {
//   message: 'Tips',
//   description: <div>
//     <div>保留用户、权限及一个示例模块</div>
//     <div>菜单数据为假数据，现不是树形结构，待后期调整</div>
//     <div>保留真实接口请求</div>
//     <div>登录用户root/admin</div>
//   </div>,
//   duration: 0,
// }
// notification.open(args)

export const createFormItem = (opts) => {
  const rules = [];
  if (opts.require) {
    rules.push({ required: true, message: `请输入${opts.label}` });
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
  return opts.getFieldDecorator(opts.name, {
    rules,
  })(<Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />);
};


class View extends Component {
  login(values) {
    this.props.login(values).then((isSuccess) => {
      isSuccess && browserHistory.push('/Manage');
      // this.props.initCommon()
      // isSuccess && this.props.initCompany()
    });
  }

  render() {
    return (
      <Layout className="login-layout">
        <Content style={{ padding: '0 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <WrappedNormalLoginForm
            login={this.login.bind(this)}
            loading={this.props.loading}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; 产业互联技术中心
        </Footer>
      </Layout>
    );
  }
}

export default View;
