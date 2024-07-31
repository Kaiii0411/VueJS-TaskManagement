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
    setUser(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  }

const actions = {
  setUser({ commit }, user) {
    commit('setUser', user)
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
  },

  async getByMail({ commit }, mail) {
    try {
      let userExist = {
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

      const response = await axios.get(`api/users/mail/${mail}`)
      if (response.status === 200 && response.data !== null) {
        userExist = response.data
        return userExist
      } else {
        return userExist
      }
    } catch (error) {
      throw new Error(error)
    }
  },

  async createUser({ commit }, payload) {
    try {
      const response = await axios.post('api/users/create', payload)
      if (response.status === 200 && response.data !== null) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  },

  async getAllUsers({ commit }) {
    let allUsers = []
    let response = await axios.get('api/users/getall')
    if (response.status === 200) {
      allUsers = response.data
      allUsers = allUsers.map((user) => ({
        ...user,
        isEditable: false
      }))
      return allUsers
    }
  },

  async updateUser({ commit }, payload) {
    try {
      const response = await axios.post(`api/users/update`, payload)
      if (response.status === 200 && response.data !== null) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
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