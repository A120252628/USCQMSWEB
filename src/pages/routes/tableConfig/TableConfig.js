/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2020-03-30 11:27:42
 * @Descripttion: 配置平台
 */

import React from 'react'
import { connect } from 'dva'
import TableConfigCmp from '../../components/tableConfig/TableConfigCmp'
import { Checkbox } from 'antd'

import { showConfirm } from '../../../utils/utils'
import { stateMap } from '../../../utils/paramsConfig'

const typeMap = ['普通对象', '文件对象', '关联对象', '分类对象']

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
    title: '对象标识',
    dataIndex: 'ITEMNO',
    width: 200
  },
  {
    title: '数据库表名',
    dataIndex: 'TABLENAME',
    width: 200
  },
  {
    title: '业务对象名称',
    dataIndex: 'NAME',
    width: 200
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '生命周期',
    dataIndex: 'IDLIFE',
    width: 80,
    render(text) {
      return text ? '有' : '无'
    }
  },
  {
    title: '对象类型',
    dataIndex: 'TYPE',
    width: 150,
    render(text) {
      return typeMap[text]
    }
  },
  {
    title: '快速查询字段',
    dataIndex: 'QUERYFIELDS',
    width: 300
  },
  {
    title: '备注',
    dataIndex: 'REMARK',
    width: 100
  },
  {
    title: '控制归档权',
    dataIndex: 'CONTRLFILE',
    render(text) {
      return text ? '是' : '否'
    }
  }
]

const TableConfig = ({ dispatch, tableConfig, isModeling }) => {
  let {
    list,
    activeKey,
    record,
    selectedRowKey,
    selectedRows,
    showTab,
    visible,
    fieldList,
    menuList,
    propertyList,
    propertyItemList,
    gridList,
    gridItemList,
    relationList,
    relationItemList,
    PID,
    ITEMNO,
    modalFooter = true
  } = tableConfig

  console.log(localStorage.getItem('AcceptLanguage'))
  const { STATE, EFFECTIVE } = selectedRows[0] || {}
  let disabled = !(selectedRows[0] && isModeling && (STATE === 'U' || STATE === 'C'))

  const toogleModal = (record = {}, TYPE) => {
    dispatch({ type: 'tableConfig/toogleModal', payload: { record: { ...record, TYPE } } })
    if (!visible && record) {
      dispatch({ type: 'tableConfig/queryItem', payload: { activeKey: '1', PID: record.ID } })
    } else {
      dispatch({ type: 'tableConfig/packet', payload: { modalFooter: true } })
    }
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    const { ITEMNO } = selectedRows[0]
    dispatch({
      type: 'tableConfig/packet',
      payload: { selectedRowKey, selectedRows, ITEMNO }
    })
    dispatch({ type: 'tableConfig/clearItemData' })
    changePane(activeKey, selectedRows[0])
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }

  const onRowClick = () => {
    !showTab && dispatch({ type: 'tableConfig/packet', payload: { showTab: true } })
  }

  const closeTab = () => {
    dispatch({ type: 'tableConfig/packet', payload: { showTab: false } })
  }

  const changePane = (activeKey, rows = selectedRows[0]) => {
    dispatch({ type: 'tableConfig/packet', payload: { activeKey, PID: rows.ID } })
    dispatch({ type: 'tableConfig/queryItem', payload: { activeKey, PID: rows.ID } })
  }

  const del = record => {
    dispatch({ type: 'tableConfig/del', payload: { record, activeKey } })
  }

  // const recovery = record => {
  //   dispatch({ type: 'tableConfig/recovery', payload: { record } })
  // }

  const onSearch = queryWord => {
    dispatch({ type: 'tableConfig/search', payload: { queryWord } })
  }

  const showSysObject = sql => {
    dispatch({ type: 'tableConfig/query', payload: { sql } })
  }

  const showInvalidObject = () => {
    dispatch({ type: 'tableConfig/queryInvalid' })
  }

  const upgrade = selectedRow => {
    dispatch({ type: 'tableConfig/upgrade', payload: { selectedRow } })
    showSysObject(`STATE='U'`)
  }

  const synchro = selectedRow => {
    dispatch({ type: 'tableConfig/synchro', payload: { selectedRow } })
  }
  const btns = [
    {
      name: `选择显示对象`,
      btns: [
        {
          name: '显示业务对象',
          func: () => {
            showSysObject(`sitem=0`)
          }
        },
        {
          name: '显示系统对象',
          func: () => {
            showSysObject(`sitem=1`)
          }
        },
        {
          name: '显示设计中对象',
          disabled: !isModeling,
          func: () => {
            showSysObject(`state IN('C','U')`)
          }
        },
        {
          name: '显示已作废对象',
          disabled: !isModeling,
          func: () => {
            showInvalidObject()
          }
        }
      ]
    },
    {
      name: '选择新建对象',
      disabled: !isModeling,
      btns: [
        {
          name: '新建普通对象',
          disabled: !isModeling,
          func: () => {
            toogleModal(null, 0)
          }
        },
        {
          name: '新建文件对象',
          disabled: !isModeling,
          func: () => {
            toogleModal(null, 1)
          }
        },
        {
          name: '新建关联对象',
          disabled: !isModeling,
          func: () => {
            toogleModal(null, 2)
          }
        },
        {
          name: '新建分类对象',
          disabled: !isModeling,
          func: () => {
            toogleModal(null, 3)
          }
        }
      ]
    },
    {
      name: '修改',
      disabled,
      func: () => {
        toogleModal(selectedRows[0], selectedRows[0].TYPE)
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

  const onDoubleClick = record => {
    toogleModal(record, record.TYPE)
    dispatch({ type: 'tableConfig/packet', payload: { modalFooter: false } })
  }

  const props = {
    list,
    activeKey,
    columns,
    record,
    toogleModal,
    rowSelection,
    onRowClick,
    showTab,
    closeTab,
    changePane,
    visible,
    fieldList,
    menuList,
    propertyList,
    propertyItemList,
    gridList,
    gridItemList,
    relationList,
    relationItemList,
    PID,
    onSearch,
    btns,
    disabled,
    ITEMNO,
    onDoubleClick,
    modalFooter
  }

  return <TableConfigCmp {...props} />
}

function mapStateToProps({ tableConfig, user: { isModeling } }) {
  return { tableConfig, isModeling }
}

export default connect(mapStateToProps)(TableConfig)
