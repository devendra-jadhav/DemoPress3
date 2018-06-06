using Press3.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.DataAccessLayer
{
    public class Conference : DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Conference(string sConstring) : base(sConstring) { }

        public bool UpdateConferenceRequestUUID(string requestUUID, Int32 sequenceNumber)
        {
            Logger.Info("[UpdateConferenceRequestUUID] Requestuid:" + requestUUID + ",with SequenceNumber:" + sequenceNumber);
            bool response = false;
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "UpdateConferenceRequestUUID";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = sequenceNumber;
                _cmd.Parameters.Add("@RequestUUID", SqlDbType.VarChar,100).Value = requestUUID;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                return true;
            }
            catch (Exception ex)
            {
                response = false;
                Logger.Error("Exception while updating conferenceRequestUUID:"+ ex.ToString());
              //  throw;
                
            }
            finally
            {
                _cmd = null;
            }
            return response;   
        }
        public DataSet ConferenceCallByDirectExtension(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
      
            try
            {

                _cmd = new SqlCommand();
                _cmd.CommandText = "ConferenceCallByDirectExtension";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _ds = new DataSet();
                _da = new SqlDataAdapter();
                
                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = httpParameters.CallUUid;
                _cmd.Parameters.Add("@ToNumber", SqlDbType.VarChar, 20).Value = httpParameters.ToNumber;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar, 20).Value = httpParameters.FromNumber;
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 20).Value = httpParameters.Event;
                _cmd.Parameters.Add("@CallStatus", SqlDbType.VarChar, 20).Value = httpParameters.CallStatus;
                _cmd.Parameters.Add("@ConferenceDigitsMatch", SqlDbType.VarChar, 20).Value = httpParameters.ConfDigits;
                _cmd.Parameters.Add("@eventtimestamp", SqlDbType.BigInt).Value = httpParameters.Eventtimestamp;
                _cmd.Parameters.Add("@ConferenceName", SqlDbType.VarChar, 50).Value = httpParameters.ConferenceName;
                _cmd.Parameters.Add("@ConferenceAction", SqlDbType.VarChar, 50).Value = httpParameters.ConferenceAction;
                _cmd.Parameters.Add("@ConfInstanceMemberID", SqlDbType.VarChar, 100).Value = httpParameters.ConferenceMemberID;
                _cmd.Parameters.Add("@ConferenceUUID", SqlDbType.VarChar, 100).Value = httpParameters.ConferenceUUID;
                _cmd.Parameters.Add("@RequestUUID", SqlDbType.VarChar, 50).Value = httpParameters.RequestUuid;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = httpParameters.SequenceNumber;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "GatewayDetails";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }catch(Exception e){
                Logger.Error("Exception while join into conference by direct extension:"+e.ToString());
            }
            finally
            {
                _cmd = null;
                //if (_cmd.Connection.State == ConnectionState.Open) _cmd.Connection.Dispose();

            }
            return _ds;

        }

        public DataSet CheckCompleTransfer(string conferenceMemberId,string conferenceRoom,string talkingAgentRequestId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            Logger.Info("Checking is transfered agent answered or not with conference room:"+conferenceRoom+",ConferenceMemberId:"+conferenceMemberId);
            try{
             _cmd.CommandText = "CheckCompleteTransfer";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
            _cmd.Parameters.Add("@ConferenceMemberId", SqlDbType.Int).Value = Convert.ToInt32(conferenceMemberId);
            _cmd.Parameters.Add("@ConferenceRoom", SqlDbType.Int).Value = Convert.ToInt32(conferenceMemberId);
           _cmd.Parameters.Add("@TalkingAgentRequestUUID", SqlDbType.VarChar,50).Value = talkingAgentRequestId;                
            _cmd.Parameters.Add("@ConferenceMemberCount", SqlDbType.Int).Direction = ParameterDirection.Output;
            _cmd.Parameters.Add("@ConferenceMemberJoinCount", SqlDbType.Int).Direction = ParameterDirection.Output;
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
                throw;
            }
            finally
            {
                _cmd = null;
            }
            return _ds;
            
        }


        public DataSet UpdateConference(Press3.UserDefinedClasses.HttpParameters httpParameters)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();

            try
            {
                Logger.Info("httpParameters.IsCaller " + httpParameters.IsCaller.ToString() + " httpParameters.RequestUuid " + httpParameters.RequestUuid);
                _cmd.CommandText = "UpdateConference";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.Int).Value = httpParameters.SequenceNumber;
                _cmd.Parameters.Add("@MemberId", SqlDbType.Int).Value = httpParameters.ConferenceMemberID;
                _cmd.Parameters.Add("@EventTime", SqlDbType.BigInt,100).Value = httpParameters.Eventtimestamp;
                _cmd.Parameters.Add("@ConferenceAction", SqlDbType.VarChar, 30).Value = httpParameters.ConferenceAction;
                _cmd.Parameters.Add("@IsCaller", SqlDbType.Bit).Value = httpParameters.IsCaller;
                _cmd.Parameters.Add("@IsAgent", SqlDbType.Bit).Value = httpParameters.IsAgent;
                _cmd.Parameters.Add("@IsTransferAgent", SqlDbType.Bit).Value = httpParameters.IsTransferToAgent;
                _cmd.Parameters.Add("@RequestUUID", SqlDbType.VarChar,100).Value = httpParameters.RequestUuid;
                _cmd.Parameters.Add("@ConferenceRoom", SqlDbType.VarChar, 225).Value = httpParameters.ConferenceName;                
                _cmd.Parameters.Add("@ConfMembersCount", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@IsActiveAgent", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@IsPrivateVisited", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                   _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
                

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                _cmd = null;
            }
            return _ds;
        }
        public bool UpdatePrivateRoomStatus(int sequenceNumber,bool isInPrivateRoom,int callId, bool isWarmTransfer = false)
        {
            Logger.Info(string.Format("UpdatePrivateRoomStatus. SeQuenceNumber: {0}, CallId: {1}, IsPrivate: {2}", sequenceNumber, callId, isInPrivateRoom));
            bool response = false;
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "UpdatePrivateRoomStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = sequenceNumber;
                _cmd.Parameters.Add("@IsInPrivateRoom", SqlDbType.Bit).Value = isInPrivateRoom;
                _cmd.Parameters.Add("@IsWarmTransfer", SqlDbType.Bit).Value = isWarmTransfer;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());              
                response = false;
                throw;
            }
            finally
            {
                _cmd = null;
            }
            return response;
        }
        public DataSet GetCallerConferenceRoomdetails(int sequenceNumber)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetCallerConferenceRoomDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallerSequenceNumber", SqlDbType.Int).Value = sequenceNumber;
                _cmd.Parameters.Add("@RoomType", SqlDbType.Int).Direction = ParameterDirection.Output;
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
                throw;
            }
            finally
            {
                _cmd = null;
            }
            return _ds;
        }
        public DataSet StartConference(int mode,int agentId, int accountId, int callId, int toAgentId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "Conference";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@ToAgentId", SqlDbType.BigInt).Value = toAgentId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ConferenceInfo";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

        public bool UpdateConferenceMuteUnMute(Int32 sequenceNumber, bool isMute)
        {
            bool response = false;
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "UpdateConferenceMuteUnMute";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@SequenceNumber", SqlDbType.BigInt).Value = sequenceNumber;
                _cmd.Parameters.Add("@isInMute", SqlDbType.Bit).Value = isMute;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                response = true;
            }
            catch(Exception ex)
            {
                response = false;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }

            return response;
        }

        public DataSet EndConference(int agentId, int accountId, int callId,int mode)
        {
            Logger.Info("End conference is requested with agentid:" + agentId + ",AccountID:" + ",Callid:" + callId + ",Mode" + mode);
                
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "Conference";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ConferenceInfo";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in EndConference:"+ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet GetConferenceRoom(int agentId,int accountId, int callId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetConferenceRoom";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ConferenceRoomDetails";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
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
