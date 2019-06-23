
const tokens = {
    admin: {
      token: 'admin-token'
    },
    editor: {
      token: 'editor-token'
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