<script setup>
  import { useRouter, RouterView } from 'vue-router'
  const router = useRouter()

  const navigateToTaskTracking = () => {
    router.push({ name: 'tasktrackingtool' })
  }

  const navigateToTaskTrackingReport = () => {
    router.push({ name: 'tasktrackingreport' })
  }

  const navigateToTeamReportByWeek = () => {
    router.push({ name: 'teamreportbyweek' })
  }

  const navigateToTeamReportByMonth = () => {
    router.push({ name: 'teamreportbymonth' })
  }

  const navigateToTeamReportByUser = () => {
    router.push({ name: 'teamreportbyuser' })
  }

  const navigateToTaskManagement = () => {
    router.push({ name: 'taskmanagement' })
  }

  const navigateToUserManagement = () => {
    router.push({ name: 'usermanagement' })
  }
</script>

<template>
    <nav>
    <el-header>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" @click="navigateToTaskTracking()">Start Working</el-menu-item>
        <el-menu-item index="2" @click="navigateToTaskTrackingReport()">My Dashboard</el-menu-item>
        <el-sub-menu index="3">
          <template #title>Team Report</template>
          <el-menu-item index="3-1" @click="navigateToTeamReportByWeek()">By Week</el-menu-item>
          <el-menu-item index="3-2" @click="navigateToTeamReportByMonth()">By Month</el-menu-item>
          <el-menu-item index="3-3" @click="navigateToTeamReportByUser()">By User</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="4" @click="navigateToTaskManagement()">Task Management</el-menu-item>
        <el-menu-item index="5" @click="navigateToUserManagement()">User Management</el-menu-item>
      </el-menu>
    </el-header>
  </nav>
  <el-main>
    <RouterView />
  </el-main>
</template>
