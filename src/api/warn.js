import request from '@/utils/request'

export function getWarningList(params) {
  return request({
    url: '/warn/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/warn/pageQuery',
    method: 'get',
    params
  })
}

export function getById(params) {
  return request({
    url: `/warn/${params}`,
    method: 'get',
    params
  })
}
