<script>
import { defineComponent } from 'vue'
import ScriptContent from './TeamReportByWeek.js'

export default defineComponent({
  extends: ScriptContent,
  components: {}
})
</script>

<template>
    <div>
      <el-card>
        <template #header>
          <div class="card-header">
            <h5>TEAM REPORT BY WEEK</h5>
          </div>
        </template>
        <el-form :inline="true">
          <el-form-item label="From">
            <el-date-picker v-model="fromDate" type="date" placeholder="Pick a day" size="large" />
          </el-form-item>
          <el-form-item label="To">
            <el-date-picker v-model="toDate" type="date" placeholder="Pick a day" size="large" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="runReport()">View</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="mt-3">
        <el-table
          :header-cell-style="{ background: '#343a40', color: 'white' }"
          stripe
          border
          show-summary
          :data="groupByTask_Week"
          :summary-method="summaryMethod"
          style="width: 100%"
          max-height="500"
        >
          <el-table-column prop="group" label="Department">
            <template #default="scope">
              <span v-if="shouldShowColumn(scope.$index)">
                {{ scope.row.group }}
              </span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="startOfWeek" label="Week of">
            <template #default="scope">
              <span v-if="shouldShowColumn(scope.$index)">
                {{ scope.row.startOfWeek }}
              </span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="Task" />
          <el-table-column prop="workCount" label="Work Count" />
          <el-table-column prop="duration" label="Total (mins)" sortable />
          <el-table-column prop="durationInHours" label="Total (hrs)">
            <template #default="scope">
              {{ parseFloat((Math.round((scope.row.duration * 10) / 6) / 100).toFixed(2)) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>