import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/acident/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/acident',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/acident',
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
