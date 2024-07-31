using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.Services
{
    public class DapperService : IDapperService
    {
        private readonly IConfiguration _config;
        private string Connectionstring = "SqlConnection";

        public DapperService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<T?> Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.Text)
        {
            using IDbConnection db = new SqlConnection(_config.GetConnectionString(Connectionstring));
            return await db.QueryFirstOrDefaultAsync<T>(sp, parms, commandType: commandType);
        }

        public async Task<List<T>> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new SqlConnection(_config.GetConnectionString(Connectionstring));
            var result = await db.QueryAsync<T>(sp, parms, commandType: commandType);
            return result.ToList();
        }

        public async Task<T?> Excute<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            T? result;
            using IDbConnection db = new SqlConnection(_config.GetConnectionString(Connectionstring));
            try
            {
                if (db.State == ConnectionState.Closed)
                    db.Open();

                using var tran = db.BeginTransaction();
                try
                {
                    result = await db.QueryFirstOrDefaultAsync<T>(sp, parms, commandType: commandType, transaction: tran);
                    tran.Commit();
                }
                catch (Exception)
                {
                    tran.Rollback();
                    throw;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (db.State == ConnectionState.Open)
                    db.Close();
            }

            return result;
        }
    }
}
