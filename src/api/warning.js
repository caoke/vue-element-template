import request from '@/utils/request'

// 获取告警方式
export function getWarningWayList() {
  return request({
    url: `/warn/getWarningWayList`,
    method: 'get'
  })
}

// 获取告警记录
export function getWarningMsgList(data) {
  const { currentPage, pageSize } = data
  delete data.currentPage
  delete data.pageSize
  const params = filterParams(data)
  return request({
    url: `/warn/getWarningMsgList/${currentPage}/${pageSize}`,
    method: 'get',
    params: params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
