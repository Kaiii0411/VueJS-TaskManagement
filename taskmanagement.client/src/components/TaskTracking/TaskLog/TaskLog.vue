<template>
    <div v-if="iShowDetail">
      <li class="list-group-item border-0 p-1">
        <div class="d-flex align-items-center">
          <span class="badge bg-danger" v-on:click="deleteTask(iTaskLog.id)" style="cursor: pointer"
            >Delete</span
          >
          <div class="ms-1 flex-fill">
            <span>
              {{ formatDate(iTaskLog.startTime, 'mm/dd - h:MM TT') }}
              {{ formatEndTimeWithDuration() }}
            </span>
            <input
              v-if="this.iTaskLog.endTime"
              class="rounded border border-secondary"
              v-model="endTime"
              type="time"
              v-on:blur="saveTime()"
            />
            <span v-if="this.iTaskLog.endTime"> in {{ iTaskLog.duration }} mins</span>
          </div>
          <input
            style="width: 70px; text-align: right"
            class="rounded border border-secondary me-1"
            v-model="iTaskLog.workCount"
            v-on:blur="saveLog()"
            type="number"
          />
          <input
            class="rounded border border-secondary w-25 me-1"
            v-model="iTaskLog.note"
            v-on:keyup.enter="saveLog()"
            v-on:blur="saveLog()"
          />
          <span
            v-if="taskLog.endTime === null"
            class="badge bg-success"
            v-on:click="endSession(taskLog.id)"
            style="cursor: pointer"
            >End Session</span
          >
          <span v-else class="badge bg-secondary" style="cursor: not-allowed">End Session</span>
        </div>
      </li>
    </div>
  </template>
  
  <script>
  import dateFormat from 'dateformat'
  import { mapActions } from 'vuex'
  
  export default {
    name: 'task-log',
    components: {},
  
    props: {
      taskLog: {
        type: Object,
        required: true
      },
  
      showDetail: {
        type: Boolean,
        required: true
      }
    },
  
    data() {
      return {
        iTaskLog: { ...this.taskLog },
        endTime: this.formatDate(this.taskLog.endTime, 'HH:MM')
      }
    },
  
    computed: {
      iShowDetail() {
        return this.taskLog.endTime === null || this.showDetail == null ? true : this.showDetail
      }
    },
  
    emits: ['taskLog_ended', 'taskLog_deleted'],
  
    methods: {
      ...mapActions('task', ['endTask', 'deleteTaskLog', 'fetchTaskLog', 'saveTaskLog']),
  
      formatDate(value, formatString) {
        if (value === null) {
          return ''
        }
        return dateFormat(value, formatString)
      },
  
      async endSession(logId) {
        await this.endTask({ taskLogId: logId }).then(() => {
          this.bindData()
          this.$emit('taskLog_ended')
        })
      },
  
      async deleteTask(logId) {
        await this.deleteTaskLog({ taskLogId: logId }).then(() => {
          this.$emit('taskLog_deleted')
        })
      },
  
      bindData() {
        this.fetchTaskLog({ taskLogId: this.iTaskLog.id }).then((data) => {
          this.iTaskLog = data
          this.endTime = this.formatDate(this.iTaskLog.endTime, 'HH:MM')
        })
      },
  
      formatEndTimeWithDuration() {
        return this.taskLog.endTime === null ? 'until now' : ' to '
      },
  
      saveTime() {
        const newEndTime = new Date(
          this.formatDate(this.iTaskLog.endTime, 'yyyy-mm-dd') + 'T' + this.endTime + '+00:00'
        )
        if (newEndTime > new Date(this.iTaskLog.startTime + '+00:00')) {
          this.iTaskLog.endTime = newEndTime
        }
        this.saveLog()
        this.bindData()
      },
  
      saveLog() {
        this.saveTaskLog({ taskLog: this.iTaskLog }).then(() => {
          this.$nextTick(() => {
            this.bindData()
          })
        })
      }
    },
  
    watch: {
      taskLog() {
        this.iTaskLog = { ...this.taskLog }
        this.endTime = this.formatDate(this.taskLog.endTime, 'HH:MM')
      }
    }
  }
  </script>
  