import request from '@/utils/request'

export function getAreaList(params) {
  return request({
    url: '/gis/area/findList',
    method: 'get',
    params
  })
}

export function addArea(data) {
  return request({
    url: '/gis/area/add',
    method: 'post',
    data
  })
}

export function editArea(data) {
  return request({
    url: '/gis/area/update',
    method: 'put',
    data
  })
}

export function delArea(params) {
  return request({
    url: `/gis/area/${params}`,
    method: 'delete',
    params
  })
}
