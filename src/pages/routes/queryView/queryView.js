/*
 * @Author: hjh
 * @Date: 2019-12-13 09:16:42
 * @LastEditTime: 2020-04-07 15:44:29
 * @Descripttion: 查询视图
 */
import React from 'react'
import { connect } from 'dva'
import QueryViewCmp from '../../components/queryView/QueryViewCmp'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { Checkbox } from 'antd'
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
    title: '是否生效',
    dataIndex: 'EFFECTIVE',
    width: 80,
    render(text) {
      return <Checkbox checked={text} />
    }
  },
  {
    title: '版本',
    dataIndex: 'VER',
    width: 80
  },
  {
    title: '查询视图标识',
    dataIndex: 'NO'
  },
  {
    title: '查询视图名称',
    dataIndex: 'NAME'
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME'
  },
  {
    title: '查询对象',
    dataIndex: 'ITEMNO'
  },
  {
    title: '查询条件',
    dataIndex: 'WCONDITION',
    render(text) {
      return (
        <Ellipsis tooltip length={100}>
          {text}
        </Ellipsis>
      )
    }
  },
  { title: '控制权限', dataIndex: 'CONTROLAUTH' },
  { title: '支持复制', dataIndex: 'COPYABLE' }
]
const QueryView = ({ dispatch, queryView, isModeling }) => {
  let { list, record, visible, selectedRowKeys, itemList, selectedRows, PID, ITEMNO, menuList, showTab } = queryView
  const { STATE, EFFECTIVE } = selectedRows[0] || {}
  let disabled = !(selectedRows[0] && isModeling && (STATE === 'U' || STATE === 'C'))
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const { ITEMNO, ID } = selectedRows[0]
    dispatch({ type: 'queryView/packet', payload: { selectedRowKeys, selectedRows, ITEMNO, showTab: true, PID: ID } })
    dispatch({ type: 'queryView/getRelationMenu', payload: { PID: ID } })
  }

  // const recovery = record => {
  //   dispatch({ type: 'queryView/recovery', payload: { record } })
  // }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'queryView/packet', payload: { record, visible: !visible } })
  }

  const del = record => {
    dispatch({ type: 'queryView/del', payload: { record } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const upgrade = selectedRow => {
    dispatch({ type: 'queryView/upgrade', payload: { selectedRow } })
  }

  const closeTab = () => {
    dispatch({ type: 'queryView/packet', payload: { showTab: false } })
  }

  const synchro = selectedRow => {
    dispatch({ type: 'queryView/synchro', payload: { selectedRow } })
  }

  const showSysObject = sql => {
    dispatch({ type: 'queryView/query', payload: { sql } })
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
      disabled,
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: STATE === 'U' ? '取消升版' : '删除',
      disabled: !(selectedRows[0] && isModeling && (STATE === 'U' || STATE === 'C')),
      func: () => {
        showConfirm(
          () => {
            del(selectedRows[0])
          },
          STATE === 'U' ? '取消升版?' : '确认删除?'
        )
      }
    },
    {
      name: '同步建模',
      disabled: !(selectedRows[0] && (STATE === 'C' || STATE === 'U' || (STATE === 'F' && !EFFECTIVE))),
      func: () => {
        showConfirm(() => {
          synchro(selectedRows[0])
        }, '确认同步当前选择数据？')
      }
    },
    {
      name: '升版',
      disabled: !(selectedRows[0] && isModeling && STATE === 'F'),
      func: () => {
        showConfirm(() => {
          upgrade(selectedRows[0])
        }, '确认升级当前选择数据版本？')
      }
    }
  ]

  const tableProps = { btns, list, rowSelection, columns }
  const formProps = { record, visible, title: '关联关系', toogleModal, itemList }
  const props = { showTab, disabled, menuList, PID, ITEMNO, tableProps, formProps, closeTab }

  return <QueryViewCmp {...props} />
}

function mapStateToProps({ queryView, user: { isModeling } }) {
  return { queryView, isModeling }
}

export default connect(mapStateToProps)(QueryView)
