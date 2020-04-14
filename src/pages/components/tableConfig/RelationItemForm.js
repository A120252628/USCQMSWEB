/*
 * 对象属性页选项表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-10 10:59:32
 */
import React, { Component } from 'react'
import { Form, Input, message, Select } from 'antd'
import RelationParamsForm from './RelationParamsForm'
import Modal from '../common/Modal'
import { connect } from 'dva'
import IconSelectorForm from '../common/IconSelectorForm'
import { relationTypeMap } from '../../../utils/paramsConfig'

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

class RelationItemForm extends Component {
  state = { selectRtype: '' }
  componentDidMount() {
    if (this.props.record.RTYPE) {
      this.setState({
        selectRtype: this.props.record.RTYPE,
        disabledType: true
      })
    }
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.childForm.props.form.validateFields(async (error, value) => {
          if (!error) {
            callback()
            const { record, dispatch, PID, gid } = this.props
            values.ITEMID = gid
            await dispatch({
              type: 'tableConfig/addOrEditRootItem',
              payload: { values: { ...values, ...value }, record, PID }
            })
            callback()
          } else {
            return message.error('保存失败')
          }
        })
      } else {
        return message.error('保存失败')
      }
    })
  }

  handleChange = value => {
    this.setState({ selectRtype: value })
  }
  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      ID,
      RTYPE,
      NAME,
      NO,
      ITEMNO,
      RELEVANCENAME,
      RELEVANCENO,
      ITEMGRID,
      ICON,
      SUPQUERY,
      ENNAME
    } = this.props.record
    const { selectRtype } = this.state

    return (
      <div style={{ padding: '2px' }}>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <th width='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='页签标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </th>
                <th width='50%'>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='页签标题'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '必填!' }],
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关联页类型'>
                    {getFieldDecorator('RTYPE', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: RTYPE
                    })(
                      <Select style={{ width: '100%' }} onChange={this.handleChange} disabled={this.state.disabledType}>
                        {relationTypeMap.map(item => (
                          <Option value={item.value} key={item.value}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='图标'>
                    {getFieldDecorator('ICON', { initialValue: ICON })(
                      <IconSelectorForm onOk={this.setIconName} icon={ICON} />
                    )}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
        </Form>
        {selectRtype &&
          selectRtype !== 'authority' &&
          selectRtype !== 'changeHistory' &&
          selectRtype !== 'input' &&
          selectRtype !== 'output' && (
            <RelationParamsForm
              wrappedComponentRef={form => (this.childForm = form)}
              selectRtype={selectRtype}
              RELEVANCENAME={RELEVANCENAME}
              ITEMNO={selectRtype !== 'relationproperty' ? ITEMNO : this.props.ITEMNO}
              RELEVANCENO={RELEVANCENO}
              ITEMGRID={ITEMGRID}
              SUPQUERY={SUPQUERY}
            />
          )}
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(RelationItemForm)))
