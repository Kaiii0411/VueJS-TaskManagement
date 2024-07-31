<template>
  <el-card>
    <h1>Welcome {{ fullName }}</h1>
    <el-checkbox v-model="showDetail">Show Completed Logs</el-checkbox>
    <TaskTracking
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :showStart="true"
      @task_started="dataBind"
      :showDetail="showDetail"
    />
    <PickupTask @pickuptask_started="dataBind()" />
  </el-card>
</template>

<script>
import TaskTracking from '@/components/TaskTracking/TaskTrackingLine/TaskTrackingLine.vue'
import PickupTask from '@/components/TaskTracking/PickupTask/PickupTask.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'task-tracking-list',
  components: {
    TaskTracking,
    PickupTask
  },

  data() {
    return {
      tasks: [],
      userInfomation: {
        id: 0,
        userName: '',
        firstName: '',
        lastName: '',
        timezone: 0
      },
      showDetail: true
    }
  },

  mounted() {
    this.dataBind()
  },

  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapGetters('task', ['assignedTasks']),

    fullName() {
      return this.userInfomation.firstName + ' ' + this.userInfomation.lastName
    }
  },

  methods: {
    ...mapActions('task', ['fetchAssignedTasks']),

    async dataBind() {
      await this.fetchAssignedTasks({ userId: this.userInfo.id }).then(() => {
        this.tasks = this.$store.state.task.assignedTasks
        this.userInfomation = this.$store.state.user.userInfo
      })
    }
  }
}
</script>
