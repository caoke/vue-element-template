
import Mock from 'mockjs'
import user from './user'
import build from './building'
import area from './area'

const mocks = [
  ...user,
  ...build,
  ...area
]

export default mocks.map(route => {
  return Mock.mock(route.url, route.type, route.response)
})
