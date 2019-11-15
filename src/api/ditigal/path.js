import request from '@/utils/request'

export function getPathPlanningList(mid) {
  return request({
    url: `/path/getPathPlanningList`,
    method: 'get',
    params: { mapId: mid }
  })
}

export function addPathPlanning(data) {
  return request({
    url: '/path/addPathPlanning',
    method: 'post',
    data
  })
}

export function deletePathPlanning(id) {
  return request({
    url: `/path/deletePathPlanning/${id}`,
    method: 'get'
  })
}
