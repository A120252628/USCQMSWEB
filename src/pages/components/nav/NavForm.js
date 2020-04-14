import React, { Component } from 'react'
import { Form, Input, message, Select, Checkbox } from 'antd'
import { connect } from 'dva'
import { facetypeMap } from '../../../utils/paramsConfig'
import IconSelectorForm from '../common/IconSelectorForm'
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
const Option = Select.Option
const FormItem = Form.Item
class NavForm extends Component {
  Ok = e => {
    e.preventDefault()
    const { PID = 0, form, LEVEL, dispatch, record } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        values.LEVEL = LEVEL + 1
        values.SUPQUERY = values.SUPQUERY ? 1 : 0
        dispatch({ type: 'nav/addOrEdit', payload: { values, PID, oldValues: record } })
      } else {
        return message.error('保存失败')
      }
    })
  }

  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const { ID, NAME, NO, FACETYPE, ICON, SUPQUERY, ENNAME } = this.props.record //声明record
    return (
      <Form>
        <table width='100%'>
          <tbody>
            <tr>
              <td>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator('ID', {
                    initialValue: ID
                  })(<Input hidden />)}
                </FormItem>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单名称'>
                  {getFieldDecorator('NAME', {
                    rules: [{ required: true, message: '请输入菜单名称!' }],
                    initialValue: NAME
                  })(<Input />)}
                </FormItem>
              </td>
              <td>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单编码'>
                  {getFieldDecorator('NO', {
                    rules: [{ required: true, message: '请输入菜单编码!' }],
                    initialValue: NO
                  })(<Input />)}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='页面类型'>
                  {getFieldDecorator('FACETYPE', {
                    initialValue: FACETYPE,
                    rules: [{ required: true, message: '请选择页面类型!' }]
                  })(
                    <Select initialValue={FACETYPE} style={{ width: '100%' }}>
                      {facetypeMap.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </td>
              <td>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='图标'>
                  {getFieldDecorator('ICON', {
                    initialValue: ICON
                  })(<IconSelectorForm onOk={this.setIconName} icon={ICON} />)}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='支持搜索'>
                  {getFieldDecorator('SUPQUERY', {
                    initialValue: SUPQUERY === 0 ? false : true,
                    valuePropName: 'checked'
                  })(<Checkbox />)}
                </FormItem>
              </td>
              <td>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='英文名称'>
                  {getFieldDecorator('ENNAME', {
                    initialValue: ENNAME
                  })(<Input />)}
                </FormItem>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    )
  }
}
export default Modal(connect()(Form.create()(NavForm)))
