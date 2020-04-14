/*
 * @Author: hjh
 * @Date: 2019-07-31 15:19:38
 * @LastEditTime: 2019-12-10 17:29:44
 * @Descripttion: 关联页表单
 */

import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'

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
class RelationForm extends Component {
  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { PID, record, dispatch } = this.props
        await dispatch({ type: 'tableConfig/addOrEditItem', payload: { values, PID, record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const { NO, NAME, ID, ENNAME } = this.props.record //声明record
    return (
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
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关联页标识'>
                  {getFieldDecorator('NO', {
                    rules: [{ required: true, message: '请输入标识!' }],
                    initialValue: NO
                  })(<Input />)}
                </FormItem>
              </th>
              <th>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关联页名称'>
                  {getFieldDecorator('NAME', {
                    rules: [{ required: true, message: '请输入标识名称!' }],
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
            </tr>
          </tbody>
        </table>
      </Form>
    )
  }
}

export default Modal(connect()(Form.create()(RelationForm)))
