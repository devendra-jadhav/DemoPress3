using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Supervisor
    /// </summary>
    public class Supervisor : IHttpHandler, IRequiresSessionState
    {
        public int agentId = 0;
        public int accountId = 0;
        public int loginId = 0;
        public int roleId = 0;
        public JObject sessionObj = new JObject();
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                    loginId = Convert.ToInt32(context.Session["LoginId"]);
                    roleId = Convert.ToInt32(context.Session["RoleId"]);
                    Logger.Info(context.Session["RoleId"].ToString());
                    if (context.Session["AccountId"] != null)
                        accountId = Convert.ToInt32(context.Session["AccountId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }


                try
                {
                    sessionObj = CheckSession(context);
                    if (sessionObj != null)
                    {
                        if (sessionObj.SelectToken("Success").ToString() == "False")
                        {
                            HttpContext.Current.Response.StatusCode = 406;
                            return;
                        }
                        else
                        {
                            JObject resJObj = new JObject();
                            int type = Convert.ToInt32(context.Request["type"]);
                            switch (type)
                            {
                                case 1: //  To get supervisor dashboard
                                    resJObj = GetDashboard(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 2: // To get agent and calls bulletins
                                    resJObj = GetAgentsSummary(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 3: // To get agents active and waiting calls
                                    resJObj = GetAgentsActiveOrWaitingCalls(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 4: // To get agents average Talk time vs Wait time by hour report
                                    resJObj = GetAgentsAvgTalkTimeVsWaitTimeReport(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 5: // To get agents average Handle time by hour report
                                    resJObj = GetAgentsHandleTimeByHourReport(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 6: // To get agents abondan calls by hour report
                                    resJObj = GetAgentsCallAbondanmentByHourReport(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 7: // To get agents logged in list
                                    resJObj = GetLoggedInAgents(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 8: // To get agents history
                                    resJObj = GetAgentsHistory(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 9: // To get skill groups of an account
                                    resJObj = GetSkillGroups(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 10: // To get agent profile
                                    resJObj = GetAgentProfile(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 11:
                                    resJObj = ManagerCallActions(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 12:
                                    resJObj = AccountSettings(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 13:// To set priority for waitiong calls
                                    resJObj = SetPriorityForWaitingCalls(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 14: // To get SLA by hour report
                                    resJObj = GetSLAByHourReport(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 15: // To assign agents to Supervisor
                                    resJObj = TeamManagement(context);
                                    context.Response.Write(resJObj);
                                    break;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error("Exception in Session check:" + ex.ToString());
                    throw ex;
                }

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }

        }

        private JObject TeamManagement(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObject = new Press3.BusinessRulesLayer.Manager();
                UserDefinedClasses.TeamManagement tmObj = new Press3.UserDefinedClasses.TeamManagement();
                tmObj.AgentId =  agentId;
                //context.Request["agentId"] != null ? Convert.ToInt32(context.Request["agentId"]) : 0;
                tmObj.AccountId = accountId;
                tmObj.Supervisor_Id = Convert.ToInt32(context.Request["SupervisorId"]);
                tmObj.Mode = Convert.ToInt32(context.Request["mode"]);
                tmObj.AgentToAssign = context.Request["AgentToAssign"] != null ? Convert.ToInt32(context.Request["AgentToAssign"]) : 0;
                tmObj.AgentToRelease = context.Request["AgentToRelease"] != null ? Convert.ToInt32(context.Request["AgentToRelease"]) : 0;
                responseJObj = managerObject.TeamManagement(MyConfig.MyConnectionString, tmObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return responseJObj;
        }

        private JObject AccountSettings(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObject = new Press3.BusinessRulesLayer.Manager();
                responseJObj = managerObject.AccountSettings(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["Mode"]), context.Request["MetaData"].ToString());
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return responseJObj;
        }
        private JObject ManagerCallActions(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager callsObject = new Press3.BusinessRulesLayer.Manager();
                responseJObj = callsObject.ManagerCallActions(CommonClasses.MyConfig.MyConnectionString, Convert.ToInt32(context.Request["Mode"]), agentId, accountId, Convert.ToInt32(context.Request["CallId"]), Convert.ToInt32(context.Request["ToAgentId"]), context.Request["CallEvent"].ToString());
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return responseJObj;
        }
        public JObject GetDashboard(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetDashboard(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }

        public JObject GetAgentsSummary(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentsSummary(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToByte(context.Request["durationType"]), Convert.ToInt32(context.Request["AgentStatus"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAgentsActiveOrWaitingCalls(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentsActiveOrWaitingCalls(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToByte(context.Request["statusType"]), Convert.ToByte(context.Request["callType"]), Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAgentsAvgTalkTimeVsWaitTimeReport(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentsAvgTalkTimeVsWaitTimeReport(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAgentsHandleTimeByHourReport(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentsHandleTimeByHourReport(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAgentsCallAbondanmentByHourReport(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentsCallAbondanmentByHourReport(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToInt32(context.Request["studioId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetLoggedInAgents(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetLoggedInAgents(MyConfig.MyConnectionString, accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }

        public JObject GetAgentsHistory(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                UserDefinedClasses.AgentHistory agentHistory = new UserDefinedClasses.AgentHistory();
                agentHistory.AccountId = accountId;
                agentHistory.AgentId = context.Request["agentId"] != null ? Convert.ToInt32(context.Request["agentId"]) : 0;
                agentHistory.DurationType = context.Request["durationType"] != null ? Convert.ToByte(context.Request["durationType"]) : Convert.ToByte(0);
                agentHistory.FromDate = context.Request["fromDate"];
                agentHistory.ToDate = context.Request["toDate"];
                agentHistory.SkillGroupId = context.Request["skillGroupId"] != null ? Convert.ToInt32(context.Request["skillGroupId"]) : 0;
                agentHistory.Rating = context.Request["rating"] != null ? Convert.ToByte(context.Request["rating"]) : Convert.ToByte(0);

                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentsHistory(MyConfig.MyConnectionString, agentHistory);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetSkillGroups(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetSkillGroups(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAgentProfile(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetAgentProfile(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["agentId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject SetPriorityForWaitingCalls(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.SetPriorityForWaitingCalls(MyConfig.MyConnectionString, Convert.ToInt32(context.Request["callId"]), Convert.ToInt32(context.Request["priority"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetSLAByHourReport(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetSLAByHourReport(MyConfig.MyConnectionString, accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject CheckSession(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.CheckSession(MyConfig.MyConnectionString, loginId);
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