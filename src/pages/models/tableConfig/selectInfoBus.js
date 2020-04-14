import * as commonService from '../../service/commonService'
import { message, notification } from 'antd'

const tableName = 'usc_model_mq_affair'
export default {
  namespace: 'selectInfoBus',
  state: {
    visible: false,
    record: null,
    list: [],
    selectedRowKey: [],
    menuVisible: false
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      console.log({ ...state, ...payload })
      return { ...state, ...payload }
    }
  },
  //异步
  effects: {
    *query(
      {
        payload: { TYPE, onSelect }
      },
      { call, put }
    ) {
      let params = { tableName, page: 1, pageSize: 200 }
      let { data } = yield call(commonService.get, '/sysModelItem/packet', params)
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, TYPE, onSelect, visible: true, selectedRowKey: [], selectedRows: [] }
        })
      }
    },
    *queryMqlines({}, { call, put }) {
      let params = { tableName: 'usc_model_mq_lines', page: 1, pageSize: 200 }
      let { data } = yield call(commonService.get, '/sysModelItem/packet', params)
      if (data) {
        yield put({
          type: 'packet',
          payload: { mqLinesList: data.dataList }
        })
      }
    },
    *addOrEdit(
      {
        payload: { values, record }
      },
      { call, put, select }
    ) {
      let data = {}
      let newValues = { tableName }
      if (!record.ID) {
        newValues.data = values
        data = yield call(commonService.post, '/ModelItemRelationInfo/createData', newValues)
      } else {
        newValues = { ...newValues, data: record, uData: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/update', newValues)
      }
      if (data.data.flag) {
        message.success(data.data.info)
        yield put({ type: 'packet', payload: { selectedRows: data.data.dataList, menuVisible: false } })
        const { TYPE, onSelect } = yield select(state => state.selectMenu)
        yield put({ type: 'query', payload: { TYPE, onSelect } })
      } else {
        message.error(data.data.info)
      }
    },
    *del(
      {
        payload: { record }
      },
      { call, put, select }
    ) {
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/deleteMenu', { tableName, data: record })
      if (data.flag) {
        message.success('操作成功!')
        const { TYPE, onSelect } = yield select(state => state.selectMenu)
        yield put({ type: 'query', payload: { TYPE, onSelect } })
      } else {
        notification.error({
          message: '操作失败!',
          duration: 0
        })
      }
    }
  }
}
