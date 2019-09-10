import request from '@/utils/request'
import { filterParams } from '@/utils/util'

export function getPersonel(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  const params = filterParams(data)
  return request({
    url: `/personel/list/${currentPage}/${pageSize}`,
    method: 'get',
    params: params
  })
}

export function savePersonel(data) {
  return request({
    url: data.id ? '/personel/update' : '/personel/add',
    method: 'post',
    data
  })
}

export function deletePersonel(id) {
  return request({
    url: `/personel/delete/${id}`,
    method: 'get'
  })
}
