
import Mock from 'mockjs'
import user from './user'
import build from './building'

const mocks = [
  ...user,
  ...build
]

export default mocks.map(route => {
  return Mock.mock(route.url, route.type, route.response)
})
