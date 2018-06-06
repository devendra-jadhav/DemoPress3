using Press3.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UDC = Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class DirectDialExtension: DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public DirectDialExtension(string sConstring) : base(sConstring) { }

        public DataSet DialExtension(UDC.ReadRestParameters restParameters)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "DialExtension";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = restParameters.SequenceNumber;
                _cmd.Parameters.Add("@CallUUId", SqlDbType.VarChar, 225).Value = restParameters.CallUid;
                _cmd.Parameters.Add("@Digits", SqlDbType.VarChar, 20).Value = restParameters.Digits;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = restParameters.ToNumber;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "GatewayDetails";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            finally
            {
                _cmd = null;
                _da = null;
            }
            return _ds;
        }
    }
}
