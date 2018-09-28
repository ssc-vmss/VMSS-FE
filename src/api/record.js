import request from '@/utils/request'

export function getRecordList(params) {
  return request({
    url: '/gis/record/findList',
    method: 'get',
    params
  })
}
