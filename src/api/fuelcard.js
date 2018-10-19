import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/fuelCard/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/fuelCard',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/fuelCard',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutFuelCard',
    method: 'put',
    params
  })
}
