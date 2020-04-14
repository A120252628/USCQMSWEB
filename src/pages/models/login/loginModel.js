// 登陆model
import router from 'umi/router'
import * as commonService from '../../service/commonService'
import { message } from 'antd'

export default {
  namespace: 'login',
  state: {},
  //同步
  reducers: {},
  //异步
  effects: {
    *login(
      {
        payload: { values },
        callback
      },
      { call, put }
    ) {
      let data = yield call(commonService.Login, values)
      if (data && data.data) {
        data = data.data
        if (data.force) {
          if (callback && typeof callback === 'function') {
            callback(data)
          }
        } else {
          const { info, clientID, userId, userName, employeeName, dataList, AcceptLanguage } = data
          message.info(info)
          sessionStorage.setItem('clientID', clientID)
          sessionStorage.setItem('isAuthenticated', true)
          localStorage.setItem('userName', userName)
          localStorage.setItem('userId', userId)
          localStorage.setItem('employeeName', employeeName)
          localStorage.setItem('menuData', JSON.stringify(dataList))
          localStorage.setItem('AcceptLanguage', AcceptLanguage)
          if (localStorage.getItem('modelUser') !== localStorage.getItem('userName')) {
            localStorage.removeItem('isModeling')
            yield put({ type: 'user/packet', payload: { isModeling: false } })
          }
          router.push('/')
        }
      } else {
        callback()
        router.push('/login')
      }
    },
    *logout({}, { call }) {
      sessionStorage.clear()
      const userName = localStorage.getItem('userName')
      const { data } = yield call(commonService.Logout, { userName })
      if (data.flag) {
        sessionStorage.clear()
        window.location.pathname = '/login'
      } else {
        message.error(data.info)
      }
    }
  }
}
