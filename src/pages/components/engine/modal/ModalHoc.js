/*
 * @Author: hjh
 * @Date: 2019-10-31 09:32:24
 * @LastEditTime: 2020-03-27 14:24:49
 * @Descripttion: 弹窗通用高阶组件
 */
import { Component } from 'react'
import { message, Button } from 'antd'
import Modal from '../../common/DragModal'
import { confirmBtn } from '../../../../utils/buttonFunc'

const ModalHoc = engine => WrappedComponent => {
  return class extends Component {
    state = { loading: false }

    toogleModal = bool => {
      const { model, dispatch } = this.props
      const { btnId, namespace } = engine
      let payload = { [model.visible]: bool || !model[`modal-${btnId}`] }
      dispatch({ type: `${namespace}/packet`, payload })
      this.setState({ loading: false })
    }
    onClick = (item, e) => {
      const { namespace } = engine
      const { model } = this.props
      const { selectedRows, hnameSpace, clickButton } = model
      let { wtype, values } = clickButton
      this.item = item
      switch (wtype) {
        case 'itemPropertyPage':
        case 'classNodeItemPropertyNo':
          if (engine.peptide) {
            this.childRef.onOk(e, this.confirm)
          } else {
            if (this.childForm) {
              this.childForm.Ok(e, this.confirm)
            }
          }
          break
        case 'itemRelationPage':
        case 'linkPage':
          this.toogleModal()
          break
        case 'queryItemView':
        case 'batchAdd':
          if (!selectedRows || selectedRows.length === 0) {
            return message.warn('请选中您要选择的数据。')
          }
          values.hData = selectedRows
          confirmBtn(item || clickButton, hnameSpace, values, this.callback)
          this.setState({ loading: true })
          break
        case 'print':
          const printContent = document.getElementById('print-content').innerHTML
          var f = document.getElementById('printf')
          f.contentDocument.write(`<style type="text/css"> 
          .print_table {
            border-collapse:collapse;
          }
          .print_table td {
            border: 1px solid #000;
            word-break: break-all;
            white-space: normal;
          }
          </style>`)
          f.contentDocument.write(printContent)
          f.contentDocument.close()
          f.contentWindow.print()
          break
        default:
          confirmBtn(item || clickButton, namespace, values, this.callback)
      }
    }

    confirm = values => {
      const { clickButton } = this.props.model
      const { namespace } = engine
      values = { ...values, ...clickButton.values }
      confirmBtn(this.item || clickButton, namespace, values, this.callback)
      this.setState({ loading: true })
    }

    callback = res => {
      this.setState({ loading: false })
      if (res && !this.item) {
        // 点击确定/取消按钮，后台返回数据后关闭弹窗，除确定按钮外不关闭弹窗
        this.toogleModal(false)
      }
    }

    render() {
      let title = ''
      const { model } = this.props
      let wtype = ''
      const { clickButton } = model || {}
      let btnsCmp = []
      if (clickButton) {
        wtype = clickButton.wtype
        const { name, btns } = clickButton
        title = name
        if (btns && btns instanceof Array) {
          btnsCmp = btns.map((item, index) => (
            <Button type='primary' key={index} onClick={this.onClick.bind(this, item)} icon={item.icon}>
              {item.name}
            </Button>
          ))
        }
      }
      btnsCmp.push(
        <Button key='back' onClick={() => this.toogleModal(false)}>
          取消
        </Button>,
        <Button key='submit' type='primary' onClick={this.onClick.bind(this, null)}>
          {engine.okText || '确认'}
        </Button>
      )
      const props = {}
      if (!engine.peptide) {
        props.wrappedComponentRef = form => (this.childForm = form)
      }
      return (
        <Modal
          width={engine.width || '80%'}
          title={title}
          visible={model && model[`modal-${engine.btnId}`]}
          onCancel={() => this.toogleModal(false)}
          onOk={this.onOk}
          footer={wtype === 'itemRelationPage' ? null : btnsCmp}
        >
          <WrappedComponent
            getInstance={ele => {
              this.childRef = ele
            }}
            {...this.props}
            height={400}
            {...props}
          />
        </Modal>
      )
    }
  }
}
export default ModalHoc
