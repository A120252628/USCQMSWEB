/*
 * @Author: hjh
 * @Date: 2019-07-29 16:29:06
 * @LastEditTime: 2020-03-26 15:05:20
 * @Descripttion: 配置平台表单弹窗
 */

import React, { Component } from 'react'
import { Form, Input, message, Select, Icon } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'
import SelectItemNo from './SelectItemNo'

const Option = Select.Option
const { TextArea } = Input
const FormItem = Form.Item
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
const implclassMap = [
  'com.usc.obj.api.type.GeneralObject',
  'com.usc.obj.api.type.file.FileObject',
  'com.usc.obj.api.type.relation.RelationShipObject',
  'com.usc.obj.api.type.relation.ClassRelationShipObject'
]

class TableConfigForm extends Component {
  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        if (values.QUERYFIELDS) {
          values.QUERYFIELDS = values.QUERYFIELDS.join(',')
        }
        values.SITEM = 0 // 默认都是业务对象
        await this.props.dispatch({ type: 'tableConfig/addOrEdit', payload: { values, record: this.props.record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  toogleItemNo = () => {
    this.props.dispatch({
      type: 'selectItemNo/query',
      payload: { condition: 'TYPE = 0 or TYPE = 1', onSelect: this.itemNoSelect }
    })
  }

  itemNoSelect = rows => {
    const {
      record: { TYPE },
      form
    } = this.props
    const { ITEMNO, TABLENAME, NAME } = rows[0]
    form.setFieldsValue({
      ITEMNO: TYPE === 2 ? `rel_${ITEMNO}_obj` : `crl_${ITEMNO}_obj`,
      NAME: TYPE === 2 ? `${NAME}关系对象` : `${NAME}分类对象`,
      TABLENAME: TYPE === 2 ? `rel_${TABLENAME}_obj` : `crl_${TABLENAME}_obj`
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let {
      ID,
      ITEMNO,
      TABLENAME,
      NAME,
      ISLIFE,
      TYPE,
      CONTRLFILE,
      QUERYFIELDS,
      REMARK,
      BRIEFEXP,
      IMPLCLASS,
      STATE,
      ENNAME
    } = this.props.record
    if (QUERYFIELDS) {
      QUERYFIELDS = QUERYFIELDS.split(',')
    } else {
      QUERYFIELDS = []
    }
    const queryfieldsList = (this.props.fieldList && this.props.fieldList.map(item => item.NO)) || []

    const onRules = (rule, value, callback) => {
      let list = this.props.list || []
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
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='对象标识'>
                    {getFieldDecorator('ITEMNO', {
                      rules: [
                        { required: true, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '输入不规范!' },
                        { validator: onRules }
                      ],
                      initialValue: ITEMNO
                    })(
                      TYPE === 0 || TYPE === 1 ? (
                        <Input />
                      ) : (
                        <Input
                          disabled
                          addonAfter={<Icon style={{ margin: '0' }} type='plus' onClick={this.toogleItemNo} />}
                        />
                      )
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='数据库表名'>
                    {getFieldDecorator('TABLENAME', {
                      rules: [
                        { required: true, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '输入不规范!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: TABLENAME
                    })(<Input disabled={(TYPE === 0 || TYPE === 1) && STATE !== 'U' ? false : true} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='业务对象名称'>
                    {getFieldDecorator('NAME', {
                      rules: [
                        { required: true, message: '此项必填!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NAME
                    })(<Input disabled={TYPE === 0 || TYPE === 1 ? false : true} />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='英文名称'>
                    {getFieldDecorator('ENNAME', {
                      initialValue: ENNAME
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                {/* <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='生命周期'>
                    {getFieldDecorator('ISLIFE', {
                      initialValue: ISLIFE,
                      rules: [{ required: true, message: '此项必填!' }]
                    })(
                      <Select initialValue={ISLIFE} style={{ width: '100%' }}>
                        <Option value={0}>无</Option>
                        <Option value={1}>有</Option>
                      </Select>
                    )}
                  </FormItem>
                </th> */}
                {/* <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='控制归档权'>
                    {getFieldDecorator('CONTRLFILE', {
                      initialValue: CONTRLFILE
                    })(
                      <Select initialValue={CONTRLFILE} style={{ width: '100%' }}>
                        <Option value={0}>否</Option>
                        <Option value={1}>是</Option>
                      </Select>
                    )}
                  </FormItem>
                </th> */}
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='对象类型'>
                    {getFieldDecorator('TYPE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: TYPE
                    })(
                      <Select initialValue={TYPE} style={{ width: '100%' }} disabled>
                        <Option value={0}>普通对象</Option>
                        <Option value={1}>文件对象</Option>
                        <Option value={2}>关联对象</Option>
                        <Option value={3}>分类对象</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='快速查询字段'>
                    {getFieldDecorator('QUERYFIELDS', {
                      initialValue: QUERYFIELDS
                    })(
                      <Select mode='multiple' style={{ width: '100%' }}>
                        {queryfieldsList.map((item, index) => (
                          <Option key={index} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='简单表达式'>
                    {getFieldDecorator('BRIEFEXP', {
                      initialValue: BRIEFEXP
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='实现类'>
                    {getFieldDecorator('IMPLCLASS', {
                      initialValue: IMPLCLASS || implclassMap[TYPE]
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                    {getFieldDecorator('REMARK', {
                      initialValue: REMARK
                    })(<TextArea autosize={{ minRows: 2 }} />)}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
        </Form>
        <SelectItemNo />
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(TableConfigForm)))
