export default [
  { label: '住院流水号', prop: 'sn' },
  { label: '姓名', prop: 'username' },
  { label: '性别', prop: 'gender', filters: { 0: '未知', 1: '男', 2: '女' }},
  { label: '手机号', prop: 'phone' },
  { label: '身份证号', prop: 'idcard' },
  { label: '生日', prop: 'birth' },
  { label: '所属区域', prop: 'area' },
  { label: '入院时间', prop: 'admission' },
  { label: '主治医生', prop: 'doctor' },
  { label: '责任护士', prop: 'nurse' },
  { label: '监护人', prop: 'guardian' },
  { label: '状态', prop: 'status', filters: { 0: '未知', 1: '住院', 2: '出院' }}

]
