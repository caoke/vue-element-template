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

/**
 * description 置空参数
 */
export function resetForm(obj) {
  const result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = resetForm(obj[key]) // 递归复制
      } else {
        result[key] = ''
      }
    }
  }
  return result
}
