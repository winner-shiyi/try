import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { common } from '../../store/common';
import DropdownPanelWrapper from './DropdownPanelWrapper';

const { Header } = Layout;

class TopMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: document.body.clientWidth > 768,
    };

    this.responsiveHandler = ((e) => {
      if (e.matches) {
        this.setState({
          expand: false,
        });
      } else {
        this.setState({
          expand: true,
        });
      }
    });
  }

  componentDidMount() {
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.responsiveHandler);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.firstLeaf && (newProps.firstLeaf.href !== (this.props.firstLeaf && this.props.firstLeaf.href))) {
      browserHistory.push(newProps.firstLeaf.href); // TODO
      this.props.initMenu();
    }
  }

  componentWillUnmount() {
    this.mql && this.mql.removeListener(this.responsiveHandler);
  }

  onClick({ key }) {
    this.props.clickTopMenu(key);
  }

  createMenu = (data) => data.map((item) => <Menu.Item key={item.id}><a>{item.name}</a></Menu.Item>);

  render() {
    const {
      expand,
    } = this.state;
    const menu = (
      <Menu
        mode="horizontal"
        selectedKeys={this.props.selectedKeys}
        style={{ lineHeight: '64px' }}
        onClick={this.onClick.bind(this)}
      >
        {this.createMenu(this.props.topMenuData)}
      </Menu>
    );
    return (
      <Header className="header flex flex-c flex-js">
        {
          !expand && <Dropdown overlay={menu} trigger={['click']}>
            <Button icon="bars" />
          </Dropdown>
        }
        {
          expand && menu
        }
        <DropdownPanelWrapper />
      </Header>
    );
  }
}

const TopMenuWrapper = connect((state) => {
  const topMenuData = state.common.topMenuData;
  return {
    topMenuData,
    selectedKeys: state.common.selectedTopKeys,
    firstLeaf: state.common.firstLeaf,
  };
}, {
  clickTopMenu: common.clickTopMenu,
  initMenu: common.initMenu,
})(TopMenu);

export default TopMenuWrapper;
