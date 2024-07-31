import { markRaw } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import dateFormat from 'dateformat'
import { Check, Close } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus'

export default {
  name: 'task-management',

  data() {
    return {
      tasks: [],
      search: '',
      taskGroupOptions: [],
      taskCreateRequest: {
        taskName: '',
        groupId: null,
        mustDo: false,
        createdBy: 0
      },
      taskUpdateRequest: {
        id: null,
        taskName: '',
        groupId: null,
        mustDo: false
      },
      userOptions: [],
      usersAssigned: [],
      tempRow: null,
      assignRequest: {
        taskId: null,
        taskName: '',
        userId: null
      },
      checkIcon: markRaw(Check),
      closeIcon: markRaw(Close),
      dialogAssignVisible: false,
      dialogCreateVisible: false
    }
  },

  mounted() {},

  created() {
    this.dataBind()
    this.getTaskGroupOptions()
  },

  computed: {
    ...mapGetters('user', ['userInfo']),

    filterTableData() {
      return this.tasks.filter(
        (data) => !this.search || data.taskName.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },

  methods: {
    ...mapActions('task', [
      'getAllTasks',
      'createTask',
      'updateTask',
      'getUsersAssigned',
      'getTaskLogs',
      'deleteTask',
      'assignTask'
    ]),
    ...mapActions('taskGroup', ['getAllTaskGroups']),
    ...mapActions('user', ['getAllUsers']),

    dataBind() {
      this.getAllTasks().then(() => {
        this.tasks = this.$store.state.task.allTasks
      })
    },

    getTaskGroupOptions() {
      this.getAllTaskGroups().then((data) => {
        this.taskGroupOptions = data.map((group) => ({
          value: group.id,
          label: group.name
        }))
      })
    },

    filterPriority(value, row) {
      return row.mustDo == value
    },

    isNullOrEmpty(value) {
      return value === null || value === undefined || value === ''
    },

    createNewTask() {
      //validate
      if (
        this.isNullOrEmpty(this.taskCreateRequest.taskName) ||
        this.isNullOrEmpty(this.taskCreateRequest.groupId)
      ) {
        ElNotification({
          title: 'Warning',
          message: 'Task name and task group are required!',
          type: 'warning'
        })
        return
      }

      //check exist
      if (
        this.tasks.some((task) => task.taskName.trim() === this.taskCreateRequest.taskName.trim())
      ) {
        ElNotification({
          title: 'Warning',
          message: 'Task name already exists',
          type: 'warning'
        })
        return
      }
      //create task
      this.taskCreateRequest.createdBy = this.userInfo.id
      this.createTask(this.taskCreateRequest).then((result) => {
        if (result) {
          ElNotification({
            title: 'Success',
            message: 'Your task has been created!',
            type: 'success'
          })

          this.taskCreateRequest.taskName = ''
          this.taskCreateRequest.groupId = null
          this.taskCreateRequest.mustDo = false
          this.taskCreateRequest.createdBy = 0

          this.dataBind()
        } else {
          ElNotification({
            title: 'Error',
            message: 'Something went wrong!',
            type: 'error'
          })
        }
      })
    },

    formatDate(value, formatString) {
      if (value === null) {
        return ''
      }
      return dateFormat(value, formatString)
    },

    handleEdit(index, row) {
      if (!this.isNullOrEmpty(this.tempRow)) {
        ElNotification({
          title: 'Warning',
          message: 'Only 1 line can be adjusted!',
          type: 'warning'
        })
        return
      }

      row.isEditable = true
      this.tempRow = { ...row }
    },

    handleCancel(index, row) {
      row.isEditable = false
      row = this.tempRow
      this.tempRow = null
    },

    handleSave(index, row) {
      this.taskUpdateRequest.id = this.tempRow.id
      this.taskUpdateRequest.taskName = this.tempRow.taskName
      this.taskUpdateRequest.groupId = this.tempRow.groupId
      this.taskUpdateRequest.mustDo = this.tempRow.mustDo

      this.updateTask(this.taskUpdateRequest).then((result) => {
        if (result) {
          ElNotification({
            title: 'Success',
            message: 'Your task has been updated!',
            type: 'success'
          })

          this.taskUpdateRequest.id = 0
          this.taskUpdateRequest.taskName = ''
          this.taskUpdateRequest.groupId = null
          this.taskUpdateRequest.mustDo = false
          row.isEditable = false
          this.tempRow = null
          this.dataBind()
        } else {
          ElNotification({
            title: 'Error',
            message: 'Something went wrong!',
            type: 'error'
          })
        }
      })
    },

    handleDelete(index, row) {
      Promise.all([
        this.getUsersAssigned({ taskId: row.id }),
        this.getTaskLogs({ taskId: row.id })
      ]).then(([usersAssigned, taskLogs]) => {
        if (usersAssigned.length > 0 || taskLogs.length > 0) {
          ElMessageBox.confirm(
            `Task is assigned to ${usersAssigned.length} users and has ${taskLogs.length} logs. Continue?`,
            'Warning',
            {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning',
              center: true
            }
          )
            .then(() => {
              this.deleteTask({ taskId: row.id }).then((result) => {
                if (result) {
                  ElNotification({
                    title: 'Success',
                    message: 'Delete completed',
                    type: 'success'
                  })
                  this.dataBind()
                } else {
                  ElNotification({
                    title: 'Error',
                    message: 'Delete failed',
                    type: 'error'
                  })
                }
              })
            })
            .catch(() => {
              ElNotification({
                title: 'Info',
                message: 'Delete canceled',
                type: 'info'
              })
            })
        } else {
          ElMessageBox.confirm('Action will permanently delete task. Continue?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteTask({ taskId: row.id }).then((result) => {
                if (result) {
                  ElNotification({
                    title: 'Success',
                    message: 'Delete completed',
                    type: 'success'
                  })
                  this.dataBind()
                } else {
                  ElNotification({
                    title: 'Error',
                    message: 'Delete failed',
                    type: 'error'
                  })
                }
              })
            })
            .catch(() => {
              ElNotification({
                title: 'Info',
                message: 'Delete canceled',
                type: 'info'
              })
            })
        }
      })
    },

    onClickAssignmentDialog(index, row) {
      this.dialogAssignVisible = true
      this.assignRequest.taskId = row.id
      this.assignRequest.taskName = row.taskName
      this.getUserOptions(row.id)
    },

    onClickCreateTaskDialog() {
      this.dialogCreateVisible = true
    },

    getUserOptions(taskId) {
      Promise.all([this.getUsersAssigned({ taskId: taskId }), this.getAllUsers()]).then(
        ([usersAssigned, allUsers]) => {
          this.usersAssigned = usersAssigned
          this.userOptions = allUsers
            .filter(
              (group) =>
                !usersAssigned.some(
                  (assigned) => assigned.userName.trim() === group.userName.trim()
                )
            )
            .map((group) => ({
              value: group.id,
              label: group.userName + '-' + group.email
            }))
        }
      )
    },

    handleAssign() {
      if (this.isNullOrEmpty(this.assignRequest.userId)) {
        ElNotification({
          title: 'Warning',
          message: 'Please select a user to assign task!',
          type: 'warning'
        })
        return
      }

      this.assignTask(this.assignRequest).then((result) => {
        if (result) {
          ElNotification({
            title: 'Success',
            message: 'Task has been assigned!',
            type: 'success'
          })
          this.getUserOptions(this.assignRequest.taskId)
          this.assignRequest.userId = null
        } else {
          ElNotification({
            title: 'Error',
            message: 'Assign failed',
            type: 'error'
          })
        }
      })
    },

    handleRefresh() {
      this.dataBind()
    }
  }
}
