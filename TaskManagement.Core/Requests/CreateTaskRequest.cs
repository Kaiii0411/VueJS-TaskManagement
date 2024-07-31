using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.Requests
{
    public class CreateTaskRequest
    {
        public string TaskName { get; set; } = null!;
        public int GroupId { get; set; }
        public bool MustDo { get; set; }
        public int CreatedBy { get; set; }
    }
}
