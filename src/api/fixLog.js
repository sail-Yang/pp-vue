import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/fix/list',
    method: 'post',
    data
  })
}

export function deleteItem(id) {
  return request({
    url: '/fix/del',
    method: 'post',
    params: { id }
  })
}
