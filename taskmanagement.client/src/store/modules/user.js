const state = () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {
      id: 0,
      userName: '',
      firstName: '',
      lastName: '',
      timezone: 0,
      token: ''
    }
  })

const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    console.log(state.userInfo)
  }
}

const actions = {
  setUser({ commit }, userInfo) {
    commit('setUserInfo', userInfo)
  },

  async login({ commit }, payload){
    let userInfo = {
      id: 0,
      userName: '',
      firstName: '',
      lastName: '',
      timezone: 0,
      token: ''
    }

    userInfo.userName = payload.userName
    userInfo.token = payload.token
    commit('setUserInfo', userInfo)
  }
}

  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }