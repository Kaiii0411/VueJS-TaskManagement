using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.ViewModels
{
    public class TaskAssignmentViewModel
    {
        public string TaskName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public DateTime AssignedDate { get; set; }
    }
}
