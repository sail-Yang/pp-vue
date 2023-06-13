import request from '@/utils/request'

export function getFanDataByPeriod(bgtime, edtime, fanid) {
  return request({
    url: '/fandata/period',
    method: 'get',
    params: { bgtime, edtime, fanid }
  })
}

export function predictByRealTime(fanid) {
  return request({
    url: '/predict/realtime',
    method: 'get',
    params: { fanid }
  })
}

export function predictByPeriod(bgtime, edtime, hours, fanid, signal) {
  return request({
    url: '/predict/period',
    method: 'get',
    params: { bgtime, edtime, hours, fanid },
    signal: signal
  })
}
