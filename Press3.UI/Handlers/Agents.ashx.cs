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
using SD = System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;


namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Agents
    /// </summary>
    public class Agents : IHttpHandler, IRequiresSessionState
    {
        public int agentId = 0,accountId = 0;
        public Int32 loginId = 0;
        public JObject sessionObj = new JObject();
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
                
                int type = Convert.ToInt32(context.Request["type"]);
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
                        switch (type)
                        {
                            case 1:
                                resJObj = GetAgentGatewayDetails(context);
                                context.Response.Write(resJObj);
                                break;
                            case 2:
                                resJObj = GetAgentScriptsAndCallSummary(context);
                                context.Response.Write(resJObj);
                                break;
                            case 3:
                                resJObj = ChangeSipRegistrationStatus(context);
                                context.Response.Write(resJObj);
                                break;
                            case 4:
                                resJObj = ChangeAgentStatus(context);
                                context.Response.Write(resJObj);
                                break;
                            case 5:
                                resJObj = GetAvailableAgents(context);
                                context.Response.Write(resJObj);
                                break;
                            case 6:
                                resJObj = GetAgentStatuses(context);
                                context.Response.Write(resJObj);
                                break;
                            case 7:
                                resJObj = GetAgentCreationRelatedData(context);
                                context.Response.Write(resJObj);
                                break;
                            case 8:
                                resJObj = AgentsManagement(context);
                                context.Response.Write(resJObj);
                                break;
                            case 9:
                                resJObj = UpdateProfileImage(context);
                                context.Response.Write(resJObj);
                                break;
                            case 10:
                                context.Response.Write("<ul><li>Add</li></ul>");
                                break;
                            case 11:
                                resJObj = GetAgents(context);
                                context.Response.Write(resJObj);
                                break;
                            case 12:
                                resJObj = GetProfileDetails(context);
                                context.Response.Write(resJObj);
                                break;
                            case 13:
                                resJObj = CheckExtSipUnameExistance(context);
                                 context.Response.Write(resJObj);
                                break;
                            case 14:
                                resJObj = GetAgentInformation(context);
                                context.Response.Write(resJObj);
                                break;
                            case 15 :
                                 resJObj = GetStatusChangeDatewise(context);
                                context.Response.Write(resJObj); 
                                break;
                            case 16:
                                resJObj = GetPress3Health(context);
                                context.Response.Write(resJObj);
                                break;
                            case 17:
                                resJObj = GetOpenCbrCount(context);
                                context.Response.Write(resJObj);
                                break;
                            case 18:
                                resJObj = LoginTimePolling(context);
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

        private JObject LoginTimePolling(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.LoginTimePolling(MyConfig.MyConnectionString, agentId, loginId);
                if (responseJObj["Success"].ToString() == "False")
                {
                    //agentObject.AgentLogout(MyConfig.MyConnectionString, loginId, agentId);
                    //Session.Clear();
                    //Session.Abandon();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetOpenCbrCount(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetOpenCbrCount(MyConfig.MyConnectionString, agentId,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetPress3Health(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                int roleId = (context.Request["SelectedRole"] != null && context.Request["SelectedRole"] != "") ? Convert.ToInt32(context.Request["SelectedRole"]) : 0;
                int LoginRequired = (context.Request["LoginRequired"] != null && context.Request["LoginRequired"] != "") ? Convert.ToInt32(context.Request["LoginRequired"]) : 0;
                int deviceStatusId = (context.Request["deviceStatusId"] != null && context.Request["deviceStatusId"] != "") ? Convert.ToInt32(context.Request["deviceStatusId"]) : 2;
                int LoginStatus = (context.Request["LoginStatus"] != null && context.Request["LoginStatus"] != "") ? Convert.ToInt32(context.Request["LoginStatus"]) : 2;
                int DeviceType = (context.Request["DeviceType"] != null && context.Request["DeviceType"] != "") ? Convert.ToInt32(context.Request["DeviceType"]) : 0;

                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetPress3Health(MyConfig.MyConnectionString, accountId, roleId, LoginRequired, deviceStatusId, LoginStatus, DeviceType);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }


        private JObject CheckExtSipUnameExistance(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.CheckExtSipUnameExistance(MyConfig.MyConnectionString, context.Request["SipUname"].ToString(), Convert.ToInt32(context.Request["AgentId"]), Convert.ToInt32(context.Request["Mode"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;

        }

        private JObject GetProfileDetails(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetProfileDetails(MyConfig.MyConnectionString, Convert.ToInt32(context.Request["AgentId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;

        }
        
        private JObject UpdateProfileImage(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.UpdateProfileImage(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["AgentId"]), Convert.ToString(context.Request["ProfileImage"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject AgentsManagement(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                UserDefinedClasses.Agent agentsobj = new UserDefinedClasses.Agent();
                agentsobj.Mode = Convert.ToInt32(context.Request["Mode"]);
                agentsobj.AccountId = accountId;
                if (Convert.ToInt32(context.Request["Mode"]) == 1 || Convert.ToInt32(context.Request["Mode"]) == 3)
                {
                    
                    agentsobj.Name = context.Request["FullName"].ToString();
                    agentsobj.FirstName = context.Request["FirstName"].ToString();
                    agentsobj.LastName = context.Request["LastName"].ToString();
                    agentsobj.Mobile = context.Request["Mobile"].ToString();
                    agentsobj.Email = context.Request["Email"].ToString();
                    agentsobj.Password = Convert.ToString(context.Request["Password"]);
                    agentsobj.RoleId = Convert.ToInt32(context.Request["Role"]);
                    agentsobj.PhoneType = Convert.ToInt32(context.Request["PhoneType"]);
                    agentsobj.Skills = context.Request["Skill"].ToString();
                    agentsobj.AccountStatusId = Convert.ToInt32(context.Request["ProfileStatus"]);
                    agentsobj.ReportingManagerIds = context.Request["ReportingManagers"].ToString();
                    agentsobj.ReportingSupervisorIds = context.Request["ReportingSupervisors"].ToString();
                    agentsobj.Id = Convert.ToInt32(context.Request["AgentId"]);
                    agentsobj.SipUserName = context.Request["SipUserName"].ToString();
                    agentsobj.SipUserPassword = Convert.ToString(context.Request["SipUserPassword"]);
                    agentsobj.gatewayID = Convert.ToInt32(context.Request["gatewayID"]);
                    agentsobj.PortNumber = context.Request["PortNumber"].ToString();
                    agentsobj.LoginType = Convert.ToInt32(context.Request["LoginType"]);
                    agentsobj.OutBoundAccessType = Convert.ToInt32(context.Request["OutBoundAccessType"]);
                    string str = Convert.ToString(context.Request["ProfileImage"]);
                    if (!String.IsNullOrEmpty(Convert.ToString(context.Request["ProfileImage"])))
                    {
                        Image _image = null;
                        MemoryStream mStream = new MemoryStream();
                        byte[] byteArr;
                        string tempStoragePath = HttpContext.Current.Server.MapPath("/Images/ProfileImages/");
                        string tempFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".jpg";
                        byteArr = Convert.FromBase64String(context.Request["ProfileImage"].ToString().Replace(" ", "+").Replace("data:image/png;base64,",""));
                        mStream = new MemoryStream(byteArr);
                        _image = Image.FromStream(mStream);
                        _image.Save(tempStoragePath + tempFileName);
                        agentsobj.ProfileImagePath = "/Images/ProfileImages/" + tempFileName;
                    }
                }
                else if (Convert.ToInt32(context.Request["Mode"]) == 2)
                {
                    agentsobj.Id = Convert.ToInt32(context.Request["AgentId"]);
                }
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.AgentsMangement(MyConfig.MyConnectionString, agentsobj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetAgentCreationRelatedData(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetAgentCreationRelatedData(MyConfig.MyConnectionString,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetAgentStatuses(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetAgentStatuses(MyConfig.MyConnectionString,agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject ChangeSipRegistrationStatus(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.ChangeSipRegistrationStatus(MyConfig.MyConnectionString, Convert.ToInt32(context.Request["Status"]), agentId,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetAgentScriptsAndCallSummary(HttpContext context)
        {
            JObject gatewayDetailsJobj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                gatewayDetailsJobj = agentObject.GetAgentScriptsAndCallSummary(MyConfig.MyConnectionString, agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return gatewayDetailsJobj;
        }
        private JObject GetAgentGatewayDetails(HttpContext context)
        {
            JObject gatewayDetailsJobj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                gatewayDetailsJobj = agentObject.GetAgentGatewayDetails(MyConfig.MyConnectionString, agentId, accountId);
            }
            catch(Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return gatewayDetailsJobj;
        }
        private JObject ChangeAgentStatus(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.ChangeAgentStatus(MyConfig.MyConnectionString, context.Request["Status"].ToString(), agentId,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetAvailableAgents(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetAvailableAgents(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["CallId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject CheckSession(HttpContext context)
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

        private JObject GetAgents(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                string SearchText = context.Request["searchText"] != null ? context.Request["searchText"].ToString().Trim() : "";
                int accStatusId = (context.Request["accStatusId"] != null && context.Request["accStatusId"] != "") ? Convert.ToInt32(context.Request["accStatusId"]) : 0;

                int agentTypeId = (context.Request["agentTypeId"] != null && context.Request["agentTypeId"] != "") ? Convert.ToInt32(context.Request["agentTypeId"]) : 0;

                int deviceStatusId = (context.Request["deviceStatusId"] != null && context.Request["deviceStatusId"] != "") ? Convert.ToInt32(context.Request["deviceStatusId"]) : 0;

                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetAgents(MyConfig.MyConnectionString, accountId, SearchText, accStatusId, agentTypeId, deviceStatusId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetAgentInformation(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
              
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetAgentInformation(MyConfig.MyConnectionString, accountId, agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }



        private JObject GetStatusChangeDatewise(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
              
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                responseJObj = agentObject.GetStatusChangeDatewise(MyConfig.MyConnectionString, accountId, agentId, context.Request["date"].ToString());
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