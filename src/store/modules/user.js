import { login, logout, getInfo, signup, emailLogin, updateAccount, updateModel } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: 'https://cdn.staticaly.com/gh/sail-Yang/myImage@main/img/logo.1yceuco8s0rk.png',
    model: 'multi',
    password: '',
    email: '',
    roles: [],
    visitNums: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MODEL: (state, model) => {
    state.model = model
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_VISITNUMS: (state, visitNums) => {
    state.visitNums = visitNums
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login,封装axios进行异步请求,获取token后存入vuex供全局使用
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_MODEL', data.model)
        commit('SET_PASSWORD', data.password)
        commit('SET_EMAIL', data.email)
        commit('SET_USERNAME', data.username)
        commit('SET_VISITNUMS', data.visitNums)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user email login,封装axios进行异步请求,获取token后存入vuex供全局使用
  emailLogin({ commit }, userInfo) {
    const { email, emailCode } = userInfo
    return new Promise((resolve, reject) => {
      emailLogin(email.trim(), emailCode).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_MODEL', data.model)
        commit('SET_PASSWORD', data.password)
        commit('SET_EMAIL', data.email)
        commit('SET_USERNAME', data.username)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar } = data
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        console.log('role', roles)
        commit('SET_ROLES', roles)
        commit('SET_USERNAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_VISITNUMS', data.visitNums)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user sign up
  signup({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      const { username, password, email, emailCode } = userInfo
      signup({ username: username.trim(), password: password, email: email, code: emailCode }).then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROLES', [])
      commit('SET_TOKEN', '')
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  updateAccount({ commit }, userInfo) {
    const { username, password, email, emailCode } = userInfo
    return new Promise((resolve, reject) => {
      updateAccount({ username: username.trim(), password: password, email: email.trim(), code: emailCode }).then(response => {
        const { data } = response
        commit('SET_PASSWORD', password)
        commit('SET_EMAIL', email)
        commit('SET_USERNAME', username)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateModel({ commit }, modelInfo) {
    const { username, model } = modelInfo
    return new Promise((resolve, reject) => {
      updateModel(username, model).then(response => {
        commit('SET_MODEL', model)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()
    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

