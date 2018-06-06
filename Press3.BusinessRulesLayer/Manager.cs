using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Press3.DataAccessLayer;
using Press3.Utilities;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;
using System.Web;

namespace Press3.BusinessRulesLayer
{
    public class Manager
    {
        private Helper helper = null;
        public Manager()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }

        public JObject TeamManagement(String connection, UDC.TeamManagement tmObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager mgrObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = mgrObj.TeamManagement(tmObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in BAL.TeamManagement" + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetDashboard(String connection, int accountId, int agentId, int roleId, int studioId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetDashboard(accountId, agentId, roleId, studioId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetDashboard " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentsSummary(String connection, int accountId, int agentId, int roleId, Byte durationType,int agentStatus)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentsSummary(accountId, agentId, roleId, durationType, agentStatus);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentsSummary " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentsActiveOrWaitingCalls(String connection, int accountId, int agentId, int roleId, Byte statusType, Byte callType, int studioId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentsActiveOrWaitingCalls(accountId, agentId, roleId, statusType, callType, studioId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentsActiveOrWaitingCalls " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentsAvgTalkTimeVsWaitTimeReport(String connection, int accountId, int agentId, int roleId, int studioId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentsAvgTalkTimeVsWaitTimeReport(accountId, agentId, roleId, studioId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentsAvgTalkTimeVsWaitTimeReport " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentsHandleTimeByHourReport(String connection, int accountId, int agentId, int roleId, int studioId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentsHandleTimeByHourReport(accountId, agentId, roleId, studioId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentsHandleTimeByHourReport " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentsCallAbondanmentByHourReport(String connection, int accountId, int agentId, int roleId, int studioId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentsCallAbondanmentByHourReport(accountId, agentId, roleId, studioId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentsCallAbondanmentByHourReport " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetLoggedInAgents(String connection, Int32 accountId, Int32 agentId, Int32 roleId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetLoggedInAgents(accountId, agentId, roleId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetLoggedInAgents " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public DataSet GetAccountAgents(String connection, Int32 accountId, Int32 agentId, Int32 roleId)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                ds = managerObj.GetLoggedInAgents(accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetLoggedInAgents " + ex.ToString());
            }
            return ds;
        }
        public JObject GetAgentLinkedSkills(string connection, int accountId, int agentId = 0)
        {
            try
            {
                if (accountId == 0)
                {
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                    helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Manager managerObj = new DataAccessLayer.Manager(connection);
                    DataSet ds = managerObj.GetAgentLinkedSkills(accountId, agentId);
                    if (ds.IsNull())
                    {
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                        helper.CreateProperty(UDC.Label.MESSAGE, managerObj.ErrorMessage);
                    }
                    else
                        helper.ParseDataSet(ds);
                }
            }
            catch (Exception e)
            {
                Logger.Error(string.Format("Exception in BAL.GetAgentLinkedSkills. {0}", e.ToString()));
                helper.InitializeResponseVariables();
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return helper.GetResponse();
        }
        public JObject CheckSession(String connection, int loginId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.CheckSession(loginId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.CheckSession " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentsHistory(String connection, UDC.AgentHistory agentHistory)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentsHistory(agentHistory);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentsHistory " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public DataSet DownloadAgentsHistory(String connection, UDC.AgentHistory agentHistory)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                ds = managerObj.GetAgentsHistory(agentHistory);
                int temp = ds.Tables[0].Rows.Count;
                int temp2 = ds.Tables.Count;
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.DownloadAgentsHistory " + ex.ToString());
            }
            return ds;
        }
        public JObject GetSkillGroups(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetSkillGroups(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.CheckSession " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentProfile(String connection, int accountId, int agentId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentProfile(accountId, agentId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAgentProfile " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject ManagerCallActions(String connection, int mode, int agentId, int accountId, int callId, int toAgentId, string callEvent)
        {
            try
            {
                JObject responseJObj = new JObject();
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.ManagerCallActions(mode, agentId, accountId, callId, toAgentId, callEvent);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    BusinessRulesLayer.Conference conferenceObj = new BusinessRulesLayer.Conference(connection);
                    responseJObj = conferenceObj.ConferenceDial(ds, callEvent, toAgentId);
                    if (Convert.ToBoolean(responseJObj.SelectToken("Success").ToString()) == true)
                    {
                        helper = new Helper();
                        helper.ParseDataSet(ds);
                        helper.CreateProperty("RequestUUID", responseJObj.SelectToken("RequestUUID").ToString());
                    }
                    else
                    {
                        helper.CreateProperty(UDC.Label.MESSAGE, "Action Not Performed Right Now");
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                    }
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty("RetMessage", ex.ToString());
                Logger.Error("Exception In StartConference " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public DataSet GetEmailOrSmsTemplates(String connection, int accountId, int mode, int templateId)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                ds = managerObj.GetEmailOrSmsTemplates(accountId, mode, templateId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetEmailOrSmsTemplates " + ex.ToString());
            }
            return ds;
        }
        public JObject GetEmailOrSmsTemplate(String connection, int accountId, int mode, int templateId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetEmailOrSmsTemplates(accountId, mode, templateId);

                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    if (mode == 1)
                    {
                        if (ds.Tables[0].TableName != "OutputParameters")
                        {
                            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                            {
                                foreach (DataRow row in ds.Tables[0].Rows)
                                {
                                    string finalTemplateContent = HttpContext.Current.Server.HtmlDecode(Convert.ToString(row["TemplateContent"]));
                                    row["TemplateContent"] = finalTemplateContent;
                                    row.EndEdit();
                                    ds.AcceptChanges();
                                }
                            }
                        }
                    }
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetEmailOrSmsTemplate " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetTimeSlotTimings(String connection, int timeSlotId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetTimeSlotTimings(timeSlotId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetTimeSlotTimings " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public DataSet GetTimeSlots(String connection, int accountId)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                ds = managerObj.GetTimeSlots(accountId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetTimeSlots " + ex.ToString());
            }
            return ds;
        }
        public JObject GetTimeSlot(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetTimeSlots(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetTimeSlotTimings " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject AccountSettings(String connection, int accountId, int mode, string metaData)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.AccountSettings(accountId, metaData, mode);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetAgentStatuses " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject SetPriorityForWaitingCalls(String connection, int callId, int priority)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.SetPriorityForWaitingCalls(callId, priority);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.SetPriorityForWaitingCalls " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetSLAByHourReport(String connection, int accountId, int agentId, int roleId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetSLAByHourReport(accountId, agentId, roleId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetSLAByHourReport " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetGateways(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetGateways(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetGateways " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject CreateOrEditGateway(String connection, UDC.Gateway gateway)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);

                JArray rangeNumbersArray = JArray.Parse(gateway.RangeCallerIds);
                DataTable rangeNumbersDt = new DataTable();
                rangeNumbersDt.Columns.Add("prefix", typeof(string));
                rangeNumbersDt.Columns.Add("fromrange", typeof(string));
                rangeNumbersDt.Columns.Add("torange", typeof(string));
                for (int i = 0; i <= rangeNumbersArray.Count - 1; i++)
                {
                    rangeNumbersDt.Rows.Add(rangeNumbersArray[i].SelectToken("prefix").ToString(), rangeNumbersArray[i].SelectToken("fromrange").ToString(), rangeNumbersArray[i].SelectToken("torange").ToString());
                }

                JArray individualNumbersArray = JArray.Parse(gateway.IndividualCallerIds);
                DataTable individualNumbersDt = new DataTable();
                individualNumbersDt.Columns.Add("number", typeof(string));
                for (int i = 0; i <= individualNumbersArray.Count - 1; i++)
                {
                    individualNumbersDt.Rows.Add(individualNumbersArray[i].SelectToken("number").ToString());
                }

                JArray deletedNumbersArray = JArray.Parse(gateway.DeletedCallerIds);
                DataTable deletedNumbersDt = new DataTable();
                deletedNumbersDt.Columns.Add("number", typeof(string));
                for (int i = 0; i <= deletedNumbersArray.Count - 1; i++)
                {
                    deletedNumbersDt.Rows.Add(deletedNumbersArray[i].SelectToken("number").ToString());
                }

                DataSet ds = managerObj.CreateOrEditGateway(gateway, rangeNumbersDt, individualNumbersDt, deletedNumbersDt);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.CreateOrEditGateway " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetGatewayDetails(String connection, int accountId, int gatewayId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetGatewayDetails(accountId, gatewayId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetGatewayDetails " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetCallerIdNumbers(String connection, int accountId, int availableStatus, int assignedStatus, string serachText)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetCallerIdNumbers(accountId, availableStatus, assignedStatus, serachText);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetCallerIdNumbers " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject UpdateCallerIdStatus(String connection, int accountId, int agentId, int statusId, int callerId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.UpdateCallerIdStatus(accountId, agentId, statusId, callerId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.UpdateCallerIdStatus " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetActiveAccountCallerIds(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetActiveAccountCallerIds(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetActiveAccountCallerIds " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject TicketPrioritiesManagement(String connection, UserDefinedClasses.Priorities prioritiesObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.TicketPrioritiesManagement(prioritiesObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetActiveAccountCallerIds " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageTicketStatuses(String connection, UserDefinedClasses.TicketStatus statusObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.ManageTicketStatuses(statusObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageTicketStatuses " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetSLATypes(String connection, int accountId, byte mode, byte idSLAType)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetSLATypes(accountId, mode, idSLAType);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetSLATypes " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetGeneralSettings(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetGeneralSettings(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetGeneralSettings " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageTemplates(String connection, UDC.Template templateObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.ManageTemplates(templateObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageTemplates " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageGeneralSettings(String connection, UDC.GeneralSettings generalSettingsObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.ManageGeneralSettings(generalSettingsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageGeneralSettings " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageOutboundCommunicationSettings(String connection, UDC.OutboundCommunicationSettings settingsObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.ManageOutboundCommunicationSettings(settingsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageOutboundCommunicationSettings " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageSenderIds(string connection, int accountId, int agentId, string senderIds)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);

                JArray senderIdsArray = JArray.Parse(senderIds);
                DataTable senderIdsDt = new DataTable();
                senderIdsDt.Columns.Add("senderId", typeof(string));
                for (int i = 0; i <= senderIdsArray.Count - 1; i++)
                {
                    senderIdsDt.Rows.Add(senderIdsArray[i].SelectToken("senderId").ToString());
                }

                DataSet ds = managerObj.ManageSenderIds(accountId, agentId, senderIdsDt);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageSenderIds " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetSenderIds(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetSenderIds(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetSenderIds " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetSkillGroupScoreCards(String connection, int accountId, int callId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetSkillGroupScoreCards(accountId, callId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetSkillGroupScoreCards " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageAgentScoreCards(String connection, UDC.AgentScoreCard scoresObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);

                JArray scoresArray = JArray.Parse(scoresObj.Scores);
                DataTable scoresDt = new DataTable();
                scoresDt.Columns.Add("QuestionId", typeof(int));
                scoresDt.Columns.Add("Answer", typeof(int));
                for (int i = 0; i <= scoresArray.Count - 1; i++)
                {
                    scoresDt.Rows.Add(scoresArray[i].SelectToken("QuestionId").ToString(), scoresArray[i].SelectToken("Answer").ToString());
                }

                DataSet ds = managerObj.ManageAgentScoreCards(scoresObj, scoresDt);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageAgentScoreCards " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAccountCustomers(String connection, int accountId,string searchContacts)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAccountCustomers(accountId, searchContacts);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetAccountCustomers " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageTimeSlots(String connection, UDC.TimeSlot timeSlot)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);

                JArray timingsArray = JArray.Parse(timeSlot.TimeSlotTimings);
                DataTable timingsDt = new DataTable();
                timingsDt.Columns.Add("day", typeof(string));
                timingsDt.Columns.Add("fromtime", typeof(string));
                timingsDt.Columns.Add("totime", typeof(string));
                for (int i = 0; i <= timingsArray.Count - 1; i++)
                {
                    timingsDt.Rows.Add(timingsArray[i].SelectToken("day").ToString(), timingsArray[i].SelectToken("fromtime").ToString(), timingsArray[i].SelectToken("totime").ToString());
                }

                DataSet ds = managerObj.ManageTimeSlots(timeSlot, timingsDt);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.ManageTimeSlots " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetVoiceMails(String connection, UDC.VoiceMail voiceMailObj)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetVoiceMails(voiceMailObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetVoiceMails " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject AssignAgentToVoiceMail(String connection, int accountId, int agentId, int voiceMailId, int assignedTo)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.AssignAgentToVoiceMail(accountId, agentId, voiceMailId, assignedTo);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.AssignAgentToVoiceMail " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetDashboardHeadServiceLevels(String connection, int accountId, int agentId, int roleId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetDashboardHeadServiceLevels(accountId, agentId, roleId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetIvrStudioIdAndNames " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetTotalCallsReceivedByHour(String connection, int accountId, int agentId, int roleId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetTotalCallsReceivedByHour(accountId, agentId, roleId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetIvrStudioIdAndNames " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetCallCenterPerformanceReports(String connection, int accountId, int month, int year)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetCallCenterPerformanceReports(accountId, month, year);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetCallCenterPerformanceReports " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetAgentPerformanceReports(String connection, int accountId, int agentId, int roleId ,int month, int year)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetAgentPerformanceReports(accountId, agentId, roleId ,month, year);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetCallCenterPerformanceReports " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetCallCenterTicketPerformanceReports(String connection, int accountId, int month, int year)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.GetCallCenterTicketPerformanceReports(accountId, month, year);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetCallCenterTicketPerformanceReports " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject getAgentsAvailabilityStatuses(string connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                DataSet ds = managerObj.getAgentsAvailabilityStatuses(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.getAgentsAvailabilityStatuses " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public int GetAccountId(String connection, int conferenceId)
        {
            int returnAccountId = 0;
            try
            {
                Press3.DataAccessLayer.Manager managerObj = new Press3.DataAccessLayer.Manager(connection);
                returnAccountId = managerObj.GetAccountId(conferenceId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetCallCenterTicketPerformanceReports " + ex.ToString());
            }
            return returnAccountId;
        }
    }
}
