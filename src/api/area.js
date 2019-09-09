import request from '@/utils/request'
import { filterParams } from '@/utils/util'

export function getArea(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  const params = filterParams(data)
  return request({
    url: `/area/list/${currentPage}/${pageSize}`,
    method: 'get',
    params: params
  })
}

export function saveArea(data) {
  return request({
    url: data.id ? '/area/update' : '/area/add',
    method: 'post',
    data
  })
}

export function deleteArea(id) {
  return request({
    url: `/area/delete/${id}`,
    method: 'get'
  })
}

