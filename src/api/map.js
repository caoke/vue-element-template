import request from '@/utils/request'

export function getMapList(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  return request({
    url: `/map/list/${currentPage}/${pageSize}`,
    method: 'get',
    params: data
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
