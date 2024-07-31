<script>
import { defineComponent } from 'vue'
import ScriptContent from './TeamReportByMonth.js'

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
            <h5>TEAM REPORT BY MONTH</h5>
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
          style="width: 100%"
          max-height="500"
          :data="groupbyMonth"
        >
          <el-table-column prop="group" label="Department" />
          <el-table-column align="center" prop="month" label="Month" width="100" />
          <el-table-column align="center" prop="workCount" label="Work Count" width="200" />
          <el-table-column
            align="center"
            sortable
            prop="duration"
            label="Duration (mins)"
            width="200"
          />
          <el-table-column align="center" prop="durationInHours" label="Duration (hrs)" width="200">
            <template #default="scope">
              {{ (Math.round((scope.row.duration * 10) / 6) / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="percentage" label="Percentage (%)" width="150">
            <template #default="scope">
              {{ (100 * scope.row.percentage.toFixed(4)).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-button type="primary" @click="onClickShowDetails()" class="mt-2"> Show Details </el-button>
      <el-card class="mt-2" v-if="isShowDetails">
        <el-table
          :header-cell-style="{ background: '#343a40', color: 'white' }"
          stripe
          border
          show-summary
          :summary-method="summaryMethodForDetail"
          style="width: 100%"
          max-height="500"
          :data="groupByTask_Month"
        >
          <el-table-column prop="group" label="Department">
            <template #default="scope">
              <span v-if="shouldShowColumnDepartment(scope.$index)">
                {{ scope.row.group }}
              </span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="Task Name" width="700">
            <template #default="scope">
              <span v-if="shouldShowColumnTaskName(scope.$index)">
                {{ scope.row.taskName }}
              </span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="month" label="Month" width="100" />
          <el-table-column align="center" prop="workCount" label="Work Count" width="200" />
          <el-table-column
            align="center"
            sortable
            prop="duration"
            label="Duration (mins)"
            width="200"
          />
          <el-table-column align="center" prop="durationInHours" label="Duration (hrs)" width="200">
            <template #default="scope">
              {{ (Math.round((scope.row.duration * 10) / 6) / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="percentage" label="Percentage (%)" width="150">
            <template #default="scope">
              {{ (100 * scope.row.percentage.toFixed(4)).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>

