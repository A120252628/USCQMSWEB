/*
 * 对象属性页选项表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-05 09:19:30
 */
import React, { Component } from 'react'
import { Form, Input, Checkbox, message } from 'antd'
import Modal from '../common/Modal'
import { connect } from 'dva'

const FormItem = Form.Item

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

class PropertyItemForm extends Component {
  static defaultProps = {
    record: {
      ID: -1
    }
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { PID, record, dispatch } = this.props
        values.EDITABLE = values.EDITABLE ? 1 : 0
        await dispatch({ type: 'tableConfig/addOrEditRootItem', payload: { values, PID, record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { ID, NO, NAME, EDITABLE, WLINE, ENNAME } = this.props.record

    const onRules = (rule, value, callback) => {
      let list = this.props.list
      if (ID) {
        list = list.filter(item => item.ID !== ID)
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
                <th width='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性标识'>
                    {getFieldDecorator('NO', {
                      rules: [
                        { required: true, message: '此项必填!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </th>
                <th width='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性标识名称'>
                    {getFieldDecorator('NAME', {
                      rules: [
                        { required: true, message: '此项必填!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NAME
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
                <th width='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='可编辑'>
                    {getFieldDecorator('EDITABLE', {
                      initialValue: EDITABLE,
                      valuePropName: 'checked'
                    })(<Checkbox />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th width='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='整行'>
                    {getFieldDecorator('WLINE', {
                      initialValue: WLINE,
                      valuePropName: 'checked'
                    })(<Checkbox />)}
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

export default Modal(connect()(Form.create()(PropertyItemForm)))
