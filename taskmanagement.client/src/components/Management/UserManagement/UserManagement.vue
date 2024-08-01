<template>
    <el-card>
      <el-button type="primary" plain size="default" @click="onClickCreateUserDialog()">
        Create
      </el-button>
      <el-button type="warning" plain size="default" @click="handleRefresh()">Refresh</el-button>
      <el-table
        :header-cell-style="{ background: '#343a40', color: 'white' }"
        stripe
        border
        :data="filterTableData"
        style="width: 100%"
        max-height="500"
        class="mt-2"
      >
        <el-table-column prop="userName" label="User Name" header-align="center" align="center">
          <template #default="scope">
            <el-tag v-if="!scope.row.isEditable">{{ scope.row.userName }}</el-tag>
            <div v-else>
              <el-input size="default" v-model="tempRow.userName" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="firstName" label="First Name" header-align="center" align="center">
          <template #default="scope">
            <span v-if="!scope.row.isEditable">{{ scope.row.firstName }}</span>
            <div v-else>
              <el-input size="default" v-model="tempRow.firstName" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastName" label="Last Name" header-align="center" align="center">
          <template #default="scope">
            <span v-if="!scope.row.isEditable">{{ scope.row.lastName }}</span>
            <div v-else>
              <el-input size="default" v-model="tempRow.lastName" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="timezone"
          label="Time Zone"
          header-align="center"
          align="center"
          width="100"
        />
        <el-table-column prop="email" label="Email" header-align="center" width="350">
          <template #default="scope">
            <span v-if="!scope.row.isEditable">{{ scope.row.email }}</span>
            <div v-else>
              <el-input size="default" v-model="tempRow.email" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isActive"
          label="Is Active"
          header-align="center"
          align="center"
          width="100"
          :filters="[
            { text: 'Active', value: true },
            { text: 'Inactive', value: false }
          ]"
          :filter-method="filterIsActive"
        >
          <template #default="scope">
            <el-tag
              v-if="!scope.row.isEditable"
              :type="!scope.row.isActive ? 'danger' : 'success'"
              disable-transitions
            >
              {{ scope.row.isActive ? 'Active' : 'Inactive' }}
            </el-tag>
            <div v-else>
              <el-switch
                v-model="tempRow.isActive"
                class="mt-2"
                inline-prompt
                :active-icon="checkIcon"
                :inactive-icon="closeIcon"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdDate"
          label="Created Date"
          header-align="center"
          align="center"
          width="250"
        >
          <template #default="scope">
            <span>{{ formatDate(scope.row.createdDate, 'yyyy-mm-dd HH:MM:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Search by first name" />
          </template>
          <template #default="scope">
            <div v-if="!scope.row.isEditable">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> Edit </el-button>
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
  
    <el-dialog v-model="dialogCreateVisible" width="500" title="CREATE NEW USER">
      <el-card>
        <el-form>
          <el-form-item label="First Name:" label-width="100">
            <el-input v-model="userCreateRequest.firstName"></el-input>
          </el-form-item>
          <el-form-item label="Last Name:" label-width="100" class="mt-3">
            <el-input v-model="userCreateRequest.lastName"></el-input>
          </el-form-item>
          <el-form-item label="User Name:" label-width="100" class="mt-3">
            <el-input v-model="userCreateRequest.userName"></el-input>
          </el-form-item>
          <el-form-item label="Email:" label-width="100" class="mt-3">
            <el-input v-model="userCreateRequest.email"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogCreateVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleCreateUser()"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import ScriptContent from './UserManagement.js'
  
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
  