import request from '@/utils/request'

export function getFanDataByPeriod(bgtime, edtime, fanid) {
  return request({
    url: '/fandata/period',
    method: 'get',
    params: { bgtime, edtime, fanid }
  })
}

export function predictByRealTime(username, fanid, model) {
  return request({
    url: '/predict/realtime',
    method: 'get',
    params: { username, fanid, model }
  })
}

export function predictByPeriod(username, bgtime, edtime, hours, fanid, signal, model) {
  return request({
    url: '/predict/period',
    method: 'get',
    params: { username, bgtime, edtime, hours, fanid, model },
    signal: signal
  })
}

export function getWeatherByRealTime(fanid) {
  return request({
    url: '/weather/realtime',
    method: 'get',
    params: { fanid }
  })
}

export function getWeatherByPeriod(bgtime, edtime, fanid) {
  return request({
    url: '/weather/period',
    method: 'get',
    params: { bgtime, edtime, fanid }
  })
}

export function fetchFans() {
  return request({
    url: '/fandata/fannums',
    method: 'get'
  })
}

export function fetchDatas() {
  return request({
    url: '/fandata/getavg',
    method: 'get'
  })
}

export function fetchFanList(username) {
  return request({
    url: '/fandata/fans',
    method: 'get',
    params: { username }
  })
}

export function updateFanUser(fanid, username) {
  return request({
    url: '/fandata/fanuser',
    method: 'post',
    params: { username, fanid }
  })
}
