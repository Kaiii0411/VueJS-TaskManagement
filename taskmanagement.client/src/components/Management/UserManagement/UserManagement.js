import { markRaw } from 'vue'
import { mapActions } from 'vuex'
import dateFormat from 'dateformat'
import { Check, Close } from '@element-plus/icons-vue'
import { ElNotification} from 'element-plus'

export default {
  data() {
    return {
      users: [],
      search: '',
      dialogCreateVisible: false,
      userCreateRequest: {
        firstName: '',
        lastName: '',
        userName: '',
        email: ''
      },
      userUpdateRequest: {
        id: '',
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        isActive: false
      },
      tempRow: null,
      checkIcon: markRaw(Check),
      closeIcon: markRaw(Close)
    }
  },

  mounted() {},

  created() {
    this.dataBind()
  },

  computed: {
    filterTableData() {
      return this.users.filter(
        (data) => !this.search || data.firstName.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },

  methods: {
    ...mapActions('user', ['getAllUsers', 'createUser', 'updateUser']),

    dataBind() {
      this.getAllUsers().then((data) => {
        this.users = data
      })
    },

    filterIsActive(value, row) {
      return row.isActive == value
    },

    handleRefresh() {
      this.dataBind()
    },

    formatDate(value, formatString) {
      if (value === null) {
        return ''
      }
      return dateFormat(value, formatString)
    },

    isNullOrEmpty(value) {
      return value === null || value === undefined || value === ''
    },

    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@schooloutfitters\.com$/
      return emailPattern.test(email)
    },

    onClickCreateUserDialog() {
      this.dialogCreateVisible = true
    },

    handleCreateUser() {
      //validate
      if (
        this.isNullOrEmpty(this.userCreateRequest.firstName) ||
        this.isNullOrEmpty(this.userCreateRequest.lastName) ||
        this.isNullOrEmpty(this.userCreateRequest.userName) ||
        this.isNullOrEmpty(this.userCreateRequest.email)
      ) {
        ElNotification({
          title: 'Warning',
          message: 'Please complete all information!',
          type: 'warning'
        })
        return
      }

      if (!this.isValidEmail(this.userCreateRequest.email)) {
        ElNotification({
          title: 'Warning',
          message: 'Invalid email address or not from schooloutfitters.com!',
          type: 'warning'
        })
        return
      }

      //check exist
      if (this.users.some((user) => user.email.trim() === this.userCreateRequest.email)) {
        ElNotification({
          title: 'Warning',
          message: `An account with email ${this.userCreateRequest.email} has been created!`,
          type: 'warning'
        })
        return
      }

      //create a new account
      this.createUser(this.userCreateRequest).then((result) => {
        if (result) {
          ElNotification({
            title: 'Success',
            message: 'Create a new account successfully!',
            type: 'success'
          })

          this.userCreateRequest.firstName = ''
          this.userCreateRequest.lastName = ''
          this.userCreateRequest.userName = ''
          this.userCreateRequest.email = ''

          this.dataBind()
        } else {
          ElNotification({
            title: 'Error',
            message: 'Failed to create a new account!',
            type: 'error'
          })
        }
      })
    },

    handleEdit(index, row) {
      if (!this.isNullOrEmpty(this.tempRow)) {
        ElNotification({
          title: 'Warning',
          message: 'Only 1 line can be adjusted!',
          type: 'warning'
        })
        return
      }

      row.isEditable = true
      this.tempRow = { ...row }
    },

    handleCancel(index, row) {
      row.isEditable = false
      row = this.tempRow
      this.tempRow = null
    },

    handleSave(index, row) {
      this.userUpdateRequest.id = this.tempRow.id
      this.userUpdateRequest.firstName = this.tempRow.firstName
      this.userUpdateRequest.lastName = this.tempRow.lastName
      this.userUpdateRequest.userName = this.tempRow.userName
      this.userUpdateRequest.email = this.tempRow.email
      this.userUpdateRequest.isActive = this.tempRow.isActive

      if (
        this.isNullOrEmpty(this.userUpdateRequest.firstName) ||
        this.isNullOrEmpty(this.userUpdateRequest.lastName) ||
        this.isNullOrEmpty(this.userUpdateRequest.userName) ||
        this.isNullOrEmpty(this.userUpdateRequest.email)
      ) {
        ElNotification({
          title: 'Warning',
          message: 'Please complete all information!',
          type: 'warning'
        })
        return
      }

      if (!this.isValidEmail(this.userUpdateRequest.email)) {
        ElNotification({
          title: 'Warning',
          message: 'Invalid email address or not from schooloutfitters.com!',
          type: 'warning'
        })
        return
      }

      this.updateUser(this.userUpdateRequest).then((result) => {
        if (result) {
          ElNotification({
            title: 'Success',
            message: 'Your information has been updated!',
            type: 'success'
          })

          this.userUpdateRequest.id = 0
          this.userUpdateRequest.firstName = ''
          this.userUpdateRequest.lastName = ''
          this.userUpdateRequest.userName = ''
          this.userUpdateRequest.email = ''
          this.userUpdateRequest.isActive = false

          row.isEditable = false
          this.tempRow = null
          this.dataBind()
        } else {
          ElNotification({
            title: 'Error',
            message: 'Something went wrong!',
            type: 'error'
          })
        }
      })
    }
  }
}
