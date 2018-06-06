using System;
using System.Data.SqlClient;

namespace Press3.DataAccessLayer
{
    public abstract class DataAccess : IDisposable
    {
        private SqlConnection _connection;
        private string _errorMessage = string.Empty;
        protected DataAccess(string sConnString)
        {
            _connection = new SqlConnection(sConnString);
        }

        protected SqlConnection Connection
        {
            get { return _connection; }
        }
        public string ErrorMessage 
        {
            get { return _errorMessage; }
            protected set { _errorMessage = value; }
        }

        public void Dispose()
        {
            _connection.Dispose();
        }
    }
}
