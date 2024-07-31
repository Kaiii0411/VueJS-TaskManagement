using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.Interfaces
{
    public interface IDapperService
    {
        Task<T?> Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.Text);
        Task<List<T>> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        Task<T?> Excute<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
    }
}
