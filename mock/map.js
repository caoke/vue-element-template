export default [
  // map list
  {
    url: '/map/list/1/10',
    type: 'get',
    response: config => {
      return {
        statusCode: 0,
        data: [
          {
            id: 1,
            buildingname: '住院部',
            type: 1,
            floor: 23,
            src: 'http://120.24.54.8/yyServer/file/image/5d6fc8dee4b0a2cc117cb459'
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
        message: 'ok',
        data: 10
      }
    }
  },
  {
    url: '/map/beacon/update',
    type: 'post',
    response: config => {
      return {
        statusCode: 0,
        message: 'ok',
        data: 10
      }
    }
  },
  // map list
  {
    url: '/map/beacons/1',
    type: 'get',
    response: config => {
      // const params = JSON.parse(config.body)
      return {
        statusCode: 0,
        data: [
          {
            createtime: 1568283003000,
            id: 1,
            map: 8,
            sn: '1',
            type: 0,
            xpos: 4076,
            ypos: 600
          },
          {
            createtime: 1568282199000,
            id: 2,
            map: 8,
            sn: '2',
            type: 0,
            xpos: 2540,
            ypos: 720
          },
          {
            createtime: 1568282199000,
            id: 3,
            map: 8,
            sn: '3',
            type: 0,
            xpos: 3540,
            ypos: 1000
          }
        ],
        dataCount: 3

      }
    }
  },
  // getMapById
  {
    url: '/map/getMapById/1',
    type: 'post',
    response: config => {
      return {
        statusCode: 0,
        data: {
          id: 1,
          width: 7134,
          height: 4041,
          floor: 1, // 归属楼层
          buildingname: '住院部',
          src: '',
          filename: '地图.jpg'
        }
      }
    }
  }
]
