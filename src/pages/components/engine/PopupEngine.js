/*
 * @Author: hjh
 * @Date: 2019-11-26 15:44:48
 * @LastEditTime: 2020-04-14 15:28:48
 * @Descripttion: 点击弹窗engine
 */
import { connect } from 'dva'
import ModalHoc from './modal/ModalHoc'
import TableHoc from './table/TableHoc'
import ButtonHoc from './button/ButtonHoc'
import RelationPageHoc from './layout/RelationPageHoc'
import PropertyHoc from './property/PropertyHoc'
import PrintHoc from './relationPage/PrintHoc'
import UpAndDownHoc from './layout/UpAndDownHoc'

export default function(engine) {
  const { namespace, clickButton, width } = engine
  let { wtype, name, implclass } = clickButton
  const Basic = () => <div />
  let OutComponent = Basic

  switch (wtype) {
    case 'itemPropertyPage':
    case 'classNodeItemPropertyNo':
      engine.propertyType = 'itemPropertyPage'
      engine.width = width || 800
      OutComponent = PropertyHoc(engine)(OutComponent)
      break
    case 'itemRelationPage':
      OutComponent = RelationPageHoc(OutComponent)
      break
    case 'queryItemView':
      engine.isModal = true
      OutComponent = ButtonHoc(engine)(OutComponent)
      OutComponent = TableHoc(engine)(OutComponent)
      break
    case 'batchAdd':
      engine.isModal = true
      OutComponent = TableHoc(engine)(OutComponent)
      break
    case 'print':
      engine.width = 1000
      engine.okText = '打印'
      OutComponent = PrintHoc(engine)(OutComponent)
      break
    case 'linkPage':
      engine.width = '80%'
      engine.facetype = 2
      engine.height = '500px'
      OutComponent = TableHoc(engine)(OutComponent)
      OutComponent = UpAndDownHoc(engine)(OutComponent)
      break
    case 'report':
      engine.isModal = true
      engine.width = '80%'
      engine.height = '500px'
      let { reportId, isBddp } = JSON.parse(implclass || '{}')
      OutComponent = () => (
        <iframe
          width='100%'
          height='500px'
          title={name}
          src={`http://127.0.0.1:18080/RDP-SERVER/${isBddp ? 'bddpshow/show' : 'rdppage/main'}/${reportId}`}
        />
      )
      break
    default:
      engine.width = 400
      OutComponent = () => <p>{`确定要${name}吗?`}</p>
  }

  // 最后包裹弹窗
  OutComponent = ModalHoc(engine)(OutComponent)

  function mapStateToProps(state) {
    return { model: state[namespace] }
  }
  return connect(mapStateToProps)(OutComponent)
}
