import axios from 'axios'

const state = () => ({
  task: {
    id: 0,
    name: '',
    duration: 0
  },

  taskLog: {
    id: 0,
    userId: 0,
    taskId: 0,
    startTime: new Date(),
    endTime: new Date(),
    taskName: '',
    duration: 0,
    note: '',
    workCount: 0
  },

  assignedTasks: [
    {
      id: 0,
      name: '',
      duration: 0
    }
  ],

  taskLogs: [
    {
      id: 0,
      userId: 0,
      taskId: 0,
      startTime: new Date(),
      endTime: new Date(),
      taskName: '',
      duration: 0,
      note: '',
      workCount: 0
    }
  ],

  allTasks: [
    {
      id: 0,
      taskName: '',
      groupId: 0,
      taskGroup: '',
      mustDo: false,
      createdBy: 0,
      createdDate: new Date(),
      isEditable: false
    }
  ]
})

const mutations = {
  saveAssignedTasks(state, tasks) {
    state.assignedTasks = tasks
  },

  saveTaskList(state, tasks) {
    state.allTasks = tasks
  }
}

const actions = {
  setAssignedTasks({ commit }, tasks) {
    commit('saveAssignedTasks', tasks)
  },

  setTaskList({ commit }, tasks) {
    commit('saveTaskList', tasks)
  },

  async fetchTask({ commit }, payload) {
    try {
      await axios.get(`api/Task/${payload.taskId}`).then((response) => {
        if (response.status === 200) {
          return response.data
        }
      })
    } catch (err) {
      console.error(err)
    }
  },

  async fetchAssignedTasks({ commit }, payload) {
    try {
      await axios
        .get(`api/users/${payload.userId}/GetAssignedTasks`)
        .then((response) => {
          commit('saveAssignedTasks', response.data)
          return response.data
        })
    } catch (err) {
      console.error(err)
    }
  },

  async fetchNonAssignedTasks({ commit }, payload) {
    try {
      let tasks = []
      tasks = await axios
        .get(`api/users/${payload.userId}/GetNonAssignedTasks`)
        .then((response) => {
          return response.data
        })
      return tasks
    } catch (err) {
      console.error(err)
      return null
    }
  },

  async fetchTaskLog({ commit }, payload) {
    try {
      let taskLogs = []
      taskLogs = await axios
        .get(`api/Task/logs/${payload.taskLogId}`)
        .then((response) => {
          if (response.status === 200) {
            return response.data
          }
        })
      return taskLogs
    } catch (err) {
      console.error(err)
    }
  },

  async startTask({ commit }, payload) {
    try {
      const response = await axios.put(
        `api/Task/${payload.taskId}/logs/StartTask`,
        payload.userId,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (response.status === 200) {
        commit('saveAssignedTasks', response.data)
        return response.data
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('Validation Errors:', err.response.data.errors)
      } else {
        console.error('Error:', err.response ? err.response.data : err.message)
      }
    }
  },

  async getTodayTaskLogs({ commit }, payload) {
    const currentDate = new Date()
    let taskLogs = []
    taskLogs = await axios
      .get(
        `api/users/${payload.userId}/logs?taskId=${payload.taskId}&fromDate=${currentDate.toLocaleDateString()}`
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data
        }
      })
    return taskLogs
  },

  async getTaskLogsByRange({ commit }, payload) {
    let taskLogs = []
    taskLogs = await axios
      .get(
        `api/users/${payload.userId}/logs?taskId=` +
          payload.taskId +
          `&fromDate=${payload.fromDate}&toDate=${payload.toDate}`
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data
        }
      })
    return taskLogs
  },

  async getTaskInRange({ commit }, payload) {
    try {
      let taskLogs = []
      taskLogs = await axios
        .get(
          `api/Task/query?userId=` +
            payload.userId +
            `&logFrom=${payload.fromDate}&logTo=${payload.toDate}`
        )
        .then((response) => {
          if (response.status === 200) {
            return response.data
          }
        })
      return taskLogs
    } catch (err) {
      console.error(err)
    }
  },

  async endTask({ commit }, payload) {
    await axios
      .post(`api/Task/logs/${payload.taskLogId}/EndTask`)
      .then((response) => {
        if (response.status === 200) {
          return response.data
        }
      })
  },

  async deleteTaskLog({ commit }, payload) {
    await axios
      .delete(`api/Task/logs/${payload.taskLogId}`)
      .then((response) => {
        if (response.status === 200) {
          return response.data
        }
      })
  },

  async saveTaskLog({ commit }, payload) {
    try {
      await axios
        .put(`api/Task/logs/${payload.taskLog.id}`, payload.taskLog)
        .then((response) => {
          if (response.status === 200) {
            return response.data
          }
        })
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('Validation Errors:', err.response.data.errors)
      } else {
        console.error('Error:', err.response ? err.response.data : err.message)
      }
    }
  },

  async getAllTasks({ commit }) {
    try {
      let tasks = []
      await axios.get(`api/Task/GetAll`).then((response) => {
        tasks = response.data
        commit('saveTaskList', tasks)
        return tasks
      })
    } catch (err) {
      console.error(err)
      return null
    }
  },

  async createTask({ commit }, payload) {
    try {
      const response = await axios.post(`api/Task/create`, payload)
      if (response.status === 200 && response.data !== null) {
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  },

  async updateTask({ commit }, payload) {
    try {
      const response = await axios.post(`api/Task/update`, payload)
      if (response.status === 200 && response.data !== null) {
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  },

  async getUsersAssigned({ commit }, payload) {
    try {
      let response = await axios.get(
        `api/Task/${payload.taskId}/GetUsersAssigned`,
        payload
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      return false
    }
  },

  async getTaskLogs({ commit }, payload) {
    try {
      let response = await axios.get(
        `api/Task/${payload.taskId}/logs`,
        payload
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      return false
    }
  },

  async deleteTask({ commit }, payload) {
    try {
      let response = await axios.delete(`api/Task/${payload.taskId}`)
      if (response.status === 200 && response.data !== null) {
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  },

  async assignTask({ commit }, payload) {
    const response = await axios.post(
      `api/Task/${payload.taskId}/assign`,
      payload.userId,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (response.status === 200) {
      return response.data
    }
  }
}

const getters = {
  assignedTasks: (state) => state.assignedTasks
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
