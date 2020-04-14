/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime : 2019-12-23 16:54:51
 * @Descripttion: 字段属性组件
 */

import React from 'react'
import { connect } from 'dva'
import { Checkbox } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import FieldForm from './FieldForm'

import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { showConfirm } from '../../../utils/utils'
import { getColumnSearchProps } from '../../../utils/columnUtil'
import { editorMap, ftypeMap } from '../../../utils/paramsConfig'

const columns = [
  {
    title: '字段标识',
    dataIndex: 'NO',
    width: 200,
    ...getColumnSearchProps('NO', '字段标识')
  },
  {
    title: '数据库字段名',
    dataIndex: 'FIELDNAME',
    width: 200,
    ...getColumnSearchProps('FIELDNAME', '数据库字段名')
  },
  {
    title: '字段名称',
    dataIndex: 'NAME',
    width: 200,
    ...getColumnSearchProps('NAME', '字段名称')
  },
  {
    title: '英文名称',
    dataIndex: 'ENNAME',
    width: 200
  },
  {
    title: '字段类型',
    dataIndex: 'FTYPE',
    width: 100,
    render(text) {
      let fType = ftypeMap.find(item => item.type === text)
      return (
        <Ellipsis tooltip lines={1}>
          {(fType && fType.name) || text}
        </Ellipsis>
      )
    }
  },
  {
    title: '字段长度',
    dataIndex: 'FLENGTH',
    width: 50
  },
  {
    title: '精度',
    dataIndex: 'ACCURACY',
    width: 50
  },
  {
    title: '验证唯一性',
    dataIndex: 'ONLY',
    width: 100,
    align: 'center',
    render(text) {
      return <Checkbox checked={text} />
    }
  },
  {
    title: '允许为空',
    dataIndex: 'ALLOWNULL',
    width: 100,
    align: 'center',
    render(text) {
      return <Checkbox checked={text} />
    }
  },
  {
    title: '缺省值',
    dataIndex: 'DEFAULTV',
    width: 80
  },
  {
    title: '编辑器',
    dataIndex: 'EDITOR',
    width: 150,
    render(text) {
      let editor = editorMap.find(item => item.value === text)
      return (
        <Ellipsis tooltip lines={1}>
          {(editor && editor.name) || text}
        </Ellipsis>
      )
    }
  },
  {
    title: '编辑器参数',
    dataIndex: 'EDITPARAMS',
    width: 200,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '字段类别',
    dataIndex: 'TYPE',
    width: 100,
    render(text) {
      return <span>{text ? '业务字段' : '系统字段'}</span>
    }
  },
  {
    title: '备注',
    dataIndex: 'REMARK'
  }
]
const Field = ({ dispatch, field, fieldList, PID, disabled }) => {
  const { visible, record, selectedRows, selectedRowKey, modalFooter = true } = field

  const toogleModal = (record = { TYPE: 1 }) => {
    dispatch({ type: 'field/toogleModal', payload: { record } })
    if (visible) {
      dispatch({ type: 'field/packet', payload: { modalFooter: true } })
    }
  }

  const del = record => {
    dispatch({
      type: 'tableConfig/delItem',
      payload: { ID: record.ID, STATE: record.STATE, PID }
    })
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
      disabled: disabled || !selectedRows[0],
      // disabled: disabled || !selectedRows[0] || !selectedRows[0].TYPE,
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: selectedRows[0] && selectedRows[0].STATE !== 'F' ? '删除' : '作废',
      disabled: disabled || !selectedRows[0] || !selectedRows[0].TYPE,
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    }
  ]

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'field/packet', payload: { selectedRowKey, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }

  const onDoubleClick = record => {
    toogleModal(record)
    dispatch({ type: 'field/packet', payload: { modalFooter: false } })
  }

  const props = {
    btns,
    list: fieldList,
    columns,
    rowSelection,
    listName: 'fieldList',
    tableName: 'usc_model_field',
    canDragRow: !disabled,
    onDoubleClick
  }
  let footer = {}
  if (!modalFooter) footer = { footer: null }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TableWithBtn {...props} />
      <FieldForm
        FieldList={fieldList}
        record={record}
        width={750}
        title='字段管理'
        visible={visible}
        toogleModal={toogleModal}
        PID={PID}
        {...footer}
      />
    </div>
  )
}

function mapStateToProps({ field }) {
  return { field }
}

export default connect(mapStateToProps)(Field)
