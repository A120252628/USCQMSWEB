import * as commonService from '../../service/commonService'
import { message } from 'antd'

const tableName = 'usc_model_mq_lines'
export default {
  namespace: 'msgLines',
  state: {
    visible: false,
    list: [],
    selectedRows: [],
    selectedRowKeys: []
  },
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *query({ payload = {} }, { call, put }) {
      const { sql } = payload
      let { data } = yield call(commonService.get, '/sysModelItem/packet', { tableName, condition: sql })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, showTab: false, selectedRowKeys: [], selectedRows: [] }
        })
      }
    },
    *addOrEdit(
      {
        payload: { values, oldValues }
      },
      { call, put }
    ) {
      let data = {}
      if (values.ID) {
        let upValues = { tableName, data: oldValues, uData: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/update', upValues)
      } else {
        let res = { tableName, data: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/createData', res)
      }
      if (data.data) {
        message.success(data.data.info)
        yield put({ type: 'packet', payload: { visible: false } })
        yield put({ type: 'query' })
      }
    },
    *del(
      {
        payload: { record }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/deleteMenu', { tableName, data: record })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query' })
      }
    },
    *synchro({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/modelSynchronous/single', {
        data: payload.selectedRow,
        tableName
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query' })
      }
    }
  }
}
