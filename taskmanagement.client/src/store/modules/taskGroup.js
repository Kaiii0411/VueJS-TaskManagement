import axios from 'axios'

const state = () => ({
  taskGroup: {
    id: 0,
    name: ''
  },

  taskGroups: [
    {
      id: 0,
      name: ''
    }
  ]
})

const mutations = {
  saveTaskGroups(state, taskGroups) {
    state.taskGroups = taskGroups
  }
}

const actions = {
  setTaskGroups({ commit }, taskGroups) {
    commit('saveTaskGroups', taskGroups)
  },

  async getAllTaskGroups({ commit }) {
    try {
      let response = await axios.get('api/taskgroups/GetAll')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
