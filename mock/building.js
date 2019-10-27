export default [
  // building list
  {
    url: '/building/list/1/100',
    type: 'get',
    response: config => {
      // const { name } = JSON.parse(config.body)
      return {
        statusCode: 0,
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
  // add building
  {
    url: '/building/add',
    type: 'post',
    response: config => {
      const data = JSON.parse(config.body)
      console.log(data)
      if (data) {
        return {
          statusCode: 0,
          message: 'ok'
        }
      }
    }
  },
  {
    url: '/building/update',
    type: 'post',
    response: config => {
      const data = JSON.parse(config.body)
      console.log(data, 'update')
      if (data) {
        return {
          statusCode: 0,
          message: 'ok'
        }
      }
    }
  },
  // delete building
  {
    url: '/building/delete/1',
    type: 'get',
    response: config => {
      return {
        statusCode: 0,
        message: 'ok'
      }
    }
  }
]
