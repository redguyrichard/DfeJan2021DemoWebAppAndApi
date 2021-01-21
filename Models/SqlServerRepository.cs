using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using DfeJan2021DemoWebAppAndApi.Models;

namespace DfeJan2021DemoWebAppAndApi.Database
{
    public interface ISqlServerRepository
    {
        IEnumerable<DataSnapshot> GetDataSnapshot(int trustUpin);
        
        int UpsertDataSnapShots(int trustUkprn, IEnumerable<DataSnapshot> dataSnapshots);

    }

    public sealed class SqlServerRepository : ISqlServerRepository, IDisposable
    {
        private readonly IDbConnection _dbConnection;

        public SqlServerRepository(string sqlServerConnectionString)
        {
            _dbConnection = new SqlConnection(sqlServerConnectionString);
        }

        public IEnumerable<DataSnapshot> GetDataSnapshot(int trustUkprn)
        {
            string sql = $"SELECT * FROM [dbo].[DataSnapshots] WHERE TrustUkprn = {trustUkprn}";

            // No need to use using statement. Dapper will automatically
            // open, close and dispose the connection for you.
            return _dbConnection.Query<DataSnapshot>(sql);
        }

        public int UpsertDataSnapShots(int trustUkprn, IEnumerable<DataSnapshot> dataSnapshots)
        {
            using (var connection = _dbConnection)
            {
                connection.Open();

                // Convert dataSnapshots to sproc params
                var upsertSprocPrams = dataSnapshots.Select(ds => new {
                    SnapshotDate = ds.SnapshotDate,
                    TrustUkprn = trustUkprn,
                    AcademyUpin = ds.AcademyUpin,
                    CoaAccount = ds.CoaAccount,
                    CoaAccountValue = ds.CoaAccountValue
                });

                // Upsert Data
                var affectedRows = connection.Execute("sp_DataSnapshot_Upsert", upsertSprocPrams, commandType: CommandType.StoredProcedure);

                // Run Forecast SPROC
                var forcaseSprocResults = connection.Execute("sp_forecast", null, commandType: CommandType.StoredProcedure);

                return affectedRows;
            }
        }

        public void Dispose()
        {
            _dbConnection.Close();
            _dbConnection.Dispose();
        }
    }
}
