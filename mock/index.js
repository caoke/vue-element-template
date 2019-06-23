
import Mock from 'mockjs'
import user from './user'

const mocks = [
  ...user
]

export default mocks.map(route => {
  return Mock.mock(route.url, route.type, route.response)
})