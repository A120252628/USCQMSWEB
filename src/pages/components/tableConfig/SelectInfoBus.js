/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime: 2020-03-24 09:14:03
 * @Descripttion: 选择菜单组件
 */

import React from 'react'
import { connect } from 'dva'
import { message } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import InfoBusForm from './MsgLinesForm'
import Modal from '../common/DragModal'
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
    title: '总线名称',
    dataIndex: 'CHANNELNAME',
    width: 100
  },
  {
    title: '执行内容',
    dataIndex: 'MCONTENT',
    width: 200
  },
  {
    title: '请求参数',
    dataIndex: 'REQPARAM'
  }
]
const SelectInfoBus = ({ selectInfoBus, dispatch }) => {
  const { visible, list, selectedRowKey, selectedRows, menuVisible, record = {}, onSelect, mqLinesList } = selectInfoBus

  const toogleModal = () => {
    dispatch({ type: 'selectInfoBus/packet', payload: { visible: false } })
  }

  const toogleEdit = type => {
    if (type === 1) {
      if (selectedRows.length > 0) {
        dispatch({ type: 'selectInfoBus/packet', payload: { record: selectedRows[0], menuVisible: !menuVisible } })
      } else {
        message.warning('请选择数据~')
      }
    } else {
      dispatch({ type: 'selectInfoBus/queryMqlines' })
      dispatch({ type: 'selectInfoBus/packet', payload: { record: {}, menuVisible: !menuVisible } })
    }
  }

  const del = () => {
    if (selectedRows.length > 0) {
      showConfirm(() => {
        dispatch({ type: 'selectInfoBus/del', payload: { record: selectedRows[0] } })
      })
    } else {
      message.warning('请选择数据~')
    }
  }

  const Ok = () => {
    if (selectedRows[0]) {
      onSelect(selectedRows[0])
      toogleModal()
    } else {
      message.warn('请选择数据~')
    }
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'selectInfoBus/packet', payload: { selectedRowKey, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }
  const onSearch = () => {}
  const btns = [
    {
      name: '新建',
      func: () => {
        toogleEdit(0)
      }
    },
    {
      name: '修改',
      func: () => {
        toogleEdit(1)
      }
    },
    {
      name: '删除',
      func: () => {
        del()
      }
    }
  ]
  const props = { onSearch, list, columns, btns, rowSelection, height: 400 }
  return (
    <Modal width={800} title='选择信息总线' visible={visible} onOk={Ok} onCancel={toogleModal}>
      <TableWithBtn {...props} />
      <InfoBusForm
        mqLinesList={mqLinesList || []}
        visible={menuVisible}
        record={record}
        toogleModal={toogleEdit}
        width={650}
        title='编辑信息总线'
      />
    </Modal>
  )
}

function mapStateToProps({ selectInfoBus }) {
  return { selectInfoBus }
}

export default connect(mapStateToProps)(SelectInfoBus)
