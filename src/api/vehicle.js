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
