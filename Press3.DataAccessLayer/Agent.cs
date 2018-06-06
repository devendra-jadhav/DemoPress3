using System;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class Agent: DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Agent(string sConstring) : base(sConstring) { }

        public DataSet AgentLogin(AgentLogin agentLoginObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "AgentAuthentication";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = agentLoginObj.Name ;
                _cmd.Parameters.Add("@Password", SqlDbType.VarChar, 225).Value = agentLoginObj.Password;
                _cmd.Parameters.Add("@IpAddress", SqlDbType.VarChar, 25).Value = agentLoginObj.IpAddress;
                _cmd.Parameters.Add("@Browser", SqlDbType.VarChar, 50).Value = agentLoginObj.Browser;
                _cmd.Parameters.Add("@IsLogout", SqlDbType.Bit).Value = agentLoginObj.IsLogout;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@LoginTime", SqlDbType.VarChar, 30).Direction = ParameterDirection.Output;
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
        
        public DataSet GetAgentGatewayDetails(int agentId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentSipGatewayDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
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
                throw;
            }
            finally
            {
                _cmd = null;
                _da = null;
            }
            return _ds;
        }
        public DataSet GetAgentScriptsAndCallSummary(int agentId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAgentScriptsAndCallSummary";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallSummary";
                    _ds.Tables[1].TableName = "AgentScripts";
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
                _cmd = null;
                _da = null;
            }
            return _ds;
        }
        public DataSet AgentLogout(Int32 loginId, Int32 agentId, Byte isAutoLogout)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "AgentLogout";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@LoginId", SqlDbType.BigInt).Value = loginId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@IsAutoLogout", SqlDbType.Bit).Value = isAutoLogout;
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
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

        public DataSet ChangeSipRegistrationStatus(int status, Int32 agentId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "ChangeSipRegistrationStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Status", SqlDbType.TinyInt).Value = status;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
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
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

        public DataSet ChangeAgentStatus(string status, Int32 agentId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "ChangeAgentStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Status", SqlDbType.VarChar, 50).Value = status;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
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
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

        public DataSet GetAvailableAgents(int accountId,int callId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetAvailableAgents";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Agents";
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
        public DataSet GetAgentStatuses(Int32 agentId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetAgentStatuses";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId",SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentStatuses";
                    _ds.Tables[1].TableName = "AgentProfilePic";
                    _ds.Tables[2].TableName = "AgnetLoginDetails";
                    if (_ds.Tables.Count > 3) {
                        _ds.Tables[3].TableName = "AgentDeviceStatus";                   
                    }
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

        public DataSet GetAgentCreationRelatedData(int accountId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {

                _cmd.CommandText = "GetAgentCreationRelatedData";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Roles";
                    _ds.Tables[1].TableName = "Managers";
                    _ds.Tables[2].TableName = "CommunicationTypes";
                    _ds.Tables[3].TableName = "AgentAccountStatus";
                    _ds.Tables[4].TableName = "GatewayNames";
                    _ds.Tables[5].TableName = "LoginType";
                    _ds.Tables[6].TableName = "OutBoundType";
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

        public DataSet AgentsManagement(UserDefinedClasses.Agent agentObj)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "AgentsManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = agentObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = agentObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentObj.Id;
                if (agentObj.Mode == 1 || agentObj.Mode == 3)
                {
                    _cmd.Parameters.Add("@FullName", SqlDbType.VarChar, 200).Value = agentObj.Name;
                    _cmd.Parameters.Add("@FirstName", SqlDbType.VarChar, 100).Value = agentObj.FirstName;
                    _cmd.Parameters.Add("@LastName", SqlDbType.VarChar, 100).Value = agentObj.LastName;
                    _cmd.Parameters.Add("@Email", SqlDbType.VarChar, 500).Value = agentObj.Email;
                    _cmd.Parameters.Add("@Mobile", SqlDbType.VarChar, 20).Value = agentObj.Mobile;
                    _cmd.Parameters.Add("@Password", SqlDbType.VarChar, 200).Value = agentObj.Password;
                    _cmd.Parameters.Add("@Role", SqlDbType.Int).Value = agentObj.RoleId;
                    _cmd.Parameters.Add("@DeviceType", SqlDbType.Int, 100).Value = agentObj.PhoneType;
                    _cmd.Parameters.Add("@AccountStatusId", SqlDbType.TinyInt).Value = agentObj.AccountStatusId;
                    _cmd.Parameters.Add("@Skills", SqlDbType.VarChar, -1).Value = agentObj.Skills;
                    _cmd.Parameters.Add("@SipUserName", SqlDbType.VarChar, 50).Value = agentObj.SipUserName;
                    _cmd.Parameters.Add("@SipUserPassword", SqlDbType.VarChar, 50).Value = agentObj.SipUserPassword;
                    _cmd.Parameters.Add("@gatewayID", SqlDbType.Int).Value = agentObj.gatewayID;
                    _cmd.Parameters.Add("@PortNumber", SqlDbType.VarChar, 20).Value = agentObj.PortNumber;
                    _cmd.Parameters.Add("@ProfileImagePath", SqlDbType.VarChar, 500).Value = agentObj.ProfileImagePath;
                    _cmd.Parameters.Add("@ReportingManagers", SqlDbType.VarChar, 500).Value = agentObj.ReportingManagerIds;
                    _cmd.Parameters.Add("@ReportingSupervisors", SqlDbType.VarChar, 500).Value = agentObj.ReportingSupervisorIds;
                    _cmd.Parameters.Add("@LoginType", SqlDbType.Int).Value = agentObj.LoginType;
                    _cmd.Parameters.Add("@OutBoundAccessType", SqlDbType.Int).Value = agentObj.OutBoundAccessType;
                }
                _cmd.Parameters.Add("@RetAgentId", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentInformation";
                }
                if (_ds.Tables.Count > 1)
                {
                    _ds.Tables[1].TableName = "AgentDeviceInformation";
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

        public DataSet UpdateProfileImage(int accountId,int agentId,string profileImagePath)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "UpdateProfileImage";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@ProfileImagePath", SqlDbType.VarChar,200).Value = profileImagePath;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentStatuses";
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

        public DataSet GetAgents(int accountId, string SearchText, int accStatusId, int agentTypeId, int deviceStatusId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetAgentsWithSkills";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@SearchText", SqlDbType.VarChar, 100).Value = SearchText;
                _cmd.Parameters.Add("@AccStatusId", SqlDbType.TinyInt).Value = accStatusId;
                _cmd.Parameters.Add("@AgentTypeId", SqlDbType.TinyInt).Value = agentTypeId;
                _cmd.Parameters.Add("@DevStatusId", SqlDbType.TinyInt).Value = deviceStatusId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentSkills";

                    _ds.Tables[1].TableName = "Supervisors";

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
        public DataSet GetProfileDetails(int agentid)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetProfileDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@agentid", SqlDbType.Int).Value=agentid;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);

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




        public DataSet CheckExtSipUnameExistance(string extSipUname, int agentId, int mode)
        {

            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "CheckExtSipUnameExistance";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = mode;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@SipUname", SqlDbType.VarChar, 100).Value = extSipUname;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar,1000).Direction = ParameterDirection.Output;
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
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        
        
        }


        public DataSet GetAgentInformation(int accountId, int agentId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetAgentStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.VarChar, 100).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "AgentInfo";
                    _ds.Tables[1].TableName = "AgentStatus";
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


        public DataSet GetStatusChangeDatewise(int accountId, int agentId,string Date)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetStatusChangeDatewise";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.VarChar, 100).Value = agentId;
                _cmd.Parameters.Add("@Date", SqlDbType.VarChar, 100).Value = Date;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                   
                   _ds.Tables[0].TableName = "AgentStatusChanges";
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



        public DataSet GetPress3Health(int accountId, int roleId, int LoginRequired, int deviceStatusId, int LoginStatus, int DeviceType)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetPress3Health";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@LoginRequired", SqlDbType.Int).Value = LoginRequired;
                _cmd.Parameters.Add("@PortalLoginStatus", SqlDbType.Int).Value = LoginStatus;
                _cmd.Parameters.Add("@DevTypeId", SqlDbType.Int).Value = DeviceType;
                _cmd.Parameters.Add("@DevStatusId", SqlDbType.Int).Value = deviceStatusId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {

                    _ds.Tables[0].TableName = "AgentSkills";
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

        public DataSet GetOpenCbrCount(int agentId,int accountId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "getOpenCbrCount";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@accountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Cbrcount", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
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

        public DataSet LoginTimePolling(int agentId, int loginId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "LoginTimePolling";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@LoginId", SqlDbType.BigInt).Value = loginId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
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
                