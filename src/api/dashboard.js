import request from '@/utils/request'

export function getAllCount(params) {
  return request({
    url: '/admin/statistics/getAllCount',
    method: 'get',
    params
  })
}
