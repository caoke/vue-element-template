export default [
  { label: '编号', prop: 'sn' },
  { label: '姓名', prop: 'username' },
  { label: '性别', prop: 'gender', filters: { 0: '未知', 1: '男', 2: '女' }},
  { label: '职位', prop: 'position' },
  { label: '身份证号', prop: 'idcard' },
  { label: '状态', prop: 'status', filters: { 0: '正常', 1: '休假', 2: '离职' }}
]
