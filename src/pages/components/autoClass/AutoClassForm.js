/**
 * @author lwp
 */
import React, { Component } from 'react'
import { Form, Input, message, Select } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

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
class AutoClassForm extends Component {
  constructor(props) {
    super(props)
    this.state = { provinceData: props.options }
  }
  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const oldValues = this.props.record
        this.props.dispatch({ type: 'autoClass/addOrEdit', payload: { values, oldValues } })
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { ID, NO, NAME, ITEMNO, WCONDITION, CONTROLAUTH, COPYABLE, STATE, ENNAME } = this.props.record
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: NO
                    })(<Input disabled={STATE === 'U' ? true : false} />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '必填项!' }],
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
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='查询对象'>
                    {getFieldDecorator('ITEMNO', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: ITEMNO
                    })(
                      <Select style={{ width: '100%' }}>
                        {this.state.provinceData.map(province => (
                          <Option key={province.ID} value={province.ITEMNO}>
                            {province.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='查询条件'>
                    {getFieldDecorator('WCONDITION', {
                      initialValue: WCONDITION
                    })(<TextArea />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='控制权限'>
                    {getFieldDecorator('CONTROLAUTH', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: CONTROLAUTH
                    })(
                      <Select initialValue={CONTROLAUTH} style={{ width: '100%' }}>
                        <Option value={1}>是</Option>
                        <Option value={0}>否</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='支持复制'>
                    {getFieldDecorator('COPYABLE', {
                      initialValue: COPYABLE,
                      rules: [{ required: true, message: '必填项!' }]
                    })(
                      <Select initialValue={COPYABLE} style={{ width: '100%' }}>
                        <Option value={1}>是</Option>
                        <Option value={0}>否</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
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
//使用表单共享出去的方式
export default Modal(connect()(Form.create()(AutoClassForm)))
