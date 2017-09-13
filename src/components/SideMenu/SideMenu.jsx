import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Icon,
} from 'antd';
import {
  Link,
} from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { common } from '../../store/common';


const { SubMenu } = Menu;

class SideMenu extends Component {
  static propTypes = {
    menuData: PropTypes.array.isRequired,
    selectedKeys: PropTypes.array,
  }
  constructor(props) {
    super(props);
    props.menuLoad()
      .then(() => {

      });
    //   .then((json) => {
    //   const matchMenu = json.find(item => {
    //     return item.subItems.find(subItem => {
    //       return subItem.link === pathname || subItem.link + 'Detail' === pathname
    //     })
    //   })
    //   matchMenu && this.props.menuOpen([matchMenu.id + ''])
    // })
  } 

  onClick({ key }) {
    this.props.clickMenuItem(key);
  }

  onTitleClick({ key }) {
    this.props.clickSubMenu(key);
  }

  onOpenChange(openKeys) {
    this.props.menuOpen(openKeys);
  }

  render() {
    const menuData = this.props.menuData;
    const selectedKeys = this.props.selectedKeys;
    const openKeys = this.props.openKeys;

    return (
      <Scrollbars
        style={{ height: document.body.clientHeight - 300 }}
      >
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[...selectedKeys]}
          openKeys={openKeys}
          onOpenChange={this.onOpenChange.bind(this)}
          onClick={this.onClick.bind(this)}
        >
          {
            menuData[0].map((pItem) => {
              const subMapItems = menuData[1].map((item) => { // TODO
                if (pItem.id === item.parentId) {
                  return (
                    <Menu.Item key={item.id}>
                      <Link to={item.href}>{item.name}</Link>
                    </Menu.Item>
                  );
                }
                return false;
              });

              const subItems = subMapItems.filter((i) => !!i);

              const createSubMenu = () => {
                if (subItems.length > 0) {
                  return (
                    <SubMenu
                      key={pItem.id}
                      title={
                        <span>
                          {pItem.icon && <Icon type={pItem.icon} />}
                          <span>{pItem.name}</span>
                        </span>
                      }
                      onTitleClick={this.onTitleClick.bind(this)}
                    >
                      {subItems}
                    </SubMenu>
                  );
                } 
                return '';
              };

              return createSubMenu();
            })
          }
        </Menu>
      </Scrollbars>
    );
  }
}

const mapStateToProps = (state) => {
  const menuData = state.common.sideMenuData;
  return {
    selectedKeys: state.common.selectedKeys || [],
    openKeys: state.common.openedKeys || [],
    menuData,
  };
};

const mapDispatchToProps = {
  menuLoad: common.menuLoad,
  menuOpen: common.menuOpen,
  clickTopMenu: common.clickTopMenu,
  clickSubMenu: common.clickSubMenu,
  clickMenuItem: common.clickMenuItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
