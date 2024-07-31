using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.Models
{
    public class TaskLogReport
    {
        public int Quarter
        {
            get
            {
                return this.LogDate.GetQuarter();
            }
        }
        public int Month
        {
            get
            {
                return this.LogDate.Month;
            }
        }
        public DateTime StartOfWeek
        {
            get
            {
                int diff = (7 + (this.LogDate.DayOfWeek - DayOfWeek.Sunday)) % 7;
                return this.LogDate.AddDays(-1 * diff).Date;
            }
        }
        public DateTime LogDate { get; set; }
        public string Group { get; set; }
        public string TaskName { get; set; }
        public string TaskOwner { get; set; }
        public int Duration { get; set; }
        public int WorkCount { get; set; }
    }
}
