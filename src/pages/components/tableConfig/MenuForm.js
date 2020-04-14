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
import * as commonService from '../../service/commonService'

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

class TableSortForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportList: []
    }
  }
  componentDidMount() {
    const { WTYPE, IMPLCLASS } = this.props.record
    if (WTYPE === 'report') {
      this.setState({ wType: WTYPE })
      let { isBddp } = JSON.parse(IMPLCLASS || '{}')
      this.isBddpChange({ target: { checked: isBddp ? true : false } })
    }
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { REQPARAM, reportId, isBddp } = values
        if (REQPARAM) {
          values.REQPARAM = REQPARAM.join(';')
        }
        if (this.state.wType === 'report') {
          values.IMPLCLASS = JSON.stringify({ reportId, isBddp })
          delete values.reportId
          delete values.isBddp
        }
        await this.props.dispatch({ type: 'selectMenu/addOrEdit', payload: { values, record: this.props.record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  onWTypeChange = value => {
    this.setState({ wType: value })
    if (value === 'report') {
      this.isBddpChange({ target: { checked: false } })
    }
  }

  isBddpChange = e => {
    this.props.form.resetFields(['reportId'])
    commonService.post('/src/getReportFiles', { isBddp: e.target.checked }).then(res => {
      let { dataList } = res.data
      if (e.target.checked) {
        dataList = dataList.map(item => ({ name: item.bdname, uuid: item.name }))
      }
      this.setState({ reportList: dataList })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { NO, NAME, ID, IMPLCLASS, ICON, WTYPE, MTYPE, REQPARAM, TITLE } = this.props.record
    if (REQPARAM) {
      REQPARAM = REQPARAM.split(';')
    }
    let isBddp
    let reportId
    if (WTYPE === 'report') {
      IMPLCLASS = JSON.parse(IMPLCLASS)
      isBddp = IMPLCLASS.isBddp
      reportId = IMPLCLASS.reportId
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                {/* <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='请求路径'>
                    {getFieldDecorator('WEBPATH', {
                      initialValue: WEBPATH
                    })(<Input />)}
                  </FormItem>
                </th> */}
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗类型'>
                    {getFieldDecorator('WTYPE', {
                      initialValue: WTYPE
                    })(
                      <Select onChange={this.onWTypeChange} style={{ width: '100%' }}>
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单类型'>
                    {getFieldDecorator('MTYPE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MTYPE
                    })(
                      <Select style={{ width: '100%' }}>
                        <Option value={1}>业务菜单</Option>
                        <Option value={2}>系统菜单</Option>
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
              {this.state.wType !== 'report' ? (
                <tr>
                  <th colSpan='2'>
                    <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='实现类'>
                      {getFieldDecorator('IMPLCLASS', {
                        rules: [{ required: true, message: '此项必填!' }],
                        initialValue: IMPLCLASS
                      })(<Input />)}
                    </FormItem>
                  </th>
                </tr>
              ) : (
                <tr>
                  <th>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='大屏报表'>
                      {getFieldDecorator('isBddp', {
                        initialValue: isBddp,
                        valuePropName: 'checked'
                      })(<Checkbox onChange={this.isBddpChange} />)}
                    </FormItem>
                  </th>
                  <th>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='报表'>
                      {getFieldDecorator('reportId', {
                        initialValue: reportId,
                        rules: [{ required: true, message: '请选择!' }]
                      })(
                        <Select style={{ width: '100%' }}>
                          {this.state.reportList.map(item => (
                            <Option key={item.uuid} value={item.uuid}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </th>
                </tr>
              )}
            </tbody>
          </table>
          {this.state.wType !== 'report' && (
            <div style={{ width: '100%', marginTop: '10px', fontWeight: 'bold' }}>
              <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='请求参数'>
                {getFieldDecorator('REQPARAM', {
                  initialValue: REQPARAM
                })(<Checkbox.Group options={reqParamMap} />)}
              </FormItem>
            </div>
          )}
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(TableSortForm)))
