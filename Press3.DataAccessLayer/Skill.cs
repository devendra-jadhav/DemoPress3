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
    public class Skill : DataAccess
    {
        private SqlCommand _sqlCommand = null;
        private SqlDataAdapter _sqlDataAdapter = null;
        private DataSet _dataSet = null;

        private readonly Helper _helper = new Helper();
        public Skill(string connectionString) : base(connectionString) { }
        public DataSet GetSkills(int accountId, int skillId = 0)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.GET_SKILL_DETAILS, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = 0;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);                
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                    _dataSet.Tables[0].TableName = "SkillDetails";
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
        public DataSet Create(UDC.Skill skillEntity)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.CREATE_OR_EDIT_SKILL, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = skillEntity.AccountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = skillEntity.AgentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_NAME, SqlDbType.VarChar, 50).Value = skillEntity.Name;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.DESCRIPTION, SqlDbType.VarChar, 200).Value = skillEntity.Description == null ? string.Empty : skillEntity.Description;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch(Exception e)
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
        public DataSet Update(UDC.Skill skillEntity)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.CREATE_OR_EDIT_SKILL, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = skillEntity.AccountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = skillEntity.AgentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_ID, SqlDbType.Int).Value = skillEntity.Id;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_NAME, SqlDbType.VarChar, 50).Value = skillEntity.Name;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.DESCRIPTION, SqlDbType.VarChar, 1000).Value = skillEntity.Description;
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
        public DataSet Delete(UDC.Skill skillEntity)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SKILL, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = skillEntity.AccountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_ID, SqlDbType.Int).Value = skillEntity.Id;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_NAME, SqlDbType.VarChar, 50).Value = skillEntity.Name;
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
                    _dataSet.Tables[0].TableName = "SkillGroupDetails";
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

        public DataSet GetSkill(int accountId, int skillId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.GET_SKILL_DETAILS, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_ID, SqlDbType.Int).Value = skillId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0) {
                    _dataSet.Tables[0].TableName = "SkillsDetails";
                    if (_dataSet.Tables.Count > 1) {
                        _dataSet.Tables[1].TableName = "SkillDetails";
                    
                    }      
                }
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
    }
}
