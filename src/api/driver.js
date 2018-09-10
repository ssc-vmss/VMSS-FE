import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/driver/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/driver/driver',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/driver/driver',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/driver/logoutDriver',
    method: 'put',
    params
  })
}
