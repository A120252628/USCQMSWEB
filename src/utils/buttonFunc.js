import { message } from 'antd'

export const clickBtn = (item, engine, model) => {
  // console.log(engine)
  let { selectedRows = [], pRecord, dataList, params } = model
  let { itemNo, namespace, relevanceNo, itemGrid, modelRelationShip, itemA, classNamespace } = engine
  let { reqparam, wtype, param, implclass, mno, id, propertyParam } = item
  if (item.itemNo) itemNo = item.itemNo
  const { classNodeItemNo, classItemNo } = params || {}
  reqparam = (reqparam && reqparam.split(';')) || []
  if (wtype !== 'queryItemView' && wtype !== 'batchAdd') {
    if (reqparam.indexOf('hData') !== -1 && selectedRows.length === 0) {
      message.warn(selectedRows.length === 0 ? '请选择要操作的行！' : '请选择单条数据')
      return
    } else if (reqparam.indexOf('hSingleData') !== -1 && selectedRows.length !== 1) {
      message.warn('请选择单条数据')
      return
    }
  }
  let btns = null
  if (param && JSON.parse(param)) {
    btns = JSON.parse(param)
    item.btns = btns
  }
  // 提前取得所有的参数，避免弹窗之后model层改变取不到对应数据
  item.values = {
    itemNo,
    hData: selectedRows,
    itemAData: pRecord,
    relationShipNo: relevanceNo,
    rData: dataList,
    itemGridNo: itemGrid ? itemGrid.no : modelRelationShip.itemGrid.no,
    pid: selectedRows[0] ? selectedRows[0].ID : '0',
    itemA,
    classNodeItemNo,
    classItemNo,
    classNodeData: selectedRows[0],
    classBusinessItemNo: params ? params.itemNo : null
  }
  let newPayload = { clickButton: item, namespace, itemNo, engine }
  if (wtype === 'itemPropertyPage') {
    // 流程特殊处理和分配角色特殊处理
    if (implclass === 'com.usc.app.action.demo.zc.ActStartProcess') {
      window.g_app._store.dispatch({
        type: 'actStartProcess/query',
        payload: { selectedRows: model && model.selectedRows ? model.selectedRows : [], itemNo: itemNo }
      })
      return
    } else if (implclass === 'assignRole') {
      window.g_app._store.dispatch({
        type: `${implclass}/query`,
        payload: { selectedRows: model && model.selectedRows ? model.selectedRows : [] }
      })
      return
    } else {
      if (propertyParam) {
        propertyParam = JSON.parse(propertyParam)
        const { itemNo: pItemNo, mapFields, selectMap, selectDefaultV, defaultVList } = propertyParam
        let mapRecord = {}
        let sRecord = pItemNo === itemA ? pRecord : selectedRows[0]
        if (selectDefaultV) {
          defaultVList.forEach(item => {
            const { field, value } = item
            mapRecord[field] = value
          })
        }
        if (selectMap) {
          mapFields.forEach(item => {
            const { sfield, tfield } = item
            mapRecord[tfield] = sRecord[sfield]
          })
        }
        newPayload.mapRecord = mapRecord
      }
      newPayload.record = reqparam.indexOf('hData') !== -1 ? selectedRows : {}
    }
  } else if (wtype === 'classNodeItemPropertyNo') {
    newPayload.record = reqparam.indexOf('hData') !== -1 ? selectedRows : {}
    newPayload.namespace = classNamespace
    newPayload.itemNo = params.itemNo
  } else if (wtype === 'itemRelationPage') {
    newPayload.record = selectedRows[0]
  } else if (wtype === 'queryItemView') {
    newPayload.record = selectedRows[0]
    newPayload.rData = dataList
  } else if (wtype === 'classItemView') {
    return
  } else if (wtype === 'batchAdd') {
    if (propertyParam) {
      propertyParam = JSON.parse(propertyParam)
      const { mapFields } = propertyParam
      item.values.mapFields = mapFields
    }
  } else if (wtype === 'downLoad') {
    let values = { mno, menuId: id, implclass }
    reqparam.forEach(p => {
      values[p] = item.values[p]
    })
    window.g_app._store.dispatch({ type: `common/downLoad`, payload: { values } })
    return
  } else if (wtype === 'print') {
    if (selectedRows.length === 0) {
      message.warn('请选择要操作的行！')
      return
    }
    newPayload.record = selectedRows
  }
  window.g_app._store.dispatch({ type: `popup/loadPopup`, payload: newPayload })
}

export const confirmBtn = (item, namespace, values, callback) => {
  let { reqparam, mno, id, implclass, impltype } = item
  reqparam = (reqparam && reqparam.split(';')) || []
  let newValues = { mno, menuId: id, implclass, file: values.file, impltype: impltype ? true : false }
  reqparam.forEach(item => {
    if (item === 'classBusinessItemNo') {
      newValues.itemNo = values[item]
    } else if (item === 'rData') {
      newValues.hData = values.hData
    } else if (item === 'mapFields') {
      newValues.otherParam = values[item]
    } else {
      newValues[item] = values[item]
    }
  })
  window.g_app._store.dispatch({
    type: 'common/save',
    payload: { values: newValues, namespace },
    callback: res => {
      callback && callback(res)
    }
  })
}
