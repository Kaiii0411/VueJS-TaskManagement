using Azure.Core;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskManagement.Core.Requests;

namespace TaskManagement.Services
{
    public class UserService : IUserService
    {
        IDapperService _dapperService;

        public UserService(IDapperService dapperService) 
        {
            _dapperService = dapperService;
        }

        public async Task<User?> GetById(int id)
        {
            string sQuery = "SELECT Id, UserName, FirstName, LastName, Timezone FROM [User] WHERE ID = @ID";
            var parameters = new DynamicParameters();
            parameters.Add("ID", id, DbType.Int32);

            return await _dapperService.Get<User>(sQuery, parameters, CommandType.Text);
        }

        public async Task<List<Core.Models.Task>> GetAssignedTasks(int userId)
        {
            string sQuery = "sp_Task_GetAssignedTasks";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId, DbType.Int32);

            return await _dapperService.GetAll<Core.Models.Task>(sQuery, parameters, CommandType.StoredProcedure);
        }

        public async Task<List<Core.Models.Task>> GetNonAssignedTasks(int userId)
        {
            string sQuery = @"SELECT Id, Name
		                        FROM [Task] T
                                WHERE NOT Exists (SELECT * FROM  
			                        TaskAssignment TA 
		                            WHERE TA.TaskId = T.Id  
									AND TA.UserId = @UserId)
                                ORDER BY Name";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId, DbType.Int32);

            return await _dapperService.GetAll<Core.Models.Task>(sQuery, parameters, CommandType.Text);
        }

        public async Task<User?> GetByUserName(string userName)
        {
            string sQuery = "SELECT Id, UserName, FirstName, LastName FROM [User] WHERE UserName = @UserName";
            var parameters = new DynamicParameters();
            parameters.Add("UserName", userName, DbType.String);

            return await _dapperService.Get<User>(sQuery, parameters, CommandType.Text);
        }

        public async Task<bool> UpdateTaskOrdering(int userId, int taskId, int newOrder)
        {
            try
            {
                string sQuery = @"UPDATE FROM TaskAssignment SET TaskOrder = @NewOrder WHERE UserId = @UserId AND TaskId = @TaskId";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", userId, DbType.Int32);
                parameters.Add("TaskId", taskId, DbType.Int32);
                parameters.Add("NewOrder", newOrder, DbType.Int32);
                await _dapperService.Excute<bool>(sQuery, parameters, CommandType.Text);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
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

        public async Task<bool> Create(CreateUserRequest request)
        {
            try
            {
                int userId = 0;
                var createParameters = new DynamicParameters();
                createParameters.Add("@userName", request.UserName, DbType.String);
                createParameters.Add("@firstName", request.FirstName, DbType.String);
                createParameters.Add("@lastName", request.LastName, DbType.String);
                createParameters.Add("@email", request.Email, DbType.String);

                userId = await _dapperService.Excute<int>("sp_User_Create", createParameters, CommandType.StoredProcedure);

                if (userId == 0)
                    return false;

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<User>> GetAll()
        {
            string sQuery = "SELECT Id, UserName, FirstName, LastName, Timezone, Email, CreatedDate, IsActive FROM [User] ORDER BY Id DESC";
            var parameters = new DynamicParameters();
            var result = await _dapperService.GetAll<User>(sQuery, parameters, CommandType.Text);
            return result;
        }

        public async Task<bool> Update(UpdateUserRequest request)
        {
            try
            {
                string sQuery = @"sp_User_Update";
                var updateParameters = new DynamicParameters();
                updateParameters.Add("@userId", request.Id, DbType.Int32);
                updateParameters.Add("@userName", request.UserName, DbType.String);
                updateParameters.Add("@firstName", request.FirstName, DbType.String);
                updateParameters.Add("@lastName", request.LastName, DbType.String);
                updateParameters.Add("@email", request.Email, DbType.String);
                updateParameters.Add("@isActive", request.IsActive, DbType.String);

                updateParameters.Add("@result", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await _dapperService.Excute<bool>(sQuery, updateParameters, CommandType.StoredProcedure);
                var result = updateParameters.Get<bool>("@result");
                return result;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
