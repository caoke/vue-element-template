export default [
  { label: '编号', prop: 'id' },
  { label: '硬件id', prop: 'deviceid' },
  { label: '标签名称', prop: 'name' },
  { label: '绑定id', prop: 'objectid' },
  { label: '标签类型', prop: 'objecttype', filters: { 1: '医护人员', 2: '患者', 3: '设备' }}
]
