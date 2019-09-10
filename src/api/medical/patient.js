import request from '@/utils/request'
import { filterParams } from '@/utils/util'

export function getPatient(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  const params = filterParams(data)
  return request({
    url: `/patient/list/${currentPage}/${pageSize}`,
    method: 'get',
    params: params
  })
}

export function savepatient(data) {
  return request({
    url: data.id ? '/patient/update' : '/patient/add',
    method: 'post',
    data
  })
}

export function deletepatient(id) {
  return request({
    url: `/patient/delete/${id}`,
    method: 'get'
  })
}
