<template>
    <el-card>
      <template #header>
        <div class="card-header">
          <h5>Task Report - {{ fullName }}</h5>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="From">
            <el-input type="date" v-model="fromDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="To">
            <el-input type="date" v-model="toDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="runReport">View</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mt-3">
      <template #header>
        <div class="card-header">
          <h5>Total usage time: {{ totalDuration }} mins ~ {{ totalDuration / 60 }} hours</h5>
        </div>
      </template>
      <TaskTracking
        v-for="task in tasks"
        :task="task"
        :key="task.id"
        :showStart="false"
        :logFrom="fromDate"
        :logTo="toDate"
        :showDetail="showDetail"
      />
    </el-card>
  </template>
  
  <script>
  import TaskTracking from '@/components/TaskTracking/TaskTrackingLine/TaskTrackingLine.vue'
  import { mapGetters, mapActions } from 'vuex'
  import dateFormat from 'dateformat'
  
  export default {
    components: {
      TaskTracking
    },
  
    data() {
      return {
        fromDate: '',
        toDate: '',
        tasks: [],
        showDetail: true
      }
    },
  
    mounted() {
      const today = new Date()
      this.fromDate = dateFormat(today, 'yyyy-mm-dd')
      this.toDate = dateFormat(today, 'yyyy-mm-dd')
      this.bindData()
    },
  
    computed: {
      ...mapGetters('user', ['userInfo']),
  
      fullName() {
        return this.userInfo.firstName + ' ' + this.userInfo.lastName
      },
  
      totalDuration() {
        let mins = 0
        this.tasks.forEach((t) => {
          mins += t.duration
        })
        return mins
      }
    },
  
    methods: {
      ...mapActions('task', ['getTaskInRange']),
  
      formatDate(value, formatString) {
        if (value === null) {
          return ''
        }
        return dateFormat(value, formatString)
      },
  
      runReport() {
        this.bindData()
      },
  
      async bindData() {
        await this.getTaskInRange({
          userId: this.userInfo.id,
          fromDate: this.fromDate,
          toDate: this.toDate
        }).then((data) => {
          this.tasks = data
        })
      }
    }
  }
  </script>
  