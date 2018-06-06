using System;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class GetStudioXmlV1 : DataAccess
    {
        SqlCommand _cmd;
        SqlConnection _con;
        DataSet _ds;
        SqlDataAdapter _da;
        readonly Helper _helper = new Helper();
        public GetStudioXmlV1(string sConstring) : base(sConstring) { }
        public DataSet ManagerDashBoardCounts(Int32 accountId)
        {
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            _con = Connection;
            try
            {
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "GetManagerDashboard";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);

            }
            catch (Exception ex)
            {
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> ManagerDashBoardCounts , Error -->" + ex.ToString());
                _ds = null;
            }
            finally
            {
                _cmd = null;
                if (_con.State == ConnectionState.Open) _con.Dispose();

            }
            return _ds;
        }
        public DataSet StudioXml(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            Logger.Debug("Getting  studioXml:[StudioCallProcess] Calluuid:" + httpParameters.CallUUid + ",FromNumber:" + httpParameters.FromNumber + ",Tonumber:" + httpParameters.ToNumber);
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "StudioCallProcess";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;

                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = httpParameters.CallUUid;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = httpParameters.ToNumber;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = httpParameters.FromNumber;
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 20).Value = httpParameters.Event;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 20).Value = httpParameters.CallStatus;
                _cmd.Parameters.Add("@Digits", SqlDbType.VarChar, 20).Value = httpParameters.Digits;
                _cmd.Parameters.Add("@StartTime", SqlDbType.BigInt).Value = httpParameters.StartTime;
                _cmd.Parameters.Add("@RingTime", SqlDbType.BigInt).Value = httpParameters.RingTIme;
                _cmd.Parameters.Add("@EndTime", SqlDbType.BigInt).Value = httpParameters.EndTime;
                _cmd.Parameters.Add("@RecoedURL", SqlDbType.VarChar, 100).Value = httpParameters.RecordUrl;
                _cmd.Parameters.Add("@DialBLegUUID", SqlDbType.VarChar, 100).Value = httpParameters.DialBLegUUID;
                _cmd.Parameters.Add("@EndReason", SqlDbType.VarChar, 50).Value = httpParameters.EndReason;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = httpParameters.SequenceNumber;
                _cmd.Parameters.Add("@HangupDisposition", SqlDbType.VarChar, 20).Value = httpParameters.HangupDisposition;
                _cmd.Parameters.Add("@EventDateTime", SqlDbType.VarChar,100).Value = httpParameters.Eventtimestamp;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
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
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> StudioXml , Error -->" + ex.ToString());
                _ds = null;
                //responseXML = "<Response><Hangup data='Server error in DataAccessLayes -->"+ ex.ToString() + "'/></Response>";
            }
            finally
            {
                _cmd = null;
                if (_con.State == ConnectionState.Open) _con.Dispose();

            }
            return _ds;
        }
        public DataSet GetAgentQueueXml(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            //event play
            Logger.Debug("Getting Agent QueueXml:[ConnectToAgentQueue_v1] Calluuid:"+httpParameters.CallUUid+",FromNumber:" + httpParameters.FromNumber + ",Tonumber:" + httpParameters.ToNumber);
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "ConnectToAgentQueue_v1";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;

                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = httpParameters.CallUUid;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = httpParameters.ToNumber;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = httpParameters.FromNumber;
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 20).Value = httpParameters.Event;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 20).Value = httpParameters.CallStatus;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = httpParameters.SequenceNumber;
                _cmd.Parameters.Add("@EventDateTime", SqlDbType.VarChar, 100).Value = httpParameters.Eventtimestamp;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
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
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> GetAgentQueueXml , Error -->" + ex.ToString());
                _ds = null;
            }
            finally
            {
                _cmd = null;
                if (_con.State == ConnectionState.Open) _con.Dispose();
            }

            return _ds;
        }

        public DataSet GetCbrQueueXml(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            //event play
            Logger.Debug("Getting Call Back Request Xml:[CbrQueue] Calluuid:" + httpParameters.CallUUid + ",FromNumber:" + httpParameters.FromNumber + ",Tonumber:" + httpParameters.ToNumber+",CBR AgentId:"+httpParameters.CallBackRequestAgentId);
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "CbrQueue";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;

                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = httpParameters.CallUUid;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = httpParameters.ToNumber;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = httpParameters.FromNumber;
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 20).Value = httpParameters.Event;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 20).Value = httpParameters.CallStatus;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = httpParameters.SequenceNumber;
                _cmd.Parameters.Add("@StartTime", SqlDbType.BigInt).Value = httpParameters.StartTime;
                _cmd.Parameters.Add("@EndTime", SqlDbType.BigInt).Value = httpParameters.EndTime;
                _cmd.Parameters.Add("@RingTime", SqlDbType.BigInt).Value = httpParameters.RingTIme;
                _cmd.Parameters.Add("@EndReason", SqlDbType.VarChar, 100).Value = httpParameters.EndReason;
                _cmd.Parameters.Add("@EventDateTime", SqlDbType.VarChar,100).Value = httpParameters.Eventtimestamp;
                _cmd.Parameters.Add("@IsCallBackRequetCall", SqlDbType.Bit).Value = httpParameters.IsCallBackRequetCall;
                _cmd.Parameters.Add("@CallBackRequestAgentId", SqlDbType.BigInt).Value = httpParameters.CallBackRequestAgentId;
                _cmd.Parameters.Add("@HangupDisposition", SqlDbType.VarChar, 10).Value = httpParameters.HangupDisposition;
                _cmd.Parameters.Add("@CallBackRequestClip", SqlDbType.VarChar, 500).Value = httpParameters.CallBackRequestClip;
                _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                /*
                @CallUUID VARCHAR(100),
	            @ToNumber VARCHAR(20),
	            @FromNumber VARCHAR(20),
	            @CallEvent VARCHAR(20),
	            @CallStatus VARCHAR(20),
	            @SequenceNumber BIGINT,
	            @Success bit out,
	            @StartTime BIGINT,
	            @EndTime BIGINT,
	            @RingTime BIGINT,
	            @EndReason VARCHAR(100),
	            @Message VARCHAR(1000) OUT,
	            @IsCallBackRequetCall BIT =0,
	            @CallBackRequestAgentId INT=0,
	            @HangupDisposition VARCHAR(10),
	            @CallBackRequestClip VARCHAR(100),
	            @ResponseXML xml out,
	            @AgentId Numeric =0 Out
                 */
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
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> GetAgentQueueXml , Error -->" + ex.ToString());
                _ds = null;
            }
            finally
            {
                _cmd = null;
                if (_con.State == ConnectionState.Open) _con.Dispose();
            }

            return _ds;
        }

    }
}
