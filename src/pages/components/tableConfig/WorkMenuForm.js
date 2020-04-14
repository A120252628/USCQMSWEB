/**
 * @author lwp
 */
import React, { Component } from 'react'
import { Form, Input, message, Select, Icon, Checkbox } from 'antd'
import { connect } from 'dva'
import SelectMenu from './SelectMenu'
import SelectInfoBus from './SelectInfoBus'
import SelectItemNo from './SelectItemNo'
import Modal from '../common/Modal'
import { reqParamMap, wtypeMap } from '../../../utils/paramsConfig'
import IconSelectorForm from '../common/IconSelectorForm'
import * as commonService from '../../service/commonService'
import PropertyParamForm from './PropertyParamForm'
import ItemSelectorCmp from './ItemSelectorCmp'
import DragModal from '../common/DragModal'

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

class WorkMenuForm extends Component {
  state = {
    WTYPE: '',
    visible: false,
    visible2: false,
    IMPLTYPE: false
  }
  toogleModal = () => {
    let { WTYPE, MNO, ITEMNO } = this.props.record
    WTYPE = this.state.WTYPE || WTYPE
    if (WTYPE === 'itemPropertyPage') {
      if (!MNO && !this.state.MNO) {
        message.warn('请先选择弹窗标识')
        return
      }
      this.setState({ visible: !this.state.visible })
    } else if (WTYPE === 'batchAdd') {
      ITEMNO = ITEMNO || this.props.ITEMNO || this.state.ITEMNO
      commonService.get('/sysModelItem/queryItemFields', { itemNo: ITEMNO }).then(res => {
        this.setState({ fieldList: res.data })
        this.setState({ visible2: !this.state.visible2 })
      })
    }
  }
  toogleModal2 = () => {
    this.setState({ visible2: !this.state.visible2 })
  }
  Ok = (e, callback) => {
    e.preventDefault()
    const { onMenusOk } = this.props
    if (onMenusOk && typeof onMenusOk === 'function') {
      const values = this.props.form.getFieldsValue()
      if (!values.NO) return message.error('保存失败')
      const { REQPARAM } = values
      if (REQPARAM) {
        values.REQPARAM = REQPARAM.join(';')
      }
      onMenusOk(values)
      return
    }
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { PID, record, dispatch, toogleModal, namespace, activeKey, onMenusOk } = this.props
        const { REQPARAM } = values
        if (REQPARAM) {
          values.REQPARAM = REQPARAM.join(';')
        }
        if (onMenusOk && typeof onMenusOk === 'function') {
          callback()
          onMenusOk(values)
          return
        }
        //保存和更新数据
        await dispatch({ type: 'tableConfig/addOrEditItem', payload: { values, PID, record, activeKey: '2' } })
        callback()
        toogleModal()
        dispatch({
          type: `${namespace}/getRelationMenu`,
          payload: { PID, activeKey }
        })
      } else {
        return message.error('保存失败')
      }
    })
  }

  componentDidMount() {
    const { record } = this.props
    const { WTYPE, ICON, IMPLTYPE } = record
    this.setState({ ICON, WTYPE, IMPLTYPE })
    this.getMnoList(WTYPE)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.record !== this.props.record) {
      const { record } = this.props
      const { WTYPE, ICON } = record
      this.setState({ ICON, WTYPE })
      this.getMnoList(WTYPE)
    }
  }

  getMnoList = (WTYPE, itemNo) => {
    let tableName = ''
    let { ITEMNO, classItemNo } = this.props
    ITEMNO = itemNo || ITEMNO
    if (WTYPE === 'itemRelationPage') {
      tableName = 'usc_model_relationpage'
    } else if (WTYPE === 'itemPropertyPage') {
      tableName = 'usc_model_property'
    } else if (WTYPE === 'classNodeItemPropertyNo') {
      tableName = 'usc_model_property'
      ITEMNO = classItemNo
    } else {
      return
    }
    if (ITEMNO)
      commonService.get('/sysModelItem/queryItemPGR', { itemNo: ITEMNO, tableName }).then(res => {
        if (res && res.data && res.data.flag) {
          this.setState({ mnoList: res.data.dataList })
        }
      })
  }

  //添加的时候弹出model
  showWorkMenu = () => {
    this.state.IMPLTYPE
      ? this.props.dispatch({ type: 'selectInfoBus/query', payload: { onSelect: this.InfoBusSelect } })
      : this.props.dispatch({ type: 'selectMenu/query', payload: { TYPE: 1, onSelect: this.menuSelect } })
  }
  //保存添加选择的数据
  menuSelect = data => {
    let { NO, NAME, IMPLCLASS, WEBPATH, WTYPE, REQPARAM, ICON, TITLE } = data
    REQPARAM = REQPARAM && REQPARAM.split(';')
    this.getMnoList(WTYPE)
    this.setState({ WTYPE, ICON })
    this.props.form.setFieldsValue({ NO, NAME, IMPLCLASS, WEBPATH, WTYPE, REQPARAM, ICON, TITLE })
  }
  InfoBusSelect = data => {
    let { NO, NAME, WTYPE, REQPARAM, ICON, TITLE } = data
    REQPARAM = REQPARAM && REQPARAM.split(';')
    this.setState({ WTYPE, ICON })
    this.props.form.setFieldsValue({ NAME, IMPLCLASS: NO, WTYPE, REQPARAM, ICON, TITLE })
  }

  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  Action = PROPERTYPARAM => {
    this.props.form.setFieldsValue({ PROPERTYPARAM })
    this.setState({ PROPERTYPARAM })
  }

  openSelectItemNo = () => {
    this.props.dispatch({
      type: 'selectItemNo/query',
      payload: { condition: 'type in (0, 1)', onSelect: this.itemNoSelect }
    })
  }

  itemNoSelect = rows => {
    let obj = {}
    const { ITEMNO } = rows[0]
    obj['ITEMNO'] = ITEMNO
    this.props.form.setFieldsValue(obj)
    this.getMnoList(this.state.WTYPE, ITEMNO)
    this.setState({ ITEMNO })
  }

  onMnoChange = (value, option) => {
    this.setState({ MNO: value })
    this.props.form.setFieldsValue({ TITLE: option.key })
  }

  childAction = () => {
    this.childForm.props.form.validateFields((err, values) => {
      if (!err) {
        for (let i = 0; i < values.mapFields.length; i++) {
          if (!values.mapFields[i]) {
            values.mapFields.splice(i, 1)
            i--
          }
        }
        this.props.form.setFieldsValue({ PROPERTYPARAM: JSON.stringify(values) })
        this.toogleModal2()
      } else {
        return message.error('保存失败')
      }
    })
  }
  onIMPLTYPEChange = e => {
    this.setState({ IMPLTYPE: e.target.checked })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let {
      ID,
      DEL,
      NO,
      NAME,
      IMPLCLASS,
      MTYPE,
      PID,
      PARAM,
      ABTYPE,
      REQPARAM,
      WTYPE,
      MNO,
      ITEMNO,
      PROPERTYPARAM,
      TITLE,
      IMPLTYPE,
      ENNAME
    } = this.props.record
    const { ICON, visible, visible2, fieldList } = this.state
    const { propertyList, relationList } = this.props.tableConfig
    if (!WTYPE) {
      WTYPE = this.state.WTYPE
    }
    let mnoList = this.state.mnoList
    if (!mnoList) mnoList = WTYPE === 'itemRelationPage' ? relationList : propertyList
    if (REQPARAM) {
      REQPARAM = REQPARAM.split(';')
    }
    const isABAction = MTYPE === 1 && ABTYPE
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
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', fontWeight: 'bold' }}>
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                {getFieldDecorator('ID', {
                  initialValue: ID
                })(<Input hidden />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                {getFieldDecorator('PID', {
                  initialValue: PID
                })(<Input hidden />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                {getFieldDecorator('ABTYPE', {
                  initialValue: ABTYPE
                })(<Input hidden />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                {getFieldDecorator('DEL', {
                  initialValue: DEL
                })(<Input hidden />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='事务标识'>
                {getFieldDecorator('NO', {
                  rules: [
                    { required: true, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '输入不规范!' },
                    {
                      validator: onRules
                    }
                  ],
                  initialValue: isABAction ? (ABTYPE === 'after' ? 'AfterAction' : 'BeforeAction') : NO
                })(<Input disabled={isABAction} />)}
              </FormItem>
            </div>
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单名称'>
                {getFieldDecorator('NAME', {
                  rules: [
                    { required: true, message: '此项必填!' },
                    {
                      validator: onRules
                    }
                  ],
                  initialValue: isABAction ? (ABTYPE === 'after' ? '后处理集合' : '前处理集合') : NAME
                })(<Input disabled={isABAction} />)}
              </FormItem>
            </div>
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='英文名称'>
                {getFieldDecorator('ENNAME', {
                  initialValue: ENNAME
                })(<Input />)}
              </FormItem>
            </div>
            {MTYPE !== 1 && (
              <div style={{ width: '50%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='参数'>
                  {getFieldDecorator('PARAM', {
                    initialValue: PARAM
                  })(<Input />)}
                </FormItem>
              </div>
            )}
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单类型'>
                {getFieldDecorator('MTYPE', {
                  rules: [{ required: true, message: '此项必填!' }],
                  initialValue: MTYPE
                })(
                  <Select disabled initialValue={MTYPE} style={{ width: '100%' }}>
                    <Option value={0}>菜单项</Option>
                    <Option value={1}>菜单组</Option>
                  </Select>
                )}
              </FormItem>
            </div>
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗类型'>
                {getFieldDecorator('WTYPE', {
                  initialValue: WTYPE
                })(
                  <Select disabled style={{ width: '100%' }}>
                    {wtypeMap.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </div>
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='图标'>
                {getFieldDecorator('ICON', {
                  initialValue: ICON
                })(<IconSelectorForm onOk={this.setIconName} icon={ICON} />)}
              </FormItem>
            </div>
            {WTYPE && (
              <div style={{ width: '50%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='对象标识'>
                  {getFieldDecorator('ITEMNO', {
                    rules: [{ required: true, message: '必填项!' }],
                    initialValue: ITEMNO || this.props.ITEMNO || this.props.classItemNo
                  })(<Input disabled addonAfter={<Icon type='plus' onClick={this.openSelectItemNo} />} />)}
                </FormItem>
              </div>
            )}
            {(WTYPE === 'itemRelationPage' ||
              WTYPE === 'itemPropertyPage' ||
              this.state.WTYPE === 'itemRelationPage' ||
              this.state.WTYPE === 'itemPropertyPage') &&
              !this.state.IMPLTYPE && (
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗标识'>
                    {getFieldDecorator('MNO', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MNO
                    })(
                      <Select onChange={this.onMnoChange} style={{ width: '100%' }}>
                        {mnoList.map(item => (
                          <Option value={item.NO} key={item.NAME}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </div>
              )}
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗标题'>
                {getFieldDecorator('TITLE', {
                  initialValue: TITLE
                })(<Input />)}
              </FormItem>
            </div>
            <div style={{ width: '50%' }}>
              <FormItem
                onChange={this.onIMPLTYPEChange}
                {...formItemLayout}
                style={{ marginBottom: 0 }}
                label='信息总线'
              >
                {getFieldDecorator('IMPLTYPE', {
                  initialValue: IMPLTYPE,
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </FormItem>
            </div>
            {MTYPE !== 1 && (
              <div style={{ width: '100%' }}>
                <FormItem
                  {...formItemLayout2}
                  style={{ marginBottom: 0 }}
                  label={this.state.IMPLTYPE ? '信息总线' : '实现类'}
                >
                  {getFieldDecorator('IMPLCLASS', {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: IMPLCLASS
                  })(<Input disabled addonAfter={<Icon type='plus' onClick={this.showWorkMenu} />} />)}
                </FormItem>
              </div>
            )}
            {(WTYPE === 'itemPropertyPage' ||
              WTYPE === 'batchAdd' ||
              this.state.WTYPE === 'itemPropertyPage' ||
              this.state.WTYPE === 'batchAdd') && (
              <div style={{ width: '100%' }}>
                <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='属性页参数'>
                  {getFieldDecorator('PROPERTYPARAM', {
                    initialValue: PROPERTYPARAM
                  })(<Input disabled addonAfter={<Icon type='plus' onClick={this.toogleModal} />} />)}
                </FormItem>
              </div>
            )}
            <div style={{ width: '100%', marginTop: '10px' }}>
              <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='请求参数'>
                {getFieldDecorator('REQPARAM', {
                  initialValue: REQPARAM
                })(<Checkbox.Group disabled options={reqParamMap} />)}
              </FormItem>
            </div>
          </div>
        </Form>
        <SelectMenu />
        <SelectInfoBus />
        <SelectItemNo />
        {(MNO || this.state.MNO) && (
          <PropertyParamForm
            pItemNo={this.props.ITEMNO || this.props.classItemNo}
            ITEMNO={ITEMNO || this.props.ITEMNO || this.props.classItemNo || this.state.ITEMNO}
            ITEMA={this.props.ITEMA}
            MNO={MNO || this.state.MNO}
            visible={visible}
            PROPERTYPARAM={PROPERTYPARAM || this.state.PROPERTYPARAM}
            toogleModal={this.toogleModal}
            Action={this.Action}
          />
        )}
        {(this.state.WTYPE === 'batchAdd' || WTYPE === 'batchAdd') && (
          <DragModal visible={visible2} title='参数' onCancel={this.toogleModal2} onOk={this.childAction}>
            <ItemSelectorCmp
              wrappedComponentRef={form => (this.childForm = form)}
              editparams={PROPERTYPARAM}
              fieldList={fieldList}
            />
          </DragModal>
        )}
      </div>
    )
  }
}

function mapStateToProps({ tableConfig }) {
  return { tableConfig }
}

export default Modal(connect(mapStateToProps)(Form.create()(WorkMenuForm)))
