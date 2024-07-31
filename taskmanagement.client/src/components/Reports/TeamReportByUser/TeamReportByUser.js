import { mapActions } from 'vuex'
import dateFormat from 'dateformat'
import { ElNotification } from 'element-plus'

export default {
  name: 'team-report-by-user',
  data() {
    return {
      fromDate: '',
      toDate: '',
      logs: []
    }
  },

  computed: {
    groupbyUser() {
      const result = []
      this.logs.reduce((res, log) => {
        if (!res[log.month + log.taskOwner]) {
          res[log.month + log.taskOwner] = {
            quarter: log.quarter,
            month: log.month,
            taskOwner: log.taskOwner,
            duration: 0
          }
          result.push(res[log.month + log.taskOwner])
        }
        res[log.month + log.taskOwner].duration += log.duration
        return res
      }, {})
      return result
    },

    totalDuration() {
      return this.groupbyUser.reduce((a, item) => a + (item.duration || 0), 0)
    }
  },

  methods: {
    ...mapActions('report', ['getTaskLogByDate']),

    runReport() {
      this.bindData()
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

    bindData() {
      if (this.isNullOrEmpty(this.fromDate)) {
        ElNotification({
          title: 'Warning',
          message: 'Please select start date!',
          type: 'warning'
        })
        return
      }

      this.getTaskLogByDate({
        from: dateFormat(this.fromDate, 'yyyy-mm-dd'),
        to: dateFormat(this.toDate, 'yyyy-mm-dd')
      }).then((data) => {
        this.logs = data
      })
    },

    summaryMethod({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Grand Total'
        } else if (index === 3 || index === 4) {
          sums[index] = data.reduce((prev, curr) => {
            if (column.property.trim() === 'durationInHours') {
              return prev + Math.round((curr['duration'] * 10) / 6) / 100
            } else {
              return prev + (Number(curr[column.property]) || 0)
            }
          }, 0)
        }
      })
      return sums
    }
  },

  mounted() {
    const today = new Date()
    this.fromDate = dateFormat(today, 'yyyy-mm-01')
    this.toDate = dateFormat(today, 'yyyy-mm-dd')
    this.bindData()
  }
}
