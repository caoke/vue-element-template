import request from '@/utils/request'

export function getArea(data) {
  return request({
    url: '/area/list',
    method: 'post',
    data
  })
}

export function saveArea(data) {
  return request({
    url: '/area/save',
    method: 'post',
    data
  })
}

export function deleteArea(id) {
  return request({
    url: '/area/delete',
    method: 'post',
    data: { id: id }
  })
}

