using System;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using Press3.UserDefinedClasses;


namespace Press3.DataAccessLayer
{
    public class GetStudioXml : DataAccess
    {
        SqlCommand _cmd;
         SqlConnection _con;
         DataSet _ds;
         SqlDataAdapter _da;
        readonly Helper _helper = new Helper();
        
        public GetStudioXml(string sConstring) : base(sConstring) { }
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
            _ds = new DataSet();
            try
            {
                _cmd = new SqlCommand();
               _con = Connection;
               _cmd.CommandText = "InboundIvrCallProcesses";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;

                 _cmd.Parameters.Add("@CallUUID" , SqlDbType.VarChar,100).Value = httpParameters.CallUUid;
                 _cmd.Parameters.Add("@ToNumber" , SqlDbType.VarChar,20).Value = httpParameters.ToNumber;
                 _cmd.Parameters.Add("@FromNumber" , SqlDbType.VarChar,20).Value = httpParameters.FromNumber;
                 _cmd.Parameters.Add("@CallEvent" , SqlDbType.VarChar,20).Value = httpParameters.Event;
                 _cmd.Parameters.Add("@CallStatus" , SqlDbType.VarChar,20).Value = httpParameters.CallStatus;
                 _cmd.Parameters.Add("@Digits" , SqlDbType.VarChar,20).Value = httpParameters.Digits;
                 _cmd.Parameters.Add("@StartTime" ,SqlDbType.BigInt).Value = httpParameters.StartTime;
                _cmd.Parameters.Add("@RingTime" ,SqlDbType.BigInt).Value = httpParameters.RingTIme;
                _cmd.Parameters.Add("@EndTime" ,SqlDbType.BigInt).Value = httpParameters.EndTime;
                _cmd.Parameters.Add("@RecoedURL", SqlDbType.VarChar, 100).Value = httpParameters.RecordUrl;
                _cmd.Parameters.Add("@DialBLegUUID", SqlDbType.VarChar, 100).Value = httpParameters.DialBLegUUID;
                 _cmd.Parameters.Add("@EndReason" , SqlDbType.VarChar,50).Value =httpParameters.EndReason;
                 _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = httpParameters.SequenceNumber;
                 _cmd.Parameters.Add("@HangupDisposition" , SqlDbType.VarChar,20).Value = httpParameters.HangupDisposition;
                 _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                 _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                 _cmd.Parameters.Add("@Message", SqlDbType.VarChar,1000).Direction = ParameterDirection.Output;
                 _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
                _con.Open();
                _cmd.ExecuteNonQuery();
                _con.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
               
                //if (Convert.ToBoolean(_cmd.Parameters["@Success"].Value) == true)
                //{
                //    responseXML = "<Response>" + _cmd.Parameters["@ResponseXML"].Value.ToString() + "</Response>";
                //}
                //else
                //{
                //    responseXML = "<Response><Hangup data=" + _cmd.Parameters["@Message"].Value.ToString() + "/></Response>";
                //}
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

        public string GetAgentQueueXml(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            //event play
            string agentQueueXML = "";
            try
            {
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "ConnectToAgentQueue";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = _con;

                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = httpParameters.CallUUid;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = httpParameters.ToNumber;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = httpParameters.FromNumber;
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 20).Value = httpParameters.Event;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 20).Value = httpParameters.CallStatus;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = httpParameters.SequenceNumber;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
                _con.Open();
                _cmd.ExecuteNonQuery();
                _con.Close();

                if (Convert.ToBoolean(_cmd.Parameters["@Success"].Value) == true)
                {
                    agentQueueXML = "<Response>" + _cmd.Parameters["@ResponseXML"].Value.ToString() + "</Response>";
                }
                else
                {
                    agentQueueXML = "<Response><Hangup data=" + _cmd.Parameters["@Message"].Value.ToString() + "/></Response>";
                }
            }catch(Exception ex){
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> GetAgentQueueXml , Error -->" + ex.ToString());
                agentQueueXML = "<Response><Hangup data='Server error in DataAccessLayes -->" + ex.ToString() + "'/></Response>";
            }
            finally
            {
                _cmd = null;
                if (_con.State == ConnectionState.Open) _con.Dispose();
            }

            return agentQueueXML;
        }

        public string UpdateAgentAnswerState(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            string agentAnswerStatusXml = String.Empty;
            try
            {
                _cmd = new SqlCommand();
                _con = Connection;
                _cmd.CommandText = "UpdateAgentAnswerStatus";
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
                _cmd.Parameters.Add("@EndReason", SqlDbType.VarChar, 50).Value = httpParameters.EndReason;
                _cmd.Parameters.Add("@HangupDisposition", SqlDbType.VarChar, 20).Value = httpParameters.HangupDisposition;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@ResponseXML", SqlDbType.Xml).Direction = ParameterDirection.Output;
                _con.Open();
                _cmd.ExecuteNonQuery();
                _con.Close();

            }catch(Exception ex){
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> StudioXml , Error -->" + ex.ToString());
                agentAnswerStatusXml = "<Response><Hangup data='Server error in DataAccessLayes -->" + ex.ToString() + "'/></Response>";
            }
            finally
            {
                _cmd = null;
                if (_con.State == ConnectionState.Open) _con.Dispose();
            }

            return agentAnswerStatusXml;
        }

        public DataSet GetCallerIdDetails(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            _cmd = new SqlCommand();
            _con = Connection;
            _cmd.CommandText = "GetCallerIdDetails";
            _cmd.CommandType = CommandType.StoredProcedure;
            _cmd.Connection = _con;
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = httpParameters.CallUUid;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = httpParameters.ToNumber;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = httpParameters.FromNumber;
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 20).Value = httpParameters.Event;
                _cmd.Parameters.Add("@EventTime", SqlDbType.BigInt).Value = Convert.ToInt64(httpParameters.EventTime);
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 20).Value = httpParameters.CallStatus;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                _con.Open();
                _cmd.ExecuteNonQuery();
                _con.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                _ds = null;
                _ds = null;
                Logger.Error("Error In DataAccessLayer Class-->GetStudioXml , Method --> GetCallerIdDetails , Error -->" + ex.ToString());
                
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
