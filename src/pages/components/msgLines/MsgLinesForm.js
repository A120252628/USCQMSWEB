import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

const FormItem = Form.Item
class MsgLinesForm extends Component {
  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const oldValues = this.props.record
        this.props.dispatch({ type: 'msgLines/addOrEdit', payload: { values, oldValues } })
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { NO, NAME, REMARK, ID, ENNAME } = this.props.record

    const onRules = (rule, value, callback) => {
      let fieldList = this.props.list
      if (ID) {
        fieldList = fieldList.filter(item => item.ID !== ID)
      }
      fieldList.forEach(obj => {
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
          <table width='100%'>
            <tbody>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
                    {getFieldDecorator('NO', {
                      rules: [
                        { required: true, message: '必填项!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {getFieldDecorator('NAME', {
                      rules: [
                        { required: true, message: '必填项!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='英文名称'>
                    {getFieldDecorator('ENNAME', {
                      initialValue: ENNAME
                    })(<Input />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                    {getFieldDecorator('REMARK', {
                      initialValue: REMARK
                    })(<Input />)}
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('ID', {
              initialValue: ID
            })(<Input hidden />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(MsgLinesForm)))
