import request from '@/utils/request'

export function buildings(data) {
  return request({
    url: '/building/list',
    method: 'post',
    data
  })
}
