import request from '@/utils/request'
import { filterParams } from '@/utils/util'

export function getFlag(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  const params = filterParams(data)
  return request({
    url: `/flag/list/${currentPage}/${pageSize}`,
    method: 'get',
    params: params
  })
}

export function saveflag(data) {
  return request({
    url: data.id ? '/flag/update' : '/flag/add',
    method: 'post',
    data
  })
}

export function deleteflag(id) {
  return request({
    url: `/flag/delete/${id}`,
    method: 'get'
  })
}
