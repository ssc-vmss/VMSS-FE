import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/gis/guard/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/gis/guard/pageQuery',
    method: 'get',
    params
  })
}

export function addGuard(data) {
  return request({
    url: '/gis/guard/add',
    method: 'post',
    data
  })
}

export function editGuard(data) {
  return request({
    url: '/gis/guard/update',
    method: 'put',
    data
  })
}

export function delGuard(params) {
  return request({
    url: `/gis/guard/${params}`,
    method: 'delete',
    params
  })
}
