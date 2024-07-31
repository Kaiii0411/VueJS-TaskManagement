import axios from 'axios'

const state = () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {
      id: 0,
      userName: '',
      firstName: '',
      lastName: '',
      timezone: 0,
      email: '',
      isActive: true,
      createdDate: new Date(),
      roleName: ''
    }
  })

const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
}

const actions = {
  setUser({ commit }, userInfo) {
    commit('setUserInfo', userInfo)
  },

  async login({ commit }, payload){
    try{
      let userInfo = {
        id: 0,
        userName: '',
        firstName: '',
        lastName: '',
        timezone: 0,
        email: '',
        isActive: true,
        createdDate: new Date(),
        roleName: ''
      }

      const response = await axios.get(`api/users/mail/${payload.mail}`)
      if (response.status === 200 && response.data !== null) {
        userInfo = response.data
        commit('setUserInfo', userInfo)
        return true
      }
      else {
        return false
      }
    } catch{
      return false;
    }
  }
}
const getters = {
  userInfo: (state) => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}