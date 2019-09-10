
const state = {
  areaTypes: [
    {
      value: 1,
      label: '走廊'
    },
    {
      value: 2,
      label: '楼梯'
    },
    {
      value: 3,
      label: '电梯'
    },
    {
      label: '办公室',
      value: 4
    },
    {
      label: '病房',
      value: 5
    },
    {
      label: '手术室',
      value: 6
    },
    {
      label: '厕所',
      value: 7
    },
    {
      label: '药房',
      value: 8
    }
  ]
}

export default {
  namespaced: true,
  state
}
