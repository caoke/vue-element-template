export default [
  // area list
  {
    url: '/area/list/1/10',
    type: 'get',
    response: config => {
      // const { name } = JSON.parse(config.body)
      return {
        statusCode: 0,
        data: {
          list: [
            {
              id: 1,
              name: '住院部',
              type: 1
            }
          ],
          total: 1
        }
      }
    }
  },
  // add area
  {
    url: '/area/add',
    type: 'post',
    response: config => {
      const data = JSON.parse(config.body)
      if (data) {
        return {
          statusCode: 0,
          message: 'ok'
        }
      }
    }
  },
  // update area
  {
    url: '/area/update',
    type: 'post',
    response: config => {
      const data = JSON.parse(config.body)
      if (data) {
        return {
          statusCode: 0,
          message: 'ok'
        }
      }
    }
  },
  // delete area
  {
    url: '/area/delete/1',
    type: 'get',
    response: config => {
      return {
        statusCode: 0,
        message: 'ok'
      }
    }
  }
]
