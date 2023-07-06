import Cookies from 'js-cookie'

const TokenKey = 'ZCEQIUBFKSJBFJH2020BQWE'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}
