export default [
  // map list
  {
    url: '/map/list',
    type: 'post',
    response: config => {
      const params = JSON.parse(config.body)
      console.log(params)
      return {
        code: 20000,
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
  // save building
  {
    url: '/map/save',
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
    url: '/map/delete',
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
