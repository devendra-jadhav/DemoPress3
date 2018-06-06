using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using UDC = Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class SkillGroup : DataAccess
    {
        private SqlCommand _sqlCommand = null;
        private SqlDataAdapter _sqlDataAdapter = null;
        private DataSet _dataSet = null;

        private readonly Helper _helper = new Helper();
        public SkillGroup(string connectionString) : base(connectionString) { }
       
        public DataSet GetSkillGroup(int accountId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.GET_SKILLGROUP_DETAILS, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                // _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_ID, SqlDbType.Int).Value = skillId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "SkillGroupDetails";
                    _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
                }
                }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }
        public DataSet UpdateSkillGroup(DataTable table, UDC.SkillGroup skillGroupEntity)
        {

            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.CREATE_OR_EDIT_SKILLGROUP, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = skillGroupEntity.AgentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_SKILL_IDS, SqlDbType.Structured).Value = table;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupEntity.Id;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_NAME, SqlDbType.VarChar).Value = skillGroupEntity.Name;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.DESCRIPTION, SqlDbType.VarChar).Value = skillGroupEntity.Description;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = skillGroupEntity.AccountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                //_sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                //_sqlDataAdapter.Fill(_dataSet = new DataSet());
                Connection.Open();
                _sqlCommand.ExecuteNonQuery();
                Connection.Close();
                _dataSet = new DataSet();
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
                throw;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }


        public DataSet DeleteSkillGroup(UDC.SkillGroup skillGroupEntity, int accountId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SKILLGROUP, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupEntity.Id;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
                throw;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }

        public DataSet Create(UDC.SkillGroup skillGroupEntity, DataTable table)
        {
            try
            {


                _sqlCommand = new SqlCommand(UDC.StoredProcedures.CREATE_OR_EDIT_SKILLGROUP, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = skillGroupEntity.AccountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = skillGroupEntity.AgentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_NAME, SqlDbType.VarChar, 50).Value = skillGroupEntity.Name;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_SKILL_IDS, SqlDbType.Structured).Value = table;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.DESCRIPTION, SqlDbType.VarChar, 200).Value = skillGroupEntity.Description == null ? string.Empty : skillGroupEntity.Description;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
                throw;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }
        public DataSet GetSkillGroups(int accountId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.GET_SKILLGROUPS, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                    _dataSet.Tables[0].TableName = "SkillGroups";
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }
        public DataSet GetStudioSkillGroups(int studioId)
        {
            try
            {
                _sqlCommand = new SqlCommand("GetStudioSkillGroups", Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add("@StudioId", SqlDbType.Int).Value = studioId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                    _dataSet.Tables[0].TableName = "StudioSkillGroups";
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }

        public DataSet GetScripts(int accountId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.GET_SCRIPTS, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                // _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_ID, SqlDbType.Int).Value = skillId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScriptsDetails";
                    _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                ErrorMessage = e.Message;
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }
    }
}

