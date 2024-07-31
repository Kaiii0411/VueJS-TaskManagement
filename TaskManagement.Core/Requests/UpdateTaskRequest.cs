using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.Requests
{
    public class UpdateTaskRequest
    {
        public int Id { get; set; }
        public string TaskName { get; set; } = null!;
        public int GroupId { get; set; }
        public bool MustDo { get; set; }
    }
}
