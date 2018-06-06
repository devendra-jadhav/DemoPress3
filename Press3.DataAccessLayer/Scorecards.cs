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
    public class Scorecards :DataAccess
    { 
        private SqlCommand _sqlCommand = null;
        private SqlDataAdapter _sqlDataAdapter = null;
        private DataSet _dataSet = null;

        private readonly Helper _helper = new Helper();
        public Scorecards(string connectionString) : base(connectionString) { }

        public DataSet GetScorecards(int accountId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.GET_SCORECARDS, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScorecardDetails";
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


        public DataSet Scorecard(int accountId, string scorecardTitle)
        {

            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.SCORECARD, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_TITLE, SqlDbType.VarChar, 100).Value = scorecardTitle;
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

        public DataSet ViewScorecards(int accountId, int scorecardId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.VIEW_SCORECARD, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_ID, SqlDbType.Int).Value = scorecardId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SUCCESS, SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.MESSAGE, SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                _sqlDataAdapter = new SqlDataAdapter(_sqlCommand);
                _sqlDataAdapter.Fill(_dataSet = new DataSet());
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScorecardDetails";
                    _dataSet.Tables[1].TableName = "SectionDetails";
                    _dataSet.Tables[2].TableName = "QuestionDetails";
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

        public DataSet Create(string ScorecardTitle, int skillGroupId, DataTable sectionTable, DataTable questionsTable, int accountId, int agentId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.CREATE_OR_EDIT_SCORECARD, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_TITLE, SqlDbType.VarChar, 100).Value = ScorecardTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_DETAILS, SqlDbType.Structured).Value = sectionTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.QUESTION_DETAILS, SqlDbType.Structured).Value = questionsTable;
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

        public DataSet Delete(int accountId, int scorecardId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SCORECARD, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_ID, SqlDbType.Int).Value = scorecardId;
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


        public DataSet Update(int existScorecardId, string scorecardTitle, int skillGroupId, DataTable sectionsTable, DataTable questionsTable, DataTable ExistSectionsTable, DataTable ExistQuestionsTable, int accountId, int agentId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.UPDATE_SCORECARD, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXIST_SCORECARD_ID, SqlDbType.Int).Value = existScorecardId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_TITLE, SqlDbType.VarChar, 100).Value = scorecardTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_DETAILS, SqlDbType.Structured).Value = sectionsTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.QUESTION_DETAILS, SqlDbType.Structured).Value = questionsTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXIST_SCORECARD_SECTION_DETAILS, SqlDbType.Structured).Value = ExistSectionsTable;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.EXIST_QUESTION_DETAILS, SqlDbType.Structured).Value = ExistQuestionsTable;
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


        public DataSet UploadExcelSections(string scorecardTitle, int skillGroupId, DataTable Tab, int accountId, int agentId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.UPLOAD_SCORECARD_EXCELDATA, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.AGENT_ID, SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_TITLE, SqlDbType.VarChar, 100).Value = scorecardTitle;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SKILL_GROUP_ID, SqlDbType.Int).Value = skillGroupId;
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
   
        public DataSet DeleteSection(int accountId, int scorecardId, int sectionId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SCORECARD_SECTION, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SCORECARD_ID, SqlDbType.Int).Value = scorecardId;
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

        public DataSet DeleteQuestion(int accountId, int sectionId, int questionId)
        {
            try
            {
                _sqlCommand = new SqlCommand(UDC.StoredProcedures.DELETE_SCORECARD_QUESTION, Connection);
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.ACCOUNT_ID, SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.SECTION_ID, SqlDbType.Int).Value = sectionId;
                _sqlCommand.Parameters.Add(UDC.DataBaseParameters.QUESTION_ID, SqlDbType.Int).Value = questionId;
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

        public DataSet GetSkillGroupScoreCards(int accountId, int callId)
        {
            _sqlCommand = new SqlCommand();
            _dataSet = new DataSet();
            _sqlDataAdapter = new SqlDataAdapter();
            try
            {
                _sqlCommand.CommandText = "GetSkillGroupScoreCards";
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Connection = Connection;
                _sqlCommand.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add("@CallId", SqlDbType.Int).Value = callId;
                _sqlCommand.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlDataAdapter.SelectCommand = _sqlCommand;
                _sqlDataAdapter.Fill(_dataSet);
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScoreCards";
                }
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception ex)
            {
                Utilities.Logger.Error(ex.ToString());
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }
        public DataSet ManageAgentScoreCards(UDC.AgentScoreCard scoresObj, DataTable scores)
        {
            _sqlCommand = new SqlCommand();
            _dataSet = new DataSet();
            try
            {
                _sqlCommand.CommandText = "ManageAgentScoreCards";
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Connection = Connection;
                _sqlCommand.Parameters.Add("@AgentScoreCardId", SqlDbType.Int).Value = scoresObj.Id;
                _sqlCommand.Parameters.Add("@AccountId", SqlDbType.Int).Value = scoresObj.AccountId;
                _sqlCommand.Parameters.Add("@AgentId", SqlDbType.Int).Value = scoresObj.AgentId;
                _sqlCommand.Parameters.Add("@CallId", SqlDbType.Int).Value = scoresObj.CallId;
                _sqlCommand.Parameters.Add("@ScoreCardId", SqlDbType.Int).Value = scoresObj.ScoreCardId;
                _sqlCommand.Parameters.Add("@ScoredBy", SqlDbType.Int).Value = scoresObj.ScoredBy;
                _sqlCommand.Parameters.Add("@Scores", SqlDbType.Structured).Value = scores;
                _sqlCommand.Parameters.Add("@TotalScore", SqlDbType.Float).Value = scoresObj.TotalScore;
                _sqlCommand.Parameters.Add("@OutOfScore", SqlDbType.Float).Value = scoresObj.OutOfScore;
                _sqlCommand.Parameters.Add("@Rating", SqlDbType.Float).Value = scoresObj.Rating;
                _sqlCommand.Parameters.Add("@Comments", SqlDbType.NVarChar, -1).Value = scoresObj.Comments;
                _sqlCommand.Parameters.Add("@IsDraft", SqlDbType.Bit).Value = scoresObj.IsDraft;
                _sqlCommand.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _sqlCommand.ExecuteNonQuery();
                Connection.Close();
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception ex)
            {
                Utilities.Logger.Error(ex.ToString());
            }
            finally
            {
                _sqlCommand = null;
                Connection.Close();
            }
            return _dataSet;
        }
        public DataSet GetAgentScoreCards(int accountId, int agentId, int callId)
        {
            _sqlCommand = new SqlCommand();
            _dataSet = new DataSet();
            _sqlDataAdapter = new SqlDataAdapter();
            try
            {
                _sqlCommand.CommandText = "GetAgentScoreCards";
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Connection = Connection;
                _sqlCommand.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add("@CallId", SqlDbType.Int).Value = callId;
                _sqlCommand.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlDataAdapter.SelectCommand = _sqlCommand;
                _sqlDataAdapter.Fill(_dataSet);
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "ScoreCard";
                    _dataSet.Tables[1].TableName = "Questions";
                }
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception ex)
            {
                Utilities.Logger.Error(ex.ToString());
            }
            finally
            {
                _sqlCommand = null;
                _sqlDataAdapter = null;
            }
            return _dataSet;
        }
        public DataSet GetCallEvaluationReports(int accountId, int agentId, string fromDate, string toDate,int index,int length)
        {
            _sqlCommand = new SqlCommand();
            _dataSet = new DataSet();
            _sqlDataAdapter = new SqlDataAdapter();
            try
            {
                _sqlCommand.CommandText = "GetCallEvaluationReports";
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                _sqlCommand.Connection = Connection;
                _sqlCommand.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _sqlCommand.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _sqlCommand.Parameters.Add("@FromDate", SqlDbType.VarChar, 30).Value = fromDate;
                _sqlCommand.Parameters.Add("@ToDate", SqlDbType.VarChar, 30).Value = toDate;
                _sqlCommand.Parameters.Add("@PageNumber", SqlDbType.Int).Value = index;
                _sqlCommand.Parameters.Add("@PageSize", SqlDbType.Int).Value = length;
                _sqlCommand.Parameters.Add("@Total", SqlDbType.Int).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _sqlCommand.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _sqlDataAdapter.SelectCommand = _sqlCommand;
                _sqlDataAdapter.Fill(_dataSet);
                if (_dataSet.Tables.Count > 0)
                {
                    _dataSet.Tables[0].TableName = "Reports";
                }
                _dataSet.Tables.Add(_helper.ConvertOutputParametersToDataTable(_sqlCommand.Parameters));
            }
            catch (Exception ex)
            {
                Utilities.Logger.Error(ex.ToString());
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