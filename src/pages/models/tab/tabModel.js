import React from 'react'
import Engine from '../../components/engine/Engine'
import * as commonService from '../../service/commonService'
import Home from '../../components/base/Home'
import routerConfigData from '../../routes/routerConfig/routerConfigData'
import { ergodicRoot, judgeModel } from '../../../utils/utils'
import { hideContextMenu } from '../../../utils/contextMenuFunc'
const home = {
  title: 'Home',
  icon: 'home',
  content: <Home />,
  key: 'Home',
  closable: false
}

export default {
  namespace: 'tab',
  state: {
    panes: [home],
    clickedPanes: [],
    activeKey: 'Home'
  },

  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    addTab(state, { payload }) {
      const { data } = payload
      const { namespace, name, icon } = data
      const { panes, clickedPanes } = state
      const clickIndex = clickedPanes.findIndex(item => item.key === namespace)
      const index = panes.findIndex(item => item.key === namespace)
      if (clickIndex === -1) {
        const Cmp = Engine(data)
        const pane = { title: name, icon, content: <Cmp />, key: namespace, closable: true }
        panes.push(pane)
        clickedPanes.push(pane)
      } else {
        if (index === -1) {
          panes.push(clickedPanes[clickIndex])
        } else {
          return { ...state, activeKey: namespace }
        }
      }
      return { ...state, activeKey: namespace, panes, clickedPanes }
    },
    addRouterTab(state, { payload }) {
      const { NAME, ICON, NO } = payload
      const { panes } = state
      const isExists = panes.some(item => item.key === NO)
      if (!isExists) {
        // let routerDatas = routerConfig() //获取RouterConfigData
        let routerData = routerConfigData.find(data => data.namespace === NO)
        if (!routerData) return
        const { component } = routerData
        const Cmp = component
        panes.push({ title: NAME, icon: ICON, content: <Cmp />, key: NO, closable: true })
      }
      return { ...state, activeKey: NO, panes }
    },
    addReportTab(state, { payload }) {
      const { NAME, ICON, NO, PARAMS } = payload
      const { reportId, url, isBddp } = PARAMS
      const { panes } = state
      const isExists = panes.some(item => item.key === NO)
      if (!isExists) {
        const Cmp = () => (
          <iframe
            width='100%'
            height='100%'
            title={NO}
            src={url || `http://127.0.0.1:18080/RDP-SERVER/${isBddp ? 'bddpshow/show' : 'rdppage/main'}/${reportId}`}
          />
        )
        panes.push({ title: NAME, icon: ICON, content: <Cmp />, key: NO, closable: true })
      }
      return { ...state, activeKey: NO, panes }
    },
    changeTab(state, { payload }) {
      return { ...state, activeKey: payload.activeKey }
    },
    closeTab(state, { payload }) {
      hideContextMenu()
      let { type, tabKey } = payload
      let { panes } = state
      const index = panes.findIndex(item => item.key === tabKey)
      switch (type) {
        case 1:
          if (index !== 0) {
            tabKey = (panes[index + 1] || panes[index - 1]).key
            panes.splice(index, 1)
          }
          break
        case 2:
          panes = index !== 0 ? [home, panes[index]] : [home]
          break
        default:
          panes = [home]
          tabKey = 'Home'
      }
      return { ...state, panes, activeKey: tabKey }
    }
  },
  //异步
  effects: {
    *queryMeta({ payload }, { put, select }) {
      const { item } = payload
      const { selectedRows = [] } = yield select(state => state.menu)
      const isExists = selectedRows.some(row => row.ID === item.ID)
      if (!isExists) selectedRows.push(item)
      yield put({ type: 'menu/packet', payload: { selectedKeys: [item.ID], selectedRows } })
      let { PARAMS, ID, FACETYPE, NAME, ICON, NO, SUPQUERY } = item
      if (PARAMS) {
        PARAMS = JSON.parse(PARAMS)
      }
      // 有facetype为配置界面
      if (FACETYPE === 6) {
        yield put({ type: 'addReportTab', payload: { NAME, ICON, NO, ID, PARAMS } })
      } else if (FACETYPE && PARAMS) {
        //查询页面数据
        yield put({ type: 'query', payload: { PARAMS, ID, FACETYPE, NAME, ICON, SUPQUERY } })
      } else {
        //调用前端定制界面
        yield put({ type: 'queryCustomize', payload: { NAME, ICON, NO, ID } })
      }
    },
    *queryCustomize({ payload }, { put }) {
      const { NO } = payload
      yield put({ type: 'addRouterTab', payload })
      yield put({ type: `${NO}/query`, payload: {} })
    },
    *query({ payload }, { call, put }) {
      const { PARAMS: params, ID: id, FACETYPE: facetype, NAME: name, ICON: icon, SUPQUERY: supQuery } = payload
      const { itemNo, classNodeItemNo, condition, itemGridNo, sortFields } = params
      const namespace = (facetype === 4 ? classNodeItemNo : itemNo) + '_' + id
      let data = { namespace, menuId: id, facetype, name, icon, params, supQuery }
      if (!judgeModel(namespace)) {
        // judgeModel(namespace)返回false，第一次点击，请求建模
        // 1. 查询建模
        let { data: modelData } = yield call(
          commonService.post,
          `/sysModelToWbeClient/${
            facetype === 4 ? 'getClassNodeModelData' : facetype === 5 ? 'getClassViewModelData' : 'getModelData'
          }`,
          { ...params, pageId: id, facetype }
        )
        if (modelData) {
          data = { ...modelData, ...data }
          if (facetype === 5) {
            yield put({
              type: `${namespace}/packet`,
              payload: {
                params,
                treeData: ergodicRoot(data.classViewNodeList, '0', 'treenodepid', 'treenodeid'),
                dataList: []
              }
            })
          }
        }
      }
      // 2. 生成对应组件
      yield put({ type: 'addTab', payload: { data } })
      // 3. 查询业务数据
      yield put({ type: `${namespace}/packet`, payload: { selectedRowKeys: [], selectedRows: [], showTab: false } })
      if (facetype === 4) {
        yield put({ type: 'common/queryClassNode', payload: { params, namespace } })
        const classNamespace = itemNo + '_' + id
        yield put({
          type: `${classNamespace}/packet`,
          payload: { showTab: false, selectedRowKeys: [], selectedRows: [], dataList: [] }
        })
      } else if (facetype !== 5) {
        // 自动分类视图再次点击不请求数据
        yield put({
          type: 'common/query',
          payload: { itemNo, namespace, itemGridNo, condition, sortFields }
        })
      }
    }
  }
}
