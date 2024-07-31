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
using TaskManagement.Core.ViewModels;

namespace TaskManagement.Services
{
    public class TaskService : ITaskService
    {
        private readonly IDapperService _dapperService;

        public TaskService(IDapperService dapperService) 
        {
            _dapperService = dapperService;
        }

        #region Tasks
        public async Task<Core.Models.Task?> GetById(int id)
        {
            string sQuery = "SELECT Id, Name FROM Task WHERE ID = @ID";
            var parameters = new DynamicParameters();
            parameters.Add("ID", id, DbType.Int32);

            return await _dapperService.Get<Core.Models.Task>(sQuery, parameters, CommandType.Text);
        }

        public async Task<bool> StartTask(int userId, int taskId)
        {
            try
            {
                string sQuery = "sp_Task_StartTask";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", userId, DbType.Int32);
                parameters.Add("TaskId", taskId, DbType.Int32);
                await _dapperService.Excute<bool>(sQuery, parameters, CommandType.StoredProcedure);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> EndTask(int logId)
        {
            try
            {
                string sQuery = @"UPDATE TaskLog SET EndTime = GETDATE() WHERE Id = @LogId AND EndTime IS NULL";
                var parameters = new DynamicParameters();
                parameters.Add("LogId", logId, DbType.Int32);
                await _dapperService.Excute<bool>(sQuery, parameters, CommandType.Text);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<Core.Models.Task>> GetTasksByRange(int userId, DateTime fromDate, DateTime toDate)
        {
            string sQuery = @"sp_Task_GetTaskInfoByDate";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId, DbType.Int32);
            parameters.Add("FromDate", fromDate, DbType.DateTime);
            parameters.Add("ToDate", toDate, DbType.DateTime);

            return await _dapperService.GetAll<Core.Models.Task>(sQuery, parameters, CommandType.StoredProcedure);
        }
        #endregion

        #region TaskLogs
        public async Task<TaskLog?> GetTaskLogById(int taskLogId)
        {
            string sQuery = @"SELECT TL.Id, UserId, TaskId, 
                                dbo.fnc_ConvertServerTimeToUserTime(TL.StartTime, u.TimeZone) AS StartTime, 
                                dbo.fnc_ConvertServerTimeToUserTime(TL.EndTime, u.TimeZone) AS EndTime, 
                                T.Name, TL.Note, TL.WorkCount
                                FROM TaskLog TL JOIN Task T ON T.ID = TL.TaskId 
                                    JOIN [User] u ON U.ID = TL.UserId
                                WHERE TL.ID = @ID";

            var parameters = new DynamicParameters();
            parameters.Add("ID", taskLogId, DbType.Int32);

            return await _dapperService.Get<TaskLog>(sQuery, parameters, CommandType.Text);
        }

        public async Task<bool> DeleteTaskLog(int taskLogId)
        {
            try
            {
                string sQuery = "DELETE FROM TaskLog WHERE ID = @ID";

                var parameters = new DynamicParameters();
                parameters.Add("ID", taskLogId, DbType.Int32);

                await _dapperService.Excute<bool>(sQuery, parameters, CommandType.Text);

                return true;
            }
            catch (Exception)
            {
                return false;                                
            }
        }

        public async Task<List<TaskLog>> GetTaskLogsById(int taskId)
        {
            string sQuery = @"SELECT TL.Id,	TL.UserId, TL.TaskId, TL.StartTime, TL.EndTime, T.Name As TaskName, TL.Note
                                FROM TaskLog TL 
                                    JOIN Task T ON T.ID = TL.TaskId 
                                WHERE TaskId = @ID";

            var parameters = new DynamicParameters();
            parameters.Add("ID", taskId, DbType.Int32);

            return await _dapperService.GetAll<TaskLog>(sQuery, parameters, CommandType.Text);
        }

        public async Task<List<TaskLog>> GetTaskLogs(int taskId, int userId, DateTime fromDate, DateTime? toDate)
        {
            string sQuery = @"sp_Task_GetTasksLogByDate";

            var parameters = new DynamicParameters();
            parameters.Add("TaskId", taskId, DbType.Int32);
            parameters.Add("UserId", userId, DbType.Int32);
            parameters.Add("FromDate", fromDate, DbType.DateTime);
            parameters.Add("ToDate", toDate, DbType.DateTime);

            var result = await _dapperService.GetAll<TaskLog>(sQuery, parameters, CommandType.StoredProcedure);

            return result;
        }

        public async Task<List<TaskLog>> GetTaskLogsByUser(int userId)
        {
            string sQuery = @"SELECT TL.Id,	TL.UserId, TL.TaskId, TL.StartTime, TL.EndTime, T.Name As TaskName, TL.Note
                                FROM TaskLog TL 
                                    JOIN Task T ON T.ID = TL.TaskId 
                                WHERE UserId = @UserId ";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId, DbType.Int32);

            return await _dapperService.GetAll<TaskLog>(sQuery, parameters, CommandType.Text);
        }

        public async Task<bool> UpdateTaskLog(TaskLog taskLog)
        {
            try
            {
                string sQuery = @"sp_Task_UpdateTaskLog";

                var parameters = new DynamicParameters();
                parameters.Add("LogId", taskLog.Id, DbType.Int32);
                parameters.Add("EndTime", taskLog.EndTime, DbType.DateTime);
                parameters.Add("Note", taskLog.EndTime, DbType.String);
                parameters.Add("Count", taskLog.WorkCount, DbType.Int32);

                await _dapperService.Excute<bool>(sQuery, parameters, CommandType.StoredProcedure);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<TaskListViewModel>> GetAllTasks()
        {
            try
            {
                string sQuery = @"sp_Task_GetAll";
                var parameters = new DynamicParameters();
                var result = await _dapperService.GetAll<TaskListViewModel>(sQuery, parameters, CommandType.StoredProcedure);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> Create(CreateTaskRequest request)
        {
            try
            {
                int taskId = 0;
                var createParameters = new DynamicParameters();
                createParameters.Add("@name", request.TaskName, DbType.String);
                createParameters.Add("@groupId", request.GroupId, DbType.Int32);
                createParameters.Add("@mustDo", request.MustDo, DbType.Boolean);
                createParameters.Add("@createdBy", request.CreatedBy, DbType.Int32);

                taskId = await _dapperService.Excute<int>("sp_Task_Create", createParameters, CommandType.StoredProcedure);
                
                if (taskId == 0)
                    return false;

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> Update(UpdateTaskRequest request)
        {
            try
            {
                string sQuery = @"sp_Task_Update";
                var updateParameters = new DynamicParameters();
                updateParameters.Add("@taskId", request.Id, DbType.Int32);
                updateParameters.Add("@taskName", request.TaskName, DbType.String);
                updateParameters.Add("@groupId", request.GroupId, DbType.Int32);
                updateParameters.Add("@mustDo", request.MustDo, DbType.Boolean);
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

        public async Task<bool> Delete(int taskId)
        {
            try
            {
                string sQuery = @"sp_Task_Delete";
                var updateParameters = new DynamicParameters();
                updateParameters.Add("@taskId", taskId, DbType.Int32);

                await _dapperService.Excute<bool>(sQuery, updateParameters, CommandType.StoredProcedure);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<TaskAssignmentViewModel>> GetUsersAssigned(int taskId)
        {
            string sQuery = "sp_Task_GetUsersAssigned";
            var parameters = new DynamicParameters();
            parameters.Add("@taskId", taskId, DbType.Int32);

            var result = await _dapperService.GetAll<TaskAssignmentViewModel>(sQuery, parameters, CommandType.StoredProcedure);
            return result;
        }

        public async Task<bool> AssignTask(int taskId, int userId)
        {
            try
            {
                string sQuery = "sp_Task_Assign";
                var parameters = new DynamicParameters();
                parameters.Add("@taskId", taskId, DbType.Int32);
                parameters.Add("@userId", userId, DbType.Int32);
                parameters.Add("@result", dbType: DbType.Boolean, direction: ParameterDirection.Output);

                await _dapperService.Excute<bool>(sQuery, parameters, CommandType.StoredProcedure);
                var result = parameters.Get<bool>("@result");
                return result;
            }
            catch (Exception)
            {
                return false;
            }
        }

        #endregion

        #region Report
        public async Task<List<TaskLogReport>> GetTaskLogReports(DateTime fromDate, DateTime toDate)
        {
            string sQuery = @"sp_Report_GetTaskLogByDate";

            var parameters = new DynamicParameters();
            parameters.Add("FromDate", fromDate, DbType.DateTime);
            parameters.Add("ToDate", toDate, DbType.DateTime);
            return await _dapperService.GetAll<TaskLogReport>(sQuery, parameters, CommandType.StoredProcedure);
        }
        #endregion
    }
}
