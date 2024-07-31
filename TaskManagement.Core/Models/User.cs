using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.Core.Models
{
    public class User : ISystemModel
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int Timezone { get; set; }
        public string? Email { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
        public string RoleName { get; set; } = null!;
    }
}
