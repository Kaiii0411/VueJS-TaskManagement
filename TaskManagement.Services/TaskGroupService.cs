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
    public class TaskGroupService : ITaskGroupService
    {
        private readonly IDapperService _dapperService;

        public TaskGroupService(IDapperService dapperService) 
        {
            _dapperService = dapperService;
        }

        public async Task<List<TaskGroup>> GetAll()
        {
            string sQuery = "SELECT Id, Name FROM TaskGroup";
            var parameters = new DynamicParameters();
            var result = await _dapperService.GetAll<TaskGroup>(sQuery, parameters, CommandType.Text);
            return result;
        }
    }
}
