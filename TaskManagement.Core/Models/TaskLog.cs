using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.Core.Models
{
    public class TaskLog : ISystemModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TaskId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? Note { get; set; }
        public int WorkCount { get; set; }

        [Computed]
        public string? TaskName { get; set; }

        [Computed]
        public int? Duration
        {
            get
            {
                if (EndTime == null) return null;

                TimeSpan tp = EndTime.Value - StartTime;
                return Convert.ToInt32(tp.TotalMinutes);
            }
        }
    }
}
