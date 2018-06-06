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
    public class Manager : DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Manager(string sConstring) : base(sConstring) { }

        public DataSet GetDashboard(int accountId, int agentId, int roleId,int stdioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetManagerDashboard";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = stdioId;

                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "DashboardDetails";
                 
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
        public DataSet GetAgentsSummary(int accountId, int agentId, int roleId, Byte durationType,int agentstatus)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsSummary";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@DurationType", SqlDbType.TinyInt).Value = durationType;
                _cmd.Parameters.Add("@agentstatus", SqlDbType.Int).Value = agentstatus;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentDetails";
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
        public DataSet GetAgentsActiveOrWaitingCalls(int accountId, int agentId, int roleId, Byte statusType, Byte callType, int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsActiveOrWaitingCalls";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@StatusType", SqlDbType.TinyInt).Value = statusType;
                _cmd.Parameters.Add("@CallType", SqlDbType.TinyInt).Value = callType;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
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
        public DataSet GetAgentsAvgTalkTimeVsWaitTimeReport(int accountId, int agentId, int roleId, int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsAvgTalkTimeVsWaitTimeReport";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
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
        public DataSet GetAgentsHandleTimeByHourReport(int accountId, int agentId, int roleId,int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsHandleTimeByHourReport";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
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
        public DataSet GetAgentsCallAbondanmentByHourReport(int accountId, int agentId, int roleId,int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsCallAbondanmentByHourReport";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
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
        public DataSet GetLoggedInAgents(int accountId, int agentId, int roleId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetLoggedInAgents";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentDetails";
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
        public DataSet GetAgentLinkedSkills(int accountId, int agentId = 0)
        {
            try
            {
                _cmd = new SqlCommand(UDC.StoredProcedures.GET_AGENT_LINKED_SKILLS, Connection);
                _da = new SqlDataAdapter();
                _ds = new DataSet();
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                    _ds.Tables[0].TableName = "AgentSkills";
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception e)
            {
                ErrorMessage = e.Message;
                Logger.Error(e.ToString());
            }
            finally
            {
                _cmd = null;
                _da = null;
            }
            return _ds;
        }
        public DataSet CheckSession(int loginId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "CheckSession";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@LoginId", SqlDbType.Int).Value = loginId;
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
        public DataSet GetAgentsHistory(UDC.AgentHistory agentHistory)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsHistory";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = agentHistory.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentHistory.AgentId;
                _cmd.Parameters.Add("@SessionAgentId", SqlDbType.Int).Value = agentHistory.SessionAgentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = agentHistory.RoleId;
                _cmd.Parameters.Add("@DurationType", SqlDbType.TinyInt).Value = agentHistory.DurationType;
                _cmd.Parameters.Add("@FromDate", SqlDbType.VarChar, 30).Value = agentHistory.FromDate;
                _cmd.Parameters.Add("@ToDate", SqlDbType.VarChar, 30).Value = agentHistory.ToDate;
                _cmd.Parameters.Add("@SkillGroupId", SqlDbType.Int).Value = agentHistory.SkillGroupId;
                _cmd.Parameters.Add("@Rating", SqlDbType.TinyInt).Value = agentHistory.Rating;
                _cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = agentHistory.Index;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = agentHistory.Length;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentHistory";

                    int temp = _ds.Tables[0].Rows.Count;
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
        public DataSet GetSkillGroups(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetSkillGroups";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "SkillGroups";
                    _ds.Tables[1].TableName = "Ivr_Studios";
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
        public DataSet GetAgentProfile(int accountId, int agentId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentProfile";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentBasicDetails";
                    _ds.Tables[1].TableName = "AgentStatusChanges";
                    _ds.Tables[2].TableName = "AgentCallStatistics";
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

        public DataSet ManagerCallActions(int mode, int agentId, int accountId, int callId, int toAgentId, string callEvent)
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
                _cmd.Parameters.Add("@CallEvent", SqlDbType.VarChar, 100).Value = callEvent;
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
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet GetEmailOrSmsTemplates(int accountId, int mode, int templateId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetEmailOrSmsTemplates";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = mode;
                _cmd.Parameters.Add("@TemplateId", SqlDbType.Int).Value = templateId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Templates";
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
        public DataSet GetTimeSlotTimings(int timeSlotId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetTimeSlotTimings";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@TimeSlotId", SqlDbType.Int).Value = timeSlotId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Timings";
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

        public DataSet GetTimeSlots(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAccountTimeSlots";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TimeSlots";
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
        public DataSet AccountSettings(int accountId, string metaData, int mode)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "AccountSettingsManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Mode", SqlDbType.VarChar, -1).Value = mode;
                _cmd.Parameters.Add("@MetaData", SqlDbType.VarChar, -1).Value = metaData;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AccountSettings";
                }
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

        public DataSet SetPriorityForWaitingCalls(int callId, int priority)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "SetPriorityForWaitingCalls";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callId;
                _cmd.Parameters.Add("@Priority", SqlDbType.TinyInt).Value = priority;
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
        public DataSet GetSLAByHourReport(int accountId, int agentId, int roleId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetSLAByHourReport";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
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
        public DataSet GetGateways(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetGateways";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Gateways";
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
        public DataSet CreateOrEditGateway(UDC.Gateway gateway, DataTable rangeNumbers, DataTable individualNumbers, DataTable deletedNumbers)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageGateway";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = gateway.AccountId;
                _cmd.Parameters.Add("@GatewayId", SqlDbType.Int).Value = gateway.Id;
                _cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = gateway.Name;
                _cmd.Parameters.Add("@ServerIp", SqlDbType.VarChar, 50).Value = gateway.Ip;
                _cmd.Parameters.Add("@TotalChannels", SqlDbType.Int).Value = gateway.TotalChannels;
                _cmd.Parameters.Add("@CallerIdRanges", SqlDbType.Structured).Value = rangeNumbers;
                _cmd.Parameters.Add("@IndividualCallerIds", SqlDbType.Structured).Value = individualNumbers;
                _cmd.Parameters.Add("@DeletedCallerIds", SqlDbType.Structured).Value = deletedNumbers;
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
        public DataSet GetGatewayDetails(int accountId, int gatewayId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetGatewayDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@GatewayId", SqlDbType.Int).Value = gatewayId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Gateways";
                    _ds.Tables[1].TableName = "Numbers";
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
        public DataSet GetCallerIdNumbers(int accountId, int isAvailable, int isAssigned, string searchText)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetCallerIdNumbers";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@IsAvailable", SqlDbType.Int).Value = isAvailable;
                _cmd.Parameters.Add("@IsAssigned", SqlDbType.Int).Value = isAssigned;
                _cmd.Parameters.Add("@SearchText", SqlDbType.VarChar, 50).Value = searchText;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerIds";
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
        public DataSet UpdateCallerIdStatus(int accountId, int agentId, int statusId, int callerId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateCallerIdStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@StatusId", SqlDbType.Int).Value = statusId;
                _cmd.Parameters.Add("@CallerId", SqlDbType.Int).Value = callerId;
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
        public DataSet GetActiveAccountCallerIds(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetActiveAccountCallerIds";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerIds";
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
        public DataSet TicketPrioritiesManagement(UserDefinedClasses.Priorities prioritiesObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "TicketPrioritiesManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = prioritiesObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = prioritiesObj.AccountId;
                _cmd.Parameters.Add("@PriorityId", SqlDbType.Int).Value = prioritiesObj.PriorityId;
                _cmd.Parameters.Add("@PriorityName", SqlDbType.VarChar, 20).Value = prioritiesObj.PriorityName;
                _cmd.Parameters.Add("@PriorityValue", SqlDbType.Float).Value = prioritiesObj.PriorityValue;
                _cmd.Parameters.Add("@PriorityUnitId", SqlDbType.Int).Value = prioritiesObj.PriorityUnitId;
                _cmd.Parameters.Add("@ColorCode", SqlDbType.VarChar, 10).Value = prioritiesObj.ColorCode;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = prioritiesObj.AgentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    if (prioritiesObj.Mode == 2)
                    {
                        _ds.Tables[0].TableName = "TicketPriorities";
                        _ds.Tables[1].TableName = "TicketUnits";
                    }
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
        public DataSet ManageTicketStatuses(UserDefinedClasses.TicketStatus statusObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageTicketStatuses";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = statusObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = statusObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = statusObj.AgentId;
                _cmd.Parameters.Add("@StatusId", SqlDbType.Int).Value = statusObj.Id;
                _cmd.Parameters.Add("@Status", SqlDbType.VarChar, 20).Value = statusObj.Status;
                _cmd.Parameters.Add("@ColorCode", SqlDbType.VarChar, 10).Value = statusObj.ColorCode;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    if (statusObj.Mode == 1)
                    {
                        _ds.Tables[0].TableName = "TicketStatuses";
                    }
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
        public DataSet GetSLATypes(int accountId, byte mode, byte idSLAType)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetSLATypes";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = mode;
                _cmd.Parameters.Add("@SLATypeId", SqlDbType.TinyInt).Value = idSLAType;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "SLATypes";
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
        public DataSet GetGeneralSettings(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetGeneralSettings";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Settings";
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

        public DataSet ManageTemplates(UDC.Template templateObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageTemplates";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = templateObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = templateObj.AgentId;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = templateObj.Mode;
                _cmd.Parameters.Add("@TemplateId", SqlDbType.Int).Value = templateObj.Id;
                _cmd.Parameters.Add("@TemplateType", SqlDbType.TinyInt).Value = templateObj.TemplateType;
                _cmd.Parameters.Add("@TemplateName", SqlDbType.VarChar, 50).Value = templateObj.Name;
                _cmd.Parameters.Add("@TemplateSubject", SqlDbType.NVarChar, 200).Value = templateObj.Subject;
                _cmd.Parameters.Add("@TemplateContent", SqlDbType.NVarChar, -1).Value = templateObj.Content;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet ManageGeneralSettings(UDC.GeneralSettings generalSettingsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageGeneralSettings";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = generalSettingsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = generalSettingsObj.AgentId;
                _cmd.Parameters.Add("@SLATypeId", SqlDbType.TinyInt).Value = generalSettingsObj.SLAType;
                _cmd.Parameters.Add("@SLAThresholdInSeconds", SqlDbType.Int).Value = generalSettingsObj.ThresholdInSeconds;
                _cmd.Parameters.Add("@SLATargetPercentage", SqlDbType.Int).Value = generalSettingsObj.TargetPercentage;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = generalSettingsObj.mode;
                _cmd.Parameters.Add("@IsVoiceMail", SqlDbType.Int).Value = generalSettingsObj.IsVoiceMail;
                _cmd.Parameters.Add("@IncludeDailExtension", SqlDbType.TinyInt).Value = generalSettingsObj.DailExtension;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet ManageOutboundCommunicationSettings(UDC.OutboundCommunicationSettings settingsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageOutboundCommunicationSettings";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = settingsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = settingsObj.AgentId;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = settingsObj.Mode;
                _cmd.Parameters.Add("@IsCall", SqlDbType.Bit).Value = settingsObj.IsCall;
                _cmd.Parameters.Add("@IsSenderId", SqlDbType.Bit).Value = settingsObj.IsSenderId;
                _cmd.Parameters.Add("@CallerId", SqlDbType.Int).Value = settingsObj.CallerId;
                _cmd.Parameters.Add("@SenderId", SqlDbType.Int).Value = settingsObj.SenderId;
                _cmd.Parameters.Add("@EmailType", SqlDbType.TinyInt).Value = settingsObj.EmailType;
                _cmd.Parameters.Add("@Ip", SqlDbType.VarChar, 50).Value = settingsObj.Ip;
                _cmd.Parameters.Add("@Port", SqlDbType.Int).Value = settingsObj.Port;
                _cmd.Parameters.Add("@AWSKey", SqlDbType.VarChar, 50).Value = settingsObj.AWSKey;
                _cmd.Parameters.Add("@AWSSecret", SqlDbType.VarChar, 50).Value = settingsObj.AWSSecret;
                _cmd.Parameters.Add("@FromEmailAddress", SqlDbType.VarChar, 225).Value = settingsObj.FromEmailAddress;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet ManageSenderIds(int accountId, int agentId, DataTable senderIds)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageSenderIds";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@SenderIds", SqlDbType.Structured).Value = senderIds;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetSenderIds(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetSenderIds";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "SenderIds";
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
        public DataSet GetSkillGroupScoreCards(int accountId, int callId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetSkillGroupScoreCards";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ScoreCards";
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
        public DataSet ManageAgentScoreCards(UDC.AgentScoreCard scoresObj, DataTable scores)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageAgentScoreCards";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentScoreCardId", SqlDbType.Int).Value = scoresObj.Id;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = scoresObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = scoresObj.AgentId;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = scoresObj.CallId;
                _cmd.Parameters.Add("@ScoreCardId", SqlDbType.Int).Value = scoresObj.ScoreCardId;
                _cmd.Parameters.Add("@ScoredBy", SqlDbType.Int).Value = scoresObj.ScoredBy;
                _cmd.Parameters.Add("@Scores", SqlDbType.Structured).Value = scores;
                _cmd.Parameters.Add("@TotalScore", SqlDbType.Float).Value = scoresObj.TotalScore;
                _cmd.Parameters.Add("@OutOfScore", SqlDbType.Float).Value = scoresObj.OutOfScore;
                _cmd.Parameters.Add("@Rating", SqlDbType.Float).Value = scoresObj.Rating;
                _cmd.Parameters.Add("@Comments", SqlDbType.NVarChar, -1).Value = scoresObj.Comments;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetAccountCustomers(int accountId, string searchContacts)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAccountCustomers";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@SearchContacts", SqlDbType.NVarChar,1000).Value = searchContacts;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Customers";
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
    


        public DataSet TeamManagement(UDC.TeamManagement tmObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {

                _cmd.CommandText = "TeamManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = tmObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = tmObj.AgentId;
                _cmd.Parameters.Add("@SupervisorId", SqlDbType.Int).Value = tmObj.Supervisor_Id;
                _cmd.Parameters.Add("@AgentToAssign", SqlDbType.Int).Value =tmObj.AgentToAssign;
                _cmd.Parameters.Add("@AgentToRelease", SqlDbType.Int).Value = tmObj.AgentToRelease;
                _cmd.Parameters.Add("@mode", SqlDbType.TinyInt).Value = tmObj.Mode;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                if (tmObj.Mode == 1 || tmObj.Mode == 3)
                {
                    Connection.Open();
                    _cmd.ExecuteNonQuery();
                    Connection.Close();
                }
                else if(tmObj.Mode== 2)
                {
                    _da.SelectCommand = _cmd;
                    _da.Fill(_ds);
                    if (_ds.Tables.Count > 0)
                    {
                        _ds.Tables[0].TableName = "Unassigned_Agents";
                    }
                    if (_ds.Tables.Count > 1)
                    {
                        _ds.Tables[1].TableName = "Agents_Assigned";
                    }
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet ManageTimeSlots(UDC.TimeSlot timeSlotObj, DataTable timingsDt)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageTimeSlots";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = timeSlotObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = timeSlotObj.AgentId;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = timeSlotObj.Mode;
                _cmd.Parameters.Add("@TimeSlotId", SqlDbType.Int).Value = timeSlotObj.Id;
                _cmd.Parameters.Add("@TimeSlotName", SqlDbType.VarChar, 50).Value = timeSlotObj.Name;
                _cmd.Parameters.Add("@Timings", SqlDbType.Structured).Value = timingsDt;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetVoiceMails(UDC.VoiceMail voiceMailObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetVoiceMails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = voiceMailObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = voiceMailObj.AgentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = voiceMailObj.RoleId;
                _cmd.Parameters.Add("@AssignStatus", SqlDbType.Int).Value = voiceMailObj.AssignStatus;
                _cmd.Parameters.Add("@SkillGroupId", SqlDbType.Int).Value = voiceMailObj.SkillGroupId;
                _cmd.Parameters.Add("@FromDate", SqlDbType.VarChar, 30).Value = voiceMailObj.FromDate;
                _cmd.Parameters.Add("@ToDate", SqlDbType.VarChar, 30).Value = voiceMailObj.ToDate;
                _cmd.Parameters.Add("@CallerDetails", SqlDbType.VarChar, 100).Value = voiceMailObj.CallerDetails;
                _cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = voiceMailObj.PageNumber;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = voiceMailObj.PageSize;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = voiceMailObj.StudioId;
                _cmd.Parameters.Add("@SessionAgentId", SqlDbType.Int).Value = voiceMailObj.SessionAgentId;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;                    
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "VoiceMails";
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
        public DataSet AssignAgentToVoiceMail(int accountId, int agentId, int voiceMailId, int assignedTo)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "AssignAgentToVoiceMail";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AssignedBy", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@VoiceMailId", SqlDbType.Int).Value = voiceMailId;
                _cmd.Parameters.Add("@AssignedTo", SqlDbType.Int).Value = assignedTo;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetDashboardHeadServiceLevels(int accountId, int agentId, int roleId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetIVRWiseServiceLevels";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;



                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;

                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "SlaTable";
                    _ds.Tables[1].TableName = "MultipleIvrs";

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
        public DataSet GetTotalCallsReceivedByHour(int accountId, int agentId, int roleId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetIVRCallsCountByHour";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;



                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;

                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "MultipleIvrs";
                    _ds.Tables[1].TableName = "Maxlen";
                   

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
        public DataSet GetCallCenterPerformanceReports(int accountId, int month, int year)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetCallCenterPerformanceReports";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month;
                _cmd.Parameters.Add("@Year", SqlDbType.Int).Value = year;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
                    _ds.Tables[1].TableName = "SLAReportDetails";
                    _ds.Tables[2].TableName = "TalkTimeReportDetails";
                    _ds.Tables[3].TableName = "AbandonmentReportDetails";
                    _ds.Tables[4].TableName = "HandleTimeReportDetails";
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


        public DataSet GetAgentPerformanceReports(int accountId, int agentId, int roleId, int month, int year)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentPerformanceReports";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month;
                _cmd.Parameters.Add("@Year", SqlDbType.Int).Value = year;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentAccuTimeDetails";
                    
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

        
        public DataSet GetCallCenterTicketPerformanceReports(int accountId, int month, int year)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetCallCenterTicketPerformanceReports";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month;
                _cmd.Parameters.Add("@Year", SqlDbType.Int).Value = year;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "ReportDetails";
                    _ds.Tables[1].TableName = "ClosedReportDetails";
                    _ds.Tables[2].TableName = "DueDateClosedReportDetails";
                    _ds.Tables[3].TableName = "PriorityReportDetails";
                    _ds.Tables[4].TableName = "CategoryReportDetails";
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

        public DataSet getAgentsAvailabilityStatuses(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentsAvailabilityStatuses";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentAvailableStatuses";
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
        public int GetAccountId(int conferenceId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            int accountId = 0;
            try
            {
                _cmd.CommandText = "GetAccountId";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@ConferenceId", SqlDbType.Int).Value = conferenceId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                accountId = Convert.ToInt32(_cmd.Parameters["@AccountId"].Value);
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
            return accountId;
        }
    }
}
