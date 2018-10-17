import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/vehicle/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/vehicle',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/vehicle',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutVehicle',
    method: 'put',
    params
  })
}

export function openPickproof(params) {
  return request({
    url: '/admin/vehicle/openVehiclePickproof',
    method: 'put',
    params
  })
}

export function closePickproof(params) {
  return request({
    url: '/admin/vehicle/closeVehiclePickproof',
    method: 'put',
    params
  })
}

export function getEquipmentList(params) {
  return request({
    url: '/admin/vehicleEquipment/pageQuery',
    method: 'get',
    params
  })
}
