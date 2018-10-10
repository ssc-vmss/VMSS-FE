import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/peccancy/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/peccancy',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/peccancy',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutPeccancy',
    method: 'put',
    params
  })
}
