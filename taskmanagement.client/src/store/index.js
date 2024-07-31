import { createStore } from 'vuex'
import task from './modules/task'
import user from './modules/user'
import report from './modules/report'
import taskGroup from './modules/taskGroup'

export default createStore({
  modules: {
    task,
    user,
    report,
    taskGroup
  }
})