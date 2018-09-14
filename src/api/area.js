import request from '@/utils/request'

export function getAreaList(params) {
  return request({
    url: '/area/findList',
    method: 'get',
    params
  })
}

export function addArea(data) {
  return request({
    url: '/area/add',
    method: 'post',
    data
  })
}

export function editArea(data) {
  return request({
    url: '/area/update',
    method: 'put',
    data
  })
}

export function delArea(params) {
  return request({
    url: `/area/${params}`,
    method: 'delete',
    params
  })
}
