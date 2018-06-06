using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using UDC = Press3.UserDefinedClasses;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Scorecards
    /// </summary>
    public class Scorecards : IHttpHandler, IRequiresSessionState
    {

       int accountId = 0;
        int agentId = 0;
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["accountId"] != null)
                {
                    accountId = Convert.ToInt32(context.Session["accountId"]);
                    agentId = Convert.ToInt32(context.Session["agentId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }

                JObject resJObj = new JObject();
                int type = Convert.ToInt32(context.Request["type"]);
                switch (type)
                {
                    case 1: //To Get ScoreCard
                        resJObj = GetScorecards(context);
                        context.Response.Write(resJObj);
                        break;
                    case 2: //Create ScoreCard
                        resJObj = Create(context);
                        context.Response.Write(resJObj);
                        break;
                    case 3: //Get ScoreCard for Validation
                        resJObj = Scorecard(context);
                        context.Response.Write(resJObj);
                        break;
                    case 4:// To Delete ScoreCard
                        resJObj = Delete(context);
                        context.Response.Write(resJObj);
                        break;
                    case 5:// To View ScoreCard
                        resJObj = ViewScorecards(context);
                        context.Response.Write(resJObj);
                        break;
                    case 6:// To Update Scorecard
                        resJObj = Update(context);
                        context.Response.Write(resJObj);
                        break;
                    case 7: // To Upload The Sections in the Excel file                    
                        resJObj = UploadExcelSections(context);
                        context.Response.Write(resJObj);
                        break;
                    case 8: // To Delete Section
                        resJObj = DeleteSection(context);
                        context.Response.Write(resJObj);
                        break;
                    case 9: //To Delete Question
                        resJObj = DeleteQuestion(context);
                        context.Response.Write(resJObj);
                        break;
                    case 10:// To get skill group score cards
                        resJObj = GetSkillGroupScoreCards(context);
                        context.Response.Write(resJObj);
                        break;
                    case 11:// To save or update agent score cards
                        resJObj = ManageAgentScoreCards(context);
                        context.Response.Write(resJObj);
                        break;
                    case 12:// To get agent score cards
                        resJObj = GetAgentScoreCards(context);
                        context.Response.Write(resJObj);
                        break;
                    case 13:// To get agent call evaluation reports
                        resJObj = GetCallEvaluationReports(context);
                        context.Response.Write(resJObj);
                        break;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }

        }
        public JObject GetScorecards(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.GetScorecards(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Create(HttpContext context)
        {
            JObject resultObj = new JObject();
            string scorecard = context.Request["data"];
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.Create(MyConfig.MyConnectionString, scorecard, accountId, agentId);

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Scorecard(HttpContext context)
        {
            JObject resultObj = new JObject();
            string scorecardTitle = context.Request["scorecardTitle"];
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.Scorecard(MyConfig.MyConnectionString, accountId, scorecardTitle);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject Delete(HttpContext context)
        {
            JObject resultObj = new JObject();
            int scorecardId = Convert.ToInt32(context.Request["scorecardid"]);
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.Delete(MyConfig.MyConnectionString, accountId, scorecardId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject ViewScorecards(HttpContext context)
        {
            JObject resultObj = new JObject();
            int scorecardId = Convert.ToInt32(context.Request["scorecardId"]);
            try
            {
                Press3.BusinessRulesLayer.Scorecards scoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = scoreObj.ViewScorecards(MyConfig.MyConnectionString, accountId, scorecardId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Update(HttpContext context)
        {
            JObject resultObj = new JObject();
            string scorecard = context.Request["data"];
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.Update(MyConfig.MyConnectionString, scorecard, accountId, agentId);

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject UploadExcelSections(HttpContext context)
        {
            JObject resultObj = new JObject();
            string fileName = context.Request["path"].ToString();
            string xlSheetData = context.Request["semidata"].ToString();
            string header = context.Request["header"];
            string scorecardTitle = context.Request["scorecardTitle"];
            int skillGroupId = Convert.ToInt32(context.Request["skillGroupId"]);
            string excelUploadPath = HttpContext.Current.Server.MapPath("~/ScorecardFileUpload/");
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.UploadExcelSections(MyConfig.MyConnectionString, excelUploadPath, fileName, xlSheetData, header, scorecardTitle, skillGroupId, accountId, agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject DeleteSection(HttpContext context)
        {
            JObject resultObj = new JObject();
            int scorecardId = Convert.ToInt32(context.Request["scorecardId"]);
            int sectionId = Convert.ToInt32(context.Request["sectionId"]);
            try
            {
                Press3.BusinessRulesLayer.Scorecards Scorebj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = Scorebj.DeleteSection(MyConfig.MyConnectionString, accountId, scorecardId, sectionId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject DeleteQuestion(HttpContext context)
        {
            JObject resultObj = new JObject();

            int sectionId = Convert.ToInt32(context.Request["sectionId"]);
            int questionId = Convert.ToInt32(context.Request["questionId"]);
            try
            {
                Press3.BusinessRulesLayer.Scorecards ScoreObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = ScoreObj.DeleteQuestion(MyConfig.MyConnectionString, accountId, sectionId, questionId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject GetSkillGroupScoreCards(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Scorecards scoreCardObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = scoreCardObj.GetSkillGroupScoreCards(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["callId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ManageAgentScoreCards(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Scorecards scoreCardObj = new Press3.BusinessRulesLayer.Scorecards();
                UDC.AgentScoreCard scoresObj = new UDC.AgentScoreCard();
                scoresObj.Id = (context.Request["agentScoreCardId"] != null && context.Request["agentScoreCardId"] != "") ? Convert.ToInt32(context.Request["agentScoreCardId"]) : 0;
                scoresObj.AccountId = accountId;
                scoresObj.AgentId = Convert.ToInt32(context.Request["agentId"]);
                scoresObj.CallId = Convert.ToInt32(context.Request["callId"]);
                scoresObj.ScoreCardId = Convert.ToInt32(context.Request["scoreCardId"]);
                scoresObj.ScoredBy = agentId;
                scoresObj.TotalScore = Convert.ToDouble(context.Request["totalScore"]);
                scoresObj.OutOfScore = Convert.ToDouble(context.Request["outOfScore"]);
                scoresObj.Rating = Convert.ToDouble(context.Request["rating"]);
                scoresObj.Comments = context.Request["comments"];
                scoresObj.Scores = context.Request["scores"];
                scoresObj.IsDraft = Convert.ToBoolean(Convert.ToInt16(context.Request["isDraft"]));
                resultObj = scoreCardObj.ManageAgentScoreCards(MyConfig.MyConnectionString, scoresObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAgentScoreCards(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Scorecards scoreCardObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = scoreCardObj.GetAgentScoreCards(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["agentId"]), Convert.ToInt32(context.Request["callId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetCallEvaluationReports(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Scorecards scoreCardObj = new Press3.BusinessRulesLayer.Scorecards();
                resultObj = scoreCardObj.GetCallEvaluationReports(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["agentId"]), context.Request["fromDate"], context.Request["toDate"], Convert.ToInt32(context.Request["index"]), Convert.ToInt32(context.Request["lenght"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}