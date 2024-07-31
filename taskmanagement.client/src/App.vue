<script lang="js">
    import { useRouter, RouterView } from 'vue-router'
    import { mapGetters } from 'vuex';
    import { defineComponent } from 'vue';
    export default defineComponent({
      data() {
        return {
            router: useRouter()
        };
      },

      computed: {
        ...mapGetters('user', ['userInfo']),

        userRole() {
          return this.userInfo.role;
        }
      },

      methods: {
        navigateToTaskTracking() {
            this.router.push({ name: 'tasktrackingtool' })
        },
        navigateToTaskTrackingReport() {
            this.router.push({ name: 'tasktrackingreport' })
        },
        navigateToTeamReportByWeek() {
            this.router.push({ name: 'teamreportbyweek' })
        },
        navigateToTeamReportByMonth() {
            this.router.push({ name: 'teamreportbymonth' })
        },
        navigateToTeamReportByUser() {
            this.router.push({ name: 'teamreportbyuser' })
        },
        navigateToTaskManagement() {
            this.router.push({ name: 'taskmanagement' })
        },
        navigateToUserManagement() {
            this.router.push({ name: 'usermanagement' })
        },

        showItem(item) {
          const rolePermissions = {
            dashboard: ['User', 'Admin', 'Manager'],
            admin: ['Admin'],
            reports: ['Manager', 'Admin']
          };

          return rolePermissions[item].includes(this.userRole);
        }
      },
      components: {
        RouterView
      }
    })
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
        <el-sub-menu v-if="showItem('reports')" index="3">
          <template #title>Team Report</template>
          <el-menu-item index="3-1" @click="navigateToTeamReportByWeek()">By Week</el-menu-item>
          <el-menu-item index="3-2" @click="navigateToTeamReportByMonth()">By Month</el-menu-item>
          <el-menu-item index="3-3" @click="navigateToTeamReportByUser()">By User</el-menu-item>
        </el-sub-menu>
        <el-menu-item v-if="showItem('admin')" index="4" @click="navigateToTaskManagement()">Task Management</el-menu-item>
        <el-menu-item v-if="showItem('admin')" index="5" @click="navigateToUserManagement()">User Management</el-menu-item>
      </el-menu>
    </el-header>
  </nav>

  <el-main>
    <RouterView />
  </el-main>
</template>
