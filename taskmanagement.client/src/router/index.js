import { createRouter, createWebHistory } from 'vue-router'
import TaskTrackingList from '../components/TaskTracking/TaskTrackingList/TaskTrackingList.vue'
import TaskTrackingReport from '../components/TaskTracking/TaskTrackingReport/TaskTrackingReport.vue'
import UserManagement from '../components/Management/UserManagement/UserManagement.vue'
import TaskManagement from '../components/Management/TaskManagement/TaskManagement.vue'
import TeamReportByWeek from '../components/Reports/TeamReportByWeek/TeamReportByWeek.vue'
import TeamReportByMonth from '../components/Reports/TeamReportByMonth/TeamReportByMonth.vue'
import TeamReportByUser from '../components/Reports/TeamReportByUser/TeamReportByUser.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/tasktrackingtool',
        name: 'tasktrackingtool',
        component: TaskTrackingList
      },
      {
        path: '/tasktrackingreport',
        name: 'tasktrackingreport',
        component: TaskTrackingReport
      },
      {
        path: '/report/teambyweek',
        name: 'teamreportbyweek',
        component: TeamReportByWeek
      },
      {
        path: '/report/teambymonth',
        name: 'teamreportbymonth',
        component: TeamReportByMonth
      },
      {
        path: '/report/teambyuser',
        name: 'teamreportbyuser',
        component: TeamReportByUser
      },
      {
        path: '/admin/usermanagement',
        name: 'usermanagement',
        component: UserManagement
      },
      {
        path: '/admin/taskmanagement',
        name: 'taskmanagement',
        component: TaskManagement
      },
    ]
  })
  
  export default router