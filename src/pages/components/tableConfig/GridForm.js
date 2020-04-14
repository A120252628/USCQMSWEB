/*
 * 表格排序页表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-03 11:09:44
 */
import React, { Component } from 'react'
import { Form, Input, message, Select } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

class GridForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { pid, record, dispatch } = this.props
        await dispatch({ type: 'tableConfig/addOrEditItem', payload: { values, pid, record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { no, name, id, type, ENNAME } = this.props.record

    const onRules = (rule, value, callback) => {
      let list = this.props.list
      if (id) {
        list = list.filter(item => item.id !== id)
      }
      list.forEach(obj => {
        for (const i of Object.values(obj)) {
          if (i === value) {
            callback('该值不能重复！')
          }
        }
      })
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    }
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('id', {
                      initialValue: id
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='表格页标识'>
                    {getFieldDecorator('no', {
                      rules: [{ required: true, message: '此项必填!' }, { validator: onRules }],
                      initialValue: no
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='表格页名称'>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '此项必填!' }, { validator: onRules }],
                      initialValue: name
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='英文名称'>
                    {getFieldDecorator('ENNAME', {
                      initialValue: ENNAME
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='表格类型'>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: type || 1
                    })(
                      <Select style={{ width: '100%' }}>
                        <Option value={1}>普通表格</Option>
                        <Option value={0}>树形表格</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(GridForm)))
