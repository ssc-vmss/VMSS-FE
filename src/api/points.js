import request from '@/utils/request'

export function getNewPointList(params) {
  return request({
    url: '/points/findNewList',
    method: 'get',
    params
  })
}

export function getPointList(params) {
  return request({
    url: '/points/findList',
    method: 'get',
    params
  })
}

export function getPageQuery(params) {
  return request({
    url: '/points/pageQuery',
    method: 'get',
    params
  })
}

export function getById(params) {
  return request({
    url: `/points/${params}`,
    method: 'get',
    params
  })
}

export function addPoint(data) {
  return request({
    url: '/points/add',
    method: 'post',
    data
  })
}