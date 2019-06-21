
import Mock from 'mockjs'

const tokens = {
    admin: {
      token: 'admin-token'
    },
    editor: {
      token: 'editor-token'
    }
  }

const login = (options) => {
    const { username } =  JSON.parse(options.body)
    const token = tokens[username]

    // mock error
    if (!token) {
      return {
        code: 60204,
        message: 'Account and password are incorrect.'
      }
    }

    return {
      code: 20000,
      data: token
    }
}


Mock.mock('/user/login', 'post', login)