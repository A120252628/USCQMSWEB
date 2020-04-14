/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2020-03-26 15:39:15
 * @Descripttion: 对象菜单组件
 */

import React from 'react'
import { connect } from 'dva'
import { Button, Popconfirm } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import WorkMenuForm from './WorkMenuForm'
import MoreMenus from './MoreMenus'

class Menus extends React.Component {
  state = { visible: false, record: {}, visibleParams: false, menuList: [], modalFooter: true }

  toogleModal = (type = 0, item = null, abtype) => {
    let record = { MTYPE: type, PID: (item && item.ID) || '0', ABTYPE: (item && item.ABTYPE) || abtype }
    this.setState({ record, visible: !this.state.visible, modalFooter: true })
  }

  toogleEdit = record => {
    this.setState({ record, visible: true })
  }

  toogleParams = record => {
    this.setState({ record, visibleParams: !this.state.visibleParams })
  }

  del = async record => {
    const { dispatch, PID, namespace, activeKey } = this.props
    await dispatch({
      type: 'tableConfig/delItem',
      payload: { ID: record.ID, STATE: record.STATE, PID, activeKey: '2' }
    })
    dispatch({
      type: `${namespace}/getRelationMenu`,
      payload: { PID, activeKey }
    })
  }

  onParamOk = values => {
    const { dispatch, PID } = this.props
    const { record } = this.state
    dispatch({ type: 'tableConfig/addOrEditItem', payload: { values, PID, record, activeKey: '2' } })
  }
  render() {
    const { PID, disabled, ITEMNO, activeKey, menuList, namespace, classItemNo, ITEMA, isModeling } = this.props
    const { visible, record, visibleParams, modalFooter } = this.state

    const btns = [
      {
        name: '新建菜单项',
        disabled,
        func: () => {
          this.toogleModal(0)
        }
      },
      {
        name: '新建菜单组',
        disabled,
        func: () => {
          this.toogleModal(1)
        }
      }
    ]
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'NAME',
        width: 300
      },
      {
        title: '英文名称',
        dataIndex: 'ENNAME',
        width: 200
      },
      {
        title: '菜单编码',
        dataIndex: 'NO',
        width: 150
      },
      {
        title: '菜单类型',
        dataIndex: 'MTYPE',
        width: 100,
        render(text) {
          return <span>{text === 0 ? '菜单项' : '菜单组'}</span>
        }
      },
      {
        title: '参数',
        dataIndex: 'PARAMS',
        width: 50
      },
      {
        title: '操作',
        align: 'left',
        width: 300,
        render: (text, record) => {
          let hasBeforeAct = false
          let hasAfterAct = false
          if (record.children) {
            hasBeforeAct = record.children.some(item => item.ABTYPE === 'before')
            hasAfterAct = record.children.some(item => item.ABTYPE === 'after')
          }
          return (
            <div>
              <Button
                disabled={disabled || (record.ABTYPE && record.MTYPE === 1)}
                style={{ marginLeft: 5 }}
                type='primary'
                icon='edit'
                size='small'
                onClick={() => {
                  this.toogleEdit(record)
                }}
              >
                修改
              </Button>
              <Popconfirm
                title='确定要删除吗?'
                onConfirm={() => {
                  this.del(record)
                }}
              >
                <Button disabled={disabled} style={{ marginLeft: 5 }} type='danger' icon='delete' size='small'>
                  删除
                </Button>
              </Popconfirm>
              <Button
                size='small'
                type='primary'
                style={{ marginLeft: 5 }}
                onClick={() => {
                  this.toogleParams(record)
                }}
                disabled={disabled}
              >
                参数
              </Button>
              {record.MTYPE === 1 && (
                <span>
                  <Button
                    style={{ marginLeft: 5, background: 'yellow' }}
                    size='small'
                    onClick={() => {
                      this.toogleModal(0, record)
                    }}
                    disabled={disabled}
                  >
                    新建菜单项
                  </Button>
                  {!record.ABTYPE && (
                    <Button
                      style={{ marginLeft: 5, background: 'yellow' }}
                      size='small'
                      onClick={() => {
                        this.toogleModal(1, record)
                      }}
                      disabled={disabled}
                    >
                      新建菜单组
                    </Button>
                  )}
                </span>
              )}
              {record.MTYPE === 0 && !record.ABTYPE && (
                <span>
                  {!hasBeforeAct && (
                    <Button
                      style={{ marginLeft: 5 }}
                      type='primary'
                      size='small'
                      onClick={() => {
                        this.toogleModal(1, record, 'before')
                      }}
                      disabled={disabled}
                    >
                      新建前处理
                    </Button>
                  )}
                  {!hasAfterAct && (
                    <Button
                      style={{ marginLeft: 5 }}
                      type='primary'
                      size='small'
                      onClick={() => {
                        this.toogleModal(1, record, 'after')
                      }}
                      disabled={disabled}
                    >
                      新建后处理
                    </Button>
                  )}
                </span>
              )}
            </div>
          )
        }
      }
    ]

    const onDoubleClick = record => {
      this.toogleEdit(record)
      this.setState({ modalFooter: false })
    }

    const props = {
      list: menuList || [],
      columns,
      btns,
      tableName: 'usc_model_itemmenu',
      listName: 'menuList',
      canDragRow: isModeling,
      isTree: true,
      namespace,
      onDoubleClick
    }
    let footer = {}
    if (!modalFooter) footer = { footer: null }
    const props2 = { PID, record, ITEMNO, activeKey, namespace, classItemNo, ITEMA, ...footer }
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <TableWithBtn {...props} />
        <WorkMenuForm width={700} title='对象菜单' visible={visible} toogleModal={this.toogleModal} {...props2} />
        <MoreMenus
          visible={visibleParams}
          onCancel={this.toogleParams}
          onOk={this.onParamOk}
          menuList={menuList}
          {...props2}
        />
      </div>
    )
  }
}

function mapStateToProps({ user: { isModeling } }) {
  return { isModeling }
}

export default connect(mapStateToProps)(Menus)
