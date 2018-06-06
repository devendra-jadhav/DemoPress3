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
    public class Scripts : DataAccess
    {
        private SqlCommand _sqlCommand = null;
        private SqlDataAdapter _sqlDataAdapter = null;
        private DataSet _dataSet = null;

        private readonly Helper _helper = new Helper();
        public Scripts(string connectionString) : base(connectionString) { }
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
        public DataSet Create(string scriptTitle,int skillGroupId,int check,DataTable sectionTable,DataTable topicsTable,int accountId,int agentId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.CREATE_OR_EDIT_SCRIPT, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_TITLE,SqlDbType.VarChar,100).Value = scriptTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.CHECK, SqlDbType.Int).Value = check;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_DETAILS, SqlDbType.Structured).Value = sectionTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.TOPICS_DETAILS, SqlDbType.Structured).Value = topicsTable;
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
        public DataSet Script(int accountId,string scriptTitle)
        {

            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.SCRIPT, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_TITLE, SqlDbType.VarChar, 100).Value = scriptTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
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

        public DataSet Delete(int accountId,int scriptId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SCRIPT, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_ID, SqlDbType.Int).Value = scriptId;
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
        public DataSet ViewScript(int accountId,int scriptId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.VIEW_SCRIPT, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_ID, SqlDbType.Int).Value = scriptId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScriptDetails";
                    _dataSet.Tables[1].TableName = "SectionDetails";
                    _dataSet.Tables[2].TableName = "TopicDetails";
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

        public DataSet Update(int existScriptId,string scriptTitle, int skillGroupId, int check, DataTable sectionsTable, DataTable topicsTable, DataTable ExistSectionsTable, DataTable ExistTopicsTable,int accountId,int agentId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.UPDATE_SCRIPT, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId  ;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXIST_SCRIPT_ID, SqlDbType.Int).Value = existScriptId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_TITLE, SqlDbType.VarChar, 100).Value = scriptTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.CHECK, SqlDbType.Int).Value = check;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_DETAILS, SqlDbType.Structured).Value = sectionsTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.TOPICS_DETAILS, SqlDbType.Structured).Value = topicsTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXIST_SECTION_DETAILS, SqlDbType.Structured).Value = ExistSectionsTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXIST_TOPICS_DETAILS, SqlDbType.Structured).Value = ExistTopicsTable;
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

        public DataSet GetScriptsSectionsTopics(int accountId, int scriptId,int sectionId,int skillGroupId,int mode)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.SCRIPTS_DATA, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.Mode, SqlDbType.Int).Value = mode;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_ID, SqlDbType.Int).Value = scriptId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_ID, SqlDbType.Int).Value = sectionId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.DEFAULTSCRIPT, SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScriptsData";
                    if(mode == 1 || mode == 2)
                    {
                        _dataSet.Tables[1].TableName = "Sections";
                        _dataSet.Tables[2].TableName = "Topics";
                    }


                }
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

        public DataSet DeleteSection(int accountId,int scriptId, int sectionId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SECTION, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_ID, SqlDbType.Int).Value = scriptId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_ID, SqlDbType.Int).Value = sectionId;
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

        public DataSet DeleteTopic(int accountId, int sectionId,int topicId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_TOPIC, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;                
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_ID, SqlDbType.Int).Value = sectionId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.TOPIC_ID, SqlDbType.Int).Value = topicId;
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

        public DataSet UploadExcelSections(string scriptTitle,int skillGroupId,int check, DataTable Tab,int accountId,int agentId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.UPLOAD_EXCELDATA, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCRIPT_TITLE, SqlDbType.VarChar, 100).Value = scriptTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.CHECK, SqlDbType.Int).Value = check;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXCEL_DATA, SqlDbType.Structured).Value = Tab;
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
    }
}

