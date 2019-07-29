export default [
  // building list
  {
    url: '/building/list',
    type: 'post',
    response: config => {
      // const { name } = JSON.parse(config.body)
      return {
        code: 20000,
        data: [
          {
            id: 1,
            name: '住院部',
            level: 28,
            isEnabled: 1
          }
        ]
      }
    }
  },
  // save building
  {
    url: '/building/save',
    type: 'post',
    response: config => {
      const data = JSON.parse(config.body)
      if (data) {
        return {
          code: 20000,
          message: 'ok'
        }
      }
    }
  },
  // delete building
  {
    url: '/building/delete',
    type: 'post',
    response: config => {
      const { id } = JSON.parse(config.body)
      console.log(id)
      if (id) {
        return {
          code: 20000,
          message: 'ok'
        }
      }
    }
  }
]
