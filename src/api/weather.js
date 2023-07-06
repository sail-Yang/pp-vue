import request from '@/utils/request'

export function getWeatherByRealTime(fanid, type) {
  return request({
    url: '/weather/realtime',
    method: 'get',
    params: { fanid, type }
  })
}

export function getWeatherByPeriod(bgtime, edtime, fanid, type) {
  return request({
    url: '/weather/period',
    method: 'get',
    params: { bgtime, edtime, fanid, type }
  })
}
