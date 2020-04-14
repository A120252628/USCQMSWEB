/*
 * @Author: hjh
 * @Date: 2019-06-18 15:30:38
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-18 16:04:03
 */

import React, { Component } from 'react'
import { Form, Input, message, Select, Checkbox } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'
import IconSelectorForm from '../common/IconSelectorForm'

import { reqParamMap, wtypeMap } from '../../../utils/paramsConfig'

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

class MsgLinesForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { REQPARAM } = values
        if (REQPARAM) {
          values.REQPARAM = REQPARAM.join(';')
        }
        await this.props.dispatch({ type: 'msgLines/addOrEdit', payload: { values, record: this.props.record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { NO, NAME, ID, MCONTENT, ICON, WTYPE, MTYPE, REQPARAM, TITLE, CHANNELNAME } = this.props.record
    if (REQPARAM) {
      REQPARAM = REQPARAM.split(';')
    }
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '此项必填!' }],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '此项必填!' }],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗类型'>
                    {getFieldDecorator('WTYPE', {
                      initialValue: WTYPE
                    })(
                      <Select style={{ width: '100%' }}>
                        {wtypeMap.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='执行类型'>
                    {getFieldDecorator('MTYPE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MTYPE
                    })(
                      <Select style={{ width: '100%' }}>
                        <Option value={1}>SQL脚本</Option>
                        <Option value={2}>存储过程</Option>
                        <Option value={3}>Java实现类</Option>
                        <Option value={4}>JS脚本</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗标题'>
                    {getFieldDecorator('TITLE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: TITLE
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='图标'>
                    {getFieldDecorator('ICON', {
                      initialValue: ICON
                    })(<IconSelectorForm onOk={this.setIconName} icon={ICON} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
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
                </th>
              </tr>
              <tr>
                <th colSpan='2'>
                  <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='执行内容'>
                    {getFieldDecorator('MCONTENT', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MCONTENT
                    })(<Input.TextArea />)}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
          <div style={{ width: '100%', marginTop: '10px', fontWeight: 'bold' }}>
            <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='请求参数'>
              {getFieldDecorator('REQPARAM', {
                initialValue: REQPARAM
              })(<Checkbox.Group options={reqParamMap} />)}
            </FormItem>
          </div>
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(MsgLinesForm)))
