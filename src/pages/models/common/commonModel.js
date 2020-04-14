import * as commonService from '../../service/commonService'
import { message } from 'antd'
import { compareUpdate, ergodicRoot } from '../../../utils/utils'

/**
 * 通用model
 * 用于公共相似业务
 */
export default {
  namespace: 'common',
  state: {},
  //异步
  effects: {
    // 查询单对象数据
    *query({ payload }, { call, put }) {
      const { itemNo, namespace, itemGridNo, condition, page = 1, dataList = [], sortFields } = payload
      let { data } = yield call(commonService.common, {
        itemNo,
        itemGridNo,
        condition,
        page,
        sortFields,
        implclass: 'com.usc.app.query.QuerySingleItemData'
      })
      if (data) {
        if (data.flag) {
          yield put({
            type: `${namespace}/packet`, //调用各个组件model的同步packet方法
            payload: { dataList: dataList.concat(data.dataList), condition, page }
          })
        }
      }
    },

    // 查询关联页数据
    *querySubpage({ payload }, { call, put }) {
      const {
        item: { relevanceNo, itemNo, itemA, rType, modelClassView },
        pRecord,
        namespace,
        condition,
        page = 1,
        dataList = [],
        sortFields
      } = payload
      let pl = { page, itemAData: pRecord, itemNo, itemA }
      if (rType === 'relationpage') {
        pl = {
          ...pl,
          relationShipNo: relevanceNo,
          implclass: 'com.usc.app.query.QueryItemRelationPageData',
          condition,
          sortFields
        }
      } else if (rType === 'relationqueryview') {
        pl = { ...pl, queryViewNo: relevanceNo, implclass: 'com.usc.app.query.QueryItemRelationQueryViewData' }
      } else if (rType === 'changeHistory') {
        pl = { hData: [pRecord], itemNo, page, implclass: 'com.usc.app.sys.log.QueryChangeHistoryData' }
      } else if (rType === 'relationclassview') {
        pl = {
          ...pl,
          classViewNodeData: modelClassView.rootNode,
          viewNo: relevanceNo,
          implclass: 'com.usc.app.view.RealtionClassViewGetNodeData'
        }
      } else if (rType === 'input' || rType === 'output') {
        pl = {
          ...pl,
          itemNo: rType === 'input' ? 'TASKINPUT' : 'TASKOUTPUT',
          implclass: 'com.usc.app.action.task.query.GetTaskInOrOutputData'
        }
      }
      if (pl.implclass) {
        let { data } = yield call(commonService.common, pl)
        yield put({
          type: `${namespace}/packet`, //调用各个组件model的同步packet方法
          payload: { dataList: dataList.concat(data.dataList), pRecord, page }
        })
      }
    },

    // 查询权限页面数据
    *queryAuthority({ payload }, { call, put }) {
      const { item, pRecord, namespace } = payload
      let pl = {
        itemNo: item.itemNo,
        hData: [pRecord],
        implclass: 'com.usc.app.query.QueryFunctionalPermissionsData'
      }
      let { data } = yield call(commonService.common, pl)
      yield put({
        type: `${namespace}/packet`,
        payload: { dataList: data.dataList, pRecord, itemNo: item.itemNo }
      })
    },
    // 查询分类节点对应的数据
    *queryClassNodeData({ payload }, { call, put }) {
      const { classItemNo, itemNo, pRecord, namespace, classNodeItemNo, page = 1, dataList = [] } = payload
      let pl = {
        classItemNo,
        itemNo,
        classNodeItemNo,
        classNodeData: pRecord,
        page,
        implclass: 'com.usc.app.query.QueryClassObjectData'
      }
      let { data } = yield call(commonService.common, pl)
      yield put({
        type: `${namespace}/packet`, //调用各个组件model的同步packet方法
        payload: { dataList: dataList.concat(data.dataList), pRecord, page }
      })
    },
    // 查询分类节点树
    *queryClassNode({ payload }, { call, put }) {
      const {
        namespace,
        params: { classNodeItemNo, itemNo }
      } = payload
      let pl = {
        classNodeItemNo,
        itemNo,
        implclass: 'com.usc.app.query.QueryClassNodeData'
      }
      let { data } = yield call(commonService.common, pl)
      yield put({
        type: `${namespace}/packet`,
        payload: { dataList: data.dataList, ...payload }
      })
    },
    // 查询自动分类节点对应的数据
    *queryAutoClassData({ payload }, { call, put }) {
      const { namespace, classViewNodeData, itemNo, viewNo, page = 1, dataList = [], itemA, itemAData } = payload
      let pl = {
        classViewNodeData,
        itemNo,
        viewNo,
        itemA,
        itemAData,
        page,
        implclass: itemA ? 'com.usc.app.view.RealtionClassViewGetNodeData' : 'com.usc.app.view.ClassViewGetNodeData'
      }
      // 有itemA时是请求关联分类视图
      let { data } = yield call(commonService.common, pl)
      yield put({
        type: `${namespace}/packet`,
        payload: { dataList: dataList.concat(data.dataList), page, selectedTreeNode: classViewNodeData }
      })
    },

    // 保存（配置页面通用请求）
    *save({ payload, callback }, { call, put, select }) {
      let { values, namespace } = payload
      const { data, hData, file } = values
      let isUpdate = true
      if (data && hData && !file) {
        isUpdate = compareUpdate(data, hData)
      }
      if (isUpdate) {
        let data = yield call(commonService.common, values)
        // let data
        //刷新页面
        if (data && data.data) {
          data = data.data
          // 操作成功，执行回调函数关闭弹窗
          if (callback && typeof callback === 'function') {
            callback(data.flag, data)
          }
          if (data.flag) {
            message.info(data.info)
            let { selectedRowKeys, selectedRows, dataList = [] } = yield select(state => state[namespace])
            let newData = JSON.parse(JSON.stringify(dataList))
            switch (data.sign) {
              case 'N':
                // 新增
                newData = data.dataList.concat(newData)
                // if (selectedRowKeys && selectedRowKeys[0])
                //   selectedRowKeys[0] = selectedRowKeys[0] + data.dataList.length
                break
              case 'M':
                // 修改
                hData.forEach((item, index) => {
                  newData[item.index] = data.dataList[index]
                })
                selectedRows = data.dataList
                break
              case 'D':
                // 删除
                newData.splice(hData[0].index, hData.length)
                selectedRowKeys = []
                selectedRows = []
                break
              case 'A':
                // 添加
                newData = hData.concat(newData)
                // if (selectedRowKeys && selectedRowKeys[0]) selectedRowKeys[0] = selectedRowKeys[0] + hData.length
                break
              case 'NDW':
                // 不做数据更新
                break
              default:
                yield put({ type: `${namespace}/packet`, payload: { dataList: data.dataList, showTab: false } })
                return
            }
            yield put({
              type: `${namespace}/packet`,
              payload: { dataList: newData, selectedRowKeys, selectedRows, showTab: false }
            })
          }
        } else {
          if (callback && typeof callback === 'function') {
            callback(false)
          }
        }
      } else {
        message.info('没有改变数据')
        if (callback && typeof callback === 'function') {
          callback(true)
        }
      }
    },

    // 滚动加载 查询数据
    *loadMore({ payload }, { call, put }) {
      let { engine, page, dataList } = payload
      console.log(engine)
      if (engine.isClassPage) {
        // 分类业务对象
        const { params, namespace, pRecord } = engine
        const { itemNo, classItemNo, classNodeItemNo } = params
        yield put({
          type: 'queryClassNodeData',
          payload: { namespace, itemNo, classItemNo, classNodeItemNo, pRecord, page, dataList }
        })
      } else if (engine.isModal) {
        // 查询视图
        const { engine } = payload
        const { itemB, rData, namespace } = engine
        const params = {
          itemNo: itemB,
          rData,
          page,
          implclass: 'com.usc.app.query.QueryAddRelationObjectData'
        }
        let { data } = yield call(commonService.common, params)
        if (data) {
          yield put({
            type: `${namespace}/packet`,
            payload: { dataList: dataList.concat(data.dataList), page }
          })
        }
      } else if (engine.rType === 'relationpage') {
        // 关联页
        const { pRecord, namespace, relevanceNo, itemNo, itemA, rType, condition } = engine
        yield put({
          type: 'querySubpage',
          payload: {
            pRecord,
            namespace,
            item: {
              relevanceNo,
              itemA,
              rType,
              itemNo
            },
            condition,
            page,
            dataList
          }
        })
      } else {
        // 单对象
        const { itemNo, namespace, condition } = engine
        yield put({
          type: 'query',
          payload: { itemNo, namespace, condition, page, dataList }
        })
      }
    },

    // 拖拽行排序
    *moveRow({ payload }, { call, put }) {
      const { list, newList, listName, tableName, isTree, namespace = 'tableConfig' } = payload
      let { data } = yield call(
        commonService.post,
        isTree ? '/ModelItemRelationInfo/moveMenu' : '/ModelItemRelationInfo/moveUpOrDown',
        {
          hData: newList,
          tableName
        }
      )
      if (data) {
        message.info(data.info)
        if (data.flag) {
          const payload = {}
          payload[listName] = list
          yield put({ type: `${namespace}/packet`, payload })
        }
      }
    },

    // 搜索查询
    *search({ payload }, { call, put }) {
      const { engine, model, page, queryWord, dataList = [] } = payload
      const { namespace, itemNo, params = {}, itemA, relevanceNo, rData } = engine
      const { pRecord, selectedTreeNode } = model
      let values = { itemNo, queryWord, condition: params.condition, page }
      if (engine.hasOwnProperty('pageMenus') && engine.facetype !== 5) {
        // 单对象
        values.implclass = 'com.usc.app.query.search.SearchSingleObjectAction'
      } else if (engine.isModal) {
        // 查询视图
        values = {
          ...values,
          rData,
          implclass: 'com.usc.app.query.search.SearchAddRelationObiAction'
        }
      } else if (engine.facetype === 5 && !engine.modelClassView) {
        // 自动分类视图页面
        if (selectedTreeNode) {
          values = {
            ...values,
            classViewNodeData: selectedTreeNode,
            viewNo: params.viewNo,
            implclass: 'com.usc.app.view.search.SearchClassViewNodeObjectAction'
          }
        } else {
          message.warn('请选择父对象数据！')
          return
        }
      } else {
        if (pRecord && pRecord.id) {
          if (engine.modelRelationShip) {
            // 关联页
            values = {
              ...values,
              itemA,
              relationShipNo: relevanceNo,
              itemAData: model.pRecord,
              implclass: 'com.usc.app.query.search.SearchRelationPageAction'
            }
          } else if (engine.modelQueryView) {
            // 关联视图
            values = {
              ...values,
              itemA,
              queryViewNo: relevanceNo,
              itemAData: model.pRecord,
              implclass: 'com.usc.app.query.search.SearchRelationQueryViewAction'
            }
          } else if (engine.modelClassView) {
            // 自动分类视图关联页
            values = {
              ...values,
              itemA,
              classViewNodeData: selectedTreeNode,
              viewNo: relevanceNo,
              itemAData: model.pRecord,
              implclass: 'com.usc.app.view.search.SearchRelationClassViewNodeObjectAction'
            }
          } else {
            // 分类对象
            const { classItemNo, classNodeItemNo } = params
            values = {
              ...values,
              classItemNo,
              classNodeItemNo,
              classNodeData: model.pRecord,
              implclass: 'com.usc.app.query.search.SearchClassObjectAction'
            }
          }
        } else {
          message.warn('请选择父对象数据！')
          return
        }
      }
      let { data } = yield call(commonService.common, values)
      yield put({
        type: `${namespace}/packet`,
        payload: { dataList: dataList.concat(data.dataList), queryWord, page }
      })
    },
    // 高级搜索查询
    *advancedSearch({ payload }, { call, put }) {
      const { engine, page, dataList = [], queryWord } = payload
      const {
        namespace,
        itemNo,
        params: { condition }
      } = engine
      let params = {
        itemNo,
        condition,
        page,
        queryWord,
        implclass: 'com.usc.app.query.search.AdvancedSearchObjAction'
      }
      let { data } = yield call(commonService.common, params)
      if (data) {
        yield put({
          type: `${namespace}/packet`,
          payload: { dataList: dataList.concat(data.dataList), page, showTab: false }
        })
      }
    },
    // 查询分类视图树节点
    *queryClassViewNode({ payload }, { call, put }) {
      const { pNameSpace, item, record, facetype, namespace } = payload
      const { itemNo, itemA, relevanceNo } = item
      let pl = {
        itemNo,
        viewNo: relevanceNo,
        itemA,
        itemAData: record,
        implclass: 'com.usc.app.view.GetRelationClassViewTreeNodeData'
      }
      let { data } = yield call(commonService.common, pl)
      item.modelClassView.classViewNodeList = data.dataList
      if (pNameSpace) {
        yield put({
          type: `${pNameSpace}/addTab`,
          payload: { data: item, pRecord: record, facetype }
        })
        yield put({
          type: `${namespace}/packet`,
          payload: {
            treeData: ergodicRoot(data.dataList, '0', 'treenodepid', 'treenodeid'),
            pRecord: record,
            list: data.dataList
          }
        })
      }
    },
    // 下载
    *downLoad({ payload }, { call }) {
      let { data } = yield call(commonService.upload, payload.values)
      if (data) {
        message.info(data.info)
      }
    }
  }
}
