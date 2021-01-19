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
    }

    public sealed class SqlServerRepository : ISqlServerRepository, IDisposable
    {
        private readonly IDbConnection _dbConnection;

        public SqlServerRepository(string sqlServerConnectionString)
        {
            _dbConnection = new SqlConnection(sqlServerConnectionString);
        }

        public IEnumerable<DataSnapshot> GetDataSnapshot(int trustUpin)
        {
            const string sql = @"SELECT * FROM [dbo].[DataSnapshots]";

            // No need to use using statement. Dapper will automatically
            // open, close and dispose the connection for you.
            return _dbConnection.Query<DataSnapshot>(sql);

            // Dapper Contrib example
            //using (SqlConnection connection = new SqlConnection(connectionString))
            //{
            //    var eventId = 1;
            //    var myEvent = _dbConnection.Get<DataSnapshot>(12345);
            //    myEvent.EventName = "New Name";
            //    connection.Update(myEvent);
            //}
        }

        public int UpsertDataSnapShots(IEnumerable<DataSnapshot> dataSnapshots)
        {
            string sql = "INSERT INTO Customers (CustomerName) Values (@CustomerName);";

            //using (var connection = _dbConnection)
            //{
            //    connection.Open();
            //    var affectedRows = connection.Execute(sql,
            //        new[]
            //        {
            //            new {CustomerName = "John"},
            //            new {CustomerName = "Andy"},
            //            new {CustomerName = "Allan"}
            //        }
            //    );
            //    Console.WriteLine(affectedRows);
            //}
            using (var connection = _dbConnection)
            {
                connection.Open();
                var affectedRows = connection.Execute(sql,dataSnapshots);
                Console.WriteLine(affectedRows);
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
