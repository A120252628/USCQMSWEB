/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2020-03-26 15:39:07
 * @Descripttion: 对象表格组件
 */

import React from 'react'
import { connect } from 'dva'
import { Checkbox, message, Select } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import GridForm from './GridForm'
import SelectField from './SelectField'
import GridItemForm from './GridItemForm'
import { showConfirm } from '../../../utils/utils'
import { getColumnSearchProps } from '../../../utils/columnUtil'

const Option = Select.Option
const Grid = ({ dispatch, grid, PID, gridList, gridItemList, disabled, isModeling }) => {
  let { visible, record, selectedRowKey, selectedRows, itemVisible, itemRecord, selectedRows2, selectedRowKey2 } = grid

  const columns = [
    {
      title: '默认',
      dataIndex: 'DEFAULTC',
      align: 'center',
      width: 50,
      render: (text, record) => {
        return (
          <Checkbox
            disabled={disabled}
            onChange={value => {
              updateSingleVal(value, record, 'DEFAULTC')
            }}
            checked={text}
          />
        )
      }
    },
    {
      title: '表格类型',
      dataIndex: 'TYPE',
      align: 'center',
      width: 130,
      render: (text, record) => {
        return (
          <Select
            disabled={disabled}
            style={{ width: '80%' }}
            onChange={value => {
              updateSingleVal(value, record, 'TYPE')
            }}
            value={text}
          >
            <Option value={1}>普通表格</Option>
            <Option value={0}>树形表格</Option>
          </Select>
        )
      }
    },
    {
      title: '表格标识',
      dataIndex: 'NO',
      width: 100
    },
    {
      title: '表格名称',
      dataIndex: 'NAME',
      width: 100
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    }
  ]
  const columns2 = [
    {
      title: '字段标识',
      dataIndex: 'NO',
      width: 100,
      ...getColumnSearchProps('NO', '字段标识')
    },
    {
      title: '字段名称',
      dataIndex: 'NAME',
      width: 100,
      ...getColumnSearchProps('NAME', '字段名称')
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    },
    {
      title: '列宽',
      dataIndex: 'WIDTH',
      width: 60
    },
    {
      title: '对齐方式',
      dataIndex: 'ALIGN',
      width: 120,
      render: (text, record) => {
        return (
          <Select
            disabled={disabled}
            style={{ width: '80%' }}
            onChange={value => {
              updateSingleVal(value, record, 'ALIGN', true)
            }}
            value={text}
          >
            <Option value='left'>左对齐</Option>
            <Option value='center'>居中</Option>
            <Option value='right'>右对齐</Option>
          </Select>
        )
      }
    },
    {
      title: '可编辑',
      dataIndex: 'EDITABLE',
      align: 'center',
      width: 80,
      render(text, record) {
        return (
          <Checkbox
            disabled={disabled}
            onChange={value => {
              updateSingleVal(value, record, 'EDITABLE', true)
            }}
            checked={text}
          />
        )
      }
    },
    {
      title: '可筛选',
      dataIndex: 'SCREEN',
      align: 'center',
      width: 80,
      render(text, record) {
        return (
          <Checkbox
            disabled={disabled}
            onChange={value => {
              updateSingleVal(value, record, 'SCREEN', true)
            }}
            checked={text}
          />
        )
      }
    }
  ]

  const updateSingleVal = (value, record, field, type = false) => {
    if (disabled) return
    const values = {}
    values[field] = value.target ? value.target.checked : value
    dispatch({
      type: `tableConfig/${type ? 'addOrEditRootItem' : 'addOrEditItem'}`,
      payload: { values, record, PID: type ? selectedRows[0].ID : PID }
    })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'grid/toogleModal', payload: { record } })
  }

  const toogleItem = (itemRecord = {}) => {
    dispatch({ type: 'grid/toogleItem', payload: { itemRecord } })
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

  const addField = () => {
    if (selectedRowKey && selectedRowKey.length > 0) {
      dispatch({ type: 'selectField/query', payload: { ID: PID, onSelect } })
    } else {
      message.warning('请选择表对象!')
    }
  }

  const onSelect = data => {
    const newData = []
    data.forEach(i => {
      newData.push({
        NO: i.NO,
        ITEMID: selectedRows[0].ITEMID,
        NAME: i.NAME,
        WIDTH: 100,
        ALIGN: 'left',
        EDITABLE: 1
      })
    })
    dispatch({
      type: 'tableConfig/addOrEditRootItem',
      payload: { values: newData, PID: selectedRows[0].ID }
    })
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'grid/packet', payload: { selectedRowKey, selectedRows } })
    dispatch({ type: 'tableConfig/queryRootItem', payload: { PID: selectedRows[0].ID } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }

  const onSelectChange2 = (selectedRowKey2, selectedRows2) => {
    dispatch({ type: 'grid/packet', payload: { selectedRowKey2, selectedRows2 } })
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
      name: '添加',
      disabled,
      func: () => {
        addField()
      }
    },
    {
      name: '修改',
      disabled,
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

  const props = { list: gridList, columns, btns, rowSelection }
  const props2 = {
    list: gridItemList,
    columns: columns2,
    btns: btns2,
    listName: 'gridItemList',
    tableName: 'usc_model_grid_field',
    canDragRow: isModeling,
    rowSelection: rowSelection2
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '44%' }}>
        <TableWithBtn {...props} />
      </div>
      <div style={{ width: '55%' }}>
        <TableWithBtn {...props2} />
      </div>
      <GridForm
        width={700}
        title='表格页管理'
        visible={visible}
        toogleModal={toogleModal}
        PID={PID}
        record={record}
        list={gridList}
      />
      <GridItemForm
        width={700}
        title='字段管理'
        visible={itemVisible}
        toogleModal={toogleItem}
        PID={selectedRows[0] && selectedRows[0].ID}
        record={itemRecord}
        list={gridItemList}
      />
      <SelectField />
    </div>
  )
}

function mapStateToProps({ grid, user: { isModeling } }) {
  return { grid, isModeling }
}

export default connect(mapStateToProps)(Grid)
