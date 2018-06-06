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
    public class SipPhoneRegistration :DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public SipPhoneRegistration(string sConstring) : base(sConstring) { }
        public dynamic GetPassword(string sipPhoneNumber, string domain,string userPort,string userIp,string requestPort,string requestIp,string eventCallingFile)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            string sipPassword = string.Empty;
            try
            {
                _cmd.CommandText = "GetSipPhoneDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@SoftPhoneNumber", SqlDbType.VarChar,20).Value = sipPhoneNumber;
                _cmd.Parameters.Add("@Domain", SqlDbType.VarChar).Value = domain;
                _cmd.Parameters.Add("@UserPort", SqlDbType.VarChar).Value = userPort;
                _cmd.Parameters.Add("@UserIp", SqlDbType.VarChar).Value = userIp;
                _cmd.Parameters.Add("@RequestPort", SqlDbType.VarChar).Value = requestPort;
                _cmd.Parameters.Add("@RequestIp", SqlDbType.VarChar).Value = requestIp;
                _cmd.Parameters.Add("@EventCallingFile", SqlDbType.VarChar).Value = eventCallingFile;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "SipPhoneDetails";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));

                //sipPassword = "1234";
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            finally
            {
                _cmd = null;
                _da = null;
                
            }
            //return sipPassword;
            return _ds;
        }

        public dynamic UpdateOutboundCalls(Press3.UserDefinedClasses.HttpParameters restparameters)
        {
       

            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateOutboundCalls";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                //_cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId; 
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 32).Value = restparameters.FromNumber;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 32).Value = restparameters.ToNumber;
                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 64).Value = restparameters.CallUUid;
                _cmd.Parameters.Add("@EndTime", SqlDbType.BigInt).Value = restparameters.EndTime;
                _cmd.Parameters.Add("@EndReason", SqlDbType.VarChar, 30).Value = restparameters.EndReason;
                _cmd.Parameters.Add("@HangupDisPosition", SqlDbType.VarChar, 30).Value = restparameters.HangupDisposition;
                _cmd.Parameters.Add("@AnswerTime", SqlDbType.BigInt).Value = restparameters.StartTime;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.VarChar, 30).Value = restparameters.SequenceNumber;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 30).Value = restparameters.CallStatus;
                _cmd.Parameters.Add("@RingTime", SqlDbType.BigInt).Value = restparameters.RingTIme;
                _cmd.Parameters.Add("@BillMillSec", SqlDbType.VarChar, 30).Value = restparameters.BillMillSec;
                _cmd.Parameters.Add("@Event", SqlDbType.VarChar, 30).Value = restparameters.Event;
                _cmd.Parameters.Add("@EventTime", SqlDbType.VarChar, 30).Value = restparameters.Eventtimestamp;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "temp";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));

            }
            catch (Exception e)
            {
                Logger.Error("Exception while UpdateOutboundCalls :" + e.ToString());
            }
            return _ds;
        }
        public dynamic UpdateDial(Press3.UserDefinedClasses.HttpParameters parameters)
        {


            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateOutboundCalls";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.VarChar, 50).Value = parameters.SequenceNumber;
                _cmd.Parameters.Add("@EventTime", SqlDbType.BigInt).Value = parameters.Eventtimestamp;
                    //Convert.ToDateTime(parameters.EventTime);
                _cmd.Parameters.Add("@DialALegUUID", SqlDbType.VarChar, 64).Value = parameters.DialALegUUID;
                _cmd.Parameters.Add("@DialBLegUUID", SqlDbType.VarChar, 64).Value = parameters.DialBLegUUID;
                _cmd.Parameters.Add("@DialBLegStatus", SqlDbType.VarChar, 32).Value = parameters.DialBLegStatus;
                _cmd.Parameters.Add("@DialStartTime", SqlDbType.BigInt).Value = parameters.StartTime;
                _cmd.Parameters.Add("@DialEndTime", SqlDbType.BigInt).Value = parameters.EndTime;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 32).Value = parameters.CallStatus;
                _cmd.Parameters.Add("@Event", SqlDbType.VarChar, 16).Value = parameters.Event;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 32).Value = parameters.FromNumber;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar,32).Value = parameters.ToNumber;
                _cmd.Parameters.Add("@RecordUrl", SqlDbType.VarChar, 1024).Value = parameters.RecordUrl;
                _cmd.Parameters.Add("@Caller", SqlDbType.VarChar, 32).Value = parameters.Caller;
                _cmd.Parameters.Add("@Callee", SqlDbType.VarChar, 32).Value = parameters.Callee;
                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 64).Value = parameters.CallUUid;
                _cmd.Parameters.Add("@RequestUUID", SqlDbType.VarChar, 100).Value = parameters.RequestUuid;
                _cmd.Parameters.Add("@Direction", SqlDbType.Bit).Value = parameters.IsOutBound;

                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "temp";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));

            }
            catch (Exception e)
            {
                Logger.Error("Exception while UpdateOutboundCalls :" + e.ToString());
            }
            return _ds;
        }
        public dynamic GetAgentoutBoundType(string agentNumber,string agentRegIp,string toNumber)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentoutboundType";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentNumber", SqlDbType.VarChar, 50).Value = agentNumber;
                _cmd.Parameters.Add("@AgentRegIP", SqlDbType.VarChar, 30).Value = agentRegIp;
                _cmd.Parameters.Add("@DestinationNumber", SqlDbType.VarChar, 30).Value = toNumber;                
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;                
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentOutboundDetails";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));

            }catch(Exception e){
                Logger.Error("Exception while Getting Agent outbound type:"+e.ToString());
            }
            return _ds;
            
        }

        public dynamic GetResponseXml(string agentNumber, string destinationnumber, int outboundtype,int destinationNumberType,string transferfromnumber,String transfertonumber)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
               // Logger.Info("GetResponseXml initiated with agentnumber:"+agentNumber+",DestinationNumber"+destinationnumber+",outboundtype"+outboundtype+",destinationnumbertype:"+destinationNumberType+",transferfrom:"+transferfromnumber+",TransferTo:"+transfertonumber);
                _cmd.CommandText = "GetResponseXMl";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentNumber", SqlDbType.VarChar, 50).Value = agentNumber;
                _cmd.Parameters.Add("@DestinationNumber", SqlDbType.VarChar, 30).Value = destinationnumber;
                _cmd.Parameters.Add("@TransFromNumber", SqlDbType.VarChar, 30).Value = transferfromnumber;
                _cmd.Parameters.Add("@TransToNumber", SqlDbType.VarChar, 30).Value = transfertonumber;
                _cmd.Parameters.Add("@OutboundType", SqlDbType.Int).Value = outboundtype;
                _cmd.Parameters.Add("@DestinationNumberType", SqlDbType.Int).Value = destinationNumberType;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ResponseXml";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));

            }
            catch (Exception e)
            {
                Logger.Error("Exception while Getting Agent outbound type:" + e.ToString());
            }
            return _ds;

        }



        public dynamic RegisterAndUnRegisterSoftPhone(Press3.UserDefinedClasses.FreeSwitchRegisterParameters requestParam)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();            
            try
            {
                 _cmd.CommandText = "RegisterAndUnregisterSipPhone";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@SoftPhoneNumber", SqlDbType.VarChar,50).Value = requestParam.UserName;
                 _cmd.Parameters.Add("@Status", SqlDbType.VarChar,50).Value = requestParam.RegistrationStatus;
                _cmd.Parameters.Add("@CoreUuid", SqlDbType.VarChar,100).Value = requestParam.SofiaCoreUUID;
                _cmd.Parameters.Add("@EventDate", SqlDbType.VarChar,50).Value = requestParam.EventDateTime;
                _cmd.Parameters.Add("@ProfileName", SqlDbType.VarChar,50).Value = requestParam.ProfileName;
                _cmd.Parameters.Add("@Fromuser", SqlDbType.VarChar,50).Value = requestParam.FromUser;
                _cmd.Parameters.Add("@contact", SqlDbType.VarChar,100).Value = requestParam.Contact;
                _cmd.Parameters.Add("@Expires", SqlDbType.VarChar,50).Value = requestParam.Expires;
                _cmd.Parameters.Add("@Touser", SqlDbType.VarChar,50).Value = requestParam.ToUser;
                _cmd.Parameters.Add("@NeteWorkIp", SqlDbType.VarChar,50).Value = requestParam.NetworkIp;
                _cmd.Parameters.Add("@SipUserPort", SqlDbType.VarChar,50).Value = requestParam.SipUserPort;
                _cmd.Parameters.Add("@UserName", SqlDbType.VarChar,50).Value = requestParam.UserName;
                _cmd.Parameters.Add("@UserAgent", SqlDbType.VarChar,200).Value = requestParam.SipUserAgent;                
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "RegisterandUnRegister";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));

           }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            finally
            {
                _cmd = null;
                _da = null;
              //  _cmd.Dispose();
            }
            
            return _ds;
        }

        public DataSet GetDialplanXml(UDC.DialPlan dialPlanVarObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetDialplanXml";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = dialPlanVarObj.Mode;
                _cmd.Parameters.Add("@DestinationNumber", SqlDbType.VarChar, 20).Value = dialPlanVarObj.DestinationNumber;
                _cmd.Parameters.Add("@ExtensionName", SqlDbType.VarChar, 100).Value = dialPlanVarObj.ExtensionName;
                _cmd.Parameters.Add("@GatewayName", SqlDbType.VarChar, 100).Value = dialPlanVarObj.GatewayName;
                _cmd.Parameters.Add("@UserContext", SqlDbType.VarChar, 100).Value = dialPlanVarObj.UserContext;
                _cmd.Parameters.Add("@PlayFile", SqlDbType.VarChar, 500).Value = dialPlanVarObj.PlayFile;
                _cmd.Parameters.Add("@IsInBound", SqlDbType.Bit).Value = dialPlanVarObj.IsInBound;
                _cmd.Parameters.Add("@TransFrom", SqlDbType.VarChar, 500).Value = dialPlanVarObj.TransferFromNumber;
                _cmd.Parameters.Add("@TransTo", SqlDbType.VarChar, 500).Value = dialPlanVarObj.TransferToNumber;
                _cmd.Parameters.Add("@DialPlanXML", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in DAl GetDialPlanXml:" + ex.ToString());
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
