import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/returnTeam/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(params) {
  return request({
    url: '/admin/returnTeamAll',
    method: 'post',
    params
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/returnTeam/deleteReturnTeam',
    method: 'put',
    params
  })
}
