export default [
  // building
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
            isEnabled: true
          }
        ]
      }
    }
  }
]
