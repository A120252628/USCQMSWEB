import React, { Component } from 'react'
import { Form, Input, message, Select, Icon, Checkbox } from 'antd'
import { connect } from 'dva'
import SelectItemNo from '../tableConfig/SelectItemNo'
import Modal from '../common/Modal'
import SortFieldsForm from '../nav/SortFieldsForm'
import * as commonService from '../../service/commonService'
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

const conditions = ['TYPE in (0,1)', 'TYPE in (0,1)', 'TYPE = 2']
const fields = ['ITEMA', 'ITEMB', 'RELATIONITEM']

const FormItem = Form.Item
const Option = Select.Option
class RelationshipForm extends Component {
  state = { fieldList: [] }
  componentDidMount() {
    const { ITEMB } = this.props.record
    if (ITEMB) this.getFieldList(ITEMB)
  }

  Ok = e => {
    e.preventDefault()
    if (this.childForm) {
      this.childForm.Ok(e, (flag, sortFields) => {
        if (flag) {
          this.props.form.validateFields((err, values) => {
            if (!err) {
              const oldValues = this.props.record
              values.SUPQUERY = values.SUPQUERY ? 1 : 0
              values.sortFields = sortFields
              this.props.dispatch({ type: 'relationship/addOrEdit', payload: { values, oldValues } })
            } else {
              return message.error('保存失败')
            }
          })
        }
      })
    }
  }

  getFieldList = itemNo => {
    commonService.get('/sysModelItem/queryItemFields', { itemNo }).then(res => {
      this.setState({ fieldList: res.data })
    })
  }

  openSelectItemNo = type => () => {
    this.props.dispatch({
      type: 'selectItemNo/query',
      payload: { condition: conditions[type], onSelect: this.itemNoSelect }
    })
    this.type = type
  }

  itemNoSelect = rows => {
    let obj = {}
    obj[fields[this.type]] = rows[0].ITEMNO
    this.props.form.setFieldsValue(obj)
    if (this.type === 1) this.getFieldList(rows[0].ITEMNO)
  }

  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const { fieldList } = this.state
    const { ID, NO, NAME, RELATIONITEM, ITEMA, ITEMB, PITEM, STATE, SUPQUERY, SORTFIELDS, ENNAME } = this.props.record //声明record
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
                    })(<Input disabled={STATE === 'U' ? true : false} />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关系名称'>
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关系对象'>
                    {getFieldDecorator('RELATIONITEM', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: RELATIONITEM
                    })(<Input disabled addonAfter={<Icon type='plus' onClick={this.openSelectItemNo(2)} />} />)}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关系集合父对象'>
                    {getFieldDecorator('PITEM', {
                      initialValue: PITEM,
                      rules: [{ required: true, message: '必填项!' }]
                    })(
                      <Select initialValue={PITEM} style={{ width: '100%' }}>
                        <Option value='对象A'>对象A</Option>
                        <Option value='对象B'>对象B</Option>
                      </Select>
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='对象A'>
                    {getFieldDecorator('ITEMA', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: ITEMA
                    })(<Input disabled addonAfter={<Icon type='plus' onClick={this.openSelectItemNo(0)} />} />)}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='对象B'>
                    {getFieldDecorator('ITEMB', {
                      initialValue: ITEMB,
                      rules: [{ required: true, message: '必填项!' }]
                    })(<Input disabled addonAfter={<Icon type='plus' onClick={this.openSelectItemNo(1)} />} />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='支持搜索'>
                    {getFieldDecorator('SUPQUERY', {
                      initialValue: SUPQUERY === 0 ? false : true,
                      valuePropName: 'checked'
                    })(<Checkbox />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
          <SortFieldsForm
            sortFields={SORTFIELDS}
            fieldList={fieldList || []}
            wrappedComponentRef={form => (this.childForm = form)}
          />
        </Form>
        <SelectItemNo />
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(RelationshipForm)))
