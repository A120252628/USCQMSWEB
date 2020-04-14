import React from 'react'
import styles from './index.css'
import { Dropdown, Avatar, Divider, Button, Menu, Modal, Layout, Select } from 'antd'
import Notice from '../../routes/notice/Notice'
import { connect } from 'dva'
import OnlineUser from '../user/OnlineUser'
import Alert from '../alert/Alert'
import PassWordForm from '../user/PassWordForm'
import UserInfoForm from '../user/UserInfoForm'
import logo from '../../../assets/infinity-logo.png'

const { Header } = Layout
const { Option } = Select

const HeaderCmp = ({ dispatch, user, theme }) => {
  const DividerCmp = <Divider type='vertical' style={{ background: theme ? '#fff' : '#000' }} />
  const employeeName = localStorage.getItem('employeeName')
  const userName = localStorage.getItem('userName')
  const AcceptLanguage = localStorage.getItem('AcceptLanguage')
  const { isModeling, visible, infoVisible, userInfo } = user
  const toogleModal = () => {
    dispatch({ type: 'user/toogleModal' })
  }
  const queryUserInfo = () => {
    dispatch({ type: 'user/query' })
  }
  const logout = () => {
    if (isModeling) {
      Modal.confirm({
        title: '提示',
        content: '正在建模中，是否保存建模？',
        async onOk() {
          await dispatch({ type: `user/endModel`, payload: { force: true } })
          dispatch({ type: 'login/logout' })
        },
        async onCancel() {
          await dispatch({ type: `user/endModel`, payload: { force: false } })
          dispatch({ type: 'login/logout' })
        },
        okText: '保存',
        cancelText: '放弃'
      })
    } else {
      dispatch({ type: 'login/logout' })
    }
  }

  // const synchro = () => {
  //   dispatch({ type: 'user/synchro' })
  // }

  const clickModel = () => {
    dispatch({
      type: `user/${!isModeling ? 'startModel' : 'endModel'}`,
      callback: data => {
        const { force, info } = data
        Modal.confirm({
          title: '提示',
          content: info,
          onOk() {
            dispatch({ type: `user/endModel`, payload: { force } })
          },
          onCancel() {
            dispatch({ type: `user/endModel`, payload: { force: false } })
          },
          okText: '保存',
          cancelText: '放弃'
        })
      }
    })
  }
  const toogleInfo = () => {
    dispatch({ type: 'user/toogleInfo' })
  }
  const languageChange = val => {
    dispatch({ type: 'user/changeLanguage', payload: { val } })
  }
  const menu = (
    <Menu>
      {employeeName !== 'admin' && <Menu.Item onClick={queryUserInfo}>个人信息</Menu.Item>}
      <Menu.Item onClick={toogleModal}>修改密码</Menu.Item>
      <Menu.Item onClick={logout}>退出</Menu.Item>
    </Menu>
  )
  return (
    <Header className={`${styles.layout_header} ${theme && styles.header_dark}`}>
      <div className={`${styles.layout_title} ${theme && styles.title_dark}`}>
        <img src={logo} className={styles.header_logo} alt='logo' />
      </div>
      <div className={styles.layout_header_div_message}>
        <Select onChange={languageChange} defaultValue={AcceptLanguage} style={{ width: 100 }}>
          <Option value='zh-CN'>中文</Option>
          <Option value='en-US'>English</Option>
        </Select>
        {DividerCmp}
        {(userName === 'admin' || userName === 'hjh' || userName === 'lwp') && (
          <span>
            {/* {isModeling && (
              <Button style={{ marginTop: 3, marginRight: 5 }} type='primary' onClick={synchro}>
                同步建模
              </Button>
            )} */}
            <Button style={{ marginTop: 3, marginRight: 5 }} type='primary' onClick={clickModel}>
              {!isModeling ? '开始' : '结束'}建模
            </Button>
            {DividerCmp}
          </span>
        )}
        <Alert />
        {DividerCmp}
        <OnlineUser />
        {DividerCmp}
        <Notice theme={theme} />
        {DividerCmp}
        <Dropdown overlay={menu} trigger={['click']}>
          <div className={styles.header_user}>
            {localStorage.getItem('userName') !== 'admin' ? (
              <Avatar
                size={30}
                style={{ backgroundColor: '#e9ebee' }}
                src={`api/src/user/getAvatar/${localStorage.getItem('userId')}`}
              />
            ) : (
              <Avatar size={30} icon='user' />
            )}
            <span style={{ marginLeft: 3, marginRight: 5 }}>{employeeName}</span>
          </div>
        </Dropdown>
      </div>
      <PassWordForm visible={visible} title='修改密码' width={550} toogleModal={toogleModal} />
      <UserInfoForm
        visible={infoVisible}
        title='个人信息'
        width={800}
        toogleModal={toogleInfo}
        userInfo={userInfo}
        okText='保存'
      />
    </Header>
  )
}

function mapStateToProps({ user, menu }) {
  return { user, theme: menu.theme }
}

export default connect(mapStateToProps)(HeaderCmp)
