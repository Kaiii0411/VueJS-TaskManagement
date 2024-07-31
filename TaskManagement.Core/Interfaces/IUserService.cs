using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Models;
using TaskManagement.Core.Requests;

namespace TaskManagement.Core.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetById(int id);
        Task<List<Models.Task>> GetAssignedTasks(int userId);
        Task<List<Models.Task>> GetNonAssignedTasks(int userId);
        Task<User?> GetByUserName(string userName);
        Task<bool> UpdateTaskOrdering(int userId, int taskId, int newOrder);
        Task<User?> GetByMail(string mail);
        Task<bool> Create(CreateUserRequest request);
        Task<List<User>> GetAll();
        Task<bool> Update(UpdateUserRequest request);
    }
}
