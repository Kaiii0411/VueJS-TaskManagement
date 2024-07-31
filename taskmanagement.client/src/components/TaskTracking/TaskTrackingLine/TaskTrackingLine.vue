<template>
    <div class="mb-2 mt-2 d-flex">
      <div
        class="flex-fill me-2"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        <span class="input-group-text w-100 bg-light">
          {{ itask.name }} - Total: {{ totalDuration }}m - {{ totalSession }}ws
        </span>
      </div>
      <button
        v-if="iShowStart"
        type="button"
        class="btn btn-primary ms-auto"
        @click="startSession"
        style="white-space: nowrap"
      >
        Start Session
      </button>
    </div>
    <ul class="list-group list-group-flush">
      <TaskLog
        v-for="log in taskLogs"
        :taskLog="log"
        :key="log.id"
        @taskLog_ended="bindData"
        @taskLog_deleted="bindData"
        :showDetail="showDetail"
      />
    </ul>
  </template>
  
  <script>
  import TaskLog from '@/components/TaskTracking/TaskLog/TaskLog.vue'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import dateFormat from 'dateformat'
  
  export default {
    name: 'task-tracking-line',
    components: {
      TaskLog
    },
  
    props: {
      task: {
        type: Object,
        required: true
      },
      showStart: {
        type: Boolean,
        required: true
      },
      showDetail: {
        type: Boolean,
        required: true,
        default: true
      },
      logFrom: {
        type: String,
        required: false
      },
      logTo: {
        type: String,
        required: false
      }
    },
  
    data() {
      return {
        itask: { ...this.task },
        iShowStart: this.showStart,
        taskLogs: []
      }
    },
  
    mounted() {
      this.bindData()
    },
  
    computed: {
      ...mapGetters('user', ['userInfo']),
  
      totalDuration() {
        let total = 0
  
        this.taskLogs.forEach((log) => {
          if (typeof log.duration === 'number' && !isNaN(log.duration)) {
            total += log.duration
          }
        })
  
        return total
      },
  
      totalSession() {
        return this.taskLogs.length
      }
    },
  
    emits: ['task_started'],
  
    methods: {
      ...mapActions('task', ['startTask', 'getTodayTaskLogs', 'getTaskLogsByRange']),
  
      formatDate(value, formatString) {
        if (value === null) {
          return ''
        }
        return dateFormat(value, formatString)
      },
  
      async startSession() {
        await this.startTask({
          taskId: this.itask.id,
          userId: this.userInfo.id
        }).then(() => {
          this.$emit('task_started')
        })
      },
  
      bindData() {
        if (!this.logFrom || !this.logTo) {
          this.getTodayTaskLogs({
            taskId: this.task.id,
            userId: this.userInfo.id
          }).then((data) => {
            this.taskLogs = data
          })
        } else {
          this.getTaskLogsByRange({
            taskId: this.task.id,
            userId: this.userInfo.id,
            fromDate: this.logFrom,
            toDate: this.logTo
          }).then((data) => {
            this.taskLogs = data
          })
        }
      }
    },
  
    watch: {
      task: {
        handler() {
          this.bindData()
        }
      }
    }
  }
  </script>
  