using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskManagement.Core.Requests;

namespace TaskManagement.Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITaskService _taskService;

        public UserController
        (
            IUserService userService,
            ITaskService taskService
        )
        {
            _userService = userService;
            _taskService = taskService;
        }

        // GET api/users/{id}
        [HttpGet("{id}")]
        public async Task<User?> Get(int id)
        {
            return await _userService.GetById(id);
        }

        // GET api/users/{userName}
        [HttpGet("userName/{userName}")]
        public async Task<User?> GetByUserName(string userName)
        {
            return await _userService.GetByUserName(userName);
        }

        // GET api/{userId}/alllogs
        [HttpGet("{userId}/alllogs")]
        public async Task<List<TaskLog>> GetTaskLogs(int userId)
        {
            return await _taskService.GetTaskLogsByUser(userId);
        }

        // api/users/{userId}/GetAssignedTasks
        [HttpGet("{userId}/GetAssignedTasks")]
        public async Task<List<Core.Models.Task>> GetAssignedTask(int userId)
        {
            return await _userService.GetAssignedTasks(userId);
        }

        // api/users/{userId}/GetNonAssignedTasks
        [HttpGet("{userId}/GetNonAssignedTasks")]
        public async Task<List<Core.Models.Task>> GetNonAssignedTask(int userId)
        {
            return await _userService.GetNonAssignedTasks(userId);
        }

        [HttpGet("{userId}/logs")]
        public async Task<List<TaskLog>> GetTaskLogQuery(int userId, [FromQuery] int taskId,
                    [FromQuery] DateTime fromDate, [FromQuery] DateTime? toDate)
        {
            if (toDate != null)
                toDate = toDate.Value.AddDays(1);

            return await _taskService.GetTaskLogs(taskId, userId, fromDate.Date, toDate);
        }

        [HttpPut("{id}/tasks/{taskId}/TaskOrder")]
        public async System.Threading.Tasks.Task UpdateTaskOrdering(int id, int taskId, [FromBody] int newOrder)
        {
            await _userService.UpdateTaskOrdering(id, taskId, newOrder);
        }

        [HttpGet("mail/{mail}")]
        public async Task<User?> GetByMail(string mail)
        {
            return await _userService.GetByMail(mail.Trim());
        }

        [HttpPost("create")]
        public async Task<bool> Create(CreateUserRequest request)
        {
            return await _userService.Create(request);
        }

        [HttpGet("getall")]
        public async Task<List<User>> GetAll()
        {
            return await _userService.GetAll();
        }

        [HttpPost("update")]
        public async Task<bool> Update(UpdateUserRequest request)
        {
            return await _userService.Update(request);
        }
    }
}
