import axios from 'axios'

const state = () => ({
  taskLogReport: {
    quarter: 0,
    month: 0,
    logDate: new Date(),
    group: '',
    taskName: '',
    taskOwner: '',
    duration: 0
  },

  tasklogs: [
    {
      quarter: 0,
      month: 0,
      logDate: new Date(),
      group: '',
      taskName: '',
      taskOwner: '',
      duration: 0
    }
  ]
})

const actions = {
  async getTaskLogByDate({ commit }, payload) {
    let result = []
    result = await axios
      .get(`api/Task/reports?from=${payload.from}&to=${payload.to}`)
      .then((response) => {
        if (response.status === 200 && response.data !== null) {
          return response.data
        }
      })
    return result
  }
}

export default {
  namespaced: true,
  state,
  actions
}
