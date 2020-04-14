import request from '../../utils/request'

/**
 * 通用GET请求
 * @param path-请求API路径
 * @param payload-请求参数
 * @returns {Object}
 */
export function get(path, payload = {}) {
  const userName = localStorage.getItem('userName')
  payload.userName = userName
  let pl = JSON.stringify(payload)
  pl = encodeURIComponent(pl)
  let queryParam = `?queryParam=${pl}`
  return request('api' + path + queryParam)
}

/**
 * 通用POST请求
 * @param path-请求API路径
 * @param payload-请求参数
 * @returns {Object}
 */
export function post(path, payload = {}) {
  const userName = localStorage.getItem('userName')
  if (typeof payload === 'object') payload.userName = userName
  return request('api' + path, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * 通用请求
 * @param path-请求API路径
 * @param payload-请求参数
 * @returns {Object}
 */
export function common(payload = {}) {
  const userName = localStorage.getItem('userName')
  const formData = new FormData()
  const { file } = payload
  if (file && file instanceof File) {
    formData.append('file', file)
    delete payload.file
  }
  payload.userName = userName
  formData.append('values', JSON.stringify(payload))
  return request('api/dcm/access', {
    method: 'POST',
    body: formData
  })
}

/**
 * 查询
 * @param payload
 * @returns {Object}
 */
export function query(payload) {
  const userName = localStorage.getItem('userName')
  payload.userName = userName
  return request(`api/sysModelToWbeClient/getItemDataListLimit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
/**
 * 登录
 * @param payload
 * @returns {string}
 */
export function Login(values) {
  const queryParam = JSON.stringify(values)
  return request('/api/login', {
    method: 'POST',
    body: queryParam
  })
}
/**
 * 退出
 * @param payload
 * @returns {string}
 */
export function Logout(values) {
  const queryParam = JSON.stringify(values)
  return request('/api/logout', {
    method: 'POST',
    body: queryParam
  })
}

export function upload(values) {
  const userName = localStorage.getItem('userName')
  values.userName = userName
  const formData = new FormData()
  formData.append('values', JSON.stringify(values))
  return request('api/dcm/access', {
    method: 'POST',
    body: formData
  })
}
