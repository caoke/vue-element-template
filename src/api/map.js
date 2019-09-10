import request from '@/utils/request'
import { filterParams } from '@/utils/util'

export function getMapList(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  const params = filterParams(data)
  return request({
    url: `/map/list/${currentPage}/${pageSize}`,
    method: 'get',
    params: params
  })
}

export function deleteMap(id) {
  return request({
    url: `/map/delete/${id}`,
    method: 'get'
  })
}

export function saveMap(data) {
  return request({
    url: data.id ? '/map/update' : '/map/add',
    method: 'post',
    data
  })
}

export function uploadFile(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  })
}
