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

export function addInfo(data) {
  return request({
    url: '/admin/repair',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/repair',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutRepair',
    method: 'put',
    params
  })
}
