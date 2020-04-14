/*
 * @Author: hjh
 * @Date: 2019-12-16 13:53:29
 * @LastEditTime: 2020-03-26 15:40:12
 * @Descripttion: 消息事务
 */

import React from 'react'
import { connect } from 'dva'
import { showConfirm } from '../../../utils/utils'
import TableWithBtn from '../../components/common/TableWithBtn'
import MqAffairForm from '../../components/msgLines/MqAffairForm'
import { mqMtype } from '../../../utils/paramsConfig'

const columns = [
  {
    title: '标识',
    dataIndex: 'NO',
    width: 200
  },
  {
    title: '名称',
    dataIndex: 'NAME',
    width: 200
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '总线名称',
    dataIndex: 'CHANNELNAME',
    width: 200
  },
  {
    title: '执行类型',
    dataIndex: 'MTYPE',
    render(text) {
      return mqMtype[text - 1]
    }
  }
]
const MqAffair = ({ dispatch, mqAffair, isModeling }) => {
  let { list, record, visible, selectedRowKeys, selectedRows, mqLinesList = [] } = mqAffair

  const { STATE, EFFECTIVE } = selectedRows[0] || {}

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({
      type: 'mqAffair/packet',
      payload: { selectedRowKeys, selectedRows, disabled: !isModeling }
    })
  }

  const toogleModal = (record = {}) => {
    if (!visible) {
      dispatch({ type: 'mqAffair/queryMqLines' })
    }
    dispatch({ type: 'mqAffair/packet', payload: { record, visible: !visible } })
  }

  const del = record => {
    dispatch({ type: 'mqAffair/del', payload: { record } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const synchro = selectedRow => {
    dispatch({ type: 'mqAffair/synchro', payload: { selectedRow } })
  }

  const showSysObject = sql => {
    dispatch({ type: 'mqAffair/query', payload: { sql } })
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
  const formProps = { record, visible, title: '消息事务', toogleModal, mqLinesList }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TableWithBtn {...tableProps} />
      <MqAffairForm {...formProps} />
    </div>
  )
}

function mapStateToProps({ mqAffair, user: { isModeling } }) {
  return { mqAffair, isModeling }
}

export default connect(mapStateToProps)(MqAffair)
