using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public AuthController
        (
            IConfiguration configuration,
            IUserService userService
        )
        {
            _configuration = configuration;
            _userService = userService;
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var token = GenerateJwtToken("nghia.nguyen@schooloutfitters.com");
            return Ok(new { token });
        }

        private async Task<string> GenerateJwtToken(string email)
        {
            User? user = await _userService.GetByMail(email);

            if(user == null)
                return string.Empty;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.RoleName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])),
            signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
