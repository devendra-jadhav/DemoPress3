using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;

namespace Press3.DataAccessLayer
{
    public class Caller : DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Caller(string sConstring) : base(sConstring) { }

        public DataSet GetCallerCallHistory(int accountId, string fromNumber,int callId,int pageSize,int pageNumber)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetCallerCallHistory";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar).Value = fromNumber;
                _cmd.Parameters.Add("@CallId", SqlDbType.BigInt).Value = callId;
                _cmd.Parameters.Add("@PageSize", SqlDbType.BigInt).Value = pageSize;
                _cmd.Parameters.Add("@PageNumber", SqlDbType.BigInt).Value = pageNumber;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallHistory";
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
            }
            return _ds;
        }
        public DataSet GetCallerDetails(string fromNumber,int agentId,int mode,string detailsObj,int accountId,string name,string email,string caller_id,string callerMobile)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageCallerDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = mode;
                _cmd.Parameters.Add("@DetailsObj", SqlDbType.NVarChar, -1).Value = detailsObj;

                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;

                _cmd.Parameters.Add("@CallerId", SqlDbType.VarChar, 20).Value = caller_id;
                _cmd.Parameters.Add("@Name", SqlDbType.NVarChar, 200).Value = name;
                _cmd.Parameters.Add("@Email", SqlDbType.VarChar, 1000).Value = email;


                _cmd.Parameters.Add("@FromNumber", SqlDbType.VarChar,20).Value = fromNumber;

                //_cmd.Parameters.Add("@CallerMobile", SqlDbType.VarChar, 20).Value = fromNumber;

              
              
     
                _cmd.Parameters.Add("@CallerMobile", SqlDbType.VarChar, 20).Value = callerMobile;
                _cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerDetails";
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
            }
            return _ds;
        }
        public DataSet CallersManagement(UserDefinedClasses.Callers callsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "CallersManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = callsObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callsObj.AgentId;
                _cmd.Parameters.Add("@GroupId", SqlDbType.Int).Value = callsObj.GroupId;
                _cmd.Parameters.Add("@LabelId", SqlDbType.Int).Value = callsObj.LabelId;
                _cmd.Parameters.Add("@SearchText", SqlDbType.VarChar,100).Value = callsObj.SearchText;
                _cmd.Parameters.Add("@PageLength", SqlDbType.Int).Value = callsObj.PageLength;
                _cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = callsObj.PageIndex;
                _cmd.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@SettingsData", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@IsInCall", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerDetails";
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
            }
            return _ds;
        }
        public DataSet ManageCallerGroupsAndLabels(UserDefinedClasses.Callers callsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageCallerGroupsAndLabels";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = callsObj.Mode;

                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callsObj.AgentId;                
                _cmd.Parameters.Add("@Name", SqlDbType.VarChar, 25).Value = callsObj.Name;
                _cmd.Parameters.Add("@ColorCode", SqlDbType.VarChar, 10).Value = callsObj.ColorCode;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerGroupsDetails";
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
            }
            return _ds;
        }

        public DataSet AddCallersToGroupsOrLabels(UserDefinedClasses.Callers callsObj, int sourcegroupId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "AddCallersToGroupsOrLabels";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = callsObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callsObj.AgentId;
                _cmd.Parameters.Add("@Id", SqlDbType.BigInt).Value = callsObj.GroupId;
                _cmd.Parameters.Add("@SourceGrpId", SqlDbType.BigInt).Value = sourcegroupId;
                _cmd.Parameters.Add("@CallerIds", SqlDbType.VarChar, -1).Value = callsObj.CallerIds;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerGroupsDetails";
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
            }
            return _ds;
        }

        public DataSet AddCallersThroughExcel(int accountId, int agentId, DataTable excelData)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "AddCallersThroughExcel";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                _cmd.Parameters.Add("@ExcelData", SqlDbType.Structured).Value = excelData;
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
                throw ex;
            }
            finally
            {
                _cmd = null;
                Connection.Close();
            }
            return _ds;
        }
        public DataSet DeleteCallersManagement(UserDefinedClasses.Callers callsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageCallerGroupsAndLabels";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = callsObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callsObj.AgentId;
                _cmd.Parameters.Add("@CallerIds", SqlDbType.VarChar, 50).Value = callsObj.CallerIds;
                _cmd.Parameters.Add("@GroupId", SqlDbType.Int).Value = callsObj.GroupId;
                _cmd.Parameters.Add("@LabelId", SqlDbType.Int).Value = callsObj.LabelId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerDetails";
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
            }
            return _ds;
        }

        public DataSet EditLableAndGroups(UserDefinedClasses.Callers callsObj)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "ManageCallerGroupsAndLabels";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = callsObj.Mode;
                _cmd.Parameters.Add("@Name", SqlDbType.VarChar, 25).Value = callsObj.Name;
                _cmd.Parameters.Add("@ColorCode", SqlDbType.VarChar, 10).Value = callsObj.ColorCode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.BigInt).Value = callsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = callsObj.AgentId;
                _cmd.Parameters.Add("@GroupId", SqlDbType.Int).Value = callsObj.GroupId;
                _cmd.Parameters.Add("@LabelId", SqlDbType.Int).Value = callsObj.LabelId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerDetails";
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
            }
            return _ds;
        }

    }
}
