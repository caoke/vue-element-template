export default [
  // map list
  {
    url: '/map/list/1/10',
    type: 'get',
    response: config => {
      const params = JSON.parse(config.body)
      console.log(params)
      return {
        statusCode: 0,
        data: [
          {
            id: 1,
            buildingname: '住院部',
            type: 1,
            src: '111111111'
          }
        ],
        dataCount: 1

      }
    }
  },
  // save building
  {
    url: '/map/add',
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
  {
    url: '/map/update',
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
  // delete building
  {
    url: '/map/delete/1',
    type: 'post',
    response: config => {
      const { id } = JSON.parse(config.body)
      console.log(id)
      if (id) {
        return {
          statusCode: 0,
          message: 'ok'
        }
      }
    }
  },
  // add icon
  {
    url: '/map/beacon/add',
    type: 'post',
    response: config => {
      return {
        statusCode: 0,
        message: 'ok'
      }
    }
  }
]
