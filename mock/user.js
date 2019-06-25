
const tokens = {
    admin: {
      token: 'admin-token'
    },
    editor: {
      token: 'editor-token'
    }
  }

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    }
}

export default [
    // user login
    {
      url: '/user/login',
      type: 'post',
      response: config => {
        const { username } = JSON.parse(config.body)
        const token = tokens[username]
  
        // mock error
        if (!token) {
          return {
            code: 60204,
            message: 'Account and password are incorrect.......'
          }
        }
  
        return {
          code: 20000,
          data: token
        }
      }
    },

    {
        url: '/user/info',
        type: 'post',
        response: config => {
            const { token } = JSON.parse(config.body)
            const info = users[token]

            if(!info) {
                return {
                    code: 50008,
                    message: 'Login failed, unable to get user details.'
                }
            }else {
                return {
                    code: 20000,
                    data: info,
                    message: 'ok'
                }
            }

        }
    },
  
    // user logout
    {
      url: '/user/logout',
      type: 'post',
      response: () => {
        return {
          code: 20000,
          data: 'success'
        }
      }
    }
  ]