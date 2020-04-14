/*
 * @Author: hjh
 * @Date: 2019-09-23 10:37:33
 * @LastEditTime: 2020-03-26 15:43:27
 * @Descripttion: 自动分类视图
 */

import React from 'react'
import { connect } from 'dva'
import AutoClassCmp from '../../components/autoClass/AutoClassCmp'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { Checkbox } from 'antd'
import { showConfirm } from '../../../utils/utils'
import { stateMap } from '../../../utils/paramsConfig'
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
    title: '标识',
    dataIndex: 'NO'
  },
  {
    title: '名称',
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
  {
    title: '控制权限',
    dataIndex: 'CONTROLAUTH'
  },
  {
    title: '支持复制',
    dataIndex: 'COPYABLE'
  }
]
const AutoClass = ({ dispatch, autoClass, isModeling }) => {
  let {
    list = [],
    record,
    visible,
    selectedRowKeys,
    selectedRows = [],
    itemOptions,
    showTab,
    PID,
    activeKey = '1',
    ITEMNO,
    menuList
  } = autoClass
  const { STATE, EFFECTIVE } = selectedRows[0] || {}
  let disabled = !(selectedRows[0] && isModeling && (STATE === 'U' || STATE === 'C'))

  function onSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'autoClass/packet',
      payload: {
        selectedRowKeys,
        selectedRows,
        showTab: true,
        PID: selectedRows[0].ID,
        ITEMNO: selectedRows[0].ITEMNO
      }
    })
    changePane(activeKey, selectedRows)
  }

  const closeTab = () => {
    dispatch({ type: 'autoClass/packet', payload: { showTab: false } })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'autoClass/toogleModal', payload: { record } })
  }

  const del = record => {
    dispatch({
      type: 'autoClass/del',
      payload: { record }
    })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const upgrade = selectedRow => {
    dispatch({ type: 'autoClass/upgrade', payload: { selectedRow } })
  }

  const changePane = (activeKey, rows = selectedRows) => {
    dispatch({ type: 'autoClass/packet', payload: { activeKey, PID: rows[0].ID } })
    switch (activeKey) {
      case '1':
        dispatch({ type: 'viewStructure/query', payload: { PID: rows[0].ID } })
        dispatch({ type: 'viewStructure/packet', payload: { selectedRowKeys: [], selectedRows: [] } })
        break
      case '2':
        dispatch({ type: 'autoClass/getRelationMenu', payload: { PID: rows[0].ID, activeKey } })
        break
      default:
        console.log('wrong activeKey')
    }
  }

  const synchro = selectedRow => {
    dispatch({ type: 'autoClass/synchro', payload: { selectedRow } })
  }

  // const recovery = record => {
  //   dispatch({
  //     type: 'autoClass/recovery',
  //     payload: { record }
  //   })
  // }

  const showSysObject = sql => {
    dispatch({ type: 'autoClass/query', payload: { sql } })
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

  let props = {
    dispatch,
    list,
    visible,
    record,
    columns,
    rowSelection,
    btns,
    toogleModal,
    itemOptions,
    closeTab,
    showTab,
    PID,
    disabled,
    changePane,
    activeKey,
    ITEMNO,
    menuList
  }

  return <AutoClassCmp {...props} />
}

function mapStateToProps({ autoClass, user: { isModeling } }) {
  return { autoClass, isModeling }
}

export default connect(mapStateToProps)(AutoClass)
