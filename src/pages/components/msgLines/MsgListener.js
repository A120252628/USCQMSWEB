/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2020-03-23 17:59:57
 * @Descripttion: 对象表格组件
 */

import React from 'react'
import { connect } from 'dva'
import TableWithBtn from '../common/TableWithBtn'
import MsgListenerForm from './MsgListenerForm'
import { showConfirm } from '../../../utils/utils'

const columns = [
  {
    title: '标识',
    dataIndex: 'NO',
    width: 100
  },
  {
    title: '名称',
    dataIndex: 'NAME',
    width: 100
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '监听队列',
    dataIndex: 'QUEUES',
    width: 100
  }
]
const MsgListener = ({ dispatch, msgListener, PID, disabled }) => {
  let { visible, record, selectedRowKeys, selectedRows, list } = msgListener

  const toogleModal = (record = {}) => {
    dispatch({ type: 'msgListener/packet', payload: { record, visible: !visible } })
  }

  const del = record => {
    dispatch({
      type: 'msgListener/del',
      payload: { ID: record.ID, STATE: record.STATE, PID }
    })
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({ type: 'msgListener/packet', payload: { selectedRowKeys, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const btns = [
    {
      name: '新建',
      disabled,
      func: () => {
        toogleModal()
      }
    },
    {
      name: '修改',
      disabled: disabled || !selectedRows[0],
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: '删除',
      disabled: disabled || !selectedRows[0],
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    }
  ]
  const props = {
    list,
    columns,
    btns,
    listName: 'list',
    tableName: 'usc_model_msglistener',
    canDragRow: !disabled,
    rowSelection
  }

  const formProps = { visible, toogleModal, PID, record, list }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TableWithBtn {...props} />
      <MsgListenerForm {...formProps} />
    </div>
  )
}

function mapStateToProps({ msgListener }) {
  return { msgListener }
}

export default connect(mapStateToProps)(MsgListener)
