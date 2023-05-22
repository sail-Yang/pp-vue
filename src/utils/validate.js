/**
 * Created by PanJiaChen on 16/11/18.
 */
import { getUserNames } from '@/api/user'
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(username) {
  return getUserNames().then(response => {
    const { data } = response
    // console.log(data.indexOf(username.trim()))
    return data.indexOf(username.trim()) >= 0
  })
}
