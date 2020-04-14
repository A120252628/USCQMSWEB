/*
 * @Author: hjh
 * @Date: 2019-09-24 10:34:12
 * @LastEditTime: 2020-03-26 15:33:48
 * @Descripttion: 视图结构树表单
 */

import React, { Component } from 'react'
import { Form, Input, message, Button, Select, Checkbox } from 'antd'
import { connect } from 'dva'
import IconSelectorForm from '../common/IconSelectorForm'

const FormItem = Form.Item
const TextArea = Input.TextArea
const { Option } = Select

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

const variableMap = [
  { name: '节点数据', value: '%CLASSVIEWTREENODEVALUE%' },
  { name: '父节点数据', value: '%PARENT.CLASSVIEWTREENODEVALUE%' },
  { name: '系统用户', value: '%SYSTEMUSER%' },
  { name: '对象字段', value: '%OBJECT.%' }
]

class ViewStructureForm extends Component {
  state = { focusDom: null }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record !== this.props.record) {
      const { NO, NAME, NODECONDITION, DATACONDITION, ICON } = nextProps.record || {}
      this.props.form.setFieldsValue({ NO, NAME, NODECONDITION, DATACONDITION, ICON })
      this.setState({ focusDom: null })
    }
  }
  Ok = e => {
    e.preventDefault()
    const { record, onOk } = this.props
    if (record) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let { SUMMARY, LOADDATASET } = values
          values = { ...values, SUMMARY: SUMMARY ? 1 : 0, LOADDATASET: LOADDATASET ? 1 : 0 }
          onOk(values, record)
        } else {
          return message.error('保存失败')
        }
      })
    } else {
      message.warn('请选择节点！')
    }
  }

  onSelect = value => {
    const { focusDom } = this.state
    if (focusDom) {
      const { setFieldsValue, getFieldValue } = this.props.form
      let value1 = getFieldValue(focusDom)
      value1 = value1 ? value1 : ''
      let obj = {}
      obj[focusDom] = value1 + value
      setFieldsValue(obj)
    }
  }

  onFocus = e => {
    this.setState({ focusDom: e.target.id })
  }

  onRules = (rule, value, callback) => {
    let { list, record = {} } = this.props
    const { ID } = record
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

  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  render() {
    const { form, record, disabled } = this.props
    const { getFieldDecorator } = form
    const { NO, NAME, NODECONDITION, DATACONDITION, ICON, PID, SUMMARY, LOADDATASET, ENNAME } = record || {}
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Button disabled={disabled} onClick={this.Ok} style={{ marginRight: '5px' }} type='primary'>
          保存
        </Button>
        <Select defaultValue='选择变量' onSelect={this.onSelect}>
          {variableMap.map((item, index) => (
            <Option value={item.value} key={index}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Form>
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
                    {getFieldDecorator('NO', {
                      rules: [
                        { required: true, message: '必填项!' },
                        {
                          validator: this.onRules
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
                        { required: true, message: '必填项!' },
                        {
                          validator: this.onRules
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='图标'>
                    {getFieldDecorator('ICON', { initialValue: ICON })(
                      <IconSelectorForm onOk={this.setIconName} icon={ICON} />
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='显示数量'>
                    {getFieldDecorator('SUMMARY', { initialValue: SUMMARY || false, valuePropName: 'checked' })(
                      <Checkbox />
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='加载数据'>
                    {getFieldDecorator('LOADDATASET', {
                      initialValue: LOADDATASET || false,
                      valuePropName: 'checked'
                    })(<Checkbox />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th colSpan='2'>
                  <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='节点SQL'>
                    {getFieldDecorator('NODECONDITION', {
                      initialValue: NODECONDITION
                    })(<TextArea disabled={PID === '0' ? true : false} onFocus={this.onFocus} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th colSpan='2'>
                  <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='业务对象查询条件'>
                    {getFieldDecorator('DATACONDITION', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: DATACONDITION
                    })(<TextArea onFocus={this.onFocus} />)}
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

export default connect()(Form.create()(ViewStructureForm))
