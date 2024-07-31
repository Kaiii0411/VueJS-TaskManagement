using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskManagement.Core.Requests;
using TaskManagement.Core.ViewModels;

namespace TaskManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("{id}")]
        public async Task<Core.Models.Task?> Get(int id)
        {
            return await _taskService.GetById(id);
        }

        [HttpGet("query")]
        public async Task<List<Core.Models.Task>> GetTaskByQuery([FromQuery] int userId, [FromQuery] DateTime logFrom, DateTime logTo)
        {
            logFrom = logFrom.Date;
            logTo = logTo.Date.AddDays(1);

            return await _taskService.GetTasksByRange(userId, logFrom, logTo);
        }

        [HttpGet("{taskId}/logs")]
        public async Task<List<TaskLog>> GetTaskLogs(int taskId)
        {
            return await _taskService.GetTaskLogsById(taskId);
        }

        [HttpGet("logs/{taskLogId}")]
        public async Task<TaskLog?> GetTaskLog(int taskLogId)
        {
            return await _taskService.GetTaskLogById(taskLogId);
        }

        [HttpPut("logs/{id}")]
        public async System.Threading.Tasks.Task UpdateTaskLog(int id, [FromBody] TaskLog value)
        {
            await _taskService.UpdateTaskLog(value);
        }

        [HttpDelete("logs/{logid}")]
        public async System.Threading.Tasks.Task DeleteTaskLog(int logId)
        {
            await _taskService.DeleteTaskLog(logId);
        }

        [HttpPut("{id}/logs/StartTask")]
        public async Task<bool> StartTask(int id, [FromBody] int userId)
        {
            return await _taskService.StartTask(userId, id);
        }

        [HttpPost("logs/{logId}/EndTask")]
        public async Task<bool> EndTask(int logId)
        {
            return await _taskService.EndTask(logId);
        }

        [HttpGet("GetAll")]
        public async Task<List<TaskListViewModel>> GetAll()
        {
            return await _taskService.GetAllTasks();
        }

        [HttpPost("create")]
        public async Task<bool> Create(CreateTaskRequest request)
        {
            return await _taskService.Create(request);
        }

        [HttpPost("update")]
        public async Task<bool> Update(UpdateTaskRequest request)
        {
            return await _taskService.Update(request);
        }

        [HttpGet("{taskId}/GetUsersAssigned")]
        public async Task<List<TaskAssignmentViewModel>> GetUsersAssigned(int taskId)
        {
            return await _taskService.GetUsersAssigned(taskId);
        }

        [HttpDelete("{taskId}")]
        public async Task<bool> Delete(int taskId)
        {
            return await _taskService.Delete(taskId);
        }

        [HttpPost("{taskId}/assign")]
        public async Task<bool> Assign(int taskId, [FromBody] int userId)
        {
            return await _taskService.AssignTask(taskId, userId);
        }

        [HttpGet("reports")]
        public async Task<List<TaskLogReport>> GetTaskLogReport([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            return await _taskService.GetTaskLogReports(from, to.Date.AddDays(1));
        }
    }
}
