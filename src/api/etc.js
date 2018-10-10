import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/etcCard/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/etcCard',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/etcCard',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutEtcCard',
    method: 'put',
    params
  })
}
