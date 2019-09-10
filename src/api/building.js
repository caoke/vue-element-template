import request from '@/utils/request'

export function buildings(data) {
  return request({
    url: `/building/list/${data.currentPage}/${data.pageSize}`,
    method: 'get'
  })
}

export function deleteBuilding(id) {
  return request({
    url: `/building/delete/${id}`,
    method: 'get'
  })
}

export function saveBuilding(data) {
  return request({
    url: data.id ? '/building/update' : '/building/add',
    method: 'post',
    data
  })
}

