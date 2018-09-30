import request from '@/utils/request'

export function getThresholdList(params) {
  return request({
    url: '/gis/threshold/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/gis/threshold/pageQuery',
    method: 'get',
    params
  })
}

export function addThreshold(data) {
  return request({
    url: '/gis/threshold/add',
    method: 'post',
    data
  })
}

export function editThreshold(data) {
  return request({
    url: '/gis/threshold/update',
    method: 'put',
    data
  })
}

export function delThreshold(params) {
  return request({
    url: `/gis/threshold/${params}`,
    method: 'delete',
    params
  })
}
