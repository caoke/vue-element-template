import request from '@/utils/request'

export function getMapList(data) {
  return request({
    url: '/map/list',
    method: 'post',
    data
  })
}

export function deleteMap(id) {
  return request({
    url: '/map/delete',
    method: 'post',
    data: { id: id }
  })
}

export function saveMap(data) {
  return request({
    url: '/map/save',
    type: 'post',
    data
  })
}

export function uploadFile(data) {
  return request({
    url: '/file/upload',
    type: 'post',
    data
  })
}
