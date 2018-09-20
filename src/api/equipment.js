import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/vehicleEquipment/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/vehicleEquipment',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/vehicleEquipment',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutVehicleEquipment',
    method: 'put',
    params
  })
}
