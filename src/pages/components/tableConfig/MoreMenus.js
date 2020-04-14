import React, { useState, useEffect } from 'react'
import Modal from '../common/DragModal'
import { Button, Popconfirm } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import WorkMenuForm from './WorkMenuForm'

const MoreMenus = ({ visible, onCancel, record, PID, menuList, onOk, itemNo, classItemNo, activeKey, namespace }) => {
  const [visible2, setVisible2] = useState(false)
  const [record2, setRecord2] = useState({})
  const [list, setList] = useState([])
  const [index, setIndex] = useState(-1)

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'NAME',
      width: 150
    },
    {
      title: '英文名称',
      dataIndex: 'ENNAME',
      width: 200
    },
    {
      title: '菜单编码',
      dataIndex: 'NO',
      width: 150
    },
    {
      title: '操作',
      align: 'left',
      width: 200,
      render: (text, record, index) => {
        return (
          <div>
            <Button
              style={{ marginLeft: 5 }}
              type='primary'
              size='small'
              onClick={() => {
                toogleModal(record, index)
              }}
            >
              修改
            </Button>
            <Popconfirm
              title='确定要删除吗?'
              onConfirm={() => {
                del(index)
              }}
            >
              <Button style={{ marginLeft: 5 }} type='danger' icon='delete' size='small'>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    if (visible) {
      const { PARAM } = record
      if (PARAM && JSON.parse(PARAM) && JSON.parse(PARAM) instanceof Array) {
        setList(JSON.parse(PARAM))
      } else {
        setList([])
      }
      setIndex(-1)
      setRecord2({})
    }
  }, [record, visible])

  const Ok = () => {
    onOk({ param: JSON.stringify(list) })
    onCancel()
  }

  const toogleModal = (record = {}, index = -1) => {
    setVisible2(!visible2)
    setRecord2(record)
    setIndex(index)
  }

  const del = index => {
    const newList = [...list]
    newList.splice(index, 1)
    setList(newList)
  }

  const onMenusOk = values => {
    const newList = [...list]
    if (index !== -1) {
      newList[index] = values
    } else {
      newList.push(values)
    }
    setList(newList)
    toogleModal()
  }

  const btns = [
    {
      name: '新建',
      func: () => {
        toogleModal()
      }
    }
  ]

  const props = {
    list,
    columns,
    btns,
    height: 300
  }
  const props2 = { toogleModal, PID, onMenusOk, itemNo, activeKey, namespace, classItemNo }

  return (
    <Modal width={650} title='更多菜单' visible={visible} onCancel={onCancel} onOk={Ok}>
      <TableWithBtn {...props} />
      <WorkMenuForm width={650} title='菜单' visible={visible2} record={record2} list={menuList} {...props2} />
    </Modal>
  )
}

export default MoreMenus
