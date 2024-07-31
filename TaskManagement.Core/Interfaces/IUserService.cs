﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Models;

namespace TaskManagement.Core.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByMail(string mail);
    }
}
