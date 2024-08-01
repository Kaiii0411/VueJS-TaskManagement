import { createRouter, createWebHistory } from 'vue-router'
import TaskTrackingList from '../components/TaskTracking/TaskTrackingList/TaskTrackingList.vue'
import TaskTrackingReport from '../components/TaskTracking/TaskTrackingReport/TaskTrackingReport.vue'
import UserManagement from '../components/Management/UserManagement/UserManagement.vue'
import TaskManagement from '../components/Management/TaskManagement/TaskManagement.vue'
import TeamReportByWeek from '../components/Reports/TeamReportByWeek/TeamReportByWeek.vue'
import TeamReportByMonth from '../components/Reports/TeamReportByMonth/TeamReportByMonth.vue'
import TeamReportByUser from '../components/Reports/TeamReportByUser/TeamReportByUser.vue'
import { authGuard } from '@/guards/authGuard'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/tasktrackingtool',
        name: 'tasktrackingtool',
        component: TaskTrackingList,
        beforeEnter: authGuard
      },
      {
        path: '/tasktrackingreport',
        name: 'tasktrackingreport',
        component: TaskTrackingReport,
        beforeEnter: authGuard
      },
      {
        path: '/report/teambyweek',
        name: 'teamreportbyweek',
        component: TeamReportByWeek,
        beforeEnter: authGuard
      },
      {
        path: '/report/teambymonth',
        name: 'teamreportbymonth',
        component: TeamReportByMonth,
        beforeEnter: authGuard
      },
      {
        path: '/report/teambyuser',
        name: 'teamreportbyuser',
        component: TeamReportByUser,
        beforeEnter: authGuard
      },
      {
        path: '/admin/usermanagement',
        name: 'usermanagement',
        component: UserManagement,
        beforeEnter: authGuard
      },
      {
        path: '/admin/taskmanagement',
        name: 'taskmanagement',
        component: TaskManagement,
        beforeEnter: authGuard
      },
    ]
  })
  
  export default router