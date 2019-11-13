export default [
  {
    url: '/personel/list/1/10',
    type: 'get',
    response: config => {
      // const { name } = JSON.parse(config.body)
      return {
        statusCode: 0,
        data: [
          {
            sn: 1,
            username: '住院部',
            gender: 1,
            position: '护士',
            status: 1
          }
        ],
        dataCount: 10
      }
    }
  },
  // add personel
  {
    url: '/personel/add',
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
  // update personel
  {
    url: '/personel/update',
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
  // delete personel
  {
    url: '/personel/delete/1',
    type: 'get',
    response: config => {
      return {
        statusCode: 0,
        message: 'ok'
      }
    }
  },
  {
    url: '/patient/list/1/10',
    type: 'get',
    response: config => {
      // const { name } = JSON.parse(config.body)
      return {
        statusCode: 0,
        data: [
          {
            sn: 1,
            username: '住院部',
            gender: 1,
            position: '护士',
            status: 1
          }
        ],
        dataCount: 10
      }
    }
  }
]
