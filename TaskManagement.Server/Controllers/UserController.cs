using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService  _userService;

        public UserController
        (
            IUserService userService
        ) 
        {
            _userService = userService;
        }

        [HttpGet("mail/{mail}", Name = "GetUserByMail")]
        public async Task<User?> GetByMail(string mail)
        {
            return await _userService.GetByMail(mail.Trim());
        }
    }
}
