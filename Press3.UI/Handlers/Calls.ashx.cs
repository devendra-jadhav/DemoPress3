using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using Press3.BusinessRulesLayer;
using System.Web.SessionState;
using Press3.UI.CommonClasses;
using Press3.UI.AppCode;
using Press3.Utilities;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Calls
    /// </summary>
    public class Calls : IHttpHandler, IRequiresSessionState
    {
        public int agentId = 0, accountId = 0;
        public Int32 loginId = 0;
        public Int32 roleId = 0;
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

                            case 1:
                                resJObj = ChangeCallStatus(context);
                                context.Response.Write(resJObj);
                                break;
                            case 2:
                                resJObj = ChangeCallActions(context);
                                context.Response.Write(resJObj);
                                break;
                            case 3:
                                resJObj = SubmitACW(context);
                                context.Response.Write(resJObj);
                                break;
                            case 4:
                                resJObj = TransferCall(context);
                                context.Response.Write(resJObj);
                                break;
                            case 5:
                                resJObj = GetCallHistorySearchData(context);
                                context.Response.Write(resJObj);
                                break;
                            case 6:
                                resJObj = GetCallHistory(context);
                                context.Response.Write(resJObj);
                                break;
                            case 7:
                                resJObj = CallBackRequestManagement(context);
                                context.Response.Write(resJObj);
                                break;
                            case 8:
                                resJObj = GetCBRSearchRelatedData(context);
                                context.Response.Write(resJObj);
                                break;
                            case 9:
                                resJObj = AssignCallBackRequest(context);
                                context.Response.Write(resJObj);
                                break;
                            case 10: // To download recorded clip
                                resJObj = DownloadRecordedClip(context);
                                context.Response.Write(resJObj);
                                return;
                            case 11: // To get callId from CallUUId
                                resJObj = GetCallIdFromCallUUId(context);
                                context.Response.Write(resJObj);
                                return;
                            case 12: // To get Ivr Studio details of a call
                                resJObj = GetIvrStudioSelectionDetails(context);
                                context.Response.Write(resJObj);
                                return;
                            case 13: // Make Outbound call
                                resJObj = MakeOutboundCall(context);
                                context.Response.Write(resJObj);
                                return;
                            case 14://get Abandonedcalls details
                                resJObj = GetAbandonedcalldetails(context);
                                context.Response.Write(resJObj);
                                return;
                            case 15: // get OutboundCallHistory
                                resJObj = GetOutBoundCallHistory(context);
                                context.Response.Write(resJObj);
                                return;
                            case 16: // update callbackrequest history
                                resJObj = UpdateCbrstatus(context);
                                context.Response.Write(resJObj);
                                return;
                            case 17: // get agent callbackrequests in next 5 minutes
                                resJObj = GetUpcomingCBR(context);
                                context.Response.Write(resJObj);
                                return;
                            case 18: // set agent callbackrequests read status
                                resJObj = GetCBRreadStatus(context);
                                context.Response.Write(resJObj);
                                return;
                            case 19: // get agent callbackrequests in next 5 minutes
                                resJObj = GetNewCBR(context);
                                context.Response.Write(resJObj);
                                return;
                            case 20: // Get Tranfer And Conference Calls
                                resJObj = GetTransferAndConferenceCalls(context);
                                context.Response.Write(resJObj);
                                return;
                        }
                    }
                }


            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());

            }
        }

        private JObject GetNewCBR(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                int CbrId = Convert.ToInt32(context.Request["cbrId"]);
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetNewCBR(MyConfig.MyConnectionString, CbrId,agentId,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetCBRreadStatus(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                int CbrId = Convert.ToInt32(context.Request["cbrId"]);
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetCBRreadStatus(MyConfig.MyConnectionString, CbrId,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetUpcomingCBR(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                int agentid = agentId;
                string CbrIds = context.Request["cbrIds"];
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetUpcomingCBR(MyConfig.MyConnectionString, agentId, CbrIds, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject UpdateCbrstatus(HttpContext context)
        {
            JObject responseJObj = new JObject();
            int cbrId = 0;
            try
            {
                cbrId = context.Request["cbrId"] != null ? Convert.ToInt32(context.Request["cbrId"]) : 0;
                int status = Convert.ToInt32(context.Request["status"]);
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.UpdateCbrstatus(MyConfig.MyConnectionString, agentId,status , cbrId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject MakeOutboundCall(HttpContext context)
        {
            JObject responseJObj = new JObject();
            int customerId = 0; bool isCustomer = false; int cbrId = 0;
            try
            {
                customerId = context.Request["customerId"] != null ? Convert.ToInt32(context.Request["customerId"]) : 0;
                cbrId = context.Request["cbrId"] != null ? Convert.ToInt32(context.Request["cbrId"]) : 0;
                isCustomer = context.Request["isCustomer"] != null ? Convert.ToBoolean(Convert.ToInt16(context.Request["isCustomer"])) : false;
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.MakeOutboundCall(MyConfig.MyConnectionString, accountId, agentId, customerId, context.Request["callUUID"], context.Request["customerCallUUID"], isCustomer, MyConfig.OutboundCallBackUrl, cbrId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetCallHistory(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {

                UserDefinedClasses.CallHistoryDetails callHistoryDetailsObj = new UserDefinedClasses.CallHistoryDetails();
                callHistoryDetailsObj.AccountId = accountId;
                callHistoryDetailsObj.Date = context.Request["Date"].ToString();
                if (Convert.ToInt32(context.Session["RoleId"]) == 1)
                {
                    callHistoryDetailsObj.AgentId = agentId;
                }
                else
                {
                    callHistoryDetailsObj.AgentId = Convert.ToInt32(context.Request["AgentId"]);
                }
                callHistoryDetailsObj.SessionAgentId = agentId;
                callHistoryDetailsObj.RoleId = roleId;
                callHistoryDetailsObj.CallType = Convert.ToInt32(context.Request["CallType"]);
                callHistoryDetailsObj.CallDirection = Convert.ToInt32(context.Request["CallDirection"]);
                callHistoryDetailsObj.SkillGroupId = Convert.ToInt32(context.Request["SkillGroupId"]);
                callHistoryDetailsObj.SkillId = Convert.ToInt32(context.Request["SkillId"]);
                callHistoryDetailsObj.Duration = Convert.ToInt32(context.Request["Duration"]);
                callHistoryDetailsObj.PageSize = Convert.ToInt32(context.Request["PageSize"]);
                callHistoryDetailsObj.PageNumber = Convert.ToInt32(context.Request["PageNumber"]);
                callHistoryDetailsObj.FromDate = context.Request["FromDate"].ToString();
                callHistoryDetailsObj.ToDate = context.Request["ToDate"].ToString();
                callHistoryDetailsObj.CallId = Convert.ToInt32(context.Request["CallId"]);
                callHistoryDetailsObj.StudioId = Convert.ToInt32(context.Request["StudioId"]);
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetCallHistory(MyConfig.MyConnectionString, callHistoryDetailsObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetCallHistorySearchData(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();

                responseJObj = callsObject.GetCallHistorySearchData(MyConfig.MyConnectionString, accountId, agentId, roleId, Convert.ToInt32(context.Request["SkillGroupId"]),context.Request["SearchFor"].ToString());
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject TransferCall(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.TransferCall(MyConfig.MyConnectionString, agentId, accountId, Convert.ToInt32(context.Request["CallId"]), Convert.ToInt32(context.Request["ToAgentId"]), Convert.ToBoolean(context.Request["IsWarmTransfer"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject ChangeCallActions(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.ChangeCallActions(MyConfig.MyConnectionString, Convert.ToInt32(context.Request["Status"]), Convert.ToInt32(context.Request["CallId"]), context.Request["Action"].ToString(), MyConfig.IvrStudioShowClipUploadPath, context.Request["conferenceRoom"].ToString(), Convert.ToBoolean(Convert.ToInt16(context.Request["IsOutbound"].ToString())));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject ChangeCallStatus(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.ChangeCallStatus(MyConfig.MyConnectionString, context.Request["Status"].ToString(), agentId, context.Request["CallId"], accountId, context.Request["Action"].ToString(), Convert.ToBoolean(Convert.ToInt16(context.Request["IsOutbound"].ToString())));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject SubmitACW(HttpContext context)
        {
            string str = context.Request["IsTransfer"];
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.SubmitACW(MyConfig.MyConnectionString, agentId, Convert.ToInt32(context.Request["CallId"]), Convert.ToBoolean(context.Request["IsTransfer"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject CallBackRequestManagement(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                //status: status, assignesAgentId: assignedAgentId, skillGroupId: skillGroupId,
                //    dialOutType : dialOuttype,fromDate : fromDate,toDate : toDate
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                UserDefinedClasses.CallbackRequest cbrObj = new UserDefinedClasses.CallbackRequest();
                cbrObj.Mode = Convert.ToInt32(context.Request["mode"]);
                cbrObj.AccountId = accountId;
                cbrObj.AgentId = agentId;
                cbrObj.DialType = context.Request["dialType"] != null ? Convert.ToInt32(context.Request["dialType"]) : 0;
                if (cbrObj.Mode == 1)
                {
                    cbrObj.DateTime = context.Request["dateTime"] != null ? context.Request["dateTime"].ToString() : "";
                    cbrObj.Mobile = context.Request["mobile"] != null ? context.Request["mobile"].ToString() : "";
                    cbrObj.Notes = context.Request["notes"] != null ? context.Request["notes"].ToString() : "";
                    cbrObj.CallerId = context.Request["callerId"] != null ? Convert.ToInt32(context.Request["callerId"]) : 0;
                    cbrObj.CallId = context.Request["callId"] != null ? Convert.ToInt32(context.Request["callId"]) : 0;
                }
                else if (cbrObj.Mode == 2)
                {
                    cbrObj.CbrId = context.Request["CbrId"] != null ? Convert.ToInt32(context.Request["CbrId"]) : 0;
                    cbrObj.SearchText = context.Request["searchText"] != null ? context.Request["searchText"].ToString() : "";
                    cbrObj.AssignedAgentId = context.Request["assignesAgentId"] != null ? Convert.ToInt32(context.Request["assignesAgentId"]) : 0;
                    cbrObj.StatusId = context.Request["status"] != null ? Convert.ToInt32(context.Request["status"]) : 0;
                    cbrObj.SkillGroupId = context.Request["skillGroupId"] != null ? Convert.ToInt32(context.Request["skillGroupId"]) : 0;
                    cbrObj.FromDate = context.Request["fromDate"] != null ? context.Request["fromDate"].ToString() : "";
                    cbrObj.ToDate = context.Request["toDate"] != null ? context.Request["toDate"].ToString() : "";
                    cbrObj.StudioId = context.Request["StudioId"] != null ? Convert.ToInt32(context.Request["StudioId"].ToString()) : 0;
                }
                cbrObj.PageNumber = context.Request["index"] != null ? Convert.ToInt32(context.Request["index"].ToString()) : 1;
                cbrObj.PageSize = context.Request["length"] != null ? Convert.ToInt32(context.Request["length"].ToString()) : 7;



                responseJObj = callsObject.CallBackRequestManagement(MyConfig.MyConnectionString, cbrObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetCBRSearchRelatedData(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetCBRSearchRelatedData(MyConfig.MyConnectionString, accountId, agentId, roleId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject AssignCallBackRequest(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.AssignCallBackRequest(MyConfig.MyConnectionString, accountId, agentId, Convert.ToInt32(context.Request["toAgentId"]), Convert.ToInt32(context.Request["requestId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        public JObject DownloadRecordedClip(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.DownloadRecordedClip(MyConfig.MyConnectionString, context.Request["clip"]);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
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
            }
            return resultObj;
        }
        private JObject GetCallIdFromCallUUId(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetCallIdFromCallUUId(MyConfig.MyConnectionString, accountId, context.Request["callUUId"]);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetIvrStudioSelectionDetails(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetIvrStudioSelectionDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["callId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetAbandonedcalldetails(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                int AgentId;
                if (Convert.ToInt32(context.Session["RoleId"]) == 1)
                {
                    AgentId = agentId;
                }
                else
                {
                    AgentId = Convert.ToInt32(context.Request["AgentId"]);
                }
                int seesionAgentId = 0;
                seesionAgentId = Convert.ToInt32(context.Session["AgentId"]);
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetAbandonedcalldetails(MyConfig.MyConnectionString, accountId, context.Request["Date"].ToString(), Convert.ToInt32(context.Request["CallDirection"]), Convert.ToInt32(context.Request["CallType"]), Convert.ToInt32(context.Request["CallEndStatus"]), AgentId, Convert.ToInt32(context.Request["SkillGroupId"]), context.Request["FromDate"].ToString(), context.Request["ToDate"].ToString(), Convert.ToInt32(context.Request["PageSize"]), Convert.ToInt32(context.Request["PageNumber"]), Convert.ToInt32(context.Request["StudioId"]), seesionAgentId, roleId);

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        //private JObject GetOutboundCallsHostory(HttpContext context)
        //{
        //    JObject responseObj = new JObject();
        //    try
        //    {
        //        Press3.BusinessRulesLayer.Calls callsObject = new BusinessRulesLayer.Calls();                
        //    }
        //    catch(Exception e)
        //    {
        //        Logger.Error(e.ToString());
        //    }
        //}


        private JObject GetOutBoundCallHistory(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {

                UserDefinedClasses.CallHistoryDetails callHistoryDetailsObj = new UserDefinedClasses.CallHistoryDetails();
                callHistoryDetailsObj.AccountId = accountId;
                callHistoryDetailsObj.Date = context.Request["Date"].ToString();
                if (Convert.ToInt32(context.Session["RoleId"]) == 1)
                {
                    callHistoryDetailsObj.AgentId = agentId;
                }
                else
                {
                    callHistoryDetailsObj.AgentId = Convert.ToInt32(context.Request["AgentId"]);
                }
                callHistoryDetailsObj.AccountId = accountId;
                callHistoryDetailsObj.CbrId = Convert.ToInt32(context.Request["CbrId"]);
                callHistoryDetailsObj.Date = context.Request["Date"].ToString();
                //callHistoryDetailsObj.AgentId = Convert.ToInt32(context.Request["AgentId"]);
                callHistoryDetailsObj.CallType = Convert.ToInt32(context.Request["CallType"]);
                callHistoryDetailsObj.CallDirection = Convert.ToInt32(context.Request["CallDirection"]);
                callHistoryDetailsObj.PageSize = Convert.ToInt32(context.Request["PageSize"]);
                callHistoryDetailsObj.PageNumber = Convert.ToInt32(context.Request["PageNumber"]);
                callHistoryDetailsObj.FromDate = context.Request["FromDate"].ToString();
                callHistoryDetailsObj.ToDate = context.Request["ToDate"].ToString();
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetOutBoundCallHistory(MyConfig.MyConnectionString, callHistoryDetailsObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }


        private JObject GetTransferAndConferenceCalls(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {

                UserDefinedClasses.CallHistoryDetails callHistoryDetailsObj = new UserDefinedClasses.CallHistoryDetails();
                callHistoryDetailsObj.AccountId = accountId;
                callHistoryDetailsObj.CallId = Convert.ToInt32(context.Request["CallId"]);
                callHistoryDetailsObj.ConferenceCallTypeId = context.Request["ConferenceCallTypeId"].ToString();
                Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
                responseJObj = callsObject.GetTransferAndConferenceCalls(MyConfig.MyConnectionString, callHistoryDetailsObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
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