import request from '@/utils/request'

export function getFilterRuleList(params) {
  return request({
    url: '/admin/filterRule/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/filterRule',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/filterRule',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/filterRule/deleteFilterRule',
    method: 'put',
    params
  })
}
