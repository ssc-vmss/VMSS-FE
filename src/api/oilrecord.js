import request from '@/utils/request'

export function getOilRecord(params) {
  return request({
    url: '/admin/oilRecord/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/oilRecord',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/oilRecord',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/oilRecord/deleteOilRecord',
    method: 'put',
    params
  })
}
