/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2020-03-26 15:39:26
 * @Descripttion: 对象属性组件
 */

import React from 'react'
import { connect } from 'dva'
import { Checkbox, Select } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import PropertyForm from './PropertyForm'
import SelectField from './SelectField'
import PropertyItemForm from './PropertyItemForm'
import PropertySetForm from './PropertySetForm'
import { showConfirm } from '../../../utils/utils'
import { getColumnSearchProps } from '../../../utils/columnUtil'

const Option = Select.Option

const Property = ({ dispatch, property, PID, propertyList, propertyItemList, disabled, isModeling }) => {
  let {
    visible,
    record,
    selectedRowKey,
    selectedRows,
    itemVisible,
    setVisible,
    itemRecord,
    selectedRows2,
    selectedRowKey2
  } = property

  const hasSelectRows = selectedRows && selectedRows.length > 0 ? true : false
  const hasSelectRows2 = selectedRows2 && selectedRows2.length > 0 ? true : false

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
      title: '属性页标识',
      dataIndex: 'NO',
      width: 100
    },
    {
      title: '属性页名称',
      dataIndex: 'NAME',
      width: 120
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    },
    {
      title: '列数',
      dataIndex: 'COLUMNS',
      width: 100,
      render: (text, record) => {
        return (
          <Select
            disabled={disabled}
            style={{ width: '80%' }}
            onChange={value => {
              updateSingleVal(value, record, 'COLUMNS')
            }}
            value={text}
          >
            <Option value={1}>单列</Option>
            <Option value={2}>2列</Option>
            <Option value={3}>3列</Option>
          </Select>
        )
      }
    },
    {
      title: '宽度',
      dataIndex: 'WIDTH',
      width: 120,
      render: (text, record) => {
        return (
          <Select
            disabled={disabled}
            style={{ width: '80%' }}
            onChange={value => {
              updateSingleVal(value, record, 'WIDTH')
            }}
            value={text}
          >
            <Option value={600}>600px</Option>
            <Option value={650}>650px</Option>
            <Option value={700}>700px</Option>
            <Option value={750}>750px</Option>
            <Option value={800}>800px</Option>
          </Select>
        )
      }
    },
    {
      title: '多肽',
      dataIndex: 'PEPTIDE',
      width: 50,
      align: 'center',
      render: (text, record) => {
        return (
          <Checkbox
            disabled={disabled}
            onChange={value => {
              updateSingleVal(value ? 1 : 0, record, 'PEPTIDE')
            }}
            checked={text}
          />
        )
      }
    }
  ]

  const columns2 = [
    {
      title: '属性标识',
      dataIndex: 'NO',
      width: 200,
      ...getColumnSearchProps('NO', '属性标识')
    },
    {
      title: '属性名称',
      dataIndex: 'NAME',
      width: 200,
      ...getColumnSearchProps('NAME', '属性名称')
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    },
    {
      title: '可编辑',
      dataIndex: 'EDITABLE',
      width: 100,
      align: 'center',
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
      title: '整行',
      dataIndex: 'WLINE',
      width: 100,
      align: 'center',
      render(text, record) {
        return (
          <Checkbox
            disabled={disabled}
            onChange={value => {
              updateSingleVal(value, record, 'WLINE', true)
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
    dispatch({ type: 'property/toogleModal', payload: { record } })
  }

  const toogleItem = (itemRecord = {}) => {
    dispatch({ type: 'property/toogleItem', payload: { itemRecord } })
  }

  const del = record => {
    const { ID, STATE } = record
    dispatch({
      type: 'tableConfig/delItem',
      payload: { ID, STATE, PID }
    })
  }

  const delItem = record => {
    const { ID, STATE } = record
    dispatch({
      type: 'tableConfig/delRootItem',
      payload: { ID, STATE, PID: selectedRows[0].ID }
    })
  }

  const addField = () => {
    dispatch({ type: 'selectField/query', payload: { ID: PID, onSelect } })
  }

  const toogleSetModal = (itemRecord = {}) => {
    dispatch({ type: 'property/packet', payload: { itemRecord, setVisible: !setVisible } })
  }

  const onSelect = data => {
    const newData = []
    const PID = selectedRows[0].PEPTIDE ? selectedRows2[0].ID : null
    data.forEach(i => {
      const obj = {}
      obj.NO = i.NO
      obj.ITEMID = selectedRows[0].ITEMID
      obj.NAME = i.NAME
      obj.EDITABLE = 1
      obj.DEFAULTV = i.DEFAULTV
      obj.PID = PID
      newData.push(obj)
    })
    dispatch({
      type: 'tableConfig/addOrEditRootItem',
      payload: { values: newData, PID: selectedRows[0].ID }
    })
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'property/packet', payload: { selectedRowKey, selectedRows } })
    dispatch({ type: 'tableConfig/queryRootItem', payload: { PID: selectedRows[0].ID } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }

  const onSelectChange2 = (selectedRowKey2, selectedRows2) => {
    dispatch({ type: 'property/packet', payload: { selectedRowKey2, selectedRows2 } })
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
      disabled: disabled || !hasSelectRows,
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: '删除',
      disabled: disabled || !hasSelectRows,
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    }
  ]

  const btns2 = [
    {
      name: '添加字段',
      disabled:
        disabled ||
        !hasSelectRows ||
        (selectedRows[0].PEPTIDE ? (hasSelectRows2 && selectedRows2[0].PID === '0' ? false : true) : false),
      func: () => {
        addField()
      }
    },
    {
      name: '修改',
      disabled: disabled || !hasSelectRows || !hasSelectRows2,
      func: () => {
        toogleItem(selectedRows2[0])
      }
    },
    {
      name: '删除',
      disabled: disabled || !hasSelectRows || !hasSelectRows2,
      func: () => {
        showConfirm(() => {
          delItem(selectedRows2[0])
        })
      }
    },
    {
      name: '新建集合',
      disabled: disabled || !hasSelectRows || !selectedRows[0].PEPTIDE,
      func: () => {
        toogleSetModal()
      }
    }
  ]

  const props = { list: propertyList, columns, btns, rowSelection }
  const props2 = {
    list: propertyItemList,
    columns: columns2,
    btns: btns2,
    listName: 'propertyItemList',
    tableName: 'usc_model_property_field',
    canDragRow: isModeling,
    rowSelection: rowSelection2,
    isTree: hasSelectRows && selectedRows[0].PEPTIDE ? true : false
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '38%' }}>
        <TableWithBtn {...props} />
      </div>
      <div style={{ width: '60%' }}>
        <TableWithBtn {...props2} />
      </div>
      <PropertyForm
        width={700}
        title='属性页管理'
        visible={visible}
        toogleModal={toogleModal}
        PID={PID}
        record={record}
        list={propertyList}
      />
      <PropertyItemForm
        width={700}
        title='字段管理'
        visible={itemVisible}
        toogleModal={toogleItem}
        PID={selectedRows[0] && selectedRows[0].ID}
        record={itemRecord}
        list={propertyItemList}
      />
      <PropertySetForm
        width={700}
        title='属性页集合'
        visible={setVisible}
        toogleModal={toogleSetModal}
        selectedRows={selectedRows[0]}
        record={itemRecord}
      />
      <SelectField />
    </div>
  )
}

function mapStateToProps({ property, user: { isModeling } }) {
  return { property, isModeling }
}

export default connect(mapStateToProps)(Property)
