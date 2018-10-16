import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/user/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/user',
    method: 'post',
    data
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/user',
    method: 'put',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/logoutUser',
    method: 'put',
    params
  })
}
