import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import Modal from '../common/Modal'
import { connect } from 'dva'

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
const FormItem = Form.Item
class MsgListenerForm extends Component {
  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { PID, record, dispatch } = this.props
        await dispatch({ type: 'msgListener/addOrEdit', payload: { values, PID, record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { ID, NO, NAME, QUEUES, ENNAME } = this.props.record

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
      callback()
    }
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table WIDTH='100%'>
            <tbody>
              <tr>
                <th WIDTH='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
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
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
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
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='英文名称'>
                    {getFieldDecorator('ENNAME', {
                      initialValue: ENNAME
                    })(<Input />)}
                  </FormItem>
                </td>
                <th WIDTH='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='消息队列'>
                    {getFieldDecorator('QUEUES', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: QUEUES
                    })(<Input />)}
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

export default Modal(connect()(Form.create()(MsgListenerForm)))
