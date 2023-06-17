import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function signup(data) {
  return request({
    url: '/user/signup',
    method: 'post',
    data
  })
}

export function getUserNames() {
  return request({
    url: '/user/getusernames',
    method: 'get'
  })
}

export function emailLogin(email, code) {
  return request({
    url: '/user/emaillogin',
    method: 'post',
    params: { email, code }
  })
}

export function getLoginCode(email) {
  return request({
    url: '/email/getcode/login',
    method: 'post',
    params: { email }
  })
}

export function getSignupCode(email, username) {
  return request({
    url: '/email/getcode/signup',
    method: 'post',
    params: { email, username }
  })
}

export function updateAccount(data) {
  return request({
    url: '/user/update/account',
    method: 'post',
    data
  })
}

export function updateModel(username, model) {
  return request({
    url: '/user/update/model',
    method: 'post',
    params: { username, model }
  })
}
