import * as commonService from '../../service/commonService'
import { message } from 'antd'

const tableName = 'usc_model_mq_listener'
export default {
  namespace: 'msgListener',
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
    *query(
      {
        payload: { PID }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName,
        condition: `itemid='${PID}'`
      })
      yield put({
        type: 'packet',
        payload: { list: data.dataList }
      })
    },
    *addOrEdit(
      {
        payload: { values, PID, record }
      },
      { call, put }
    ) {
      let data = {}
      let newValues = { tableName }
      if (!record.ID) {
        newValues = { ...newValues, PID, fk: 'itemid', data: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/createData', newValues)
      } else {
        newValues.data = record
        newValues.uData = values
        data = yield call(commonService.post, '/ModelItemRelationInfo/update', newValues)
      }
      if (data.data) {
        message.success(data.data.info)
        if (PID) {
          yield put({ type: `packet`, payload: { visible: false } })
        }
        yield put({ type: 'query', payload: { PID } })
      }
    },
    *del(
      {
        payload: { ID, STATE, PID }
      },
      { call, put }
    ) {
      const userName = localStorage.getItem('userName')
      const dataList = { ID, duser: userName }
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/deleteMenu', {
        tableName,
        data: dataList,
        state: STATE
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query', payload: { PID } })
        yield put({
          type: `packet`,
          payload: { selectedRows2: [], selectedRowKey2: [] }
        })
      }
    }
  }
}
