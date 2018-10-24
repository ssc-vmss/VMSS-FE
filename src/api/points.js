import request from '@/utils/request'

export function getNewPointList(params) {
  return request({
    url: '/gis/points/findNewList',
    method: 'get',
    params
  })
}

export function getPointList(params) {
  return request({
    url: '/gis/points/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/gis/points/pageQuery',
    method: 'get',
    params
  })
}

export function getById(params) {
  return request({
    url: `/gis/points/${params}`,
    method: 'get',
    params
  })
}
export function getMileage(params) {
  return request({
    url: '/gis/points/mileage',
    method: 'get',
    params
  })
}
export function getMileageDetailAll(params) {
  return request({
    url: '/gis/points/mileageDetailAll',
    method: 'get',
    params
  })
}
