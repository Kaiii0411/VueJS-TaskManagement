<script>
import { defineComponent } from 'vue'
import ScriptContent from './TeamReportByUser.js'

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
            <h5>TEAM DASHBOARD</h5>
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
      <el-card class="mt-2">
        <el-table
          :header-cell-style="{ background: '#343a40', color: 'white' }"
          stripe
          border
          show-summary
          :summary-method="summaryMethod"
          :data="groupbyUser"
          style="width: 100%"
          max-height="500"
        >
          <el-table-column prop="quarter" label="Quarter" />
          <el-table-column prop="month" label="Month" />
          <el-table-column prop="taskOwner" label="Task Owner" />
          <el-table-column prop="duration" sortable label="Duration (mins)" />
          <el-table-column prop="durationInHours" label="Duration (hrs)">
            <template #default="scope">
              {{ parseFloat((Math.round((scope.row.duration * 10) / 6) / 100).toFixed(2)) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>