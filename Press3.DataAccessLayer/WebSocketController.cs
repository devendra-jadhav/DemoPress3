using System;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{

    public class WebSocketController : DataAccess
    {
        SqlCommand _cmd;
        SqlConnection _con;
        DataSet _ds;
        
        readonly Helper _helper = new Helper();
        public WebSocketController(string sConstring) : base(sConstring) { }
        public DataSet InsertWsNofificationQueue(string message)
        {
   
            try
            {
                _ds = new DataSet();
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "InsertWsNotifications";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;
                _cmd.Parameters.Add("@WsMessage", SqlDbType.VarChar, message.Length).Value = message;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _con.Open();
                _cmd.ExecuteNonQuery();
                _con.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
              
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
    }
}
