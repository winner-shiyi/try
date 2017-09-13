import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon, Dropdown, Modal, Button, Row, Form, notification, Spin } from 'antd'
import SideMenu from '../../components/SideMenu'
import '../../styles/core.scss'
import './CoreLayout.scss'
import {
  browserHistory,
} from 'react-router'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { createFormItem } from '../../components'
import { common } from '../../store/common'

const { Header, Content, Sider, Footer } = Layout

class ChangePwdForm extends Component {

  componentDidMount () {
    this.props.initCommon()
  }

  onCancel () {
    this.props.hideEditPwd()
    this.props.form.resetFields()
  }

  save () {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.savePwd(values).then((isSuccess) => {
          if (isSuccess) {
            this.props.form.resetFields()
            const user = JSON.parse(sessionStorage.getItem('user'))
            user.firstLogin = false
            sessionStorage.setItem('user', JSON.stringify(user))
          }
        })
      }
    })
  }

  render () {
    const {
      form,
      savePwdLoading,
    } = this.props

    const user = JSON.parse(sessionStorage.getItem('user'))
    const firstLogin = user && user.firstLogin

    const fields = [{
      'type': 'title',
      'label': <span><Icon type="exclamation-circle-o" />为了你的账号安全，请修改密码</span>,
      'className': 'warning',
      hidden: !firstLogin,
    }, {
      'label': '原密码',
      'name': 'oldPassword',
      'long': true,
      'simple': true,
      'type': 'password',
      'required': true,
      'min': 5,
      'max': 20,
    }, {
      'label': '新密码',
      'name': 'newPassword',
      'long': true,
      'simple': true,
      'type': 'password',
      'required': true,
      'min': 6,
      'max': 20,
      pattern: /^[0-9a-zA-Z]*$/,
      patternMsg: '密码只能是数字或英文大小写',
      'validator': (rule, value, callback) => {
        const form = this.props.form
        if (value && form.getFieldValue('pwdConfirm')) {
          form.validateFields(['pwdConfirm'], { force: true })
        }
        callback()
      },
    }, {
      'label': '新密码确认',
      'name': 'pwdConfirm',
      'long': true,
      'simple': true,
      'type': 'password',
      'required': true,
      'min': 6,
      'max': 20,
      'validator': (rule, value, callback) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('newPassword')) {
          callback('两次密码输入不一致')
        } else {
          callback()
        }
      },
    }]

    let footer = [
      <Button size="large" key="submit" type="primary" onClick={::this.save} loading={savePwdLoading}>
        保存
      </Button>,
    ]

    !firstLogin && footer.push(<Button size="large" key="back" onClick={::this.onCancel}>取消</Button>)

    return (
      <Modal
        visible={this.props.editPwdVisible}
        okText="保存"
        title="修改密码"
        closable={!firstLogin}
        onCancel={firstLogin ? null : ::this.onCancel}
        onOk={this.save}
        footer={footer}
        maskClosable={false}
      >
        <Form layout="horizontal">
          <Row>
            {
              fields.map((item) => {
                return (
                  createFormItem({
                    field: item,
                    form,
                    inputOpts: {
                    },
                  })
                )
              })
            }
          </Row>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    editPwdVisible: state.common.editPwdVisible,
    savePwdLoading: state.common.savePwdLoading,
  }
}

const mapDispatchToProps = {
  showEditPwd: common.showEditPwd,
  hideEditPwd: common.hideEditPwd,
  savePwd: common.savePwd,
  initCommon: common.initCommon,
}

const ChangePwdFormWrapper = Form.create()(connect(mapStateToProps, mapDispatchToProps)(ChangePwdForm))

class DropdownPanel extends Component {

  onMenuClick ({ key }) {
    if (key === '2') {
      this.props.showEditPwd()
    }
  }

  render () {
    const logout = () => {
      sessionStorage.setItem('accessToken', '')
      // browserHistory.push('/SignIn')
      location.assign('/SignIn') // clear the redux state, because the data is related the different roles
    }

    const menu = (
      <Menu onClick={::this.onMenuClick}>
        <Menu.Item key="3">
          <a onClick={(() => {
            Modal.confirm({
              title: '确定要退出兔波波车配管理后台吗？',
              onOk: (() => {
                setTimeout(() => {
                  logout()
                }, 300)
              }),
              onCancel () {},
            })
          })}>退出</a>
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="login-name">
          {/*JSON.parse(sessionStorage.getItem(''))*/}
          你好！<Icon type="down" />
        </a>
      </Dropdown>
    )
  }
}

const DropdownPanelWrapper = connect(mapStateToProps, mapDispatchToProps)(DropdownPanel)

class TopMenu extends Component {

  constructor (props) {
    super(props)

    this.state = {
      expand: document.body.clientWidth > 768,
    }

    this.responsiveHandler = ((e) => {
      if (e.matches) {
        this.setState({
          expand: false,
        })
      } else {
        this.setState({
          expand: true,
        })
      }
    }).bind(this)
  }

  createMenu (data) {
    return data.map((item) => {
      return <Menu.Item key={item.id}><a>{item.name}</a></Menu.Item>
    })
  }

  onClick ({ key }) {
    this.props.clickTopMenu(key)
  }

  componentDidMount () {
    this.mql = window.matchMedia('(max-width: 768px)')
    this.mql.addListener(this.responsiveHandler)
  }

  componentWillUnmount () {
    this.mql && this.mql.removeListener(this.responsiveHandler)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.firstLeaf && (newProps.firstLeaf.href !== (this.props.firstLeaf && this.props.firstLeaf.href))) {
      browserHistory.push(newProps.firstLeaf.href) // TODO
      this.props.initialMenu()
    }
  }

  render () {
    const {
      expand,
    } = this.state
    const menu = (
      <Menu
        mode="horizontal"
        selectedKeys={this.props.selectedKeys}
        style={{ lineHeight: '64px' }}
        onClick={::this.onClick}
      >
        {this.createMenu(this.props.topMenuData)}
      </Menu>
    )
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
    )
  }
}

const TopMenuWrapper = connect((state) => {
  const topMenuData = state.common.topMenuData
  return {
    topMenuData: topMenuData,
    selectedKeys: state.common.selectedTopKeys,
    firstLeaf: state.common.firstLeaf,
  }
}, {
  clickTopMenu: common.clickTopMenu,
  initialMenu: common.initialMenu,
})(TopMenu)

class CoreLayout extends Component {
  render () {
    return (
      <Layout>
        <ChangePwdFormWrapper />
        <Sider
          collapsible
          collapsedWidth="0"
          breakpoint="sm"
          width={200}>
          <layout className="flex flex-v" style={{ height: '100%', borderRight: '1px solid #ececec' }}>
            <div className="logo-wrapper flex flex-v flex-c">
              <div className="logo"><img src="/tobobo_logo.png" style={{ height: 150 }} /></div>
              <div className="logo-title">兔波波车配管理后台</div>
            </div>
            <SideMenu />
          </layout>
        </Sider>
        <Layout>
          <TopMenuWrapper />
          <Scrollbars
            style={{ height: document.body.clientHeight }}
          >
            <Content style={{ padding: 0, margin: 0 }}>
              {this.props.children}
            </Content>
          </Scrollbars>
        </Layout>
      </Layout>
    )
  }
}

export default connect()(CoreLayout)
