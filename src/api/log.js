import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/log/list',
    method: 'post',
    data
  })
}

export function fetchOutliers(logid) {
  return request({
    url: '/log/outliers',
    method: 'get',
    params: { logid }
  })
}

export function deleteItem(id) {
  return request({
    url: '/log/del',
    method: 'post',
    params: { id }
  })
}

export function fetchLogNums(username) {
  return request({
    url: '/log/nums',
    method: 'get',
    params: { username }
  })
}
