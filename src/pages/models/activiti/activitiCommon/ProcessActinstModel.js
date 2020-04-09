import * as commonService from '../../../service/commonService'
import { message } from 'antd'
import { ergodicRoot, generatorTableKey } from '../../../../utils/utils'

/**
 * @author lwp
 * 数据集详情
 */

export default {
  namespace: 'processActinst',
  state: {
    visible: false,
    userVisible: false
  },
  reducers: {
    show(
      state,
      {
        payload: { title, isShowButtons, taskId, processInstanceId }
      }
    ) {
      state.visible = !state.visible
      return { ...state, title, isShowButtons, taskId, processInstanceId }
    },
    showUser(
      state,
      {
        payload: { userList, userTreeList, expandedRowKeys }
      }
    ) {
      state.userVisible = !state.userVisible
      return { ...state, userList, userTreeList, expandedRowKeys }
    },
    onCancel(state) {
      let visible = !state.visible
      return { ...state, visible }
    },
    toogleUser(state) {
      let userVisible = !state.userVisible
      return { ...state, userVisible }
    },
    onExpandedRowsChange(state, { payload: expandedRowKeys }) {
      return { ...state, expandedRowKeys }
    },
    onSelectChange(
      state,
      {
        payload: { selectedRowKey, selectedRows }
      }
    ) {
      return { ...state, selectedRowKey, selectedRows }
    },
    processReverseList(
      state,
      {
        payload: { engine, list, processReverseList }
      }
    ) {
      return { ...state, engine, list, processReverseList }
    }
  },
  effects: {
    *getActinst(
      {
        payload: { taskId, processInstanceId, title, isShowButtons }
      },
      { call, put }
    ) {
      yield put({
        type: 'show',
        payload: { title, isShowButtons, taskId, processInstanceId }
      })
      //获取申请对象模型数据以及申请数据
      let allList = yield call(commonService.post, '/act/process/getProcessSubList', {
        processInstanceId: processInstanceId
      })
      //获取流程流转信息
      let { data } = yield call(commonService.post, '/act/process/getProcessReverseList', {
        processInstanceId: processInstanceId
      })
      yield put({
        type: 'processReverseList',
        payload: {
          engine: allList.data.dataList[0].resultModel,
          list: allList.data.dataList[0].resultItemList,
          processReverseList: data.dataList
        }
      })
    },
    *showUsers({}, { call, put }) {
      let { data } = yield call(commonService.common, {
        itemno: 'SUSER',
        implclass: 'com.usc.app.action.editor.SelectUserEditor'
      })
      if (data.flag) {
        const userTreeList = ergodicRoot(generatorTableKey(data.dataList))
        const expandedRowKeys = []
        const getTreeUserListKeys = list => {
          list.forEach(i => {
            expandedRowKeys.push(i.key)
            if (i.children && i.children.length) {
              getTreeUserListKeys(i.children)
            }
          })
        }
        getTreeUserListKeys(userTreeList)
        yield put({
          type: 'showUser',
          payload: { userList: data.dataList, userTreeList, expandedRowKeys }
        })
      } else {
        message.error(data.msg)
      }
    },
    *taskTransfer(
      {
        payload: { taskId, name }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, `/act/task/taskTransfer/${taskId}`, {
        name: name
      })
      if (data.flag) {
        message.success(data.msg)
        yield put({
          type: 'toogleUser'
        })
        yield put({
          type: 'onCancel'
        })
      } else {
        message.error(data.msg)
      }
    }
  },
  subscriptions: {}
}
