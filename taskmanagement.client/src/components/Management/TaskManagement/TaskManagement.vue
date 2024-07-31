<template>
    <el-card>
      <el-button type="primary" plain size="default" @click="onClickCreateTaskDialog()">
        Create
      </el-button>
      <el-button type="warning" plain size="default" @click="handleRefresh()">Refresh</el-button>
      <el-table
        :header-cell-style="{ background: '#343a40', color: 'white' }"
        stripe
        border
        style="width: 100%"
        :data="filterTableData"
        max-height="500"
        class="mt-2"
      >
        <el-table-column prop="id" label="Id" width="50" header-align="center" align="center" />
        <el-table-column prop="taskName" label="Task Name">
          <template #default="scope">
            <span v-if="!scope.row.isEditable">{{ scope.row.taskName }}</span>
            <div v-else>
              <el-input size="default" v-model="tempRow.taskName" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskGroup" label="Task Group" width="350">
          <template #default="scope">
            <span v-if="!scope.row.isEditable">{{ scope.row.taskGroup }}</span>
            <div v-else>
              <el-select size="default" v-model="tempRow.groupId">
                <el-option
                  v-for="item in taskGroupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="120"
          prop="mustDo"
          label="Priority"
          :filters="[
            { text: 'Must Do', value: true },
            { text: 'Normal', value: false }
          ]"
          :filter-method="filterPriority"
        >
          <template #default="scope">
            <el-tag
              v-if="!scope.row.isEditable"
              :type="scope.row.mustDo ? 'danger' : 'success'"
              disable-transitions
            >
              {{ scope.row.mustDo ? 'Must Do' : 'Normal' }}
            </el-tag>
            <div v-else>
              <el-switch
                v-model="tempRow.mustDo"
                class="mt-2"
                inline-prompt
                :active-icon="checkIcon"
                :inactive-icon="closeIcon"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="120"
          prop="createdBy"
          label="Created By"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.createdBy }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="200"
          prop="createdDate"
          label="Created Date"
        >
          <template #default="scope">
            <span>{{ formatDate(scope.row.createdDate, 'yyyy-mm-dd HH:MM:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="250">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Type to search" />
          </template>
          <template #default="scope">
            <div v-if="!scope.row.isEditable">
              <el-button
                size="small"
                type="info"
                @click="onClickAssignmentDialog(scope.$index, scope.row)"
              >
                Assign
              </el-button>
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> Edit </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                Delete
              </el-button>
            </div>
            <div v-else>
              <el-button size="small" type="success" @click="handleSave(scope.$index, scope.row)">
                Save
              </el-button>
              <el-button size="small" type="danger" @click="handleCancel(scope.$index, scope.row)">
                Cancel
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  
    <el-dialog v-model="dialogAssignVisible" width="500">
      <el-card>
        <el-form>
          <el-form-item label="Task:">
            <el-input v-model="assignRequest.taskName" disabled />
          </el-form-item>
          <el-form-item label="User:" class="mt-3">
            <el-select v-model="assignRequest.userId" placeholder="Please select user to assign">
              <el-option
                v-for="item in userOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="mt-3">
        <h5>Assigned To:</h5>
        <el-table
          :data="usersAssigned"
          :header-cell-style="{ background: '#343a40', color: 'white' }"
          stripe
          border
          max-height="300"
        >
          <el-table-column header-align="center" align="center" property="userName" label="User" />
          <el-table-column
            property="assignedDate"
            label="Assigned Date"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span>{{ formatDate(scope.row.assignedDate, 'yyyy-mm-dd HH:MM') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAssignVisible = false">Cancel</el-button>
          <el-button type="primary" @Click="handleAssign()"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  
    <el-dialog v-model="dialogCreateVisible" width="500" title="CREATE NEW TASK">
      <el-card>
        <el-form>
          <el-form-item label="Name:" label-width="100">
            <el-input v-model="taskCreateRequest.taskName"></el-input>
          </el-form-item>
          <el-form-item label="Group:" label-width="100" class="mt-3">
            <el-select placeholder="Select" v-model="taskCreateRequest.groupId">
              <el-option
                v-for="item in taskGroupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Must do:" label-width="100" class="mt-3">
            <el-switch
              v-model="taskCreateRequest.mustDo"
              inline-prompt
              :active-icon="checkIcon"
              :inactive-icon="closeIcon"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogCreateVisible = false">Cancel</el-button>
          <el-button type="primary" @click="createNewTask()"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </template>

<script>
import { defineComponent } from 'vue'
import ScriptContent from './TaskManagement.js'

export default defineComponent({
  extends: ScriptContent,
  components: {}
})
</script>

<style>
    .el-form-item {
    margin-bottom: 0px !important;
    }

    .el-form-item__label {
    font-weight: bold;
    font-style: italic;
    }

    .el-dialog__title {
    font-weight: bold;
    }
</style>
