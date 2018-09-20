import request from '@/utils/request'

export function getApplyList(params) {
  return request({
    url: '/admin/vehicleApplication/pageQuery',
    method: 'get',
    params
  })
}

export function getDispatchList(params) {
  return request({
    url: '/admin/dispatch/pageQuery',
    method: 'get',
    params
  })
}

export function VehicleDataFilter(params) {
  return request({
    url: '/admin/vehicle/pageQuery',
    method: 'get',
    params
  })
}

export function DriverDataFilter(params) {
  return request({
    url: '/admin/driver/pageQuery',
    method: 'get',
    params
  })
}

export function addDispatch(data) {
  return request({
    url: '/admin/dispatch',
    method: 'post',
    data
  })
}

export function editDispatch(data) {
  return request({
    url: '/admin/dispatch',
    method: 'put',
    data
  })
}

export function delDispatch(params) {
  return request({
    url: '/admin/logoutDispatch',
    method: 'put',
    params
  })
}

export function invalidDispatch(params) {
  return request({
    url: '/admin/logoutDispatch',
    method: 'put',
    params
  })
}
