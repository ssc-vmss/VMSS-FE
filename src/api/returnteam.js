import request from '@/utils/request'

export function getInfoList(params) {
  return request({
    url: '/admin/returnTeam/pageQuery',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/admin/returnTeamAll',
    method: 'post',
    data
  })
}

export function delInfo(params) {
  return request({
    url: '/admin/returnTeam/deleteReturnTeam',
    method: 'put',
    params
  })
}
