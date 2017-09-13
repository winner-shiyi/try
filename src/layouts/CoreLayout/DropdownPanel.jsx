import React, { Component } from 'react';
import { Menu, Icon, Dropdown, Modal } from 'antd';
import { connect } from 'react-redux';
import { common } from '../../store/common';

class DropdownPanel extends Component {
  onMenuClick({ key }) {
    if (key === '2') {
      this.props.showEditPwd();
    }
  }

  render() {
    const logout = () => {
      sessionStorage.setItem('accessToken', '');
      // browserHistory.push('/SignIn')
      location.assign('/SignIn'); // clear the redux state, because the data is related the different roles
    };

    const menu = (
      <Menu onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="2">
          <a>修改密码</a>
        </Menu.Item>
        <Menu.Item key="3">
          <a 
            tabIndex={0}
            role="button"
            onClick={(() => {
              Modal.confirm({
                title: '确定要退出兔波波门店管理系统吗？',
                onOk: (() => {
                  setTimeout(() => {
                    logout();
                  }, 300);
                }),
                onCancel() {},
              });
            })}
          >退出</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="login-name">
          { /* {sessionStorage.getItem('name')}，你好！<Icon type="down" /> */ }
          你好！<Icon type="down" />
        </a>
      </Dropdown>
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

const DropdownPanelWrapper = connect(mapStateToProps, mapDispatchToProps)(DropdownPanel);

export default DropdownPanelWrapper;
