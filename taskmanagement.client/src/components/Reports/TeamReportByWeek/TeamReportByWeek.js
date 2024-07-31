import { mapActions } from 'vuex'
import dateFormat from 'dateformat'

export default {
  name: 'TeamReport',

  data() {
    return {
      fromDate: '',
      toDate: '',
      logs: [],
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          label: 'GitHub Commits',
          backgroundColor: '#f87979',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
        }
      ]
    }
  },

  computed: {
    groupByTask_Week() {
      const result = []
      this.logs.reduce((res, log) => {
        let startOfWeek = dateFormat(log.startOfWeek, 'yyyy-mm-dd')
        if (!res[startOfWeek + log.taskName]) {
          res[startOfWeek + log.taskName] = {
            quarter: log.quarter,
            month: log.month,
            taskName: log.taskName,
            startOfWeek: startOfWeek,
            group: log.group,
            workCount: 0,
            duration: 0
          }
          result.push(res[startOfWeek + log.taskName])
        }
        res[startOfWeek + log.taskName].duration += log.duration
        res[startOfWeek + log.taskName].workCount += log.workCount
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

    formatDate(value, formatString) {
      if (value === null) {
        return ''
      }
      return dateFormat(value, formatString)
    },

    shouldShowColumn(index) {
      if (index === 0) return true

      return (
        this.groupByTask_Week[index - 1] &&
        this.groupByTask_Week[index].group !== this.groupByTask_Week[index - 1].group
      )
    },

    summaryMethod({ columns, data }) {
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

    bindData() {
      this.getTaskLogByDate({
        from: dateFormat(this.fromDate, 'yyyy-mm-dd'),
        to: dateFormat(this.toDate, 'yyyy-mm-dd')
      }).then((data) => {
        this.logs = data
      })
    }
  },

  mounted() {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const firstDayOfWeek = new Date(today.setDate(diff))

    this.fromDate = dateFormat(firstDayOfWeek, 'yyyy-mm-dd')
    this.toDate = dateFormat(today, 'yyyy-mm-dd')
    this.bindData()
  }
}
