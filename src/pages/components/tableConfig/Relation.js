/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2020-03-26 15:39:45
 * @Descripttion: 对象关联页组件
 */

import React from 'react'
import { connect } from 'dva'
import { Checkbox, message } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import RelationForm from './RelationForm'
import RelationItemForm from './RelationItemForm'
import { showConfirm } from '../../../utils/utils'
import { relationTypeMap } from '../../../utils/paramsConfig'

const Relation = ({ dispatch, relation, PID, relationList, relationItemList, disabled, ITEMNO }) => {
  let {
    visible,
    record,
    selectedRowKey,
    selectedRows,
    itemVisible,
    itemRecord,
    selectedRows2,
    selectedRowKey2
  } = relation

  const columns = [
    {
      title: '默认',
      dataIndex: 'DEFAULTC',
      width: 50,
      render: (text, record) => {
        return (
          <span style={{ align: 'center' }} id='qqqqqq'>
            <Checkbox
              disabled={disabled}
              onChange={value => {
                updateSingleVal(value, record, 'DEFAULTC')
              }}
              checked={text}
            />
          </span>
        )
      }
    },
    {
      title: '关联页标识',
      dataIndex: 'NO',
      width: 100
    },
    {
      title: '关联页名称',
      dataIndex: 'NAME',
      width: 120
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    }
  ]

  const columns2 = [
    {
      title: '页签标题',
      dataIndex: 'NAME',
      width: 120
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    },
    {
      title: '关联页类型',
      dataIndex: 'RTYPE',
      width: 100,
      render(text) {
        let type = relationTypeMap.filter(item => item.value === text)[0]
        let name = (type && type.name) || text
        return <span>{name}</span>
      }
    },
    {
      title: '控制权限',
      dataIndex: 'CONTROLAUTH',
      align: 'center',
      width: 80,
      render(text) {
        return <Checkbox checked={text} />
      }
    }
  ]

  const updateSingleVal = (value, record, field, type = false) => {
    if (disabled) return
    const values = {}
    values[field] = value.target ? value.target.checked : value
    dispatch({
      type: `tableConfig/${type ? 'addOrEditRootItem' : 'addOrEditItem'}`,
      payload: { values, record, PID: type ? selectedRows[0].id : PID }
    })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'relation/toogleModal', payload: { record } })
  }

  const toogleItem = (itemRecord = {}) => {
    if (selectedRowKey && selectedRowKey.length > 0) {
      dispatch({ type: 'relation/toogleItem', payload: { itemRecord } })
    } else {
      message.warning('请选择表对象!')
    }
  }

  const del = record => {
    dispatch({
      type: 'tableConfig/delItem',
      payload: { ID: record.ID, STATE: record.STATE, PID }
    })
  }

  const delItem = record => {
    dispatch({
      type: 'tableConfig/delRootItem',
      payload: { ID: record.ID, STATE: record.STATE, PID: selectedRows[0].ID }
    })
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'relation/packet', payload: { selectedRowKey, selectedRows } })
    dispatch({ type: 'tableConfig/queryRootItem', payload: { PID: selectedRows[0].ID } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }

  const onSelectChange2 = (selectedRowKey2, selectedRows2) => {
    dispatch({ type: 'relation/packet', payload: { selectedRowKey2, selectedRows2 } })
  }

  const rowSelection2 = {
    type: 'radio',
    onChange: onSelectChange2,
    selectedRowKeys: selectedRowKey2
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
      disabled,
      func: () => {
        if (selectedRows[0]) {
          toogleModal(selectedRows[0])
        } else {
          message.warning('请选择表对象!')
        }
      }
    },
    {
      name: '删除',
      disabled,
      func: () => {
        if (selectedRows[0]) {
          showConfirm(() => {
            del(selectedRows[0])
          })
        } else {
          message.warning('请选择表对象!')
        }
      }
    }
  ]

  const btns2 = [
    {
      name: '新建',
      disabled: disabled || !selectedRows[0],
      func: () => {
        toogleItem()
      }
    },
    {
      name: '修改',
      disabled: disabled || !selectedRows[0],
      func: () => {
        if (selectedRows2[0]) {
          toogleItem(selectedRows2[0])
        } else {
          message.warning('请选择表对象!')
        }
      }
    },
    {
      name: '删除',
      disabled,
      func: () => {
        if (selectedRows2[0]) {
          showConfirm(() => {
            delItem(selectedRows2[0])
          })
        } else {
          message.warning('请选择表对象!')
        }
      }
    }
  ]

  const props = { list: relationList, columns, btns, rowSelection }
  const props2 = {
    list: relationItemList,
    columns: columns2,
    btns: btns2,
    listName: 'relationItemList',
    tableName: 'usc_model_relationpage_sign',
    canDragRow: !disabled,
    rowSelection: rowSelection2
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '29%' }}>
        <TableWithBtn {...props} />
      </div>
      <div style={{ width: '39%' }}>
        <TableWithBtn {...props2} />
      </div>
      <div style={{ width: '30%' }}>效果</div>
      <RelationForm
        width={700}
        title='关联页管理'
        visible={visible}
        toogleModal={toogleModal}
        PID={PID}
        record={record}
        list={relationList}
      />
      <RelationItemForm
        width={700}
        title='页签管理'
        visible={itemVisible}
        toogleModal={toogleItem}
        PID={selectedRows[0] && selectedRows[0].ID}
        gid={PID}
        record={itemRecord}
        list={relationItemList}
        ITEMNO={ITEMNO}
      />
    </div>
  )
}

function mapStateToProps({ relation }) {
  return { relation }
}

export default connect(mapStateToProps)(Relation)
