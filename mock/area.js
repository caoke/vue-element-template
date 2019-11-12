export default [
  // area list
  {
    url: '/area/list/1/10',
    type: 'get',
    response: config => {
      // const { name } = JSON.parse(config.body)
      return {
        statusCode: 0,
        data: [
          {
            id: 1,
            name: '住院部',
            type: 1
          }
        ],
        dataCount: 10
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
  },
  {
    url: '/map/getBeaconListByParam/1/1000?areaId=6',
    type: 'get',
    response: config => {
      return {
        statusCode: 0,
        message: 'ok',
        data: [
          {
            id: 1,
            sn: 1
          }
        ]
      }
    }
  }
]
