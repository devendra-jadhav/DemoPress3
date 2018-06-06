using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.UserDefinedClasses;
using Press3.Utilities;
using Newtonsoft.Json.Linq;
using Press3.UI.CommonClasses;
using Press3.UI.AppCode;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Login
    /// </summary>
    public class Login : IHttpHandler, IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                int type = Convert.ToInt32(context.Request["type"]);
                JObject result = new JObject();
                switch (type)
                {
                    case 1:
                        if (context.Session["LoginId"] != null)
                        {
                            Byte roleId = Convert.ToByte(context.Session["RoleId"]);
                            if (roleId == 1)
                            {
                                context.Response.StatusCode = 999;
                            }
                            else if (roleId == 2)
                            {
                                context.Response.StatusCode = 999;
                            }
                            else if (roleId == 3)
                            {
                                context.Response.StatusCode = 999;
                            }
                            result.Add(new JProperty("RoleId", roleId));
                        }
                        else
                        {
                            result = AgentLogin(context);
                            if (result != null)
                            {
                                if (string.IsNullOrEmpty(Convert.ToString(result.SelectToken("Success"))) == false)
                                {
                                    if (result.SelectToken("Success").ToString() == "True")
                                    {
                                        context.Session["LoginId"] = result.SelectToken(@"AgentDetails[0].LoginId").ToString();
                                        context.Session["AgentId"] = result.SelectToken(@"AgentDetails[0].Id").ToString();
                                        context.Session["AccountId"] = result.SelectToken(@"AgentDetails[0].AccountId").ToString();
                                        context.Session["RoleId"] = result.SelectToken(@"AgentDetails[0].RoleId").ToString();
                                        context.Session["AgentName"] = result.SelectToken(@"AgentDetails[0].Name").ToString();
                                    }
                                }
                            }

                        }
                        context.Response.Write(result);
                        break;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
        }

        public JObject AgentLogin(HttpContext context)
        {
            JObject loginObject = new JObject();
            try
            {
                AgentLogin agentLoginObj = new AgentLogin();
                agentLoginObj.Name = context.Request["name"];
                agentLoginObj.Password = context.Request["password"];
                agentLoginObj.IpAddress = context.Request.ServerVariables["REMOTE_ADDR"];
                agentLoginObj.Browser = context.Request.Browser.Browser;
                agentLoginObj.IsLogout = Convert.ToByte(context.Request["isLogout"]);
                Press3.BusinessRulesLayer.Agent agentObject = new Press3.BusinessRulesLayer.Agent();
                loginObject = agentObject.AgentLogin(MyConfig.MyConnectionString, agentLoginObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            return loginObject;
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