import { login, getInfo, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.account)
        commit('SET_ROLES', [data.account])
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.account)
        commit('SET_INTRODUCTION', data.account)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })

      // // 假数据
      // commit('SET_TOKEN', 'admin-token')
      // setToken('admin-token')
      // resolve()
    })
  },

  // user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      resolve({
        roles: ['admin']
      })
      // getInfo({ token: state.token }).then(response => {
      //   const { data } = response
      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }
      //   const { roles, name, avatar, introduction } = data
      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      // removeToken()
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        // const { data } = response
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // setToken('')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
