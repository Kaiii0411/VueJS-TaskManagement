import { mapActions } from 'vuex'
import dateFormat from 'dateformat'

export default {
  name: 'team-report-by-month',
  data() {
    return {
      fromDate: '',
      toDate: '',
      logs: [],
      isShowDetails: false
    }
  },

  computed: {
    groupbyMonth() {
      const result = []
      this.logs.reduce((res, log) => {
        if (!res[log.month + log.group]) {
          res[log.month + log.group] = {
            quarter: log.quarter,
            month: log.month,
            group: log.group,
            workCount: 0,
            duration: 0,
            percentage: 0.0
          }
          result.push(res[log.month + log.group])
        }
        res[log.month + log.group].duration += log.duration
        res[log.month + log.group].workCount += log.workCount
        res[log.month + log.group].percentage =
          res[log.month + log.group].duration / this.totalDuration
        return res
      }, {})
      return result
    },

    groupByTask_Month() {
      const result = []
      this.logs.reduce((res, log) => {
        if (!res[log.month + log.taskName]) {
          res[log.month + log.taskName] = {
            quarter: log.quarter,
            month: log.month,
            taskName: log.taskName,
            startOfWeek: log.startOfWeek,
            group: log.group,
            workCount: 0,
            duration: 0,
            percentage: 0.0
          }
          result.push(res[log.month + log.taskName])
        }
        res[log.month + log.taskName].duration += log.duration
        res[log.month + log.taskName].workCount += log.workCount
        res[log.month + log.taskName].percentage =
          res[log.month + log.taskName].duration / this.totalDuration
        return res
      }, {})
      return result
    },

    totalDuration() {
      return this.logs.reduce((a, item) => a + (item.duration || 0), 0)
    }
  },

  methods: {
    ...mapActions('report', ['getTaskLogByDate']),

    runReport() {
      this.bindData()
    },

    onClickShowDetails() {
      this.isShowDetails = !this.isShowDetails
    },

    formatDate(value, formatString) {
      if (value === null) {
        return ''
      }
      return dateFormat(value, formatString)
    },

    bindData() {
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
    },

    summaryMethodForDetail({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Grand Total'
        } else if (index === 4 || index === 5) {
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
    },

    shouldShowColumnDepartment(index) {
      if (index === 0) return true

      return (
        this.groupByTask_Month[index - 1] &&
        this.groupByTask_Month[index].group !== this.groupByTask_Month[index - 1].group
      )
    },

    shouldShowColumnTaskName(index) {
      if (index === 0) return true

      return (
        this.groupByTask_Month[index - 1] &&
        this.groupByTask_Month[index].taskName !== this.groupByTask_Month[index - 1].taskName
      )
    }
  },

  mounted() {
    const today = new Date()
    this.fromDate = dateFormat(today, 'yyyy-mm-01')
    this.toDate = dateFormat(today, 'yyyy-mm-dd')
    this.bindData()
  }
}
