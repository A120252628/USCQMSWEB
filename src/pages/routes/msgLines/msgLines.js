/*
 * @Author: hjh
 * @Date: 2019-12-16 13:53:29
 * @LastEditTime: 2020-04-14 09:03:55
 * @Descripttion: 全局表格
 */

import React from 'react'
import { connect } from 'dva'
import MsgLinesCmp from '../../components/msgLines/MsgLinesCmp'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { stateMap } from '../../../utils/paramsConfig'
import { showConfirm } from '../../../utils/utils'

const columns = [
  {
    title: '状态',
    dataIndex: 'STATE',
    width: 80,
    render(text) {
      return stateMap[text]
    }
  },
  {
    title: '标识',
    dataIndex: 'NO',
    width: 200,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '名称',
    dataIndex: 'NAME',
    width: 200,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '备注',
    dataIndex: 'REMARK',
    width: 100,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  }
]
const MsgLines = ({ dispatch, msgLines, isModeling }) => {
  let { list, record, visible, selectedRowKeys, disabled = true, selectedRows, PID, showTab } = msgLines

  const { STATE, EFFECTIVE } = selectedRows[0] || {}

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const { ID } = selectedRows[0]
    dispatch({
      type: 'msgLines/packet',
      payload: { selectedRowKeys, selectedRows, disabled: !isModeling, showTab: true, PID: ID }
    })
    dispatch({ type: 'msgListener/query', payload: { PID: ID } })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'msgLines/packet', payload: { record, visible: !visible } })
  }

  const del = record => {
    dispatch({ type: 'msgLines/del', payload: { record } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const closeTab = () => {
    dispatch({ type: 'msgLines/packet', payload: { showTab: false } })
  }

  const synchro = selectedRow => {
    dispatch({ type: 'msgLines/synchro', payload: { selectedRow } })
  }

  const showSysObject = sql => {
    dispatch({ type: 'msgLines/query', payload: { sql } })
  }

  const btns = [
    {
      name: `选择显示关系`,
      btns: [
        {
          name: '显示已同步关系',
          func: () => {
            showSysObject(`state IN('F')`)
          }
        },
        {
          name: '显示设计中关系',
          disabled: !isModeling,
          func: () => {
            showSysObject(`state IN('C','U')`)
          }
        }
      ]
    },
    {
      name: '新建',
      disabled: !isModeling,
      func: () => {
        toogleModal()
      }
    },
    {
      name: '修改',
      disabled: !isModeling || !selectedRows[0],
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: '删除',
      disabled: !(isModeling && selectedRows[0]),
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    },
    {
      name: '同步建模',
      disabled: !(isModeling && selectedRows[0] && (STATE === 'C' || STATE === 'U' || (STATE === 'F' && !EFFECTIVE))),
      func: () => {
        showConfirm(() => {
          synchro(selectedRows[0])
        }, '确认同步当前选择数据？')
      }
    }
  ]

  const tableProps = { btns, list, rowSelection, columns }
  const formProps = { record, visible, title: '全局表格', toogleModal, list }
  const props = { showTab, disabled, PID, tableProps, formProps, closeTab }

  return <MsgLinesCmp {...props} />
}

function mapStateToProps({ msgLines, user: { isModeling } }) {
  return { msgLines, isModeling }
}

export default connect(mapStateToProps)(MsgLines)
