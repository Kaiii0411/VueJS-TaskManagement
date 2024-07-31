<template>
    <h1>This is Task List Page</h1>
    <el-button @click="handleLogin()">Login</el-button>
</template>

<script>
import { defineComponent } from 'vue'
import ScriptContent from './TaskTrackingList.js'

export default defineComponent({
  extends: ScriptContent,
  components: {}
})
</script>