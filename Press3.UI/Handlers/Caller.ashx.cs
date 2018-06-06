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
    /// Summary description for Caller
    /// </summary>
    public class Caller : IHttpHandler, IRequiresSessionState
    {
        public int agentId = 0, accountId = 0;
        public JObject sessionObj = new JObject();
        public Int32 loginId = 0;
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                    loginId = Convert.ToInt32(context.Session["LoginId"]);
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
                                resJObj = GetCallerCallHistory(context);
                                context.Response.Write(resJObj);
                                break;
                            case 2:
                                resJObj = GetCallerDetails(context);
                                context.Response.Write(resJObj);
                                break;
                            case 3:
                                resJObj = CallersManagement(context);
                                context.Response.Write(resJObj);
                                break;
                            case 4:
                                resJObj = ManageCallerGroupsAndLabels(context);
                                context.Response.Write(resJObj);
                                break;
                            case 5:
                                resJObj = AddCallersToGroupsOrLabels(context);
                                context.Response.Write(resJObj);
                                break;
                            case 6:
                                resJObj = AddCallersThroughExcel(context);
                                context.Response.Write(resJObj);
                                break;
                            case 7:
                                resJObj = DeleteGroup(context);
                                context.Response.Write(resJObj);
                                break;
                            case 8:
                                resJObj = DeleteLabel(context);
                                context.Response.Write(resJObj);
                                break;
                            case 9:
                                resJObj = DeleteCaller(context);
                                context.Response.Write(resJObj);
                                break;
                            case 10:
                                resJObj = EditLableAndGroups(context);
                                context.Response.Write(resJObj);
                                break;

                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            
        }

        
        private JObject AddCallersThroughExcel(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.AddCallersThroughExcel(MyConfig.MyConnectionString, accountId, agentId, context.Request["filePath"].ToString(), context.Request["excelData"].ToString(), context.Request["isHeader"].ToString());
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }
        private JObject AddCallersToGroupsOrLabels(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.CallerIds = context.Request["callerIds"].ToString();
                callersObj.GroupId = Convert.ToInt32(context.Request["id"]);
                int sourcegroupId = Convert.ToInt32(context.Request["sourcegroupId"]);
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.AddCallersToGroupsOrLabels(MyConfig.MyConnectionString, callersObj,sourcegroupId);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }
        private JObject ManageCallerGroupsAndLabels(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.Name = context.Request["Name"].ToString();
                callersObj.ColorCode = context.Request["colorCode"].ToString();
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.ManageCallerGroupsAndLabels(MyConfig.MyConnectionString, callersObj);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }
        private JObject CallersManagement(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.SearchText = context.Request["searchText"] != null ? context.Request["searchText"].ToString() : "";
                callersObj.GroupId = Convert.ToInt32(context.Request["groupId"]);
                callersObj.LabelId = Convert.ToInt32(context.Request["labelId"]);
                callersObj.PageLength = Convert.ToInt32(context.Request["PageLength"]);
                callersObj.PageIndex = Convert.ToInt32(context.Request["PageIndex"]);
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.CallersManagement(MyConfig.MyConnectionString,callersObj);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }
        private JObject GetCallerDetails(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();

                string fromNumber = context.Request["FromNumber"].ToString();
                string detailsObj = context.Request["DetailsObj"].ToString();
                int mode = Convert.ToInt32(context.Request["Mode"]);
                string callerName = context.Request["CallerName"].ToString();
                string callerEmail = context.Request["CallerEmail"];
                string caller_Id = (context.Request["Caller_Id"] == "" || context.Request["Caller_Id"] == null) ? "" : context.Request["Caller_Id"].ToString();
                string callerNumber = (context.Request["CallerMobile"] == "" || context.Request["CallerMobile"] == null) ? "" : context.Request["CallerMobile"].ToString();

                callerDetails = callerObject.GetCallerDetails(MyConfig.MyConnectionString, fromNumber, agentId, detailsObj, mode, accountId, callerName, callerEmail, caller_Id, callerNumber);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }
        public JObject GetCallerCallHistory(HttpContext context)
        {
            JObject callHistory = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callHistory = callerObject.GetCallerCallHistory(MyConfig.MyConnectionString, accountId, Convert.ToString(context.Request["FromNumber"]),Convert.ToInt32(context.Request["CallId"]), Convert.ToInt32(context.Request["PageSize"]),Convert.ToInt32(context.Request["PageNumber"]));
            }
            catch (Exception ex)
            {
                callHistory = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callHistory;
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
        private JObject DeleteGroup(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.GroupId = Convert.ToInt32(context.Request["groupId"]);
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.DeleteCallersManagement(MyConfig.MyConnectionString, callersObj);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }

        private JObject DeleteCaller(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.GroupId = Convert.ToInt32(context.Request["groupId"]);
                callersObj.CallerIds = context.Request["callerIds"].ToString();
                callersObj.LabelId = Convert.ToInt32(context.Request["labelId"].ToString());
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.DeleteCallersManagement(MyConfig.MyConnectionString, callersObj);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }

        private JObject DeleteLabel(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.LabelId = Convert.ToInt32(context.Request["LabelId"]);
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.DeleteCallersManagement(MyConfig.MyConnectionString, callersObj);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
        }
        private JObject EditLableAndGroups(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try
            {
                Press3.UserDefinedClasses.Callers callersObj = new UserDefinedClasses.Callers();
                callersObj.Mode = Convert.ToInt32(context.Request["mode"]);
                callersObj.AccountId = accountId;
                callersObj.AgentId = agentId;
                callersObj.Name = context.Request["Name"].ToString();
                callersObj.ColorCode = context.Request["colorCode"].ToString();
                callersObj.LabelId = Convert.ToInt32(context.Request["LabelId"]);
                callersObj.GroupId = Convert.ToInt32(context.Request["groupId"]);
                Press3.BusinessRulesLayer.Caller callerObject = new Press3.BusinessRulesLayer.Caller();
                callerDetails = callerObject.EditLableAndGroups(MyConfig.MyConnectionString, callersObj);
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }
            return callerDetails;
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