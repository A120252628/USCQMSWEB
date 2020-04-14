/*
 * @Author: hjh
 * @Date: 2019-12-12 11:40:58
 * @LastEditTime: 2020-04-14 09:03:23
 * @Descripttion: 导航菜单
 */
import React from 'react'
import { connect } from 'dva'
import { message, Checkbox } from 'antd'
import NavCmp from '../../components/nav/NavCmp'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { facetypeMap } from '../../../utils/paramsConfig'
import { showConfirm } from '../../../utils/utils'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'NAME',
    width: 250
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '菜单编码',
    dataIndex: 'NO',
    width: 100
  },
  {
    title: '页面类型',
    dataIndex: 'FACETYPE',
    width: 100,
    render(text) {
      let fType = facetypeMap.find(item => item.value === text)
      return (
        <Ellipsis tooltip lines={1}>
          {(fType && fType.name) || text}
        </Ellipsis>
      )
    }
  },
  {
    title: '图标',
    dataIndex: 'ICON',
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
    title: '参数',
    dataIndex: 'PARAMS',
    width: 300,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '创建人',
    dataIndex: 'CUSER'
  }
]
const Nav = ({ dispatch, nav, isModeling }) => {
  let {
    visible,
    list,
    selectedRowKeys,
    record,
    selectedRows = [],
    showTab = false,
    menuList,
    PID,
    ITEMNO,
    classItemNo,
    LEVEL,
    visibleParams,
    expandedRowKeys = [0]
  } = nav

  const disabled = !(isModeling && selectedRows[0])

  const closeTab = () => {
    dispatch({ type: 'nav/packet', payload: { showTab: false } })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'nav/packet', payload: { visible: !visible, record } })
  }

  const toogleParams = (record = {}) => {
    dispatch({ type: 'nav/packet', payload: { visibleParams: !visibleParams, record } })
  }

  const del = values => {
    if (values.id === 1) {
      return message.error('这是根目录，不能删除')
    } else {
      dispatch({ type: 'nav/del', payload: { values } })
    }
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const { ID, PARAMS, LEVEL } = selectedRows[0]
    dispatch({ type: 'nav/packet', payload: { selectedRowKeys, selectedRows, LEVEL, PID: ID } })
    const { FACETYPE } = selectedRows[0]
    if (!FACETYPE || FACETYPE === -1) {
      closeTab()
    } else {
      if (PARAMS && JSON.parse(PARAMS)) {
        const { itemNo, classItemNo } = JSON.parse(PARAMS)
        dispatch({
          type: 'nav/packet',
          payload: { ITEMNO: itemNo, classItemNo }
        })
      }
      dispatch({ type: 'nav/getRelationMenu', payload: { PID: ID } })
      dispatch({ type: 'nav/packet', payload: { showTab: true } })
    }
  }

  const synchro = selectedRow => {
    dispatch({ type: 'nav/synchro', payload: { selectedRow } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const btns = [
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
      name: '删除',
      disabled,
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    },
    {
      name: '参数',
      disabled: disabled || selectedRows[0].FACETYPE <= 0,
      func: () => {
        toogleParams(selectedRows[0])
      }
    },
    {
      name: '同步建模',
      disabled: !isModeling,
      func: () => {
        showConfirm(() => {
          synchro(selectedRows[0])
        }, '确认同步当前选择数据？')
      }
    }
  ]

  const tableProps = {
    btns,
    list,
    rowSelection,
    columns,
    tableName: 'usc_model_navigation',
    listName: 'list',
    canDragRow: isModeling,
    isTree: true,
    namespace: 'nav',
    defaultExpandedRowKeys: [0],
    expandedRowKeys
  }
  const formProps = { record, visible, title: '菜单管理', toogleModal, PID, LEVEL }
  const form2Props = { record, visible: visibleParams, title: '菜单参数', toogleModal: toogleParams, PID }
  const props = { closeTab, showTab, menuList, PID, ITEMNO, classItemNo, tableProps, formProps, form2Props, disabled }
  return <NavCmp {...props} />
}
function mapStateToProps({ nav, user: { isModeling } }) {
  return { nav, isModeling }
}

export default connect(mapStateToProps)(Nav)
