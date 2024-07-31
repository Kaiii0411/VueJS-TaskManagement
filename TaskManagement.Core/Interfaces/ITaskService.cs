using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Models;
using TaskManagement.Core.Requests;
using TaskManagement.Core.ViewModels;

namespace TaskManagement.Core.Interfaces
{
    public interface ITaskService
    {
        Task<Core.Models.Task?> GetById(int id);
        Task<bool> StartTask(int userId, int taskId);
        Task<bool> EndTask(int logId);
        Task<List<Core.Models.Task>> GetTasksByRange(int userId, DateTime fromDate, DateTime toDate);
        Task<TaskLog?> GetTaskLogById(int taskLogId);
        Task<bool> DeleteTaskLog(int taskLogId);
        Task<List<TaskLog>> GetTaskLogsById(int taskId);
        Task<List<TaskLog>> GetTaskLogs(int taskId, int userId, DateTime fromDate, DateTime? toDate);
        Task<List<TaskLog>> GetTaskLogsByUser(int userId);
        Task<bool> UpdateTaskLog(TaskLog taskLog);
        Task<List<TaskLogReport>> GetTaskLogReports(DateTime fromDate, DateTime toDate);
        Task<List<TaskListViewModel>> GetAllTasks();
        Task<bool> Create(CreateTaskRequest request);
        Task<bool> Update(UpdateTaskRequest request);
        Task<List<TaskAssignmentViewModel>> GetUsersAssigned(int taskId);
        Task<bool> Delete(int taskId);
        Task<bool> AssignTask(int taskId, int userId);
    }
}
