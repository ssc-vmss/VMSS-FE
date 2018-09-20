import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/admin/queryUserAndDepartByUserName',
    method: 'get',
    params
  })
}

export function getInfoList(params) {
  return request({
    url: '/admin/driver/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/driver',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/driver',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/driver/logoutDriver',
    method: 'put',
    params
  })
}
