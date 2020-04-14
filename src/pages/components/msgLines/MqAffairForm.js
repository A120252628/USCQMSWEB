import React, { Component } from 'react'
import { Form, Input, message, Select } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'
import { mqMtype } from '../../../utils/paramsConfig'
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

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}

const FormItem = Form.Item
const Option = Select.Option
class MqAffairForm extends Component {
  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const oldValues = this.props.record
        this.props.dispatch({ type: 'mqAffair/addOrEdit', payload: { values, oldValues } })
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { NO, NAME, MCONTENT, ID, CHANNELNAME, MTYPE, ENNAME } = this.props.record
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '必填项!' }],
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='总线名称'>
                    {getFieldDecorator('CHANNELNAME', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: CHANNELNAME
                    })(
                      <Select style={{ width: '100%' }}>
                        {this.props.mqLinesList.map(item => (
                          <Option value={item.NO} key={item.ID}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='执行类型'>
                    {getFieldDecorator('MTYPE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MTYPE
                    })(
                      <Select style={{ width: '100%' }}>
                        {mqMtype.map((item, index) => (
                          <Option value={index + 1}>{item}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colSpan='2'>
                  <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='执行内容'>
                    {getFieldDecorator('MCONTENT', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MCONTENT
                    })(<Input.TextArea />)}
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

export default Modal(connect()(Form.create()(MqAffairForm)))
