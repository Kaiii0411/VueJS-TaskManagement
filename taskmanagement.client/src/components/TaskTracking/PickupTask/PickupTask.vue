<template>
    <div class="mb-2 d-flex">
      <div class="flex-fill me-2">
        <div class="dropdown">
          <select class="form-select" v-model="selectedTask" id="sel1">
            <option v-for="task in allTasks" :key="task.id" :value="task.id">{{ task.name }}</option>
          </select>
        </div>
      </div>
      <button type="button" class="btn btn-primary ms-auto" v-on:click="startSession()">
        Pickup
      </button>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex'
  
  export default {
    props: {
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
        allTasks: [],
        selectedTask: 0
      }
    },
  
    computed: {
      ...mapGetters('user', ['userInfo'])
    },
  
    mounted() {
      this.bindData()
    },
  
    created() {},
  
    methods: {
      ...mapActions('task', ['startTask', 'fetchNonAssignedTasks']),
  
      async startSession() {
        await this.startTask({
          taskId: this.selectedTask,
          userId: this.userInfo.id
        }).then(() => {
          this.$emit('pickuptask_started')
        })
      },
  
      async bindData() {
        await this.fetchNonAssignedTasks({ userId: this.userInfo.id }).then((data) => {
          this.allTasks = data
        })
      }
    }
  }
  </script>
  