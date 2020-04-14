/*
 * @Author: hjh
 * @Date: 2019-12-12 16:44:46
 * @LastEditTime: 2020-03-26 15:40:22
 * @Descripttion: 关联关系
 */
import React from 'react'
import { connect } from 'dva'
import RelationshipCmp from '../../components/relationship/RelationshipCmp'
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
    align: 'center',
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
    title: '支持搜索',
    dataIndex: 'SUPQUERY',
    width: 80,
    align: 'center',
    render(text) {
      return <Checkbox checked={text} />
    }
  },
  {
    title: '标识',
    dataIndex: 'NO',
    width: 150
  },
  {
    title: '关系名称',
    dataIndex: 'NAME',
    width: 150
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '关系对象',
    dataIndex: 'RELATIONITEM',
    width: 150
  },
  {
    title: '对象A',
    dataIndex: 'ITEMA',
    width: 150
  },
  {
    title: '对象B',
    dataIndex: 'ITEMB',
    width: 150
  },
  {
    title: '关系集合中的父对象',
    dataIndex: 'PITEM',
    width: 150
  },
  {
    title: '排序字段',
    dataIndex: 'SORTFIELDS',
    width: 200
  }
]
const Relationship = ({ dispatch, relationship, isModeling }) => {
  let { list, record, visible, selectedRowKeys, menuList, PID, ITEMB, selectedRows, showTab, ITEMA } = relationship

  const { STATE, EFFECTIVE } = selectedRows[0] || {}
  let disabled = !(selectedRows[0] && isModeling && (STATE === 'U' || STATE === 'C'))

  // const recovery = record => {
  //   dispatch({ type: 'relationship/recovery', payload: { record } })
  // }

  const closeTab = () => {
    dispatch({ type: 'relationship/packet', payload: { showTab: false } })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'relationship/packet', payload: { visible: !visible, record } })
  }

  const del = record => {
    dispatch({ type: 'relationship/del', payload: { record } })
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    const { ITEMB, ID, ITEMA } = selectedRows[0]
    dispatch({
      type: 'relationship/packet',
      payload: {
        selectedRowKeys,
        selectedRows,
        ITEMB,
        showTab: true,
        PID: ID,
        ITEMA
      }
    })
    dispatch({ type: 'relationship/getRelationMenu', payload: { PID: ID } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const upgrade = selectedRow => {
    dispatch({ type: 'relationship/upgrade', payload: { selectedRow } })
  }

  const synchro = selectedRow => {
    dispatch({ type: 'relationship/synchro', payload: { selectedRow } })
  }

  const onSearch = queryWord => {
    dispatch({ type: 'relationship/search', payload: { queryWord } })
  }

  const showSysObject = sql => {
    dispatch({ type: 'relationship/query', payload: { sql } })
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

  const tableProps = { btns, onSearch, list, rowSelection, columns }
  const formProps = { record, visible, title: '关联关系', toogleModal }
  const props = { showTab, disabled, menuList, PID, ITEMB, tableProps, formProps, closeTab, ITEMA }

  return <RelationshipCmp {...props} />
}

function mapStateToProps({ relationship, user: { isModeling } }) {
  return { relationship, isModeling }
}

export default connect(mapStateToProps)(Relationship)
