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
    public class Studio: DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Studio(string sConstring) : base(sConstring) { }

        public DataSet CreateOrUpdateStudio(UDC.Studio studio, DataTable nodesData)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "CreateOrUpdateStudio";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = studio.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = studio.AgentId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studio.Id;
                _cmd.Parameters.Add("@StudioName", SqlDbType.VarChar, 100).Value = studio.Name;
                _cmd.Parameters.Add("@StudioXml", SqlDbType.VarChar, -1).Value = studio.StudioXml;
                _cmd.Parameters.Add("@IvrStudioNodesData", SqlDbType.Structured).Value = nodesData;
                _cmd.Parameters.Add("@DeletedNodes", SqlDbType.VarChar, 1000).Value = studio.DeletedNodeIds;
                //_cmd.Parameters.Add("@IsOutbound", SqlDbType.Int).Value = studio.IsOutbound;
                //_cmd.Parameters.Add("@CallerId", SqlDbType.Int).Value = studio.CallerIdId;
                _cmd.Parameters.Add("@IsActive", SqlDbType.Int).Value = studio.IsActive;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@RetStudioId", SqlDbType.Int).Direction = ParameterDirection.Output;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetStudioDetails(int accountId, int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetStudioDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "StudioDetails";
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetStudioNodeDetails(int accountId, int studioId, int nodeId, int mode)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetStudioNodeDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@NodeId", SqlDbType.Int).Value = nodeId;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = mode;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "NodeDetails";
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetAccountCallerIds(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAccountCallerIds";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "CallerIdDetails";
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetAccountStudioPurposes(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetAccountStudioPurposes";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "StudioPurposes";
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetStudioGenericDetails(int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetStudioGenericDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "StudioDetails";
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet GetStudios(int accountId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetStudios";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "DraftStudios";
                    _ds.Tables[1].TableName = "ActiveStudios";
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet CreateOrUpdateStudioGenericDetails(UDC.Studio studio)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "CreateOrUpdateStudioGenericDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = studio.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = studio.AgentId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studio.Id;
                _cmd.Parameters.Add("@StudioName", SqlDbType.VarChar, 100).Value = studio.Name;
                _cmd.Parameters.Add("@IsOutbound", SqlDbType.Int).Value = studio.IsOutbound;
                _cmd.Parameters.Add("@CallerId", SqlDbType.Int).Value = studio.CallerIdId;
                _cmd.Parameters.Add("@StudioPurposeId", SqlDbType.Int).Value = studio.PurposeId;
                _cmd.Parameters.Add("@StudioPurpose", SqlDbType.VarChar, 1000).Value = studio.Purpose;
                _cmd.Parameters.Add("@IsActive", SqlDbType.Int).Value = studio.IsActive;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet UpdateStudioCallerIdNumber(UDC.StudioCallerId studioCallerId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "UpdateStudioCallerIdNumber";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = studioCallerId.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = studioCallerId.AgentId;
                _cmd.Parameters.Add("@AccountCallerId", SqlDbType.Int).Value = studioCallerId.Id;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioCallerId.StudioId;
                _cmd.Parameters.Add("@IsDeactive", SqlDbType.Bit).Value = studioCallerId.IsDeactive;
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
                Connection.Close();
            }
            return _ds;
        }
        public DataSet DeleteStudio(int accountId, int agentId, int studioId)
        {
            _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "DeleteStudio";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;

                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
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
                Connection.Close();
            }
            return _ds;
        }
    }
}
