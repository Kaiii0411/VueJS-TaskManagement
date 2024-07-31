using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Server.Controllers
{
    [Route("api/taskgroups")]
    [ApiController]
    public class TaskGroupController : ControllerBase
    {
        private readonly ITaskGroupService _taskGroupService;

        public TaskGroupController
        (
            ITaskGroupService taskGroupService
        )
        {
            _taskGroupService = taskGroupService;
        }

        [HttpGet("GetAll")]
        public async Task<List<TaskGroup>> GetAll()
        {
            return await _taskGroupService.GetAll();
        }
    }
}
