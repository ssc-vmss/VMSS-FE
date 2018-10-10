import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/repair/pageQuery',
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
