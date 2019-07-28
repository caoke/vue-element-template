import request from '@/utils/request'

export function buildings(data) {
  return request({
    url: '/building/list',
    method: 'post',
    data
  })
}

export function deleteBuilding(id) {
  return request({
    url: '/building/delete',
    method: 'post',
    data: { id: id }
  })
}

export function saveBuilding(data) {
  return request({
    url: '/building/save',
    type: 'post',
    data
  })
}
