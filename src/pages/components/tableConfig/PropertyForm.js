/*
 * 对象属性页表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-03 14:05:22
 */
import React, { Component } from 'react'
import { Form, Input, message, Select, Checkbox } from 'antd'
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
class PropertyForm extends Component {
  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { PID, record, dispatch } = this.props
        values.PEPTIDE = values.PEPTIDE ? 1 : 0
        await dispatch({ type: 'tableConfig/addOrEditItem', payload: { values, PID, record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { NO, NAME, ID, WIDTH, COLUMNS, PEPTIDE, ENNAME } = this.props.record
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
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性页标识'>
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性页名称'>
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
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='列数'>
                    {getFieldDecorator('COLUMNS', {
                      initialValue: COLUMNS
                    })(
                      <Select>
                        <Option value={1}>单列</Option>
                        <Option value={2}>2列</Option>
                        <Option value={3}>3列</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='宽度'>
                    {getFieldDecorator('WIDTH', {
                      initialValue: WIDTH || 600
                    })(<Input addonAfter='px' />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='多肽'>
                    {getFieldDecorator('PEPTIDE', {
                      initialValue: PEPTIDE,
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

export default Modal(connect()(Form.create()(PropertyForm)))
