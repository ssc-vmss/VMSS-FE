import request from '@/utils/request'

export function getWarningList(params) {
  return request({
    url: '/gis/warn/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/gis/warn/pageQuery',
    method: 'get',
    params
  })
}

export function getById(params) {
  return request({
    url: `/gis/warn/${params}`,
    method: 'get',
    params
  })
}

export function getStatistics(params) {
  return request({
    url: '/gis/warn/speedStatistics',
    method: 'get',
    params
  })
}

export function getDetailAll(params) {
  return request({
    url: '/gis/warn/speedDetailAll',
    method: 'get',
    params
  })
}

export function getVehicleStatistics(params) {
  return request({
    url: '/gis/warn/byVehicleStatistics',
    method: 'get',
    params
  })
}
export function getVehicleDetailAll(params) {
  return request({
    url: '/gis/warn/byVehicleDetailAll',
    method: 'get',
    params
  })
}