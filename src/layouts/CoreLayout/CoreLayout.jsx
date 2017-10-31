import React, { Component } from 'react';
import { Layout } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import SideMenu from '../../components/SideMenu';
import '../../styles/core.scss';
import './CoreLayout.scss';
import ChangePwdFormWrapper from './ChangePwdFormWrapper';
import TopMenuWrapper from './TopMenuWrapper';

const { Content, Sider } = Layout;

class CoreLayout extends Component {
  render() {
    return (
      <Layout>
        <ChangePwdFormWrapper />
        <Sider
          collapsible
          collapsedWidth="0"
          breakpoint="sm"
          width={200}
        >
          <layout className="flex flex-v" style={{ height: '100%', borderRight: '1px solid #ececec' }}>
            <div className="logo-wrapper flex flex-v flex-c">
              <div className="logo"><img alt="" src="/tobobo_logo.png" style={{ height: 150 }} /></div>
              <div className="logo-title">{JSON.parse(sessionStorage.getItem('storeName'))}</div>
              <div className="logo-title">兔波波车配管理后台</div>
            </div>
            <SideMenu />
          </layout>
        </Sider>
        <Layout>
          <TopMenuWrapper />
          <Scrollbars
            style={{ height: document.body.clientHeight - 64 }}
          >
            <Content style={{ padding: 0, margin: 0 }}>
              {this.props.children}
            </Content>
          </Scrollbars>
        </Layout>
      </Layout>
    );
  }
}

export default connect()(CoreLayout);
