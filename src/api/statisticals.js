import request from '@/utils/request'

export function statisticalAcidentTotalByDate(params) {
  return request({
    url: '/admin/acident/getAcidentTotalByDate',
    method: 'get',
    params
  })
}

export function statisticalAcidentDriverByDate(params) {
  return request({
    url: '/admin/acident/pageQueryByDriver',
    method: 'get',
    params
  })
}

export function statisticalAcidentVehicleByDate(params) {
  return request({
    url: '/admin/acident/pageQueryByVehicle',
    method: 'get',
    params
  })
}

export function statisticalOilsVehicleByDate(params) {
  return request({
    url: '/admin/oilRecord/byVehicleStatistics',
    method: 'get',
    params
  })
}

export function statisticalOilsDriverByDate(params) {
  return request({
    url: '/admin/oilRecord/ByUserStatistics',
    method: 'get',
    params
  })
}

export function statisticalPeccancyByType(params) {
  return request({
    url: '/admin/peccancy/statisticsByType',
    method: 'get',
    params
  })
}

export function statisticalPeccancyByDriver(params) {
  return request({
    url: '/admin/peccancy/peccancyStatisticsAll',
    method: 'get',
    params
  })
}

export function statisticalPeccancyByDriverDetail(params) {
  return request({
    url: '/admin/peccancy/peccancyStatisticsDetail',
    method: 'get',
    params
  })
}
