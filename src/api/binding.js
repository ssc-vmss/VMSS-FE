import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/vehicleMapperEquipmen/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/vehicleMapperEquipment',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/vehicleMapperEquipment',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutVehicleMapperEquipmen',
    method: 'put',
    params
  })
}

export function getVehicleList(params) {
  return request({
    url: '/admin/vehicle/pageQuery',
    method: 'get',
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

