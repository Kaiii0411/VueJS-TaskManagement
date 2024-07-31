using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.ViewModels
{
    public class TaskListViewModel
    {
        public int Id { get; set; }
        public string TaskName { get; set; } = null!;
        public int GroupId { get; set; }
        public string TaskGroup { get; set; } = null!;
        public bool MustDo { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public bool IsEditable { get; set; } = false;
    }
}
