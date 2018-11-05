import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/etcRecord/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/etcRecord',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/etcRecord',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/etcRecord/deleteEtcRecord',
    method: 'put',
    params
  })
}
