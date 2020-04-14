/*
 * @Author: hjh
 * @Date: 2019-08-01 11:24:29
 * @LastEditTime: 2020-04-10 15:25:15
 * @Descripttion: 点击按钮弹出窗口相关的请求
 */
import * as commonService from '../../service/commonService'
import { judgeModel } from '../../../utils/utils'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import SubPageEngine from '../../components/engine/SubPageEngine'
import PopupEngine from '../../components/engine/PopupEngine'

const renderDiv = (name, Page) => {
  let div = document.getElementById(name)
  if (!div) {
    div = document.createElement('div')
    div.setAttribute('id', name)
    document.body.appendChild(div)
  }
  //渲染页面
  console.log(window.g_app._store)
  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <Page />
    </Provider>,
    div
  )
}
export default {
  namespace: 'popup',
  state: {},
  effects: {
    // 添加子页面
    *loadSubpage(
      {
        payload: { itemRelationPage, record, facetype, pNameSpace, menuId, itemA }
      },
      { call, put, select }
    ) {
      for (let i = 0; i < itemRelationPage.length; i++) {
        let item = itemRelationPage[i]
        const { rType, id, itemID, name, icon, itemNo, sortFields } = item
        item = { ...item, menuId, itemA, itemNo: itemNo || itemA }
        // 1. 生成唯一namespace
        let newNamespace = ''
        if (rType === 'changeHistory' || rType === 'input' || rType === 'output' || rType === 'authority') {
          newNamespace = item.itemNo + '_' + rType
        } else if (rType === 'dynamicRelationPage') {
          newNamespace = pNameSpace + '_dynamic'
          yield put({
            type: `${newNamespace}/packet`,
            payload: { selectedRowKeys: [], selectedRows: [], showTab: false }
          })
        } else if (rType !== 'relationproperty') {
          newNamespace = item.itemNo + '_' + menuId
          // 清除关联页选择数据
          yield put({
            type: `${newNamespace}/packet`,
            payload: { selectedRowKeys: [], selectedRows: [], showTab: false }
          })
        } else {
          newNamespace = pNameSpace
        }
        item.namespace = newNamespace
        item.pRecord = record
        const panes = yield select(state => state[pNameSpace].panes)
        if (rType === 'dynamicRelationPage') {
          judgeModel(newNamespace)
          let pl = {
            itemNo,
            itemA,
            itemAData: record,
            implclass: 'com.usc.app.action.demo.zc.GainDynamicRelationPageModelAndDataAction'
          }
          let { data } = yield call(commonService.common, pl)
          item.modelRelationShip = data
          yield put({
            type: `${newNamespace}/packet`, //调用各个组件model的同步packet方法
            payload: { dataList: data.dataList, pRecord: record }
          })
          let Cmp = SubPageEngine(item)
          const index = panes.findIndex(pane => pane.key === id)
          const pane = { title: name, icon, content: <Cmp />, key: id }
          index === -1 ? panes.push(pane) : (panes[index] = pane)
          yield put({ type: `${pNameSpace}/packet`, payload: { panes } })
        } else if (panes.length < itemRelationPage.length) {
          judgeModel(newNamespace)
          // 2. 生成组件
          if (rType === 'relationclassview') {
            // 自动分类视图关联页要单独请求建模
            yield put({
              type: 'common/queryClassViewNode',
              payload: { pNameSpace, item, record, facetype, namespace: newNamespace }
            })
          }
          const key = id || itemID
          if (facetype === 4) {
            item.facetype = 2
            item.isClassPage = true
          }
          let Cmp = SubPageEngine(item)
          panes.push({ title: name, icon, content: <Cmp />, key })
          yield put({ type: `${pNameSpace}/packet`, payload: { panes } })
        }
        // 3. 请求数据
        if (facetype !== 4 && rType !== 'dynamicRelationPage') {
          yield put({
            type: `common/${rType === 'authority' ? 'queryAuthority' : 'querySubpage'}`,
            payload: { namespace: newNamespace, pRecord: record, item, sortFields }
          })
        }
      }
    },
    *loadPopup({ payload }, { call, put, select }) {
      let { clickButton, itemNo, namespace, record, engine, rData, condition } = payload
      let { id, mno, wtype, values, implclass, propertyParam, reqparam } = clickButton
      reqparam = (reqparam && reqparam.split(';')) || []
      const visible = `modal-${id}`
      let newPayload = { clickButton, record, visible }
      const state = yield select(state => state[namespace])
      newPayload[visible] = true
      if (!state || state[visible] !== false) {
        // visi为false时，说明已经点击过一次，再次点击不用请求建模，直接显示
        let ModalPage = null
        let modalParams = { clickButton, namespace, btnId: id }
        switch (wtype) {
          case 'itemPropertyPage':
          case 'classNodeItemPropertyNo':
            const params = { itemNo, itemPropertyNo: mno }
            let { data } = yield call(commonService.post, '/sysModelToWbeClient/getModel/propertyData', params)
            if (data) {
              modalParams = { ...modalParams, ...data, itemNo }
            }
            break
          case 'itemRelationPage':
            namespace = `${engine.namespace}_relationModal`
            newPayload.selectedRows = [record]
            judgeModel(namespace)
            modalParams.namespace = namespace
            break
          case 'queryItemView':
            namespace = `${engine.namespace}_queryRelation`
            judgeModel(namespace)
            modalParams = { ...modalParams, ...engine, ...engine.modelRelationShip, namespace }
            modalParams.itemGrid.rowSelectionType = reqparam.indexOf('hSingleData') !== -1 ? 'radio' : 'checkbox'
            delete modalParams.pageMenus
            delete modalParams.modelRelationShip
            break
          case 'batchAdd':
            if (propertyParam) {
              propertyParam = JSON.parse(propertyParam)
              const { itemNo: pItemNo, sql } = propertyParam
              let { data: res } = yield call(commonService.common, {
                itemNo: pItemNo,
                condition: sql,
                implClass: 'com.usc.app.action.editor.ItemSelector'
              })
              const { dataList, gridFieldList } = res.dataList[0]
              newPayload = {
                ...newPayload,
                dataList,
                pRecord: record,
                namespace,
                selectedRowKeys: [],
                selectedRows: [],
                hnameSpace: engine.namespace
              }
              namespace = `${engine.namespace}_batchAdd`
              judgeModel(namespace)
              modalParams = { ...modalParams, ...engine, namespace }
              modalParams.itemGrid.rowSelectionType = reqparam.indexOf('hSingleData') !== -1 ? 'radio' : 'checkbox'
              modalParams.itemGrid.gridFieldList = gridFieldList
              delete modalParams.pageMenus
              console.log(modalParams)
            }
            break
          case 'print':
            break
          case 'linkPage':
            namespace = `${itemNo}+${id}`
            judgeModel(namespace)
            modalParams.namespace = namespace
            let { data: modelData } = yield call(commonService.post, '/sysModelToWbeClient/getModelData', {
              itemNo,
              condition,
              facetype: 2
            })
            if (modelData) {
              modalParams = { ...modalParams, ...modelData }
            }
            break
          default:
            console.log('new wtype', wtype)
        }
        ModalPage = PopupEngine(modalParams)
        renderDiv(visible, ModalPage)
      }
      if (wtype === 'itemRelationPage') {
        const { itemNo, hData } = values
        const params = { itemNo, hData, mno, implclass: 'com.usc.app.action.mate.GainItemRelationPageAction' }
        let { data } = yield call(commonService.common, params)
        const { itemRelationPageSignList } = data.itemRelationPage
        if (itemRelationPageSignList) {
          yield put({
            type: 'loadSubpage',
            payload: {
              itemRelationPage: itemRelationPageSignList,
              record,
              pNameSpace: namespace,
              menuId: engine.menuId,
              itemA: itemNo
            }
          })
        }
      } else if (wtype === 'queryItemView') {
        engine.rData = rData
        const params = { itemNo, rData, implClass: 'com.usc.app.query.QueryAddRelationObjectData', page: 1 }
        let { data } = yield call(commonService.common, params)
        newPayload = {
          ...newPayload,
          dataList: data.dataList,
          pRecord: record,
          namespace,
          selectedRowKeys: [],
          selectedRows: [],
          hnameSpace: engine.namespace
        }
      } else if (wtype === 'print') {
        const param = { itemNo, implclass, hData: record }
        let datas = yield call(commonService.common, param)
        if (datas) {
          newPayload = { ...newPayload, printData: datas.data.dataList }
        }
      } else if (wtype === 'linkPage') {
        yield put({ type: 'common/query', payload: { itemNo, namespace, condition } })
      }
      yield put({ type: `${namespace}/packet`, payload: newPayload })
    }
  }
}
