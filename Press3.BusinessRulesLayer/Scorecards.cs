using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;
using Press3.Utilities;
using System.Data;
using System.Data.OleDb;


namespace Press3.BusinessRulesLayer
{
   public class Scorecards
    {
        private Helper _helper = null;
        public Scorecards()
        {
            _helper = new Helper();
            _helper.ResponseFormat = UDC.ResponseFormat.JSON;
            _helper.InitializeResponseVariables();
        }
        public JObject GetScorecards(string connectionString, int accountId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Scorecards ScoreObj = new DataAccessLayer.Scorecards(connectionString);
                    System.Data.DataSet ds = ScoreObj.GetScorecards(accountId);
                    if (ds == null)
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, ScoreObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject Scorecard(string connectionString, int accountId, string scorecardTitle)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Scorecards ScoreObj = new DataAccessLayer.Scorecards(connectionString);
                    System.Data.DataSet ds = ScoreObj.Scorecard(accountId, scorecardTitle);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, ScoreObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject ViewScorecards(string connectionString, int accountId, int scorecardId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Scorecards scoreObj = new DataAccessLayer.Scorecards(connectionString);
                    System.Data.DataSet ds = scoreObj.ViewScorecards(accountId, scorecardId);
                    if (ds == null)
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scoreObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject Create(string connectionString, string scorecard, int accountId, int agentId)
        {
            try
            {
                JObject jsonObj = default(JObject);
                jsonObj = new JObject();
                jsonObj = JObject.Parse(scorecard);
                string ScorecardTitle = jsonObj.SelectToken("ScorecardTitle").ToString();
                int skillGroupId = Convert.ToInt32(jsonObj.SelectToken("SkillGroupId").ToString());
                DataTable sectionsTable = new DataTable();
                sectionsTable.Columns.Add("Id", typeof(int));
                sectionsTable.Columns.Add("Name", typeof(string));
                DataTable questionsTable = new DataTable();
                questionsTable.Columns.Add("Question", typeof(string));
                questionsTable.Columns.Add("PointsForYes", typeof(string));
                questionsTable.Columns.Add("SectionId", typeof(int));
                JToken jUser = jsonObj["Sections"];
                int count = jUser.Count();
                int sectionId = 0;

                for (int i = 0; i < count; i++)
                {
                    sectionId = i + 1;
                    sectionsTable.Rows.Add(i + 1, jUser[i].SelectToken("sectionTitle").ToString());
                    JArray items = (JArray)jUser[i].SelectToken("Questions");
                    int questionsCount = items.Count();
                    for (int j = 0; j < questionsCount; j++)
                    {
                        string Question = items[j].SelectToken("Question").ToString();
                        string PointsForYes = items[j].SelectToken("PointsForYes").ToString();
                        questionsTable.Rows.Add(Question, PointsForYes, sectionId);
                    }
                }



                DataAccessLayer.Scorecards ScoreObj = new DataAccessLayer.Scorecards(connectionString);
                System.Data.DataSet ds = ScoreObj.Create(ScorecardTitle, skillGroupId, sectionsTable, questionsTable, accountId, agentId);
                if (ds.IsNull())
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, ScoreObj.ErrorMessage);
                }
                else
                    _helper.ParseDataSet(ds);

            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();

        }

        public JObject Delete(string connectionString, int accountId, int scorecardId)
        {
            try
            {
                if (scorecardId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "Scorecard is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Scorecards scoreObj = new Press3.DataAccessLayer.Scorecards(connectionString);
                    System.Data.DataSet ds = scoreObj.Delete(accountId, scorecardId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scoreObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }


        public JObject Update(string connectionString, string scorecard, int accountId, int agentId)
        {
            try
            {
                JObject jsonObj = default(JObject);
                jsonObj = new JObject();
                jsonObj = JObject.Parse(scorecard);
                int existScorecardId = Convert.ToInt32(jsonObj.SelectToken("ScorecardId").ToString());
                string scorecardTitle = jsonObj.SelectToken("ScorecardTitle").ToString();
                int skillGroupId = Convert.ToInt32(jsonObj.SelectToken("SkillGroupId").ToString());
                DataTable sectionsTable = new DataTable();
                sectionsTable.Columns.Add("Id", typeof(int));
                sectionsTable.Columns.Add("Name", typeof(string));
                DataTable questionsTable = new DataTable();
                questionsTable.Columns.Add("Title", typeof(string));
                questionsTable.Columns.Add("PointsForYes", typeof(int));
                questionsTable.Columns.Add("SectionId", typeof(int));
                JToken jUser = jsonObj["Sections"];
                int count = jUser.Count();
                int sectionId = 0;

                for (int i = 0; i < count; i++)
                {
                    sectionId = i + 1;
                    sectionsTable.Rows.Add(i + 1, jUser[i].SelectToken("sectionTitle").ToString());
                    JArray items = (JArray)jUser[i].SelectToken("Questions");
                    int questionsCount = items.Count();
                    for (int j = 0; j < questionsCount; j++)
                    {
                        string title = items[j].SelectToken("Title").ToString();
                        string pointsForYes = items[j].SelectToken("PointsForYes").ToString();
                        questionsTable.Rows.Add(title, pointsForYes, sectionId);
                    }
                }


                DataTable ExistSectionsTable = new DataTable();
                ExistSectionsTable.Columns.Add("Id", typeof(int));
                ExistSectionsTable.Columns.Add("Name", typeof(string));
                ExistSectionsTable.Columns.Add("ScorecardId", typeof(int));
                DataTable ExistQuestionsTable = new DataTable();
                ExistQuestionsTable.Columns.Add("QuestionId", typeof(string));
                ExistQuestionsTable.Columns.Add("Title", typeof(string));
                ExistQuestionsTable.Columns.Add("PointsForYes", typeof(int));
                ExistQuestionsTable.Columns.Add("SectionId", typeof(int));
                JToken jUserExist = jsonObj["ExistingSections"];
                int countExist = jUserExist.Count();


                for (int i = 0; i < countExist; i++)
                {
                    sectionId = Convert.ToInt32(jUserExist[i].SelectToken("sectionId").ToString());
                    ExistSectionsTable.Rows.Add(Convert.ToInt32(jUserExist[i].SelectToken("sectionId").ToString()), jUserExist[i].SelectToken("sectionTitle").ToString(), existScorecardId);
                    JArray itemsExist = (JArray)jUserExist[i].SelectToken("Questions");
                    int questionCountExist = itemsExist.Count();
                    for (int j = 0; j < questionCountExist; j++)
                    {

                        string questionId = itemsExist[j].SelectToken("QuestionId").ToString();
                        string title = itemsExist[j].SelectToken("Title").ToString();
                        int PointsForYes = Convert.ToInt32(itemsExist[j].SelectToken("PointsForYes").ToString());
                        ExistQuestionsTable.Rows.Add(questionId, title, PointsForYes, sectionId);
                    }

                }


                DataAccessLayer.Scorecards ScoreObj = new DataAccessLayer.Scorecards(connectionString);
                System.Data.DataSet ds = ScoreObj.Update(existScorecardId, scorecardTitle, skillGroupId, sectionsTable, questionsTable, ExistSectionsTable, ExistQuestionsTable, accountId, agentId);
                if (ds.IsNull())
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, ScoreObj.ErrorMessage);
                }
                else
                    _helper.ParseDataSet(ds);
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();

        }


        public JObject DeleteSection(string connectionString, int accountId, int scorecardId, int sectionId)
        {
            try
            {
                if (sectionId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "sectionId is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Scorecards scoreObj = new Press3.DataAccessLayer.Scorecards(connectionString);
                    System.Data.DataSet ds = scoreObj.DeleteSection(accountId, scorecardId, sectionId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scoreObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject DeleteQuestion(string connectionString, int accountId, int sectionId, int questionId)
        {
            try
            {
                if (questionId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "QuestionId is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Scorecards scoreObj = new Press3.DataAccessLayer.Scorecards(connectionString);
                    System.Data.DataSet ds = scoreObj.DeleteQuestion(accountId, sectionId, questionId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scoreObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject UploadExcelSections(string connectionString, string excelUploadPath, string fileName, string xlSheetData, string header, string scorecardTitle, int skillGroupId, int accountId, int agentId)
        {
            JObject jObj = new JObject();
            try
            {
                if (header == "1")
                {
                    header = "Yes";
                }
                else
                {
                    header = "No";
                }

                jObj = JObject.Parse(xlSheetData);
                string extension = System.IO.Path.GetExtension(fileName);
                JArray sheetArray = new JArray();
                sheetArray = jObj.SelectToken("data") as JArray;
                DataTable table = new DataTable();
                table.Columns.Add("sheetname", typeof(string));
                table.Columns.Add("columns", typeof(int));
                table.Columns.Add("section", typeof(string));
                table.Columns.Add("question", typeof(string));
                table.Columns.Add("pointsForYes", typeof(string));
                foreach (JObject _sheet in sheetArray)
                {
                    object[] val = new object[5];
                    val[0] = _sheet.SelectToken("sheetname").ToString();
                    val[1] = _sheet.SelectToken("columnscount").ToString();
                    val[2] = _sheet.SelectToken("section").ToString();
                    val[3] = _sheet.SelectToken("question").ToString();
                    val[4] = _sheet.SelectToken("pointsForYes").ToString();
                    table.Rows.Add(val);
                }
                string excelOleDbConstring = "";
                OleDbConnection oleDbCon = default(OleDbConnection);
                oleDbCon = null;
                if (extension == ".xlsx")
                {
                    excelOleDbConstring = excelOleDbConstring + "provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + excelUploadPath + fileName + ";Persist Security Info=True; Extended Properties=\"Excel 12.0;HDR=" + header + ";IMEX=1;\"";
                }
                else if (extension == ".xls")
                {
                    excelOleDbConstring = excelOleDbConstring + "provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + excelUploadPath + fileName + ";Persist Security Info=True; Extended Properties=\"Excel 8.0;HDR=" + header + ";IMEX=1;\"";
                }

                oleDbCon = new OleDbConnection(excelOleDbConstring);
                //oleDbCon = New OleDbConnection(excelOleDbConstring)
                OleDbCommand OleCmdSelect = null;
                OleDbDataAdapter OleAdapter = null;
                DataSet dSet = null;
                int secP = 0;
                int quesP = 0;
                int PointsP = 0;

                JObject objectj = new JObject();

                int ColumnsCount = 0;
                string section = "", question = "";
                string pointsforyes = "";
                DataTable Tab = new DataTable();

                Tab.Columns.Add("section", typeof(string));
                Tab.Columns.Add("question", typeof(string));
                Tab.Columns.Add("pointsForYes", typeof(string));
                for (int k = 0; k <= table.Rows.Count - 1; k++)
                {
                    OleAdapter = null;
                    dSet = null;
                    OleCmdSelect = new OleDbCommand("SELECT   *  FROM [" + table.Rows[k]["sheetname"] + "$]", oleDbCon);
                    OleAdapter = new OleDbDataAdapter(OleCmdSelect);
                    dSet = new DataSet();
                    OleAdapter.Fill(dSet);
                    secP = 0;
                    quesP = 0;
                    PointsP = 0;
                    //CountryCodeP = 0;
                    section = "";
                    question = "";
                    pointsforyes = "";
                    //countryC = "";
                    if (dSet.Tables[0].Columns.Count >= 2)
                    {
                        var _with1 = dSet.Tables[0];
                        ColumnsCount = dSet.Tables[0].Columns.Count;
                        secP = Convert.ToInt32(table.Rows[k]["section"]);
                        quesP = Convert.ToInt32(table.Rows[k]["question"]);
                        PointsP = Convert.ToInt32(table.Rows[k]["pointsForYes"]);

                    }
                    string sectionName = "";
                    foreach (DataRow _Row in dSet.Tables[0].Rows)
                    {

                        if (secP != 0)
                        {
                            section = _Row[secP - 1].ToString();
                            if (section != "")
                            {
                                sectionName = section;
                            }
                        }


                        if (quesP != 0)
                        {
                            question = _Row[quesP - 1].ToString();

                        }
                        if (PointsP != 0)
                        {
                         string temp = _Row[PointsP - 1].ToString();
                            int a;
                            if (Int32.TryParse(temp, out a))
                            {
                                pointsforyes = _Row[PointsP - 1].ToString();
                            }
                            else
                            {
                                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                                _helper.CreateProperty(UDC.Label.MESSAGE, "point for yes should be numeric only.");
                                return _helper.GetResponse();
                                
                            }
                        }

                        if ((section != "" || section == "") && question != "" && pointsforyes != "")
                        {
                            if (section != "")
                            {
                                Tab.Rows.Add(section.Trim(), question.Trim(), pointsforyes.Trim());
                            }
                            else
                                Tab.Rows.Add(sectionName, question.Trim(), pointsforyes.Trim());

                        }

                    }
                }
                Press3.DataAccessLayer.Scorecards scoreObj = new Press3.DataAccessLayer.Scorecards(connectionString);
                System.Data.DataSet ds = scoreObj.UploadExcelSections(scorecardTitle, skillGroupId, Tab, accountId, agentId);
                if (ds.IsNull())
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, scoreObj.ErrorMessage);
                }
                else
                {
                    _helper.ParseDataSet(ds);
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject GetSkillGroupScoreCards(String connection, int accountId, int callId)
        {
            try
            {
                Press3.DataAccessLayer.Scorecards scoreCardObj = new Press3.DataAccessLayer.Scorecards(connection);
                DataSet ds = scoreCardObj.GetSkillGroupScoreCards(accountId, callId);
                if (ds == null)
                {
                    _helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    _helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetSkillGroupScoreCards " + ex.ToString());
            }
            return _helper.GetResponse();
        }
        public JObject ManageAgentScoreCards(String connection, UDC.AgentScoreCard scoresObj)
        {
            try
            {
                Press3.DataAccessLayer.Scorecards scoreCardObj = new Press3.DataAccessLayer.Scorecards(connection);

                JArray scoresArray = JArray.Parse(scoresObj.Scores);
                DataTable scoresDt = new DataTable();
                scoresDt.Columns.Add("QuestionId", typeof(int));
                scoresDt.Columns.Add("Answer", typeof(int));
                for (int i = 0; i <= scoresArray.Count - 1; i++)
                {
                    scoresDt.Rows.Add(scoresArray[i].SelectToken("QuestionId").ToString(), scoresArray[i].SelectToken("Answer").ToString());
                }

                DataSet ds = scoreCardObj.ManageAgentScoreCards(scoresObj, scoresDt);
                if (ds == null)
                {
                    _helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    _helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageAgentScoreCards " + ex.ToString());
            }
            return _helper.GetResponse();
        }
        public JObject GetAgentScoreCards(String connection, int accountId, int agentId, int callId)
        {
            try
            {
                Press3.DataAccessLayer.Scorecards scoreCardObj = new Press3.DataAccessLayer.Scorecards(connection);
                DataSet ds = scoreCardObj.GetAgentScoreCards(accountId, agentId, callId);
                if (ds == null)
                {
                    _helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    _helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentScoreCards " + ex.ToString());
            }
            return _helper.GetResponse();
        }
        public JObject GetCallEvaluationReports(String connection, int accountId, int agentId, string fromDate, string toDate,int index,int length)
        {
            try
            {
                Press3.DataAccessLayer.Scorecards scoreCardObj = new Press3.DataAccessLayer.Scorecards(connection);
                DataSet ds = scoreCardObj.GetCallEvaluationReports(accountId, agentId, fromDate, toDate,index,length);
                if (ds == null)
                {
                    _helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    _helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetCallEvaluationReports " + ex.ToString());
            }
            return _helper.GetResponse();
        }
   }
}
   
