/*
 * @Author: hjh
 * @Date: 2019-07-03 17:01:17
 * @LastEditTime: 2020-03-25 15:29:28
 * @Descripttion: 带有右键菜单和滚动条的table
 */

import React, { Component } from 'react'
import { message } from 'antd'
import { Resizable } from 'react-resizable'
//启动流程
import ActStartProcess from '../../../routes/activiti/ProcessManage/ActStartProcess'
//角色分配
import AssignRole from '../../../routes/sys/AssignRole'
import components from '../../../../utils/Dnd'
import { connect } from 'dva'

import PropTypes from 'prop-types'
import { setColumn } from '../../../../utils/columnUtil'
import { generatorTableKeyByIndex, ergodicRoot, generatorTableKey } from '../../../../utils/utils'
import { showContextMenu } from '../../../../utils/contextMenuFunc'
import * as commonService from '../../../service/commonService'

import styles from './style.less'

import AutoSizer from 'react-virtualized-auto-sizer'
import VirtualTable from './VirtualTable'
import 'antd/dist/antd.css'

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props
  if (!width) {
    return <th {...restProps} />
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  )
}

class ScrollTable extends Component {
  static propTypes = {
    height: PropTypes.number, // 高度
    width: PropTypes.string, // 宽度，默认宽高都是100%
    engine: PropTypes.object, // 建模数据
    rowSelection: PropTypes.object, // 表格行选择
    model: PropTypes.object, // model
    onClick: PropTypes.func, // 点击行触发的方法
    canDragRow: PropTypes.bool // 表格行是否可拖拽排序
  }

  state = {
    columns: [],
    expandedRowKeys: []
  }

  setClassName = (record, index) => {
    const { STATE } = record
    if (STATE === '签审中') {
      return styles.stateE
    } else if (STATE === '维护中') {
      return styles.stateC
    } else {
      return index % 2 === 0 ? styles.Even : styles.Odd
      // return styles.stateDefault
    }
  }

  componentDidMount() {
    if (this.props.columns) {
      this.setState({ columns: this.props.columns })
    } else {
      const columns = this.props.engine.itemGrid ? this.props.engine.itemGrid.gridFieldList : []
      if (columns && columns.length > 0) {
        const newColumns = setColumn(columns, this.props.engine.namespace)
        this.setState({
          columns: newColumns
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.columns !== this.props.columns) {
      this.setState({ columns: nextProps.columns })
    }
    if (nextProps.engine) {
      const columns = this.props.engine.itemGrid ? this.props.engine.itemGrid.gridFieldList : []
      const nextColumns = nextProps.engine.itemGrid.gridFieldList
      if (nextColumns !== columns) {
        const newColumns = setColumn(nextColumns, nextProps.engine.namespace)
        this.setState({
          columns: newColumns
        })
      }
    }
  }

  selectRow = record => {
    const { rowSelection, onClick } = this.props
    if (rowSelection && typeof rowSelection.onChange === 'function') {
      const newRecord = JSON.parse(JSON.stringify(record))
      if (newRecord.children) {
        delete newRecord.children
      }
      rowSelection.onChange([newRecord.key], [newRecord])
      if (onClick && typeof onClick === 'function') {
        onClick(newRecord)
      }
    }
  }

  onDoubleClick = record => {
    const { onDoubleClick } = this.props
    if (onDoubleClick && typeof onDoubleClick === 'function') {
      onDoubleClick(record)
    }
  }

  // 可伸缩列
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns]
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      }
      return { columns: nextColumns }
    })
  }

  // 右键菜单
  onContextMenu = (e, record) => {
    e.preventDefault()
    let { clientX, clientY } = e
    const { model, engine } = this.props
    if (model && engine) {
      const { selectedRows } = model
      if (!selectedRows || selectedRows.length === 0) {
        // 没有选中数据时，点击右键时默认选择当前行
        this.selectRow(record)
        const newRecord = JSON.parse(JSON.stringify(record))
        if (newRecord.children) {
          delete newRecord.children
        }
        model.selectedRows = [newRecord]
        model.selectedRowKeys = [newRecord.key]
      }
      showContextMenu({ left: clientX, top: clientY, model, engine, hData: model.selectedRows || [record] })
    }
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { list, listName, tableName, dispatch, isTree, namespace } = this.props
    const list2 = [...list]
    let newList = []
    if (isTree) {
      const a = list[dragIndex]
      const b = list[hoverIndex]
      if (a.PID !== b.PID) {
        message.error('请拖动同一层级的数据')
        return
      } else {
        newList.push(a, b)
        list2[dragIndex] = b
        list2[hoverIndex] = a
      }
    } else {
      if (dragIndex > hoverIndex) {
        list2.splice(hoverIndex, 0, list[dragIndex])
        list2.splice(dragIndex + 1, 1)
        newList = list2.slice(hoverIndex, dragIndex + 1)
      } else {
        list2.splice(hoverIndex + 1, 0, list[dragIndex])
        list2.splice(dragIndex, 1)
        newList = list2.slice(dragIndex, hoverIndex + 1)
      }
    }
    dispatch({ type: 'common/moveRow', payload: { list: list2, newList, listName, tableName, isTree, namespace } })
  }

  loadMore = () => {
    console.log('load more')
    const { model, dispatch, engine } = this.props
    if (model && engine) {
      let { page, dataList, queryWord } = model
      if (dataList.length >= page * 200) {
        page++
        if (queryWord) {
          dispatch({ type: `common/search`, payload: { page, engine, dataList, model, queryWord } })
        } else {
          dispatch({ type: `common/loadMore`, payload: { page, engine, dataList } })
        }
      }
    }
  }

  onExpand = (expanded, record) => {
    let { expandedRowKeys = [] } = this.state
    if (expanded) {
      expandedRowKeys.push(record.key)
    } else {
      const index = expandedRowKeys.findIndex(item => item === record.key)
      expandedRowKeys.splice(index, 1)
    }
    this.setState({ expandedRowKeys })
  }

  render() {
    let { height, width, rowSelection, engine, model, list, canDragRow, isTree, ...restProps } = this.props
    const { columns, expandedRowKeys } = this.state
    rowSelection = {
      ...rowSelection,
      columnWidth: 30
    }
    const newColumns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index)
      })
    }))

    let newComponents = {
      header: {
        cell: ResizeableTitle
      }
    }
    let onRow = record => ({
      onClick: () => {
        this.selectRow(record)
      },
      onContextMenu: event => {
        this.onContextMenu(event, record)
      },
      onDoubleClick: () => {
        this.onDoubleClick(record)
      }
    })
    if (canDragRow) {
      newComponents = { ...newComponents, ...components }
      onRow = record => ({
        onClick: () => {
          this.selectRow(record)
        },
        onContextMenu: event => {
          this.onContextMenu(event, record)
        },
        moveRow: this.moveRow
      })
    }

    list = list || model.dataList || []
    if (list && list.length > 0) {
      list = generatorTableKey(list)
    }
    let expandProps = {}
    if ((engine && engine.itemGrid && engine.itemGrid.type === 0) || isTree) {
      list = ergodicRoot(list)
      expandProps = {
        expandedRowKeys: expandedRowKeys || [],
        onExpand: this.onExpand
      }
    }
    return (
      <div
        ref={ele => {
          this.table = ele
        }}
        id='scroll-table'
        style={{ width: width || '100%', height: height || '100%', position: 'relative' }}
      >
        <AutoSizer style={{ width: '100%', height: '100%' }}>
          {({ width, height }) => (
            <VirtualTable
              {...restProps}
              bordered
              scroll={{ x: width - 10, y: list.length * 30 >= height - 78 ? height - 39 : false }}
              height={height}
              size='small'
              pagination={false}
              columns={newColumns}
              components={newComponents}
              dataSource={list || []}
              rowClassName={this.setClassName}
              rowSelection={rowSelection}
              onRow={onRow}
              loadMore={this.loadMore}
              {...expandProps}
            />
          )}
        </AutoSizer>
        {/*流程特殊处理*/}
        <ActStartProcess />
        {/*角色分配特殊处理*/}
        <AssignRole />
      </div>
    )
  }
}

export default connect()(ScrollTable)
