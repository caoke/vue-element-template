/**
 * @description 过滤无效的参数
 */
export function filterParams(obj) {
  const res = {}
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      res[key] = obj[key]
    }
  })

  return res
}
