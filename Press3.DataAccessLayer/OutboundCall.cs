using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class OutboundCall : DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public OutboundCall(string sConstring) : base(sConstring) { }

        public DataSet UpdateCallDetails(UDC.OutboundCall callObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateCallDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callObj.Id;
                _cmd.Parameters.Add("@Event", SqlDbType.VarChar, 50).Value = callObj.Event;
                _cmd.Parameters.Add("@RingTime", SqlDbType.BigInt).Value = callObj.RingTime;
                _cmd.Parameters.Add("@AnswerTime", SqlDbType.BigInt).Value = callObj.AnswerTime;
                _cmd.Parameters.Add("@EndTime", SqlDbType.BigInt).Value = callObj.EndTime;
                _cmd.Parameters.Add("@IsCustomer", SqlDbType.Bit).Value = callObj.IsCustomer;
                _cmd.Parameters.Add("@EndReason", SqlDbType.VarChar, 225).Value = callObj.EndReason;
                _cmd.Parameters.Add("@HangupDisposition", SqlDbType.VarChar, 225).Value = callObj.HangupDisposition;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet UpdateOutboundConferenceDetails(UDC.OutboundCall callObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateOutboundConferenceDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callObj.Id;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = callObj.AgentId;
                _cmd.Parameters.Add("@ConferenceRoom", SqlDbType.VarChar, 100).Value = callObj.ConferenceName;
                _cmd.Parameters.Add("@IsCustomer", SqlDbType.Bit).Value = callObj.IsCustomer;
                _cmd.Parameters.Add("@Event", SqlDbType.VarChar, 100).Value = callObj.Event;
                _cmd.Parameters.Add("@ConferenceAction", SqlDbType.VarChar, 100).Value = callObj.ConferenceAction;
                _cmd.Parameters.Add("@RequestUUID", SqlDbType.VarChar, 225).Value = callObj.RequestUUID;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = callObj.Source;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = callObj.Destination;
                _cmd.Parameters.Add("@FsMemberId", SqlDbType.Int).Value = callObj.FsMemberId;
                _cmd.Parameters.Add("@EventTimeStamp", SqlDbType.BigInt).Value = callObj.EventTimeStamp;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetAgentConferenceRoom(int callId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentConferenceRoom";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callId;
                _cmd.Parameters.Add("@ConferenceRoom", SqlDbType.VarChar, 225).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@GatewayURL", SqlDbType.VarChar, 225).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
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
                Connection.Close();
            }
            return _ds;
        }

        public DataSet UpdateCallBackRequestStatus(UDC.OutboundCall callObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateCallBackRequestStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callObj.Id;
                _cmd.Parameters.Add("@StartTime", SqlDbType.Int).Value = callObj.AnswerTime;
                _cmd.Parameters.Add("@EndReason", SqlDbType.VarChar, 225).Value = callObj.EndReason;
                _cmd.Parameters.Add("@HangupDisposition", SqlDbType.VarChar, 225).Value = callObj.HangupDisposition;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
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
                Connection.Close();
            }
            return _ds;
        }
    }
}
