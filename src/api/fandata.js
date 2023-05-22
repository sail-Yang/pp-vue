import request from '@/utils/request'

export function getFanDataByIdAndTime(time, fanid) {
  return request({
    url: '/fan/getbytime',
    method: 'get',
    params: { time, fanid }
  })
}

export function getFanDataByPeriod(bgtime, edtime, fanid) {
  return request({
    url: '/fan/init',
    method: 'get',
    params: { bgtime, edtime, fanid }
  })
}
