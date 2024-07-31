using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.Core.Models
{
    public class Task : ISystemModel
    {
        public int Id { get; }
        public string Name { get; set; } = null!;
        public int TaskOrder { get; set; }

        [Computed]
        public int Duration { get; set; }
    }
}
