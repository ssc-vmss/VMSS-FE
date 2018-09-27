import request from '@/utils/request'

export function getRecordList(params) {
  return request({
    url: '/record/findList',
    method: 'get',
    params
  })
}
