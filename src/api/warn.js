import request from '@/utils/request'

export function getWarningList(params) {
  return request({
    url: '/gis/warn/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/gis/warn/pageQuery',
    method: 'get',
    params
  })
}

export function getById(params) {
  return request({
    url: `/gis/warn/${params}`,
    method: 'get',
    params
  })
}
