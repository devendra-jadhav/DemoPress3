using System;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class Calls :DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Calls(string sConstring) : base(sConstring) { }

        public DataSet GetCallHistory(UserDefinedClasses.CallHistoryDetails callDetailsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "CallHistoryReports";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.CommandTimeout = 0;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callDetailsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callDetailsObj.AgentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = callDetailsObj.RoleId;
                _cmd.Parameters.Add("@SessionAgentId", SqlDbType.Int).Value = callDetailsObj.SessionAgentId;
                _cmd.Parameters.Add("@CallDirection", SqlDbType.Int).Value = callDetailsObj.CallDirection;
                _cmd.Parameters.Add("@CallType", SqlDbType.Int).Value = callDetailsObj.CallType;
                _cmd.Parameters.Add("@SkillGroupId", SqlDbType.Int).Value = callDetailsObj.SkillGroupId;
                _cmd.Parameters.Add("@SkillId", SqlDbType.Int).Value = callDetailsObj.SkillId;
                _cmd.Parameters.Add("@Date", SqlDbType.VarChar, 100).Value = callDetailsObj.Date;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = callDetailsObj.PageSize;
                _cmd.Parameters.Add("@FromDatePicker", SqlDbType.VarChar, 100).Value = callDetailsObj.FromDate;
                _cmd.Parameters.Add("@ToDatePicker", SqlDbType.VarChar, 100).Value = callDetailsObj.ToDate;
                _cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = callDetailsObj.PageNumber;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callDetailsObj.CallId;
                _cmd.Parameters.Add("@StudioId_", SqlDbType.Int).Value = callDetailsObj.StudioId;
                _cmd.Parameters.Add("@ExcelDownload", SqlDbType.Int).Value = callDetailsObj.Exceldownload;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallHistoryReports";
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
        public DataSet GetCallHistorySearchData(int accountId, int agentId, int roleId, int skillGroupId,string searchFor)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetCallHistorySearchData";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@SkillGroupId", SqlDbType.Int).Value = skillGroupId;
                _cmd.Parameters.Add("@SearchFor", SqlDbType.VarChar, 100).Value = searchFor;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    if (searchFor == "AgentsAndSkillGroups")
                    {
                        _ds.Tables[0].TableName = "Agents";
                        _ds.Tables[1].TableName = "SkillGroups";
                        _ds.Tables[2].TableName = "Ivr_Studio_Name";
                    }
                    else if (searchFor == "Skills")
                    {
                        _ds.Tables[0].TableName = "Skills";
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
        public DataSet TransferCall(int agentId, int accountId, int callId, int toAgentId, Boolean isWarmTransfer)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            Logger.Info("TransferCall Executing with AccountId:"+accountId+",Callid:"+callId+",IsWarmTransfer:"+isWarmTransfer+",TransferAgentId:"+toAgentId);
            try
            {
                _cmd.CommandText = "TransferCall";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@ToAgentId", SqlDbType.BigInt).Value = toAgentId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@IsWarmTransfer", SqlDbType.Bit).Value = isWarmTransfer;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "GatewayInfo";
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
        public DataSet ChangeCallStatus(string status, Int32 agentId, string callId, int accountId, string action, bool isOutbound)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "ChangeCallStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Status", SqlDbType.VarChar, 50).Value = status;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@CallId", SqlDbType.VarChar, 225).Value = callId;
                _cmd.Parameters.Add("@Action", SqlDbType.VarChar, 50).Value = action;
                _cmd.Parameters.Add("@IsOutbound", SqlDbType.Bit).Value = isOutbound;
                _cmd.Parameters.Add("@CallTimeInSeconds", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@AgentFsMemberId", SqlDbType.Int).Direction = ParameterDirection.Output;
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
        public DataSet ChangeCallActions(int status,  int callId,string action, string conferenceRoom, bool isOutbound, out string confRoom, out int memberId, out string httpURL)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "ChangeCallActions";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Status", SqlDbType.TinyInt).Value = status;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@Action", SqlDbType.VarChar, 50).Value = action;
                _cmd.Parameters.Add("@InConferenceRoom", SqlDbType.VarChar, 225).Value = conferenceRoom;
                _cmd.Parameters.Add("@IsOutbound", SqlDbType.Bit).Value = isOutbound;
                _cmd.Parameters.Add("@MemberId", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@ConferenceRoom", SqlDbType.VarChar, 225).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@HTTPURL", SqlDbType.VarChar, 225).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
                confRoom = _cmd.Parameters["@ConferenceRoom"].Value.ToString();
                memberId = Convert.ToInt32(_cmd.Parameters["@MemberId"].Value.ToString());
                httpURL = _cmd.Parameters["@HTTPURL"].Value.ToString();
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

        public DataSet SubmitACW(int agentId, int callId, bool isTransfer)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "SubmitAfterCallWork";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@IsTransfer", SqlDbType.Bit).Value = isTransfer;
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
        public DataSet CallBackRequestManagement(UserDefinedClasses.CallbackRequest cbrObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "CallBackRequestManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.TinyInt).Value = cbrObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = cbrObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = cbrObj.AgentId;
                _cmd.Parameters.Add("@DialType", SqlDbType.TinyInt).Value = cbrObj.DialType;
                if(cbrObj.Mode == 1)
                {
                    _cmd.Parameters.Add("@Mobile", SqlDbType.VarChar, 15).Value = cbrObj.Mobile;
                    _cmd.Parameters.Add("@DateTime", SqlDbType.VarChar, 50).Value = cbrObj.DateTime;
                    _cmd.Parameters.Add("@Notes", SqlDbType.NVarChar, -1).Value = cbrObj.Notes;
                    _cmd.Parameters.Add("@CallerId", SqlDbType.Int).Value = cbrObj.CallerId;
                    _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = cbrObj.CallId;
                }
                else if(cbrObj.Mode == 2)
                {
                    _cmd.Parameters.Add("@CbrId", SqlDbType.Int).Value = cbrObj.CbrId;
                    _cmd.Parameters.Add("@SearchText", SqlDbType.VarChar, 50).Value = cbrObj.SearchText;
                    _cmd.Parameters.Add("@FromDate", SqlDbType.VarChar, 50).Value = cbrObj.FromDate;
                    _cmd.Parameters.Add("@ToDate", SqlDbType.VarChar, 50).Value = cbrObj.ToDate;
                    _cmd.Parameters.Add("@AssignedTo", SqlDbType.BigInt).Value = cbrObj.AssignedAgentId;
                    _cmd.Parameters.Add("@SkillGroupId", SqlDbType.Int).Value = cbrObj.SkillGroupId;
                    _cmd.Parameters.Add("@StatusId", SqlDbType.TinyInt).Value = cbrObj.StatusId;
                    _cmd.Parameters.Add("@StudioId_", SqlDbType.Int).Value = cbrObj.StudioId;
                    
                }
                _cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = cbrObj.PageNumber;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = cbrObj.PageSize;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@IsInCall", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {

                    int temp = _ds.Tables[0].Rows.Count;

                    _ds.Tables[0].TableName = "CallBackRequests";
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
        public DataSet GetCBRSearchRelatedData(int accountId, int agentId, int roleId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetCBRSearchrelatedData";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Agents";
                    _ds.Tables[1].TableName = "CallBackRequestsStatuses";
                    _ds.Tables[2].TableName = "SkillGroups";
                    _ds.Tables[3].TableName = "Ivr_Studios";
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
        public DataSet AssignCallBackRequest(int accountId,int agentId, int toAgentId,int requestId)
        {
            Logger.Info("ToagentId : ----" + toAgentId.ToString());
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "AssignCallBackRequest";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@ToAgentId", SqlDbType.Int).Value = toAgentId;
                _cmd.Parameters.Add("@RequestId", SqlDbType.Int).Value = requestId;
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
        public DataSet GetCallIdFromCallUUId(int accountId, string callUUId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetCallIdFromCallUUId";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@CallUUId", SqlDbType.VarChar, 225).Value = callUUId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@CallerNumber", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
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
        public DataSet GetIvrStudioSelectionDetails(int accountId, int callId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetIvrStudioSelectionDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@IvrSelectionDetails", SqlDbType.NVarChar, -1).Direction = ParameterDirection.Output;
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
        //public DataSet GetOutboundCallsHistory(int accountId, int agentId = 0, string fromNumber = string.Empty, string toNumber = string.Empty, Nullable<DateTime> fromDateTime = null, Nullable<DateTime> toDateTime = null)
        //{

        //}
        public DataSet MakeOutboundCall(int accountId, int agentId, int customerId, string callUUID, string customerCallUUID, bool isCustomer, int cbrId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "MakeOutboundCall";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@CustomerId", SqlDbType.BigInt).Value = customerId;
                _cmd.Parameters.Add("@CallUUID", SqlDbType.VarChar, 100).Value = callUUID;
                _cmd.Parameters.Add("@CustomerCallUUID", SqlDbType.VarChar, 100).Value = customerCallUUID;
                _cmd.Parameters.Add("@IsCustomer", SqlDbType.Bit).Value = isCustomer;
                _cmd.Parameters.Add("@CBRId", SqlDbType.Int).Value = cbrId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Calls";
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

        public DataSet GetAbandonedcalldetails(int accountId, string Date, int CallDirection, int CallType, int CallEndStatus, int agentId, int skillGroupId, string fromDate, string toDate, int PageSize, int PageNumber,int StudioId,int sessionAgentId,int roleId,int excelDownload)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAbandonedcallReports";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@SessionAgentId", SqlDbType.Int).Value = sessionAgentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = roleId;
                _cmd.Parameters.Add("@CallDirection", SqlDbType.TinyInt).Value = CallDirection;
                _cmd.Parameters.Add("@CallType", SqlDbType.TinyInt).Value = CallType;
                _cmd.Parameters.Add("@callEndStatus ", SqlDbType.TinyInt).Value = CallEndStatus;
                _cmd.Parameters.Add("@SkillGroupId", SqlDbType.BigInt).Value = skillGroupId;
                _cmd.Parameters.Add("@Date", SqlDbType.VarChar, 100).Value = Date;
                _cmd.Parameters.Add("@FromDatePicker", SqlDbType.VarChar, 100).Value = fromDate;
                _cmd.Parameters.Add("@ToDatePicker", SqlDbType.VarChar, 100).Value = toDate;
                _cmd.Parameters.Add("@ExcelDownload", SqlDbType.Int).Value = excelDownload;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = PageSize;
                _cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = PageNumber;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = StudioId;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
 
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Abandonedcalldetails";
                    _ds.Tables[1].TableName = "AgentsAssigned";
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


        public DataSet GetOutBoundCallHistory(UserDefinedClasses.CallHistoryDetails callDetailsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "OutBoundCallHistory";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callDetailsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callDetailsObj.AgentId;
                _cmd.Parameters.Add("@CallType", SqlDbType.Int).Value = callDetailsObj.CallDirection;
                _cmd.Parameters.Add("@CbrId", SqlDbType.Int).Value = callDetailsObj.CbrId;
                _cmd.Parameters.Add("@Date", SqlDbType.VarChar, 100).Value = callDetailsObj.Date;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = callDetailsObj.PageSize;
                _cmd.Parameters.Add("@FromDatePicker", SqlDbType.VarChar, 100).Value = callDetailsObj.FromDate;
                _cmd.Parameters.Add("@ToDatePicker", SqlDbType.VarChar, 100).Value = callDetailsObj.ToDate;
                _cmd.Parameters.Add("@ExcelDownload", SqlDbType.Int).Value = callDetailsObj.Exceldownload;
                _cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = callDetailsObj.PageNumber;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallHistoryReports";
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


        public DataSet UpdateCbrstatus(int agentid, int status, int cbrId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateCbrCancelStatus";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@agentid", SqlDbType.BigInt).Value = agentid;
                _cmd.Parameters.Add("@Status", SqlDbType.Int).Value = status;
                _cmd.Parameters.Add("@CbrId", SqlDbType.Int).Value = cbrId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
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

        public DataSet GetUpcomingCBR(int agentId, string cbrIds, int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetUpcomingCBR";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = 1;
                _cmd.Parameters.Add("@CbrIdStr", SqlDbType.VarChar, 200).Value = cbrIds;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "UpcomingCBR";
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
        public DataSet GetCBRreadStatus(int CbrId, int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetUpcomingCBR";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@CbrId", SqlDbType.BigInt).Value =CbrId;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = 2;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "UpcomingCBR";
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

        public DataSet GetNewCBR(int CbrId, int agentId, int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetNewCBR";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@CbrId", SqlDbType.BigInt).Value = CbrId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "UpcomingCBR";
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



        public DataSet GetTransferAndConferenceCalls(UserDefinedClasses.CallHistoryDetails callDetailsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetTranferAndConferenceCalls";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callDetailsObj.AccountId;
                _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = callDetailsObj.CallId;
                _cmd.Parameters.Add("@ConferenceCallTypeId", SqlDbType.VarChar, 8).Value = callDetailsObj.ConferenceCallTypeId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TransferAndConferenceCalls";
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
