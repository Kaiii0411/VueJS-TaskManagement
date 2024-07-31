using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Services
{
    public class UserService : IUserService
    {
        IDapperService _dapperService;

        public UserService(IDapperService dapperService)
        {
            _dapperService = dapperService;
        }

        public async Task<User?> GetByMail(string mail)
        {
            string sQuery = "SELECT U.Id, UserName, FirstName, LastName, Timezone, Email, U.CreatedDate, U.IsActive, R.RoleName FROM [User] U " +
                "JOIN Roles R on R.Id = U.RoleId " +
                "WHERE LOWER(Email) = @mail ";
            var parameters = new DynamicParameters();
            parameters.Add("mail", mail.ToLower(), DbType.String);

            return await _dapperService.Get<User>(sQuery, parameters, CommandType.Text);
        }
    }
}
