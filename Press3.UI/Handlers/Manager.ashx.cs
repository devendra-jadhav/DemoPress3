using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Manager
    /// </summary>
    public class Manager : IHttpHandler, IRequiresSessionState
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
                    //context.Response.Write(sessionObj);
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
                                case 1: //  To get manager dashboard
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
                                case 14:// To get gateways
                                    resJObj = GetGateways(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 15:// create or edit gateways
                                    resJObj = CreateOrEditGateway(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 16:// To get individual gateway details
                                    resJObj = GetGatewayDetails(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 17:// To get all callerid numbers based on assigned and available status
                                    resJObj = GetCallerIdNumbers(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 18:// Update callerid number status
                                    resJObj = UpdateCallerIdStatus(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 19:// To get active account callerids
                                    resJObj = GetActiveAccountCallerIds(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 20:// 
                                    resJObj = TicketPrioritiesManagement(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 21:// To save or update ticket statuses
                                    resJObj = ManageTicketStatuses(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 22:// To get SLA types
                                    resJObj = GetSLATypes(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 23:// To get general settings
                                    resJObj = GetGeneralSettings(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 24:// To save or update templates
                                    resJObj = ManageTemplates(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 25:// To save or update general settings
                                    resJObj = ManageGeneralSettings(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 26:// To save or update outbound communication settings
                                    resJObj = ManageOutboundCommunicationSettings(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 27:// To save or update SenderIds
                                    resJObj = ManageSenderIds(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 28:// To get SenderIds
                                    resJObj = GetSenderIds(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 29:// To get skill group score cards
                                    resJObj = GetSkillGroupScoreCards(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 30:// To save or update agent score cards
                                    resJObj = ManageAgentScoreCards(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 31:// To get manager dashboard counts for websocket
                                    resJObj = ManagerDashBoardCounts(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 32:// To get account customers
                                    resJObj = GetAccountCustomers(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 33:// To save or update time slots
                                    resJObj = ManageTimeSlots(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 34:// To get voice mails
                                    resJObj = GetVoiceMails(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 35:// Update assignee to the voice mail
                                    resJObj = AssignAgentToVoiceMail(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 36:// Update assignee to the voice mail
                                    resJObj = GetDashboardHeadServiceLevels(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 37:// Update assignee to the voice mail
                                    resJObj = GetTotalCallsReceivedByHour(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 38:// Get call center performance reports
                                    resJObj = GetCallCenterPerformanceReports(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 39:// Get agent performance reports
                                    resJObj = GetAgentPerformanceReports(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 40:// Get call center ticket performance reports
                                    resJObj = GetCallCenterTicketPerformanceReports(context);
                                    context.Response.Write(resJObj);
                                    break;
                                case 41:// Get call center ticket performance reports
                                    resJObj = getAgentsAvailabilityStatuses(context);
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

        private JObject getAgentsAvailabilityStatuses(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                responseJObj = managerObj.getAgentsAvailabilityStatuses(MyConfig.MyConnectionString, accountId);
                
            }
            catch (Exception ex)
            {
                responseJObj.Add(new JProperty("Success", "False"));
                Logger.Error(ex.ToString());
                throw ex;
            }
            return responseJObj;
        }

        private JObject ManageTimeSlots(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                UserDefinedClasses.TimeSlot timeSlot = new UserDefinedClasses.TimeSlot();
                timeSlot.AccountId = accountId;
                timeSlot.AgentId = agentId;
                timeSlot.Mode = context.Request["mode"] != "" ? Convert.ToByte(context.Request["mode"]) : Convert.ToByte(0);
                timeSlot.Id = (context.Request["timeSlotId"] != null && context.Request["timeSlotId"] != "") ? Convert.ToInt32(context.Request["timeSlotId"]) : 0;
                timeSlot.Name = context.Request["timeSlotName"];
                timeSlot.TimeSlotTimings = context.Request["timeSlotTimings"];

                Press3.BusinessRulesLayer.Manager managerObject = new Press3.BusinessRulesLayer.Manager();
                responseJObj = managerObject.ManageTimeSlots(MyConfig.MyConnectionString, timeSlot);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return responseJObj;
        }
        private JObject ManagerDashBoardCounts(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.StudioControllerV1 studioObject = new Press3.BusinessRulesLayer.StudioControllerV1();
                studioObject.ManagerDashBoardCounts(MyConfig.MyConnectionString, accountId);
                responseJObj.Add(new JProperty("Success", "True"));
            }
            catch (Exception ex)
            {
                responseJObj.Add(new JProperty("Success", "False"));
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
                agentHistory.Rating = context.Request["rating"] != null ? Convert.ToDouble(context.Request["rating"]) : Convert.ToDouble(0);
                agentHistory.Index = context.Request["index"] != null ? Convert.ToInt32(context.Request["index"]) : 1;
                agentHistory.Length = context.Request["length"] != null ? Convert.ToInt32(context.Request["length"]) : 7;
                agentHistory.SessionAgentId = agentId;
                agentHistory.RoleId = roleId;

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
        public JObject GetGateways(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetGateways(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }

        public JObject CreateOrEditGateway(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                UDC.Gateway gatewayObj = new UDC.Gateway();
                gatewayObj.AccountId = accountId;
                gatewayObj.Id = (context.Request["gatewayId"] != null && context.Request["gatewayId"] != "") ? Convert.ToInt32(context.Request["gatewayId"]) : 0;
                gatewayObj.Name = context.Request["gatewayName"];
                gatewayObj.Ip = context.Request["serverIp"];
                gatewayObj.RangeCallerIds = context.Request["rangeCallerIds"];
                gatewayObj.IndividualCallerIds = context.Request["individualCallerIds"];
                gatewayObj.DeletedCallerIds = context.Request["deletedCallerIds"];
                gatewayObj.TotalChannels = Convert.ToInt32(context.Request["totalChannels"]);

                resultObj = managerObj.CreateOrEditGateway(MyConfig.MyConnectionString, gatewayObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetGatewayDetails(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetGatewayDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["gatewayId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetCallerIdNumbers(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetCallerIdNumbers(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["availableStatus"]),
                    Convert.ToInt32(context.Request["assignedStatus"]), context.Request["searchText"]
                    );
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject UpdateCallerIdStatus(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.UpdateCallerIdStatus(MyConfig.MyConnectionString, accountId, agentId, Convert.ToInt32(context.Request["statusId"]),
                    Convert.ToInt32(context.Request["callerId"])
                    );
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetActiveAccountCallerIds(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetActiveAccountCallerIds(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject TicketPrioritiesManagement(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.UserDefinedClasses.Priorities prioritiesObj = new Press3.UserDefinedClasses.Priorities();
                prioritiesObj.Mode = Convert.ToInt32(context.Request["mode"]);
                prioritiesObj.AccountId = accountId;
                prioritiesObj.PriorityId = Convert.ToInt32(context.Request["PriorityId"]);
                prioritiesObj.PriorityName = context.Request["PriorityName"].ToString();
                prioritiesObj.PriorityUnitId = Convert.ToInt32(context.Request["PriorityUnitId"]);
                prioritiesObj.PriorityValue = Convert.ToDecimal(context.Request["PriorityValue"]);
                prioritiesObj.ColorCode = context.Request["ColorCode"].ToString();
                prioritiesObj.AgentId = agentId;
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.TicketPrioritiesManagement(MyConfig.MyConnectionString, prioritiesObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ManageTicketStatuses(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.UserDefinedClasses.TicketStatus statusesObj = new Press3.UserDefinedClasses.TicketStatus();
                statusesObj.Mode = Convert.ToByte(context.Request["mode"]);
                statusesObj.AccountId = accountId;
                statusesObj.AgentId = agentId;
                statusesObj.Id = (context.Request["statusId"] != null && context.Request["statusId"] != "") ? Convert.ToInt32(context.Request["statusId"]) : 0;
                statusesObj.Status = context.Request["status"];
                statusesObj.ColorCode = context.Request["colorCode"];
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.ManageTicketStatuses(MyConfig.MyConnectionString, statusesObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetSLATypes(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetSLATypes(MyConfig.MyConnectionString, accountId, Convert.ToByte(context.Request["mode"]), Convert.ToByte(context.Request["idSLAType"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetGeneralSettings(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetGeneralSettings(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ManageTemplates(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                UDC.Template templateObj = new UDC.Template();
                templateObj.Id = (context.Request["templateId"] != null && context.Request["templateId"] != "") ? Convert.ToInt32(context.Request["templateId"]) : 0;
                templateObj.AccountId = accountId;
                templateObj.AgentId = agentId;
                templateObj.Mode = Convert.ToByte(context.Request["mode"]);
                templateObj.Name = context.Request["templateName"];
                templateObj.Subject = context.Request["templateSubject"];
                templateObj.Content = context.Request["templateContent"];
                templateObj.TemplateType = (context.Request["templateType"] != null && context.Request["templateType"] != "") ? Convert.ToByte(context.Request["templateType"]) : Convert.ToByte(0);
                resultObj = managerObj.ManageTemplates(MyConfig.MyConnectionString, templateObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ManageGeneralSettings(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                UDC.GeneralSettings generalSettingsObj = new UDC.GeneralSettings();
                generalSettingsObj.AccountId = accountId;
                generalSettingsObj.AgentId = agentId;
                generalSettingsObj.mode = Convert.ToByte(context.Request["mode"]);
                generalSettingsObj.SLAType = Convert.ToByte(context.Request["typeofSLA"]);
                generalSettingsObj.ThresholdInSeconds = Convert.ToInt32(context.Request["thresholdInSeconds"]);
                generalSettingsObj.TargetPercentage = Convert.ToInt32(context.Request["targetPercentage"]);
                generalSettingsObj.IsVoiceMail = Convert.ToBoolean(Convert.ToInt16(context.Request["isVoiceMail"]));
                generalSettingsObj.DailExtension = Convert.ToByte(context.Request["dailExtension"]);
                resultObj = managerObj.ManageGeneralSettings(MyConfig.MyConnectionString, generalSettingsObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ManageOutboundCommunicationSettings(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                UDC.OutboundCommunicationSettings settingsObj = new UDC.OutboundCommunicationSettings();
                settingsObj.AccountId = accountId;
                settingsObj.AgentId = agentId;
                settingsObj.Mode = Convert.ToByte(context.Request["mode"]);
                settingsObj.CallerId = (context.Request["callerId"] != null && context.Request["callerId"] != "") ? Convert.ToInt32(context.Request["callerId"]) : 0;
                settingsObj.SenderId = (context.Request["senderId"] != null && context.Request["senderId"] != "") ? Convert.ToInt32(context.Request["senderId"]) : 0;
                settingsObj.IsCall = (context.Request["isCall"] != null && context.Request["isCall"] != "") ? Convert.ToBoolean(Convert.ToInt32(context.Request["isCall"])) : Convert.ToBoolean(0);
                settingsObj.IsSenderId = (context.Request["isSenderId"] != null && context.Request["isSenderId"] != "") ? Convert.ToBoolean(Convert.ToInt32(context.Request["isSenderId"])) : Convert.ToBoolean(0);
                settingsObj.EmailType = (context.Request["emailType"] != null && context.Request["emailType"] != "") ? Convert.ToByte(context.Request["emailType"]) : Convert.ToByte(0);
                settingsObj.Ip = context.Request["ip"];
                settingsObj.Port = Convert.ToInt32(context.Request["port"]);
                settingsObj.AWSKey = context.Request["keyAWS"];
                settingsObj.AWSSecret = context.Request["secretAWS"];
                settingsObj.FromEmailAddress = context.Request["fromEmailAddress"];
                resultObj = managerObj.ManageOutboundCommunicationSettings(MyConfig.MyConnectionString, settingsObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject ManageSenderIds(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.ManageSenderIds(MyConfig.MyConnectionString, accountId, agentId, context.Request["senderIds"]);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetSenderIds(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetSenderIds(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetSkillGroupScoreCards(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetSkillGroupScoreCards(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["callId"]));
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
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
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
                resultObj = managerObj.ManageAgentScoreCards(MyConfig.MyConnectionString, scoresObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject GetAccountCustomers(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                string searchcontacts = (context.Request["SearchText"] != null && context.Request["SearchText"] != "") ? context.Request["SearchText"]: "";
                resultObj = managerObj.GetAccountCustomers(MyConfig.MyConnectionString, accountId, searchcontacts);
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

        public JObject GetVoiceMails(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                UDC.VoiceMail voiceMailObj = new UDC.VoiceMail();
                voiceMailObj.AccountId = accountId;
                if (Convert.ToInt32(context.Session["RoleId"]) == 1)
                {
                    voiceMailObj.AgentId = agentId;
                }
                else
                {
                    voiceMailObj.AgentId = Convert.ToInt32(context.Request["AgentId"]);
                }

                voiceMailObj.SessionAgentId = agentId;
                voiceMailObj.RoleId = roleId;
                voiceMailObj.AssignStatus = (context.Request["assignStatus"] != null && context.Request["assignStatus"] != "") ? Convert.ToInt32(context.Request["assignStatus"]) : 0;
                voiceMailObj.SkillGroupId = (context.Request["skillGroupId"] != null && context.Request["skillGroupId"] != "") ? Convert.ToInt32(context.Request["skillGroupId"]) : 0;
                voiceMailObj.FromDate = context.Request["fromDate"]; 
                voiceMailObj.ToDate = context.Request["toDate"];
                voiceMailObj.CallerDetails = context.Request["callerDetails"];
                voiceMailObj.PageNumber = (context.Request["index"] != null && context.Request["index"] != "") ? Convert.ToInt32(context.Request["index"]) : 1;
                voiceMailObj.PageSize = (context.Request["length"] != null && context.Request["length"] != "") ? Convert.ToInt32(context.Request["length"]) : 10;
                voiceMailObj.StudioId = (context.Request["StudioId"] != null && context.Request["StudioId"] != "") ? Convert.ToInt32(context.Request["StudioId"]) : 0;
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetVoiceMails(MyConfig.MyConnectionString, voiceMailObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        public JObject AssignAgentToVoiceMail(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.AssignAgentToVoiceMail(MyConfig.MyConnectionString, accountId, agentId, Convert.ToInt32(context.Request["voiceMailId"]), Convert.ToInt32(context.Request["assignedTo"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
        private JObject GetDashboardHeadServiceLevels(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetDashboardHeadServiceLevels(MyConfig.MyConnectionString, accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
         private JObject GetTotalCallsReceivedByHour(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.GetTotalCallsReceivedByHour(MyConfig.MyConnectionString, accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return resultObj;
        }
         public JObject GetCallCenterPerformanceReports(HttpContext context)
         {
             JObject resultObj = new JObject();
             try
             {
                 Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                 resultObj = managerObj.GetCallCenterPerformanceReports(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["month"]), Convert.ToInt32(context.Request["year"]));
             }
             catch (Exception ex)
             {
                 Logger.Error(ex.ToString());
                 throw ex;
             }
             return resultObj;
         }
         public JObject GetAgentPerformanceReports(HttpContext context)
         {
             JObject resultObj = new JObject();
             try
             {
                 Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                 resultObj = managerObj.GetAgentPerformanceReports(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["agentsId"]), Convert.ToInt32(context.Request["roleId"]), Convert.ToInt32(context.Request["month"]), Convert.ToInt32(context.Request["year"]));
             }
             catch (Exception ex)
             {
                 Logger.Error(ex.ToString());
                 throw ex;
             }
             return resultObj;
         }
         public JObject GetCallCenterTicketPerformanceReports(HttpContext context)
         {
             JObject resultObj = new JObject();
             try
             {
                 Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                 resultObj = managerObj.GetCallCenterTicketPerformanceReports(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["month"]), Convert.ToInt32(context.Request["year"]));
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